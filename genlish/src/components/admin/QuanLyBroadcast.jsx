import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { apiKey } from '@/utils/apikey'
import axios from 'axios'
import React, { useContext } from 'react'
import { formatDuration, parseISO8601Duration } from '@/utils/other'

const QuanLyBroadcast = ({ broadcast, broadcasts, setBroadCasts, setBroadCast }) => {
    const { notifyHandler } = useContext(notifyContext)

    const handleCreateBroadCast = async () => {
        const formData = new FormData()
        formData.append('strs', broadcast.englishFile)
        formData.append('strs', broadcast.vietnameseFile)
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${broadcast.urlVideo}&key=${apiKey}&part=snippet,contentDetails,statistics,status`)
        const title = res.data.items[0].snippet.title
        const thum = res.data.items[0].snippet.thumbnails.maxres.url
        const duration = formatDuration(parseISO8601Duration(res.data.items[0].contentDetails.duration)).replace('00:', '')
        const channelName = res.data.items[0].snippet.channelTitle
        formData.append('urlVideo', broadcast.urlVideo);
        formData.append('title', title)
        formData.append('thum', thum)
        formData.append('duration', duration)
        formData.append('channelName', channelName)
        api({ sendToken: false, type: TypeHTTP.POST, path: '/broadcast/save', body: formData })
            .then(broadcast => {
                setBroadCasts(prev => [...prev, broadcast])
                notifyHandler.notify(notifyType.SUCCESS, 'Thêm Thành Công')
            })
            .catch(error => {
                notifyHandler.notify(notifyType.FAIL, error.message)
            })
    }

    const handleFileChange = (e, type) => {
        const selectedFile = e.target.files[0]; // Lấy file đầu tiên từ danh sách file
        if (selectedFile) {
            if (type === 'vietnam') {
                setBroadCast({ ...broadcast, vietnameseFile: selectedFile })
            } else {
                setBroadCast({ ...broadcast, englishFile: selectedFile })
            }
        }
    };

    const handleRemoveBroadcast = (id) => {
        api({ path: `/broadcast/delete/${id}`, type: TypeHTTP.DELETE, sendToken: false })
            .then(res => {
                setBroadCasts(broadcasts.filter(item => item._id.toLowerCase() !== res._id.toLowerCase()))
                notifyHandler.notify(notifyType.SUCCESS, 'Xóa thành công')

            })
    }

    return (
        <div className='w-full  p-[1rem] flex flex-col gap-2'>
            <span>Quản Lý BroadCast</span>
            <div className='grid grid-cols-2 gap-3'>
                <input type='file' onChange={e => handleFileChange(e, 'english')} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                <input type='file' onChange={e => handleFileChange(e, 'vietnam')} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' />
                <input value={broadcast.urlVideo} onChange={e => setBroadCast({ ...broadcast, urlVideo: e.target.value })} className='rounded-lg text-[15px] focus:outline-0 shadow-sm h-[45px] px-[1rem] border-[1px] border-[#e1e1e1]' placeholder='URL Video' />
            </div>

            <button onClick={() => handleCreateBroadCast()} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[10%] py-[7px] rounded-lg">Thêm</button>
            <span className='my-4 text-[20px]' > Danh sách broadcast</span>
            <div className='overflow-y-scroll h-[350px]'>{broadcasts.map((broadCast, index) => (
                <div key={index} className='rounded-md cursor-pointer overflow-hidden flex  bg-white shadow-xl m-2' style={{ alignItems: 'center' }} >
                    <img src={broadCast.thum} width={'15%'} />
                    <div className='py-1 flex justify-between w-3/5'>
                        <span
                            className='font-poppins font-semibold text-[15px] my-2 px-2'>{broadCast.title}
                        </span>
                        <span
                            className='font-poppins font-semibold text-[15px] my-2 px-2'>
                            {broadCast.duration}
                        </span>
                    </div>

                    <div onClick={() => handleRemoveBroadcast(broadCast._id)} className=" hover:text-red-400 px-4 py-2 cursor-pointer rounded-lg ">
                        Delete
                    </div>
                </div>
            ))}</div>
        </div>
    )
}

export default QuanLyBroadcast