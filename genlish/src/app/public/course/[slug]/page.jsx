'use client'
import Navbar from '@/components/Navbar'

import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { api, TypeHTTP } from '@/utils/api'
import { useParams, useRouter } from 'next/navigation'
import DetailCourse from '@/components/course/DetailCourse'
import ViewingCourse from '@/components/course/ViewingCourse'
import { authContext } from '@/context/AuthContext'
import { payloadContext } from '@/context/PayloadContext'
import Payment from '@/components/course/Payment'
const CourseDetail = () => {

    const { slug } = useParams()
    const [course, setCourse] = useState()
    const [study, setStudy] = useState(false)
    const [payment, setPayment] = useState(false)
    const wrapperRef = useRef()
    const router = useRouter()
    const { authData } = useContext(authContext)

    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: false, path: `/course/get-by-slug/${slug}` })
            .then(res => {
                setCourse(res)
            })
    }, [slug])

    useEffect(() => {
        if (wrapperRef.current) {
            if (study) {
                wrapperRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                wrapperRef.current.style.overflow = 'hidden'
            } else {
                wrapperRef.current.style.overflow = 'auto'
            }
        }
    }, [study, wrapperRef.current])

    return (
        <motion.div
            initial={{ x: 200 * -1 }}
            animate={{ x: 0 }}
            exit={{ x: 1920 * -1, transition: { duration: 0.2 } }}
        >
            <section className='w-full h-screen flex bg-[#f9fafb]'>
                <div ref={wrapperRef} className=' w-[100%] flex h-screen overflow-y-auto relative pt-[1rem]'>
                    <div onClick={() => router.push('/')} className='w-full cursor-pointer absolute left-6 flex items-center gap-2 top-2 text-[#3f3f3f]'>
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Trở về</span>
                    </div>
                    {course && (
                        <div style={{ transition: '0.5s', marginLeft: payment ? '-100%' : study ? '-200%' : '0' }} className='w-[100%] flex'>
                            <DetailCourse course={course} setStudy={setStudy} setPayment={setPayment} />
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    )
}

export default CourseDetail