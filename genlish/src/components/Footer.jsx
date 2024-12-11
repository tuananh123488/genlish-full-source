import React from 'react'
import Logo from './Logo'

const Footer = () => {
    return (
        <div className="flex flex-col gap-5 items-start text-[white] justify-start px-[6rem] py-[3rem] bg-[#242a61] w-[100%] text-[14px] font-medium">
            <div>
                <Logo scale={1.15} color='white' />
            </div>
            <div className='flex items-center'>
                <div className='flex flex-col gap-2'>
                    <span className='flex gap-2 items-center'><span className='font-bold text-[15px]'>Hotline</span> 0902491471</span>
                    <span className='flex gap-2 items-center'><span className='font-bold text-[15px]'>Hỗ Trợ</span> lexuantuananh  @gmail.com</span>
                    <span className='w-[400px]'>Copyright © 2017-2024 Rai and Rohl Technologies, Inc. All rights reserved.</span>
                </div>
            </div>
        </div>
    )
}

export default Footer