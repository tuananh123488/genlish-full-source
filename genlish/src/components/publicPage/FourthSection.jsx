import React from 'react'

const FourthSection = () => {
    return (
        <section className='w-full py-[7rem] rounded-[1rem] bg-white sm:my-10 flex items-center justify-center text-black'>
            <div className='p-[10px] sm:p-[2rem] w-[50rem]'>
                <h2 className='text-black text-[20px] text leading-[30px] mb-3 sm:text-[2.5rem] sm:leading-[50px] sm:my-5 font-bold font-poppins'>
                    Accumulate knowledge and skills that will help you succeed in the future
                </h2>
                <p className='text-[16px] sm:text-[18px]'>
                    We must actively study and supplement knowledge and skills every day. That will help you achieve your dream success
                </p>
            </div>
            <img className='w-[35%]' src='/hat.png' />
        </section>
    )
}

export default FourthSection