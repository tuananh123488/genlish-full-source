import React from 'react'

const SecondSection = () => {
    return (
        <section className='md:px-[4rem] mt-[2rem] sm:px-[10px] grid px-[1rem] sm:grid-cols-3 grid-cols-1 gap-8 sm:gap-5  lg:px-[8rem] mb-20'>
            <div className='hover:scale-[1.03] hover:z-2 transition-[0.3s] shadow-xl rounded-[10px] overflow-hidden'>
                <img className='' src='/banner1.png' />
                <div className='p-[1rem]'>
                    <h2 className='font-bold mb-3 text-[1.5rem] leading-[28px]'>Learn English Any Time, Any Where</h2>
                    <p>I can learn English anytime, anywhere. Develop English skills every day.</p>
                </div>
            </div>
            <div className='hover:scale-[1.03] hover:z-2 transition-[0.3s] shadow-xl rounded-[10px] overflow-hidden'>
                <img className='' src='/banner2.png' />
                <div className='p-[1rem]'>
                    <h2 className='font-bold mb-3 text-[1.5rem] leading-[28px]'>Learn English Any Time, Any Where</h2>
                    <p>I can learn English anytime, anywhere. Develop English skills every day.</p>
                </div>
            </div>
            <div className='hover:scale-[1.03] hover:z-2 transition-[0.3s] shadow-xl rounded-[10px] overflow-hidden'>
                <img className='' src='/banner1.png' />
                <div className='p-[1rem]'>
                    <h2 className='font-bold mb-3 text-[1.5rem] leading-[28px]'>Learn English Any Time, Any Where</h2>
                    <p>I can learn English anytime, anywhere. Develop English skills every day.</p>
                </div>
            </div>
        </section>
    )
}

export default SecondSection