import { authContext } from '@/context/AuthContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatDate, formatDateTime } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const PaymentHistory = ({ history, setHistory }) => {

    const [payments, setPayments] = useState([])
    const { authData } = useContext(authContext)
    useEffect(() => {
        if (history && authData.user) {
            api({ type: TypeHTTP.GET, path: `/payment/get-by-customer/${authData.user._id}`, sendToken: true })
                .then(payments => {
                    console.log(payments)
                    setPayments(payments)
                })
        }
    }, [history])

    return (
        <div style={{ right: history ? '0' : '-100%', transition: '0.5s' }} className='bg-[white] z-40 fixed top-0 w-[95%] gap-3 p-[1.5rem] h-screen overflow-y-auto items-center flex flex-col'>
            <button onClick={() => setHistory(false)}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
            <span className='w-full font-semibold'>Lịch sử thanh toán</span>
            <div className='w-full h-[90%] flex flex-col overflow-y-auto gap-2'>
                {payments.map((payment, index) => (
                    <div key={index} className='flex flex-col bg-[#f3f3f3] px-4 py-2 w-[90%] rounded-lg gap-2'>
                        <span>Thụ hưởng: 9908080899-LE XUAN TUAN ANH</span>
                        <div className='flex gap-1'>
                            <span className='w-[120px]'>Nội dung:</span>
                            <span>{payment.paymentInfo}</span>
                        </div>
                        <span>Thời gian: {formatDateTime(payment.createdAt)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PaymentHistory