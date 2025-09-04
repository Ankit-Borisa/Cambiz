import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "../images/chemibizz-name-image.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faXTwitter, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons"

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';


const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);


  const gradientStyle = {
    background: `-webkit-linear-gradient(left, #7677FF, #00AEEF)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };


  const [email, setEmail] = useState("")

  const handleSubmit = async () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      toast.error('Please Enter Email Address!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.error('Please Enter Email Address!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}api/subscriber/add`,
        {
          email: email,
        },
      );


      if (response.status === 200) {
        toast.success('You Subscribe Chembizz Successfully!', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
        setEmail('')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }

  }

  return (
    <div className='my-container'>
      <footer className='sm:px-10 px-0 sm:pt-10 pt-5 pb-2 mt-4 footer text-gray-300'>

        <div className='flex md:flex-row flex-col p-8 items-center justify-between'>
          <div>
            <h1 className='text-2xl font-medium'>Subscribe to our newsletters</h1>
            <p className='text-md text-[#FFFFFF]/50 font-thin mt-2'>Stay up to date with the latest news, announcement, and articles.</p>
          </div>

          {/* Search Bar Section */}

          <div className='sm:p-10'>
            <div className='flex md:mt-0 mt-10 justify-center items-center '>
              <input type='text' onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' style={{ background: "#12214e" }} className='shadow-lg text-white border border-white/[.3]  md:pl-6 pl-2 pr-3 md:w-full sm:w-[250px] w-[180px]  py-2 rounded-md outline-none placeholder:text-[#757575]' />

              <button onClick={handleSubmit} style={{ background: "#00AEEF" }} className='btn text-white font-medium px-4 py-2 rounded-lg duration-500 ml-4'>
                Submit
              </button>

            </div>
          </div>

        </div>
        <ToastContainer />

        <hr />


        <div className='flex md:flex-row flex-col md:p-8 items-center justify-between'>

          <div className='flex-1 p-6'>

            <p className='mt-4 text-[#FFFFFF]/70'>Connecting the world of chemical <br /> commerce together
              to make its members more successful.</p>

            <h3 className='mt-8 text-1/2xl'>
              <Link to='/about' className='font-semibold text-xl'>
                About <br />
                <img src={Logo} alt="" className='w-[230px]' />
                {/* <span className='text-3xl' style={gradientStyle}>ChemBizz</span> */}
              </Link>
            </h3>
          </div>


          {/* Links here */}
          <div className='flex-1 p-6'>
            <div className="grid md:grid-cols-2 gap-8 grid-cols-1">

              <div>
                <h1 className="font-semibold text-xl">Resources</h1>

                <ul className='mt-4'>

                  <li className='text-[#FFFFFF]/70 mb-2'>
                    <Link to="/terms-and-conditions">Terms & Conditions</Link>
                  </li>
                  <li className='text-[#FFFFFF]/70 mb-2'>
                    <Link to="/privacy-policies">Privacy Policy</Link>
                  </li>

                  <li className='text-[#FFFFFF]/70 mb-2'>
                    <Link to="/contact">Contact Us</Link>
                  </li>

                  <li className='text-[#FFFFFF]/70 mb-2'>
                    <Link to="/blogs">Blog</Link>
                  </li>
                </ul>

              </div>


              <div>
                <h1 className="font-semibold text-xl">Contact</h1>

                <ul className='mt-4'>

                  <li className='text-[#FFFFFF]/70 mb-2'>
                    <Link to="mailto:support@chembizz.com">support@chembizz.com</Link>
                  </li>
                  <li className='text-[#FFFFFF]/70 mb-2'>
                    <Link>99999 99999</Link>
                  </li>

                  <li className='text-[#FFFFFF]/70 mb-2'>
                    <Link>Ahmedabad, Gujarat, India - 382428</Link>
                  </li>
                  <li>
                    <div className='flex  gap-3'>
                      <a href="https://www.facebook.com/profile.php?id=61564475525953" target='_blank'>
                        <FontAwesomeIcon className='h-4 w-4 cursor-pointer' icon={faFacebook} />
                      </a>
                      <a href="https://www.linkedin.com/company/chembizzz/" target='_blank'>
                        <FontAwesomeIcon className='h-4 w-4 cursor-pointer' icon={faLinkedin} />
                      </a>
                      <a href="https://www.facebook.com/profile.php?id=61564475525953" target='_blank'>
                        <FontAwesomeIcon className='h-4 w-4 cursor-pointer' icon={faInstagram} />
                      </a>
                      <a href="https://x.com/Chembizzz" target='_blank'>
                        <FontAwesomeIcon className='h-4 w-4 cursor-pointer' icon={faXTwitter} />
                      </a>
                    </div>
                  </li>
                </ul>

              </div>

              <div>

              </div>

            </div>
          </div>


        </div>

        <hr />

        <div className='w-full p-8 flex md:flex-row flex-col gap-6 items-center justify-center'>
          <span className='text-center text-[#FFFFFF]/60'>©2024 ChemBizZ. All right reserved.</span>
        </div>

      </footer>
    </div>
  );
};

export default Footer;
