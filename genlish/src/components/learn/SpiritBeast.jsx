import React from 'react'

const SpiritBeast = ({ left, top, index }) => {
    return (
        <div style={index % 2 === 0 ? left === true ? { left: '25%', top: `${top}%` } : { right: '25%', top: `${top}%` } : left === true ? { right: '25%', top: `${top}%` } : { left: '25%', top: `${top}%` }} className='absolute translate-y-[-50%]'>
            <div className='h-[90px] transition-all top-0 absolute z-10 w-[100px] rounded-full flex items-center justify-center bg-[#e5e5e5]'>
                <div style={{ width: index + 1 <= 3 ? '200px' : '250px', top: index + 1 <= 3 ? '50%' : '70%', left: index + 1 === 2 ? '65%' : '50%' }} className='absolute translate-y-[-70%] translate-x-[-50%]'>
                    <img src={`/beast-${index + 1}.gif`} className='top-0 left-[50%] h-auto z-50' />
                </div>
            </div>
            <div className='h-[90px] absolute top-[8px] w-[100px] rounded-full bg-[#b7b7b7]'></div>
            <div className='h-[100px] w-[100px]'>

            </div>
        </div>
    )
}

export default SpiritBeast