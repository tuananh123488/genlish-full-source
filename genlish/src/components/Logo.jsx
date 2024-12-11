import { authContext } from '@/context/AuthContext'
import React, { useContext } from 'react'

const Logo = ({ scale }) => {
    const { authData } = useContext(authContext)
    return (
        <div style={{ scale: scale ? scale : 1 }} className='flex items-end gap-1'>
            <img width={'35px'} src='/logo.png' />
            {authData.user?.role !== 'USER' && (
                <span className='text-[23px] font-bold'>Genlish</span>
            )}
        </div>
    )
}

export default Logo