import { api, TypeHTTP } from '@/utils/api'
import { date1GetterThanDate2 } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import { formatDate } from '@/utils/time'
import React, { useEffect, useState } from 'react'

const DoanhThuNenTang = ({ option }) => {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [reload, setReload] = useState(true)
    const [payments, setPayments] = useState([])

    useEffect(() => {
        api({ sendToken: true, type: TypeHTTP.GET, path: '/payment/get-all' })
            .then(res => {
                const filter = res.filter(item => date1GetterThanDate2(item.createdAt, fromDate) && date1GetterThanDate2(toDate, item.createdAt))
                setPayments(filter)
                console.log(payments);

            })
    }, [reload, fromDate, toDate])

    useEffect(() => {
        const currentDate = new Date();

        // Ngày đầu tiên của tháng hiện tại và tăng thêm 1 ngày
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        setFromDate(firstDayOfMonth.toISOString().split('T')[0]);

        // Ngày cuối cùng của tháng hiện tại và tăng thêm 1 ngày
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
        setToDate(lastDayOfMonth.toISOString().split('T')[0]);
    }, []);

    console.log(payments)

    return (
        <div className="w-full h-[90%] flex flex-col overflow-y-auto relative">
            <div className='flex items-center text-[15px] gap-2'>
                <span className='font-semibold'>Thống kê từ ngày</span>
                <input value={fromDate} onChange={e => setFromDate(e.target.value)} type='date' className='px-4 py-1 border-[1px] border-[#dadada] rounded-md' />
                <span className='font-semibold'>đến ngày</span>
                <input value={toDate} onChange={e => setToDate(e.target.value)} type='date' className='px-4 py-1 border-[1px] border-[#dadada] rounded-md' />
                <button style={{ background: 'linear-gradient(to right, #36d1dc, #5b86e5)' }} onClick={() => setReload(!reload)} className='text-[14px] px-4 transition-all hover:scale-[1.05] py-1 rounded-md text-[white]'>
                    Tải Lại
                </button>
            </div>
            <div className='w-full grid grid-cols-2 gap-[1rem] mt-[0.5rem]'>
                <div style={{ background: 'linear-gradient(to right, #56ccf2, #2f80ed)' }} className='w-full flex items-center rounded-lg px-2 py-2 gap-2'>
                    <img src='/tong_doanh_thu.png' width={'65px'} />
                    <div className='flex flex-col'>
                        <span className='text-[white] font-bold text-[16px]'>Tổng Doanh Thu</span>
                        <span className='text-[white] font-semibold text-[16px]'>{formatMoney(payments.reduce((total, item) => total + (item.price * 0.2), 0))}đ</span>
                    </div>
                </div>
                <div style={{ background: 'linear-gradient(to left, #3494e6, #ec6ead)' }} className='w-full flex items-center rounded-lg px-2 py-2 gap-2'>
                    <img src='/tong_nguoi_hoc.png' width={'65px'} />
                    <div className='flex flex-col'>
                        <span className='text-[white] font-bold text-[16px]'>Tổng Người Học</span>
                        <span className='text-[white] font-semibold text-[16px]'>{payments.length} người học</span>
                    </div>
                </div>
            </div>
            <span className='font-semibold my-2'>Lịch sử dòng tiền</span>
            <table className="w-full text-sm text-left rtl:text-right ">
                <thead className="sticky top-0 left-0 text-xs  uppercase bg-gray-50 ">
                    <tr>
                        <th
                            scope="col"
                            className="w-[5%] py-3 text-center"
                        >
                            #
                        </th>
                        <th scope="col" className="w-[15%] py-3">
                            Tên Học Viên
                        </th>
                        <th scope="col" className="w-[20%] py-3">
                            Khóa Học
                        </th>
                        <th scope="col" className="w-[17%] py-3">
                            Tổng tiền
                        </th>
                        <th scope="col" className="w-[17%] py-3">
                            Thời gian
                        </th>
                    </tr>
                </thead>
                <tbody className=" w-[full] font-medium">
                    {payments.map((payment, index) => (
                        <tr
                            key={index}
                            className="odd:bg-white even:bg-gray-50  border-b "
                        >
                            <td
                                scope="row"
                                className="px-6 py-4 text-center font-medium"
                            >
                                {index + 1}
                            </td>
                            <td className="py-4 text-[15px]">
                                {payment.customer.fullName}
                            </td>
                            <td
                                className="py-4"
                            >
                                {payment.course.name}
                            </td>
                            <td
                                className="py-4"
                            >
                                {formatMoney(payment.price * 0.2)} đ
                            </td>
                            <td className="py-4 flex items-center gap-2">
                                {formatDate(payment.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DoanhThuNenTang