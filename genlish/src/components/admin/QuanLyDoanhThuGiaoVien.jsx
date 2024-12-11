import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatMoney, typePayments } from '@/utils/other'
import React, { useContext, useEffect, useState } from 'react'
import YeuCauRutTien from './doanh-thu-giao-vien/YeuCauRutTien'
import DoanhThuNenTang from './doanh-thu-giao-vien/DoanhThuNenTang'

const QuanLyDoanhThuGiaoVien = () => {

    const [payments, setPayments] = useState([])
    const [option, setOption] = useState('1')

    const getData = () => {
        api({ type: TypeHTTP.GET, sendToken: true, path: '/payment/get-withdraw-teacher' })
            .then(res => {
                let arr = []
                res.forEach(item => {
                    if (!arr.map(item1 => item1.teacher._id).includes(item.provider._id)) {
                        arr.push({
                            teacher: item.provider
                        })
                    }
                })
                arr = arr.map(item => {
                    const filter = res.filter(item1 => item1.provider._id === item.teacher._id)
                    return { ...item, payments: filter }
                })
                setPayments(arr)
            })
    }

    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: true, path: '/payment/get-withdraw-teacher' })
            .then(res => {
                console.log(res)
                let arr = []
                res.forEach(item => {
                    if (!arr.map(item1 => item1.teacher._id).includes(item.provider._id)) {
                        arr.push({
                            teacher: item.provider
                        })
                    }
                })
                arr = arr.map(item => {
                    const filter = res.filter(item1 => item1.provider._id === item.teacher._id)
                    return { ...item, payments: filter }
                })
                setPayments(arr)
            })
    }, [])

    useEffect(() => {
        getData()
    }, [])
    return (
        <section style={{ marginLeft: `-${screen * 100}%` }} className='flex flex-col w-full relative h-[100%] transition-all'>
            <div className='min-w-[100%] flex flex-col gap-2 h-[100%] overflow-auto p-[1rem]'>
                <div className='w-full flex justify-between mb-[0.5rem]'>
                    <span className='font-semibold'>{option === '1' ? 'Yêu cầu rút tiền từ giáo viên' : 'Thống kê doanh thu nền tảng'}</span>
                    <select onChange={(e) => setOption(e.target.value)} className='text-[14px] px-4 py-1 focus:outline-0 border-[#999] border-[1px] rounded-lg'>
                        <option value={'1'}>Yêu cầu rút tiền</option>
                        <option value={'2'}>Thống kê doanh thu</option>
                    </select>
                </div>
                {option === '1' ? <YeuCauRutTien /> : <DoanhThuNenTang option={option} />}
            </div>
        </section>
    )
}

export default QuanLyDoanhThuGiaoVien