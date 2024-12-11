import React from 'react'

import { dateCrateComment } from '@/utils/other';
const Comment = ({ username, content, date }) => {
    return (


        <div className="comment-container border p-2 rounded-lg shadow-md my-4">

            <div className="comment-content">
                <div className="comment-header flex justify-between items-center">
                    <div className='flex items-center'>
                        <img
                            src="https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0"
                            className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                            <h4 className="text-lg font-semibold">{username}</h4>
                            <div className="comment-body mt-2">
                                <p>{content}</p>
                            </div>
                        </div>

                    </div>

                    <span className="text-sm text-gray-500">{dateCrateComment(date)}</span>
                </div>


            </div>
        </div>
    );
};

export default Comment