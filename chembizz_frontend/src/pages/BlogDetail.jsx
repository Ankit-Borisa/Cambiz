import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import photo from "../images/blog-chemical.jpeg";
import { useLocation } from 'react-router-dom';
import img from "../images/companyProfile.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faXTwitter, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons"
import { BASE_URL } from '../BASE_URL';


const BlogDetail = () => {

    const gradientStyle = {
        background: `-webkit-linear-gradient(left, #7677FF, #00AEEF)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    const location = useLocation();
    const { blog } = location.state || {};
    // console.log(blog)

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
        setBlogs(data?.data)
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className='max-w-[1350px] m-auto'>
            <div className='w-full py-10'>
                <ToastContainer />

                <div className='sm:px-10 sm:py-10 px-5 py-5 bg-[#5587FA1A]/[.1] rounded-lg'>
                    <div className="">
                        <div className='w-full mb-10'>
                            <div className=''>
                                <div>
                                    <h1 className='text-darkBlue text-4xl font-semibold'>
                                        {blog?.title}
                                        {/* <span style={gradientStyle}>Details</span> */}
                                    </h1>
                                    <p className='mt-2'><span className='font-semibold'>Post On</span> : {blog?.createdAt?.slice(0, 10)}</p>
                                </div>
                                <div className='mt-5 flex justify-between items-center'>
                                    <div className='flex items-center gap-4'>
                                        <img src={img} alt="" className='img-fluid' />
                                        <div className=''>
                                            <p className='font-semibold'>ChemBizZ</p>
                                            <p className='text-xs text-gray-400'>jan 13, 2024</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex gap-5'>
                                            <a href="https://www.facebook.com/profile.php?id=61564475525953" target='_blank'>
                                                <FontAwesomeIcon className='h-5 w-5 cursor-pointer' icon={faFacebook} />
                                            </a>
                                            <a href="https://www.linkedin.com/company/chembizzz/" target='_blank'>
                                                <FontAwesomeIcon className='h-5 w-5 cursor-pointer' icon={faLinkedin} />
                                            </a>
                                            <a href="https://www.facebook.com/profile.php?id=61564475525953" target='_blank'>
                                                <FontAwesomeIcon className='h-5 w-5 cursor-pointer' icon={faInstagram} />
                                            </a>
                                            <a href="https://x.com/Chembizzz" target='_blank'>
                                                <FontAwesomeIcon className='h-5 w-5 cursor-pointer' icon={faXTwitter} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <img src={blog?.photo} className='mt-8 rounded-md max-h-[300px] w-auto' alt="" />
                            </div>
                            <p className='mb-5 mx-5 mt-5'>{blog?.Description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
