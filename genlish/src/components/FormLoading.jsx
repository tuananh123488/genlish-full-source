'use client'
import { authContext } from '@/context/AuthContext'
import { notifyContext, notifyType } from '@/context/NotifyContext'
import { api, TypeHTTP } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const FormLoading = ({ visible, oldPathname, pathname, setLoading }) => {

    useEffect(() => {
        if (oldPathname !== pathname) {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    }, [pathname])

    return (
        <section style={{ top: visible ? '0' : '100%', transition: '0.4s' }} className='z-[45] flex flex-col gap-3 items-center justify-center fixed left-0 w-screen h-screen transition-all bg-[white]'>
            <img src="/logo.png" className="w-[7%] animate-slight-move" />
            <span className='text-[20px] font-semibold'> Đang Tải ...</span>
        </section>
    )
}

export default FormLoading