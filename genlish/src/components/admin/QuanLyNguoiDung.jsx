import { api, TypeHTTP } from '@/utils/api'
import { formatDate } from '@/utils/date'
import React, { useEffect, useState } from 'react'

const QuanLyNguoiDung = () => {

    const [users, setUsers] = useState([])
    const [userFilters, setUserFilters] = useState([])
    const [name, setName] = useState('')

    useEffect(() => {
        api({ type: TypeHTTP.GET, path: '/user/get-all-student', sendToken: true })
            .then(res => setUsers(res))
    }, [])

    useEffect(() => {
        const filteredUsers = users.filter(user =>
            user.fullName.toLowerCase().includes(name.toLowerCase())
        )
        setUserFilters(filteredUsers)
    }, [name, users])

    return (
        <section className='flex flex-col h-screen p-[1.5rem]'>
            <div className='flex justify-between'>
                <h1 className='font-semibold text-[20px]'>Tất Cả Người Dùng: {users.length}</h1>
                <input value={name} onChange={e => setName(e.target.value)} placeholder='Tìm tên người dùng' className='text-[14px] px-2 h-[37px] w-[200px] rounded-md focus:outline-none border-[#c4c4c4] border-[1px]' />
            </div>
            {name === '' ? (

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
                                Họ và tên
                            </th>
                            <th scope="col" className="w-[15%] py-3">
                                Số điện thoại
                            </th>
                            <th scope="col" className="w-[15%] py-3">
                                Tiến độ
                            </th>
                            <th scope="col" className="w-[15%] py-3">
                                Địa chỉ
                            </th>
                            <th scope="col" className="w-[20%] py-3">
                                Thời gian
                            </th>

                        </tr>
                    </thead>
                    <tbody className=" w-[full]  font-medium">
                        {users.map((user, index) => (
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
                                    {user.fullName}
                                </td>
                                <td className="py-4 text-[15px]">
                                    {user.phone}
                                </td>
                                <td className="py-4 text-[15px]">
                                    Cấp độ {user.study.levelVocabulary.gate} - Ải {user.study.levelVocabulary.door}
                                </td>
                                <td className="py-4 text-[15px]">
                                    {user.address}
                                </td>

                                <td
                                    className="py-4"
                                >
                                    Đã đăng ký vào {formatDate(user.createdAt)}
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>
            ) : (

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
                                Họ và tên
                            </th>
                            <th scope="col" className="w-[15%] py-3">
                                Số điện thoại
                            </th>
                            <th scope="col" className="w-[15%] py-3">
                                Tiến độ
                            </th>
                            <th scope="col" className="w-[15%] py-3">
                                Địa chỉ
                            </th>
                            <th scope="col" className="w-[20%] py-3">
                                Thời gian
                            </th>

                        </tr>
                    </thead>
                    <tbody className=" w-[full]  font-medium">
                        {userFilters.map((user, index) => (
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
                                    {user.fullName}
                                </td>
                                <td className="py-4 text-[15px]">
                                    {user.phone}
                                </td>
                                <td className="py-4 text-[15px]">
                                    Cấp độ {user.study.levelVocabulary.gate} - Ải {user.study.levelVocabulary.door}
                                </td>
                                <td className="py-4 text-[15px]">
                                    {user.address}
                                </td>

                                <td
                                    className="py-4"
                                >
                                    Đã đăng ký vào {formatDate(user.createdAt)}
                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>
            )}
        </section>
    )
}

export default QuanLyNguoiDung