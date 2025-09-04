import React, { useState } from 'react';
import { faLocationDot, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import countries from "./CountryStateCity.json";
import loader from "../images/loading.png"
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

const Contact = () => {

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phoneNumber: '',
    country: '',
    messageType: 'Register Now',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const gradientStyle = {
    background: `-webkit-linear-gradient(left, #7677FF, #00AEEF)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const handleSendMessage = async () => {

    const { name, email, phoneNumber, messageType, message, country } = formData;

    if (!name && !email && !phoneNumber && !message && !country) {
      toast.error('Please Fill All Fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!name.trim()) {
      toast.error('Please Enter Your Fullname!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      toast.error('Please Enter Your Email!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.error('Please Enter Valid Email!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!phoneNumber) {
      toast.error('Please Enter Your Mobile Number!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!messageType.trim()) {
      toast.error('Please Enter Message Type!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!message.trim()) {
      toast.error('Please Enter Message!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${BASE_URL}api/contactMessage/add`,
        {
          fullName: name,
          email_id: email,
          country: country,
          contact_no: phoneNumber,
          message: message,
          contact_for: messageType,
        },
      );


      if (response.status === 200) {
        setLoading(false)
        setTimeout(() => {
          toast.success('Sent Successfully!', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
          });
        }, 2000);
        setFormData({
          name: '',
          email: '',
          countryCode: '+91',
          phoneNumber: '',
          country: '',
          messageType: 'Register Now',
          message: ''
        });
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error.message);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }


  }


  return (
    <div className='contact-container'>
      <div className='w-full md:p-10'>

        <ToastContainer />

        <div className='sm:px-10 sm:py-10 px-5 py-5 bg-[#5587FA1A]/[.1] flex md:flex-row flex-col rounded-lg'>
          <div className="flex-1 ">
            <div className='flex flex-col'>
              <h1 className='text-darkBlue text-4xl font-semibold'>Get in <span style={gradientStyle}> Touch </span></h1>
              <div>
                <div className='block sm:flex gap-3'>
                  <input type="text" name="name" placeholder='Name' className='mt-8 py-3 px-4 border border-black rounded-md w-full' value={formData.name} onChange={handleChange} />
                  <input type="text" name="email" placeholder='Email' className='mt-8 py-3 px-4 border border-black rounded-md w-full' value={formData.email} onChange={handleChange} />
                </div>
                <div className='flex gap-4'>
                  <input
                    type="tel"
                    name="countryCode"
                    placeholder='Enter mobile number'
                    className='mt-8 py-3 px-4 border border-black rounded-md w-[20%] sm:w-[14%] bg-white'
                    value={formData.countryCode}
                    // onChange={handleChange}
                    disabled
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder='Enter mobile number'
                    className='mt-8 py-3 px-4 border border-black rounded-md w-full'
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className='mt-8'>
                  <select id="country" name="country" className='block bg-white w-full py-2 px-4 mt-2  border border-black rounded-md' value={formData.country} onChange={handleChange}>
                    <option value="" disabled selected>select country</option>
                    {countries && countries.map((e) => (
                      <option value={e.name}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div className='sm:flex block mt-8 gap-6'>
                  <div className='sm:px-4 px-5 w-full sm:mb-0 mb-8 flex items-center gap-4 py-3  border border-black rounded-md bg-white'>
                    <input className='' name='messageType' type="radio" value="Register Now" checked={formData.messageType === "Register Now"} onChange={handleChange} />
                    <span className='text-gray-400'> Register Now </span>
                  </div>
                  <div className='sm:px-4 px-5 w-full flex items-center gap-4 py-3  border border-black rounded-md bg-white'>
                    <input className='' name='messageType' type="radio" value="Request a Demo" checked={formData.messageType === "Request a Demo"} onChange={handleChange} />
                    <span className='text-gray-400'> Request a Demo </span>
                  </div>
                </div>
                <textarea name="message" placeholder='Message' className='mt-8 py-3 px-4 border border-black rounded-md w-full' value={formData.message} onChange={handleChange} />
                {loading ? (
                  <button type="submit" className='bg-darkBlue mt-8 text-white px-4 py-3 rounded-md font-medium w-full' >
                    <img src={loader} alt="" className='h-[25px] px-4 animate-spin' />
                  </button>
                ) : (
                  <button type="submit" className='bg-darkBlue mt-8 text-white px-4 py-3 rounded-md font-medium w-full' onClick={handleSendMessage}>Send Message</button>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 sm:p-8 p-0 mt-10">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.543897911318!2d72.62590417458416!3d23.11378657910986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84604595e899%3A0x3e7418c1b4e56140!2sWebEarl%20Technologies%20Private%20Limited!5e0!3m2!1sen!2sin!4v1708591679124!5m2!1sen!2sin" className='md:h-[400px] md:w-[500px] sm:w-[350px] sm:h-[300px] w-[300px] h-[100%]' style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div className='mt-8'>
              <div className='grid md:grid-cols-2 gap-6  grid-cols-1 mt-14'>
                <div className='flex  items-start   gap-6'>
                  <span className='py-3 px-4 rounded-full text-white' style={{ background: "#5587FA" }}>
                    <FontAwesomeIcon className='h-4 w-4' icon={faLocationDot} />
                  </span>

                  <div>
                    <h1 className='font-semibold text-xl text-darkBlue'>Location</h1>
                    <p className='font-thin    text-darkBlue'>Amedabad, Gujarat, India - 382428</p>
                  </div>
                </div>

                <div className='flex  items-start   gap-6'>
                  <span className='py-3 px-4 rounded-full text-white' style={{ background: "#5587FA" }}>
                    <FontAwesomeIcon className='h-4 w-4' icon={faEnvelope} />
                  </span>

                  <div>
                    <h1 className='font-semibold text-xl text-darkBlue'>Email</h1>
                    <p className='font-thin text-darkBlue'>support@chembizz.com</p>
                  </div>
                </div>
                <div className='flex  items-start     gap-6'>
                  <span className='py-3 px-4 rounded-full text-white' style={{ background: "#5587FA" }}>
                    <FontAwesomeIcon className='h-4 w-4' icon={faPhone} />
                  </span>

                  <div>
                    <h1 className='font-semibold text-xl text-darkBlue'>Call</h1>
                    <p className='font-thin  text-darkBlue'>+91 999-999-9999 <br />
                      +91 999-999-9999</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
