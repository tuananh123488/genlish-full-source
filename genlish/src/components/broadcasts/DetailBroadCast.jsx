import { notifyContext, notifyType } from '@/context/NotifyContext';
import { Button, Input } from '@material-tailwind/react';
import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player';
;
import Comment from '../comment';
import { api, TypeHTTP } from '@/utils/api';
import { authContext } from '@/context/AuthContext';
const DetailBroadCast = ({ broadCast, setBroadCast }) => {
    const { authData } = useContext(authContext);
    const [user, setUser] = useState(authData.user);
    const { notifyHandler } = useContext(notifyContext)
    const reactPlayerRef = useRef(null);
    const subRef = useRef()
    const [id, setId] = useState(0)
    const [comment, setComment] = useState()
    const [getComment, setGetComment] = useState([])
    useEffect(() => {

        setUser(authData.user);



    }, [authData.user]);

    const handleOnProgress = () => {
        if (reactPlayerRef.current) {
            const currentTime = reactPlayerRef.current.getCurrentTime();
            let newId = null;

            broadCast?.englishSubtitle.forEach((item, index) => {
                if (currentTime >= item.firstTime && currentTime <= item.lastTime) {
                    newId = index;
                }
            });
            if (newId !== null && newId !== id) {
                setId(newId);
                if (id !== null) {
                    const previousSubEnglish = document.querySelector(`.sub-${id} .english`);
                    const previousSubVietnamese = document.querySelector(`.sub-${id} .vietnamese`);
                    if (previousSubEnglish) {
                        previousSubEnglish.style.color = 'black';
                        previousSubEnglish.style.transform = 'scale(1)';
                    }
                    if (previousSubVietnamese) {
                        previousSubVietnamese.style.color = 'black';
                        previousSubVietnamese.style.transform = 'scale(1)';
                    }
                }
                const currentSubEnglish = document.querySelector(`.sub-${newId} .english`);
                const currentSubVietnamese = document.querySelector(`.sub-${newId} .vietnamese`);
                if (currentSubEnglish) {
                    currentSubEnglish.style.color = '#6dbaa8';
                    currentSubEnglish.style.transform = 'scale(1.05)';
                }
                if (currentSubVietnamese) {
                    currentSubVietnamese.style.color = '#6dbaa8';
                    currentSubVietnamese.style.transform = 'scale(1.05)';
                }
            }
        }
    };

    const targetRef = useRef(null);

    useEffect(() => {
        if (subRef.current && targetRef.current) {
            const targetElement = document.querySelector(`.sub-${id}`);
            if (targetElement) {
                subRef.current.scrollTop = targetElement.offsetTop - subRef.current.offsetTop;
            }
        }
    }, [id, broadCast]);
    useEffect(() => {
        const targetElement = document.querySelector(`.sub-${id}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [id, broadCast]);

    useEffect(() => {
        api({ sendToken: false, type: TypeHTTP.GET, path: '/comment/get-all' })
            .then(res => {
                setGetComment(res.filter((item) => item.video_id === broadCast?._id))

            })
    }, [id, broadCast])
    const handleSubmitComment = () => {
        api({ sendToken: false, type: TypeHTTP.POST, path: '/comment/save', body: { user: { _id: user._id, fullName: user.fullName, avatar: user.avatar }, content: comment, video_id: broadCast._id } })
            .then(res => {
                notifyHandler.notify(notifyType.SUCCESS, 'Thêm thành công')
            })
    }
    return (
        <div style={{ right: broadCast ? '0' : '-100%', transition: '0.5s' }} className='bg-[white] z-40 fixed top-0 w-[95%] gap-6 p-[1.5rem] h-screen overflow-y-auto'>
            <button onClick={() => setBroadCast()} className='text-[35px] absolute top-3 right-4 text-[#999]'><i className='bx bx-x' ></i></button>
            <h1 className='mb-4 font-poppins text-[24px] font-bold'>Test Overview</h1>
            <div className='flex gap-[2rem] w-full'>
                <div className='w-[60%]'>
                    <div className='w-full rounded-lg overflow-hidden h-[395px]'>
                        <ReactPlayer
                            config={{
                                youtube: {
                                    playerVars: {
                                        rel: 0, // Tắt gợi ý video liên quan 
                                        fs: 0,
                                    },
                                },
                                facebook: {
                                    appId: '12345'
                                }
                            }}
                            controls
                            url={'https://www.youtube.com/watch?v=' + broadCast?.urlVideo}
                            ref={reactPlayerRef}
                            width={'100%'}
                            height={'100%'}
                            progressInterval={1}
                            onProgress={() => handleOnProgress()}
                        />
                    </div>
                    <h2 className='font-poppins text-[21px] mt-4 font-semibold'>{broadCast?.title}</h2>
                    <h3 className='font-poppins mt-1 text-[18px]'><b>From </b>{broadCast?.channelName}</h3>
                </div>
                <div ref={subRef} className='w-[40%] h-[550px] border-l-[2px] border-[#efefef] overflow-auto pl-[2rem]'>

                    {broadCast?.englishSubtitle.map((item, i) => (
                        <p className={`min-h-[50px] my-6 justify-center flex flex-col transition-all sub sub-${i}`} key={i} ref={i === id ? targetRef : null}>
                            <span className='font-poppins text-[19px] english'>{item.content}</span>
                            <span className='vietnamese'>{broadCast?.vietnameseSubtitle[i].content}</span>
                        </p>
                    ))}
                </div>
            </div>
            <div className='text-[24px]'>
                Bình luận
            </div>
            <div className="mb-3">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border rounded-lg p-3 w-full"
                    placeholder="Viết bình luận..."
                    rows="4"
                />
                <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => handleSubmitComment()}
                >
                    Bình luận
                </button>
            </div>
            {
                getComment.map((e, index) => (
                    <Comment key={index} username={e.user.fullName} content={e.content} date={e.createdAt} />
                ))
            }

        </div>
    )
}

export default DetailBroadCast