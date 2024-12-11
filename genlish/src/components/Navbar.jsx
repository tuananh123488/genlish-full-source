import React, { useContext, useEffect, useState } from 'react'
import Logo from './Logo'
import { notifyContext } from '@/context/NotifyContext'
import { authContext } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {

    const { notifyHandler } = useContext(notifyContext)
    const { authData, authHandler } = useContext(authContext)
    const pathname = usePathname()


    const handleSignOut = () => {
        globalThis.localStorage.removeItem('accessToken')
        globalThis.localStorage.removeItem('refreshToken')
        authHandler.setUser()
        notifyHandler.navigate('/')
    }
    const [user, setUser] = useState(authData.user);

    useEffect(() => {
        setUser(authData.user);
    }, [authData.user]);
    return (
        <>
            {user?.role === 'USER' ? (<section className='w-[5%] px-[1rem] py-[1.25rem] relative flex flex-col items-center border-r-[1px] bg-[white]'>
                <Logo />
                <div className='flex flex-col gap-2 mt-[1rem] items-center'>
                    <Link href={'/course'}>
                        <div style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] bg-[#ffffff] rounded-lg h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                            <i style={{ color: pathname.includes('course') ? '#4d5de4' : '#616161', backgroundColor: pathname.includes('course') ? '#dfe2ff' : 'none' }} className="rounded-lg fa-brands fa-studiovinari text-[20px] p-[6px] text-[#616161]"></i>
                        </div>
                    </Link>
                    <Link href={'/learn'}>
                        <div style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg bg-[white] h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                            <i style={{ color: pathname === '/learn' ? '#4d5de4' : '#616161', backgroundColor: pathname === '/learn' ? '#dfe2ff' : 'none' }} className="text-[15px] text-[#616161] fa-solid fa-book p-[10px] rounded-lg"></i>
                        </div>
                    </Link>
                    <Link href={'/vocabulary'}>
                        <div style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg bg-[white] h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                            <i style={{ color: pathname === '/vocabulary' ? '#4d5de4' : '#616161', backgroundColor: pathname === '/vocabulary' ? '#dfe2ff' : 'none' }} className="fa-solid fa-magnifying-glass text-[15px] text-[#616161] p-[10px] rounded-lg"></i>
                        </div>
                    </Link>
                    <Link href={'/broad-casts'}>
                        <div style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg bg-[white] h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                            <i style={{ color: pathname === '/broad-casts' ? '#4d5de4' : '#616161', backgroundColor: pathname === '/broad-casts' ? '#dfe2ff' : 'none' }} className="text-[15px] text-[#616161] fa-solid fa-radio p-[10px] rounded-lg"></i>
                        </div>
                    </Link>
                    <Link href={'/communicate-with-ai'}>
                        <div style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg bg-[white] h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                            <i style={{ color: pathname === '/communicate-with-ai' ? '#4d5de4' : '#616161', backgroundColor: pathname === '/communicate-with-ai' ? '#dfe2ff' : 'none' }} className="text-[15px] text-[#616161] fa-solid fa-microphone p-[10px] rounded-lg"></i>
                        </div>
                    </Link>
                    {/* <Link href={'/hoso'}>
                        <div style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg bg-[white] h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                            <img src='/person-menu.png' className='w-[50px]' />
                        </div>
                    </Link> */}
                    {/* <div style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg bg-[white] h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                        <img src='/setting-menu.png' className='w-[50px]' />
                        <span className='font-semibold text-[#393939] text-[15px]'>Cài Đặt</span>
                    </div> */}
                    <div onClick={() => handleSignOut()} style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg bg-[white] h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                        <i className="text-[15px] text-[#616161] fa-solid fa-right-from-bracket"></i>
                    </div>
                </div>
                <Link href={'/hoso'}>
                    <button className='absolute bottom-2 left-[50%] translate-x-[-50%]'>
                        <img src={authData.user?.avatar} className='rounded-full w-[50px]' width={'50px'} />
                    </button>
                </Link>

            </section>) : null}
        </>

    )
}

export default Navbar