import React from 'react'

const QLCacBaiHoc = ({ courses, setCurrentCourse }) => {
    return (
        <div className='min-w-[100%] p-[1rem] flex flex-col gap-2 h-full'>
            <span className='font-semibold text-[#393939] text-[18px]'>Quản Lý Các Bài Học</span>
            {courses.length > 0 && (
                <div className='w-full flex flex-col gap-2 h-[100%] overflow-auto'>
                    {courses.map((course, index) => (
                        <div key={index} onClick={() => setCurrentCourse(course)} className='flex cursor-pointer transition-all hover:bg-[#e4e4e4] items-center gap-2 relative px-[1rem] py-2 bg-[#f6f6f6] rounded-lg'>
                            <img src={course.image} className='w-[80px] rounded-lg' />
                            <div className='flex flex-col'>
                                <span className='font-semibold text-[15px]'>{course.title}</span>
                                <span className='text-[12px]'>by {course.teacher.fullName}</span>
                            </div>
                            <div className='flex flex-col absolute right-[1rem] top-[50%] translate-y-[-50%]'>
                                <span className='text-[13px]'>{course.type === 'free' ? 'Miễn Phí' : 'Trả Phí'}</span>
                                {course.type === 'pay' && (
                                    <span className='text-[12px]'>by {course.price}</span>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}

export default QLCacBaiHoc