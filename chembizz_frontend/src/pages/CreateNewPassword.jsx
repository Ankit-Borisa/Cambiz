import axios from 'axios';
import React, { useState } from 'react'
import 'react-phone-input-2/lib/style.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../BASE_URL';
import headerImage from "../images/blue-background.png"

const CreateNewPassword = () => {

    const location = useLocation();
    const email = location.state.emailid;

    const navigate = useNavigate();

    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const handlePassword = (e) => {
        const newPassword = e.target.value.trim();
        setPassword(newPassword)
    }

    const handleNewPassword = (e) => {
        const newPassword = e.target.value.trim();
        setNewPassword(newPassword)
    }


    const handleSubmit = async () => {
        if (!password) {
            toast.error('Please Enter New Password.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            return;
        }
        if (!newPassword) {
            toast.error('Please Enter Confirm Password.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            return;
        }
        if (password != newPassword) {
            toast.error('New Password And Confirm Password Not Matched.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}company/forgot`,
                {
                    emailid: email,
                    newPassword: newPassword,
                },
            );

            if (response.status === 200) {
                setTimeout(() => {
                    toast.success('Password Updated Successfully.', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 2000,
                    });
                    navigate("/login")
                }, 2000);

            } else {

            }
        } catch (error) {
            console.error("Error adding category:", error.message);
            toast.error(error?.response?.data?.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }


    }

    return (
        <div className='md:px-40 md:py-10 bg-gray-100'>

            <div className='p-10 flex md:flex-row flex-col bg-white rounded-2xl'>

                {/* Image */}

                <div className='relative md:w-[30%] md:p-0 px-10 py-32 flex flex-col justify-center items-center login-image rounded-2xl '>
                    <div className=' flex flex-col justify-center items-center'>
                        <h2 className='text-white text-3xl font-semibold text-center'>Don’t have an account yet?</h2>
                        <p className='text-white text-sm mt-4 text-center'>Create Your Account to Start Your Digital
                            Business Experience with ChemBiZZ</p>
                        <button className='bg-darkBlue text-white px-6 py-3 mt-4 border border-gray-200 rounded-md' onClick={() => navigate("/signup")}>Register</button>
                    </div>
                    <div className='absolute top-[0px]'>
                        <div className='flex justify-center'>
                            <img src={headerImage} alt="" className='w-full rounded-tl-xl' />
                        </div>
                    </div>
                </div>


                {/* Form */}

                <div className='p-10 md:w-[70%] flex flex-col items-center justify-center md:h-[700px] rounded-2xl'>
                    <div className='flex flex-col  '>
                        <h1 className='text-darkBlue text-center text-4xl font-semibold'>Create New Password</h1>

                        <p className='text-darkBlue text-center text-sm mt-6'>Enter New Password
                            At Least 8 Characters with uppercase & lower case</p>


                        <input type="password" value={password} onChange={handlePassword} placeholder='Enter New Password' className='mt-8 py-3 outline-none px-2 border border-gray-200 rounded-md' />

                        <input type="password" value={newPassword} onChange={handleNewPassword} placeholder='Confirm New Password' className='mt-8 py-3 outline-none px-2 border border-gray-200 rounded-md' />

                        <div className='flex items-center justify-center'>
                            <button onClick={handleSubmit} className='bg-darkBlue mt-8 text-white px-8 py-3 rounded-md font-medium '>Reset Password</button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default CreateNewPassword