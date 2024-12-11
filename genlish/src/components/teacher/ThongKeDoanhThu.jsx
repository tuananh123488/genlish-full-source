import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { getMondayAndSunday } from '@/utils/date'
import { formatMoney, typePayments } from '@/utils/other'
import { ProviderId } from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'

const ThongKeDoanhThu = () => {
    const { authData } = useContext(authContext)
    const { notifyHandler } = useContext(notifyContext)
    const [payments, setPayments] = useState([])
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [pendingPayment, setPendingPayment] = useState(0)
    const [paid, setPaid] = useState(0)
    const [numberOfUser, setNumberOfUser] = useState(0)
    const [balance, setBalance] = useState(0)
    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState()

    useEffect(() => {
        setFromDate(new Date(getMondayAndSunday().monday).toISOString().split('T')[0])
        setToDate(new Date(getMondayAndSunday().sunday).toISOString().split('T')[0])
    }, [])

    const getByTimeAndProvider = async () => {
        const body = {
            from: new Date(fromDate).toISOString(),
            to: new Date(toDate).toISOString(),
            provider_id: authData.user._id
        }
        api({ sendToken: true, type: TypeHTTP.POST, path: '/payment/get-by-time-and-provider', body: body })
            .then(payments => {
                setPayments(payments)
                setTotalRevenue(payments
                    .map(item => item.payments)
                    .flat()
                    .filter(item => item.type === typePayments.studentTranfer)
                    .reduce((total, item) => total + (item.price * 0.8), 0))
                setPendingPayment(payments
                    .map(item => item.payments)
                    .flat()
                    .filter(item => item.type === typePayments.waitingForTeacher)
                    .reduce((total, item) => total + (item.price * 0.8), 0))
                setPaid(payments
                    .map(item => item.payments)
                    .flat()
                    .filter(item => item.type === typePayments.moneyToTeacher)
                    .reduce((total, item) => total + (item.price * 0.8), 0))
                setNumberOfUser(payments
                    .map(item => item.payments)
                    .flat().length)
            })
    }

    useEffect(() => {
        if (authData.user && fromDate && toDate) {
            getByTimeAndProvider()
            api({ sendToken: true, type: TypeHTTP.GET, path: `/payment/get-balance/${authData.user._id}` })
                .then(balance => setBalance(balance))
        }
    }, [authData.user, fromDate, toDate])

    const handleWithdraw = () => {

        console.log();
        if (authData.user.bank.accountName === "" || authData.user.bank.accountNumber === "" || authData.user.bank.bankName === "") {
            notifyHandler.notify(notifyType.WARNING, 'Vui lòng cập nhật đầy đủ thông tin ngân hàng')
            return
        }
        if (balance === 0) {
            notifyHandler.notify(notifyType.WARNING, 'Số dư của bạn phải trên 200.000đ')
            return
        }
        notifyHandler.notify(notifyType.LOADING, 'Đang gửi yêu cầu rút tiền')


        api({ sendToken: true, type: TypeHTTP.PUT, path: `/payment/withdraw/${authData.user._id}` })
            .then(balance => {
                getByTimeAndProvider().then(() => {
                    setBalance(0)
                    notifyHandler.notify(notifyType.SUCCESS, 'Đã gửi yêu cầu rút tiền')
                })
                // notify
                const body1 = {
                    toUser: {
                        _id: 'admin',
                        fullName: 'admin',
                        avatar: 'admin'
                    },
                    fromUser: {
                        _id: authData.user._id,
                        fullName: authData.user.fullName,
                        avatar: authData.user.avatar
                    },
                    content: `${authData.user.fullName} yêu cầu rút tiền`,
                    type: 'notify'
                }
                api({ type: TypeHTTP.POST, sendToken: false, path: '/notification/save', body: body1 })

            })
            .catch(balance => {
                notifyHandler.notify(notifyType.FAIL, 'Gửi yêu cầu rút tiền thất bại')
            })
    }

    return (
        <section className='w-full flex flex-col px-[1.5rem] py-[1rem] h-full'>
            <span className='text-[20px] font-semibold'>Thống Kê Doanh Thu</span>
            <div className='flex items-center justify-between w-full mt-2'>
                <div className='flex items-center gap-2'>
                    <span>Từ ngày</span>
                    <input value={fromDate} onChange={e => setFromDate(e.target.value)} type='date' className='border-[1px] border-[#e4e4e4] rounded-md px-2 text-[14px]' />
                    <span>đến ngày</span>
                    <input value={toDate} onChange={e => setToDate(e.target.value)} type='date' className='border-[1px] border-[#e4e4e4] rounded-md px-2 text-[14px]' />
                </div>
                <div className='flex items-center gap-2'>
                    <span className='text-[16px] font-medium'>Khả Dụng: {formatMoney(balance * 0.8)}đ</span>
                    <button onClick={() => handleWithdraw()} style={{ background: 'linear-gradient(to right, #56ccf2, #2f80ed)' }} className='transition-all hover:scale-[1.05] text[13px] px-4 py-1 text-[white] font-semibold rounded-lg'>Rút tiền</button>
                </div>
            </div>
            <div className='w-full grid grid-cols-4 gap-[1rem] mt-[0.5rem]'>
                <div style={{ background: 'linear-gradient(to right, #56ccf2, #2f80ed)' }} className='w-full flex items-center rounded-lg px-2 py-2 gap-2'>
                    <img src='/tong_doanh_thu.png' width={'65px'} />
                    <div className='flex flex-col'>
                        <span className='text-[white] font-bold text-[16px]'>Tổng Doanh Thu</span>
                        <span className='text-[white] font-semibold text-[16px]'>{formatMoney(totalRevenue)}đ</span>
                    </div>
                </div>
                <div style={{ background: 'linear-gradient(to right, #11998e, #38ef7d)' }} className='w-full flex items-center rounded-lg px-2 py-2 gap-2'>
                    <img src='/cho_thanh_toan.png' width={'65px'} />
                    <div className='flex flex-col'>
                        <span className='text-[white] font-bold text-[16px]'>Chờ Thanh Toán</span>
                        <span className='text-[white] font-semibold text-[16px]'>{formatMoney(pendingPayment)}đ</span>
                    </div>
                </div>
                <div style={{ background: 'linear-gradient(to left, #ff9966, #ff5e62)' }} className='w-full flex items-center rounded-lg px-2 py-2 gap-2'>
                    <img src='/da_thanh_toan.png' width={'65px'} />
                    <div className='flex flex-col'>
                        <span className='text-[white] font-bold text-[16px]'>Đã Thanh Toán</span>
                        <span className='text-[white] font-semibold text-[16px]'>{formatMoney(paid)}đ</span>
                    </div>
                </div>
                <div style={{ background: 'linear-gradient(to left, #3494e6, #ec6ead)' }} className='w-full flex items-center rounded-lg px-2 py-2 gap-2'>
                    <img src='/tong_nguoi_hoc.png' width={'65px'} />
                    <div className='flex flex-col'>
                        <span className='text-[white] font-bold text-[16px]'>Tổng Người Học</span>
                        <span className='text-[white] font-semibold text-[16px]'>{numberOfUser} người học</span>
                    </div>
                </div>
            </div>
            <span className='mt-[1rem] font-medium'>Các Khóa Trong Được Đăng Ký Trong Tháng Này</span>
            <div className='w-full h-[65%] flex flex-col gap-2 mt-2'>
                {payments.map((payment, index) => (
                    <div key={index} className='w-full flex items-center bg-[#f4f4f4] p-2 rounded-md justify-between'>
                        <div className='flex items-center gap-2'>
                            <img src={payment.course_image} width={'100px'} className='rounded-md' />
                            <div className='flex flex-col'>
                                <span className='font-semibold'>{payment.course_name}</span>
                                <span className='text-[14px]'>Số lượng bài học: {payment.numberOfEpisode}</span>
                            </div>
                        </div>
                        <div className='flex flex-col items-end'>
                            <span className='text-[14px]'>Tổng số người học: {payment.payments.length}</span>
                            <span className='text-[13px] font-semibold'>Tổng tiền: {formatMoney(payment.payments.reduce((total, item) => {
                                return total += (item.price * 0.8)
                            }, 0))}đ</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ThongKeDoanhThu