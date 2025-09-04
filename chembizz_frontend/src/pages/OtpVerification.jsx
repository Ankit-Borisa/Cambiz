import React, { useEffect, useState } from 'react'
import 'react-phone-input-2/lib/style.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import OtpInput from '../components/OtpInput'

// toaster 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';
import headerImage from "../images/blue-background.png"

const OtpVerification = () => {

  const location = useLocation();
  const emailNavigate = location.state.email;

  const [email, setEmail] = useState("")

  useEffect(() => {
    if (emailNavigate) {
      setEmail(emailNavigate)
    }

  }, [emailNavigate]);


  const navigate = useNavigate();

  const [otp, setOtp] = useState('');

  const handleOtpSubmit = (enteredOtp) => {
    setOtp(enteredOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error('Please Enter OTP.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (otp.length < 6) {
      toast.error('Please Enter a Valid OTP.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (!email) {
      toast.error('Please Enter Email.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
      });
      navigate(-1)
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}api/otp/verify_otp`,
        {
          emailid: email,
          otp_value: Number(otp),
        },
      );

      if (response.status === 200) {

        navigate("/create-password", { state: { emailid: email } })
        toast.success('OTP Verify Succssfully.', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        });

      }
    } catch (error) {
      console.error("Error adding category:", error.message);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }
  };


  const resendOtp = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}api/otp/send_otp`,
        {
          emailid: email,
        },
      );

      if (response.status === 200) {
        setTimeout(() => {
          toast.success('OTP Sent Successfully.', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
          });
        }, 2000);

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
    <div className='xl:px-40 lg:px-20 md:px-10 md:py-10 bg-gray-100'>
      <div className='md:p-10 p-3 flex md:flex-row flex-col bg-white rounded-2xl'>

        {/* Image */}

        <div className='relative md:w-[30%] md:p-0 px-10 py-32 md:flex hidden flex-col justify-center items-center login-image rounded-2xl '>
          <div className=' flex flex-col justify-center items-center'>
            <h2 className='text-white text-3xl font-semibold text-center'>Don’t have an account yet?</h2>
            <p className='text-white text-sm mt-4 text-center'>Create Your Account to Start Your Digital
              Business Experience with ChemBiZZ</p>
            <button className='bg-darkBlue text-white px-6 py-3 mt-4 border border-gray-200 rounded-md'>Register</button>
          </div>
          <div className='absolute top-[0px]'>
            <div className='flex justify-center'>
              <img src={headerImage} alt="" className='w-full rounded-tl-xl' />
            </div>
          </div>
        </div>

        <ToastContainer />

        {/* Form */}

        <div className='md:p-10 md:w-[70%] flex flex-col items-center justify-center md:h-[700px] rounded-2xl'>
          <div className='flex flex-col items-center justify-center mt-8 '>
            <h1 className='text-darkBlue text-center text-4xl font-semibold'>Enter OTP</h1>

            <p className='text-darkBlue text-center text-sm mt-6'>Enter Confirmation Code
              We’ve sent you on your email.</p>

            <div className='mt-8'>
              <OtpInput onOtpSubmit={handleOtpSubmit} />
            </div>

            <p className='text-darkBlue mt-6'>Didn’t Receive Confirmation Code? <span className='underline cursor-pointer' onClick={resendOtp}>Resend OTP</span></p>
            <div className='flex items-center justify-center'>
              <button className='bg-darkBlue mt-8 text-white px-8 py-3 rounded-md font-medium' onClick={handleSubmit}>Continue</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default OtpVerification