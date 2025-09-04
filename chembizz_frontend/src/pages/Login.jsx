import React, { useEffect, useState } from 'react'
import loader from "../images/loading.png"
import 'react-phone-input-2/lib/style.css'
import { Link, useNavigate } from 'react-router-dom'
import headerImage from "../images/blue-background.png"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import loginBanner from "../images/loginBanner1.png"

// fontawesome icons

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useAuthContext } from '../context/AuthContext'
import { useSocketContext } from '../context/SocketContext'
import { useNotiContext } from '../context/NotificationContext'
import { BASE_URL } from '../BASE_URL'

const Login = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("chemicalToken")

  // useEffect(() => {
  //   if (token) {
  //     navigate(-1)
  //   }
  // }, [token]);


  const { setAuthUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { setNotifications } = useNotiContext()

  const [loading, setLoading] = useState(false)

  const [showPassword1, setShowPassword1] = useState(false);

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleEmail = (e) => {
    const lowercaseEmail = e.target.value.toLowerCase();
    setEmail(lowercaseEmail);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleNotification = (newMessage) => {

  };

  const handleNavigate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      toast.error("Please Enter Email!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.error("Invalid Email Format!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!password) {
      toast.error("Please Enter Password!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}company/login`,
        {
          emailid: email,
          password: password,
        }
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        const { membership_status, booking_date, plan_days, catalog_limit, _id, emailid } = user;

        // console.log(membership_status)

        if (membership_status === "paid") {
          // Calculate plan expiration
          const bookingDate = new Date(booking_date);
          const expiryDate = new Date(bookingDate);
          expiryDate.setDate(bookingDate.getDate() + plan_days);

          const currentDate = new Date();

          if (currentDate > expiryDate) {
            // await axios.put(`${BASE_URL}api/membership_plan/updateStatus`);
            navigate('/company/home')
          } else {
            localStorage.setItem("catalogLimit", catalog_limit);
            localStorage.setItem("bookingDate", booking_date);
            navigate('/company/home')
          }
          localStorage.setItem("chemicalToken", token);
          localStorage.setItem("myCompanyId", _id);
          localStorage.setItem("myEmailId", emailid);
          localStorage.setItem("membershipStatus", membership_status);
          navigate('/company/home')

        } else {
          localStorage.setItem("chemicalToken", token);
          localStorage.setItem("myCompanyId", _id);
          localStorage.setItem("myEmailId", emailid);
          localStorage.setItem("membershipStatus", membership_status);
          
          navigate('/company/home')
        }

        setLoading(false);
        setAuthUser({ id: _id });

        socket?.on("loginNotification", (newMessage) => {
          handleNotification(newMessage);
          setNotifications(newMessage);
        });
        navigate('/company/home')
      } else {
        setLoading(false);
        toast.error("An Error Happened In Login. Please Try Again Later!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding category:", error.response.data.message);
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };


  return (
    <div className='my-container bg-gray-100 m-auto'>
      <div className='w-full md:w-[70%] m-auto py-10'>
        <div className='flex md:flex-row flex-col bg-white rounded-2xl'>
          {/* Image */}
          <div className='md:w-[30%] md:p-0 px-10 py-32 md:flex hidden flex-col justify-center items-center rounded-2xl relative login-image'
          >
            <div className=' flex flex-col justify-center items-center absolute h-full w-full z-[1]'>
              <h2 className='text-white text-[18px] text-center leading-7 font-bold'>Don’t have an account yet?</h2>
              <p className='text-white text-sm mt-4 px-4 text-center'>Create Your Account to Start Your Digital
                Business Experience with ChemBiZZ</p>

              <Link to="/signup">
                <button className='bg-darkBlue text-white px-6 py-3 mt-4 border border-gray-200 rounded-md'>Register</button>
              </Link>
            </div>
            <div className='absolute top-[0px] z-[1] rounded-tl-lg'>
              <div className='flex justify-center'>
                <img src={headerImage} alt="" className='w-[350px] rounded-tl-lg' />
              </div>
            </div>
            <div className='absolute top-0 left-0 h-full w-full opacity-[0.3] bg-black z-1 rounded-2xl'>
              <div className=''>
              </div>
            </div>
          </div>

          <ToastContainer />
          {/* Form */}
          <div className='p-10 w-full md:w-[70%] flex flex-col items-center justify-center md:h-[700px] rounded-2xl'>
            <div className='flex flex-col w-full sm:w-[95%] '>
              <h1 className='text-darkBlue text-center text-xl sm:text-4xl font-semibold'>Login to Your Account</h1>

              <input
                type="email"
                value={email}
                onChange={handleEmail}
                onKeyDown={handleKeyDown}
                placeholder='Enter Email'
                className='mt-8 py-3 outline-none px-2 border border-[#0A122A]/[.5] rounded-md'
              />
              <div className='relative mt-8'>
                <input
                  name='password'
                  onChange={handlePassword}
                  onKeyDown={handleKeyDown}
                  type={showPassword1 ? "text" : "password"}
                  placeholder='Enter Password '
                  className='outline-none py-3 px-2 border border-[#0A122A]/[.5] rounded-md w-full'
                />
                <FontAwesomeIcon
                  icon={showPassword1 ? faEyeSlash : faEye}
                  className='absolute top-[30%] right-[2%] cursor-pointer'
                  onClick={togglePasswordVisibility1}
                />
              </div>

              <span className='text-darkBlue mt-6'><Link to="/forgot-password">Forget Password ?</Link> </span>
              <div className='flex items-center justify-center'>
                <button onClick={handleNavigate} className='bg-darkBlue mt-8 text-white h-[40px] w-[140px] rounded-md font-medium flex justify-center items-center'>
                  {loading ? (
                    <img src={loader} alt="" className='h-[30px] animate-spin' />
                  ) : (
                    <>
                      Login
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login