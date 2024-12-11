'use client'
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import FourthSection from "@/components/publicPage/FourthSection";
import SecondSection from "@/components/publicPage/SecondSection";
import ThirdSection from "@/components/publicPage/ThirdSection";
import { authContext } from "@/context/AuthContext";
import { notifyContext, notifyType } from "@/context/NotifyContext";
import { api, TypeHTTP } from "@/utils/api";
import { formatMoney, removeVietnameseTones } from "@/utils/other";
import { convertSecondsToReadableFormat } from "@/utils/time";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from 'framer-motion'

export const roles = {
  user: 'user',
  teacher: 'teacher',
  admin: 'admin'
}

export default function Home() {
  const { notifyHandler } = useContext(notifyContext)
  const { authHandler } = useContext(authContext)
  const [role, setRole] = useState(roles.user)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    api({ type: TypeHTTP.GET, sendToken: false, path: '/course/get-all' })
      .then(res => {
        setCourses(res)
      })
  }, [])

  const handleSignIn = () => {
    if (role === roles.teacher) {
      if (phone === '') {
        notifyHandler.notify(notifyType.FAIL, 'Số điện thoại không được để trống')
        return;
      }
      if (password === '') {
        notifyHandler.notify(notifyType.FAIL, 'Mật khẩu không được để trống')
        return;
      }

      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

      if (!phoneRegex.test(phone)) {
        notifyHandler.notify(notifyType.WARNING, 'Số điện thoại không hợp lệ');
        return;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        notifyHandler.notify(notifyType.WARNING, 'Mật khẩu không hợp lệ. Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số');
        return;
      }
      api({ type: TypeHTTP.POST, body: { phone: phone, password: password }, sendToken: false, path: '/auth/sign-in-with-teacher' })
        .then(res => {
          if (res.user.statusTeacher === false) {
            notifyHandler.notify(notifyType.WARNING, 'Hồ sơ giáo viên chưa được quản trị viên phê duyệt')
          } else {
            globalThis.localStorage.setItem('accessToken', res.tokens.accessToken)
            globalThis.localStorage.setItem('refreshToken', res.tokens.refreshToken)
            authHandler.setUser(res.user)
            notifyHandler.notify(notifyType.SUCCESS, 'Đăng nhập thành công')
            setTimeout(() => {
              notifyHandler.navigate('/teacher')
            }, 1500);
          }
        })
        .catch(error => {
          notifyHandler.notify(notifyType.FAIL, error.message)
        })
    } else if (role === roles.admin) {
      if (phone === '') {
        notifyHandler.notify(notifyType.FAIL, 'Số điện thoại không được để trống')
      }
      if (password === '') {
        notifyHandler.notify(notifyType.FAIL, 'Mật khẩu không được để trống')
      }
      api({ type: TypeHTTP.POST, body: { phone: phone, password: password }, sendToken: false, path: '/auth/sign-in-with-admin' })
        .then(res => {
          globalThis.localStorage.setItem('accessToken', res.tokens.accessToken)
          globalThis.localStorage.setItem('refreshToken', res.tokens.refreshToken)
          authHandler.setUser(res.user)
          notifyHandler.notify(notifyType.SUCCESS, 'Đăng nhập thành công')
          setTimeout(() => {
            notifyHandler.navigate('/admin')
          }, 1500);
        })
        .catch(error => {
          notifyHandler.notify(notifyType.FAIL, error.message)
        })
    }
  }

  return (
    <motion.div
      initial={{ x: 200 * -1 }}
      animate={{ x: 0 }}
      exit={{ x: 1920 * -1, transition: { duration: 0.2 } }}
    >

      <section className="flex flex-col item-center bg-[white] justify-center">
        <div className="h-screen py-3 flex flex-col px-[10%]">
          <div className="flex items-end justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <div className="flex items-center w-[200px] gap-2">
                <span className="font-semibold text-[16px] text-[#595959]">Vai Trò:</span>
                <select value={role} onChange={e => setRole(e.target.value)} className="bg-[white] text-center hover:scale-[1.06] transition-all text-[#149dff] shadow-xl border-[1px] border-[#e4e4e4] font-bold text-[16px] focus:outline-0 py-[5px] rounded-lg">
                  <option value={'user'} className="text-center">Học Sinh</option>
                  <option value={'teacher'} className="text-center">Giáo Viên</option>
                  <option value={'admin'} className="text-center">Quản Trị Viên</option>
                </select>
              </div>
              <span className="font-semibold text-[16px] text-[#595959]">Ngôn ngữ hiển thị: Tiếng Việt</span>
              <Link href={'/public/vocabulary'}>
                <div style={{ transition: '0.4s' }} className='flex hover:bg-[#ebebeb] rounded-lg bg-[white] h-[35px] px-2 w-[35px] items-center gap-4 cursor-pointer justify-center'>
                  <i className="fa-solid fa-magnifying-glass text-[15px] text-[#616161]"></i>
                </div>
              </Link>
            </div>
          </div>
          {role === roles.user ? (
            <div className="flex items-center justify-between mt-[2rem] gap-4">
              <img src="/couple.png" className="w-[50%] animate-slight-move" />
              <div className="flex flex-col gap-2 w-[45%] items-center">
                <span className="text-center text-[25px] font-semibold">Cách học tiếng Anh miễn phí, vui nhộn, và hiệu quả</span>
                <button onClick={() => { notifyHandler.navigate('/getting-started') }} className="text-center bg-[#149dff] transition-all hover:scale-[1.06] text-[white] font-bold text-[16px] w-[60%] py-[7px] rounded-lg">Bắt Đầu</button>
                <button onClick={() => authHandler.showSignIn()} className="bg-[white] hover:scale-[1.06] transition-all text-[#149dff] shadow-xl border-[1px] border-[#e4e4e4] font-bold text-[16px] w-[60%] py-[7px] rounded-lg">Tôi Đã Có Tài Khoản</button>
              </div>
            </div>
          ) : role === roles.teacher ? (
            <div className="flex items-center justify-between mt-[4rem] gap-4">
              <div className="w-[50%] flex justify-center">
                <img src="/teacher.png" className="w-[80%] animate-slight-move" />
              </div>
              <div style={{ background: 'linear-gradient(to right, #11998e, #38ef7d)' }} className="flex flex-col gap-2 py-[2rem] rounded-xl w-[50%] items-center">
                <h1 className=' mt-[0.5rem] font-bold text-[28px] text-[white] font-poppins' >Đăng Nhập</h1>
                <span className="text-center mb-[1rem] text-[17px] font-semibold w-full px-[4rem] text-[white]">Với vai trò giáo viên, bạn có thể phân bổ bài học cho học sinh</span>
                <input value={phone} onChange={e => setPhone(e.target.value)} className='w-[18rem] sm:w-[25rem] focus:scale-[1.03] transition pt-1 text-[15px] focus:outline-0 rounded-[0.5rem] px-[1rem] text-black my-[5px] h-[50px] from-[#ffffffac] to-[#ffffff45] bg-gradient-to-br bg-transparent' placeholder='Số Điện Thoại' />
                <input value={password} onChange={e => setPassword(e.target.value)} type='password' className='w-[18rem] sm:w-[25rem] focus:scale-[1.03] transition pt-1 text-[15px] focus:outline-0 rounded-[0.5rem] px-[1rem] text-black my-[5px] h-[50px] from-[#ffffffac] to-[#ffffff45] bg-gradient-to-br bg-transparent' placeholder='Mật Khẩu' />
                <button onClick={() => handleSignIn()} className='hover:scale-[1.02] transition my-[0.5rem] font-semibold rounded-[10px] px-[2rem] py-[12px] text-[white] bg-[#241d49]'>Đăng Nhập</button>
                <div className='py-1 cursor-pointer w-full text-center text-[16px] text-[white]'>
                  <span>Chưa có tài khoản? </span>
                  <button onClick={() => router.push('/sign-up-teacher')} className="font-bold">Đăng Ký</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-[4rem] gap-4">
              <div className="w-[50%] flex justify-center">
                <img src="/admin.png" className="w-[80%] animate-slight-move" />
              </div>
              <div style={{ background: 'linear-gradient(to right, #8a2387, #e94057, #f27121)' }} className="flex flex-col gap-2 py-[2rem] rounded-xl w-[50%] items-center">
                <h1 className=' mt-[0.5rem] font-bold text-[28px] text-[white] font-poppins' >Đăng Nhập</h1>
                <span className="text-center mb-[1rem] text-[17px] font-semibold w-full px-[4rem] text-[white]">Với vai trò quản trị viên, bạn có thể cài đặt lộ trình học và quản lý người sử dụng</span>
                <input value={phone} onChange={e => setPhone(e.target.value)} className='w-[18rem] sm:w-[25rem] focus:scale-[1.03] transition pt-1 text-[15px] focus:outline-0 rounded-[0.5rem] px-[1rem] text-black my-[5px] h-[50px] from-[#ffffffac] to-[#ffffff45] bg-gradient-to-br bg-transparent' placeholder='Tên Đăng Nhập' />
                <input value={password} onChange={e => setPassword(e.target.value)} type='password' className='w-[18rem] sm:w-[25rem] focus:scale-[1.03] transition pt-1 text-[15px] focus:outline-0 rounded-[0.5rem] px-[1rem] text-black my-[5px] h-[50px] from-[#ffffffac] to-[#ffffff45] bg-gradient-to-br bg-transparent' placeholder='Mật Khẩu' />
                <button onClick={() => handleSignIn()} className='hover:scale-[1.02] transition my-[0.5rem] font-semibold rounded-[10px] px-[2rem] py-[12px] text-[white] bg-[#241d49]'>Đăng Nhập</button>
              </div>
            </div>
          )}
        </div>
        <SecondSection />
        {role === roles.user && (<>
          <span className="w-full text-center font-nunitosans font-bold text-[25px] text-[#393939]">Các Khóa Học</span>
          <div className='w-full grid grid-cols-4 mt-[1rem] gap-4 px-[3rem] mb-[2rem]'>
            {courses.map((course, index) => (
              <div onClick={() => notifyHandler.navigate(`/public/course/${removeVietnameseTones(course.slug)}`)} className='transition-all hover:scale-[1.05] cursor-pointer flex flex-col w-[full] pb-2 shadow-xl rounded-xl' key={index}>
                <img src={course.image} width={'100%'} className='rounded-t-xl' />
                <span className='font-medium text-[15px] w-full px-3 mt-2'>{course.title}</span>
                <span className={`font-semibold text-[14px] text-[#5dade2] mt-1 w-full px-3`}>{course.type === 'free' ? 'Miễn Phí' : `${formatMoney(course.price)} đ`}</span>
                <div className='flex gap-1 relative items-center px-2 mt-1'>
                  <img src={course.teacher.avatar} className='w-[25px] aspect-square rounded-full' />
                  <span className='text-[13px] text-[#4d4d4d]'>{course.teacher.fullName}</span>
                  <span className='absolute flex items-center gap-1 text-[#4d4d4d] text-[14px] right-3 top-[50%] translate-y-[-50%]'>
                    <i className='bx bx-time-five translate-y-[1px]'></i>
                    {convertSecondsToReadableFormat(
                      course.list_course.reduce((total, item) => total + item.duration, 0)
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>)}
        {/* <ThirdSection />
      <FourthSection /> */}
        <Footer />
      </section>
    </motion.div>
  );
}
