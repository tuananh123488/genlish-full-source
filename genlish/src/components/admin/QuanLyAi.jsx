import { formContext } from '@/context/FormContext';
import { notifyContext, notifyType } from '@/context/NotifyContext';
import { api, TypeHTTP } from '@/utils/api';
import React, { useContext, useState } from 'react'
import QuanLyCua from './QuanLyCua';

const QuanLyAi = ({ gates, setGates, cua, setCua }) => {

    const { notifyHandler } = useContext(notifyContext)
    const { formHandler } = useContext(formContext)
    const [currentAi, setCurrentAi] = useState()

    const handleDelete = (gateId) => {
        api({ type: TypeHTTP.DELETE, path: `/gate/delete/${gateId}`, sendToken: false, })
            .then((gate) => {
                setGates(gates.filter(item => item._id.toLowerCase() !== gate._id.toLowerCase()));


                notifyHandler.notify(notifyType.SUCCESS, 'Xóa thành công')
            })
    }

    return (
        <div className='w-full flex h-full'>
            <div style={{ transition: '0.5s', marginLeft: currentAi ? '-100%' : 0 }} className='w-[100%] flex'>
                <div className='min-w-[100%] px-[1rem]'>
                    <div className='w-full h-screen p-[1rem] flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                            <span className='font-semibold'>Quản Lý Lộ Trình Học Từ Vựng</span>
                            <button onClick={() => { formHandler.showThemAi() }} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-semibold text-[14px] w-[140px] py-[7px] rounded-lg">Thêm Chương Học</button>
                        </div>
                        <div className="w-full max-h-[90%] mt-2 overflow-y-auto relative">
                            <table className="w-full text-sm text-left rtl:text-right">
                                <thead className="sticky top-0 left-0 text-xs uppercase bg-gray-50 ">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="w-[5%] py-3 text-center"
                                        >
                                            #
                                        </th>
                                        <th scope="col" className="w-[15%] py-3">
                                            Tên Chương
                                        </th>
                                        <th scope="col" className="w-[20%] py-3">
                                            Cấp Độ
                                        </th>
                                        <th scope="col" className="w-[17%] py-3">
                                            Các Thao Tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className=" w-[full]  font-medium">
                                    {gates.map((gate, index) => (
                                        <tr
                                            key={index}
                                            className="odd:bg-white  even:bg-gray-50  border-b"
                                        >
                                            <td
                                                scope="row"
                                                className="px-6 py-4 text-center font-medium"
                                            >
                                                {index + 1}
                                            </td>
                                            <td className="py-4 text-[15px]">
                                                {gate.title}
                                            </td>
                                            <td
                                                className="py-4"
                                            >
                                                {gate.level}
                                            </td>
                                            <td className="py-4 flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(gate._id)} // Assuming each gate has a unique ID
                                                    className="text-[white] bg-[red] text-[13px] px-3 py-1 rounded-md focus:outline-none"
                                                >
                                                    Xóa
                                                </button>
                                                <button
                                                    onClick={() => setCurrentAi(gate)} // Assuming each gate has a unique ID
                                                    className="text-[white] bg-[blue] text-[13px] px-3 py-1 rounded-md focus:outline-none"
                                                >
                                                    Thêm nội dung
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='min-w-[100%]'>
                    <QuanLyCua gates={gates} cua={cua} setCua={setCua} currentAi={currentAi} setCurrentAi={setCurrentAi} />
                </div>
            </div>
        </div>
    )
}

export default QuanLyAi