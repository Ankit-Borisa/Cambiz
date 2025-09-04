import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import photo from "../images/search-bg.jpg";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../BASE_URL';


const Blog = () => {

    const gradientStyle = {
        background: `-webkit-linear-gradient(left, #7677FF, #00AEEF)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

const navigate = useNavigate()

    const [blogs, setBlogs] = useState([])

    const fetchBlogs = async () => {

        // const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        const res = await fetch(`${BASE_URL}api/blog/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Authorization: token,
            },
        })
        const data = await res.json()
        // console.log(data)
        setBlogs(data?.data)
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleViewClick = (blog) => {
        navigate('/blog-detail', { state: { blog } });
    }

    return (
        <div className='max-w-[1350px] m-auto'>
            <div className='w-full md:py-10'>
                <ToastContainer />

                <div className='sm:px-10 sm:py-10 px-5 py-5 bg-[#5587FA1A]/[.1] rounded-lg'>
                    <div className="">
                        <div className='w-full mb-10'>
                            <h1 className='text-darkBlue text-4xl font-semibold'>
                                Latest <span style={gradientStyle}>Blogs</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr,1fr,1fr] gap-4">
                            {blogs && blogs?.map((e) => (
                                <div className="bg-white rounded-[20px] p-5 flex flex-col h-full">
                                    <img src={e?.photo} alt="" className='rounded-md' />
                                    <h4 className='text-2xl font-semibold mt-3 '>{e?.title}</h4>
                                    <p className='mb-3  text-gray-400 font-semibold'>Posted On : <span className='text-black'>{e?.createdAt?.slice(0, 10)}</span></p>
                                    <p className=''>{e?.Description?.slice(0, 50)}</p>
                                    <div className='flex justify-center mt-auto'>
                                        <button
                                            className='bg-darkBlue text-white text-sm px-10 py-2 rounded-lg mt-4'
                                            onClick={() => handleViewClick(e)}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* ))} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
