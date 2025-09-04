import React, { useEffect, useRef, useState } from 'react';
import { CalendarIcon } from "@heroicons/react/24/outline";
import homeIcon1 from "../images/home-icon-1.png";
import homeIcon2 from "../images/home-icon-2.png";
import homeIcon3 from "../images/home-icon-3.png";
import homeIcon4 from "../images/home-icon-4.png";
import solution from "../images/right-solution.png";
import setting from "../images/setting.png";
import optionsImage from "../images/ChemBizz Dashboard.png"
import polygone2 from "../images/Polygon2.png"
import polygone3 from "../images/Polygon3.png"
import pentagone from "../images/pentagone.png"
import industrial from "../images/industrial-solution.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faPhoneVolume, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2';
import Accordion from '../components/Accordian';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import homeback from "../images/home-new-bg.png"

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import loader from "../images/loading.png"
import { BASE_URL } from '../BASE_URL';
import CountUp from 'react-countup';

const AccordianData = [
  {
    title: "Purchasing",
    content: "Enjoy a new simple way to make purchases that saves you time",
  },

  {
    title: "Sourcing",
    content: "Enjoy a new simple way to make purchases that saves you time",
  },

  {
    title: "Negotiations",
    content: "Enjoy a new simple way to make purchases that saves you time",
  },

  {
    title: "Financing",
    content: "Enjoy a new simple way to make purchases that saves you time",
  },

  {
    title: "Fullfilment",
    content: "Enjoy a new simple way to make purchases that saves you time",
  },
]

const gradientStyle = {
  background: `-webkit-linear-gradient(left, #7677FF, #00AEEF)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const HomePage = () => {

  const navigate = useNavigate();

  const [formData1, setFormData1] = useState({
    full_name: '',
    email: '',
    number: '',
    message: '',
  });

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const checkToken = () => {
    const token = localStorage.getItem("chemicalToken")

    if (token) {
      navigate("/company/home")
    } else {
      navigate("/signup")
    }
  }

  const [tabs, setTabs] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const [companyName, setCompanyName] = useState("")
  const [contactPersonName, setContactPersonaName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [contactDate, setContactDate] = useState("")
  const [contactTime, setContactTime] = useState("")

  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const handleSubmitForm = async () => {

    if (!companyName && !contactPersonName && !contactNumber && !contactDate && !contactTime) {
      toast.error('Please Fill All Fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!companyName && !contactPersonName && !contactNumber && !contactDate && !contactTime) {
      toast.error('Please Fill All Fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!companyName.trim()) {
      toast.error('Please Enter Company Name!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!contactPersonName.trim()) {
      toast.error('Please Enter Contact Person Name!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!contactNumber) {
      toast.error('Please Enter Mobile Number!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (contactNumber.length < 10) {
      toast.error('Please Enter Valid Mobile Number!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!contactTime) {
      toast.error('Please Select Contact Time!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${BASE_URL}api/request_demo/create`,
        {
          company_name: companyName,
          contact_number: contactNumber,
          contact_person_name: contactPersonName,
          contact_date: contactDate,
          contact_time: contactTime,
        },
      );

      setCompanyName("")
      setContactPersonaName("")
      setContactNumber("")
      setContactDate("")
      setContactTime("")

      if (response.status === 200) {
        setLoading(false)
        setIsOpen(false)
        setTimeout(() => {
          toast.success('Demo Schedule Successfully!', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
          });
        }, 2000);

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

  const handlePricing = () => {
    navigate("/pricing")
  }

  const handleSendMessage = async () => {

    const { full_name, email, number, message } = formData1;

    if (!full_name && !email && !number && !message) {
      toast.error('Please Fill All Fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!full_name.trim()) {
      toast.error('Please Enter Your Fullname!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!number) {
      toast.error('Please Enter Your Mobile Number!', {
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

    if (!message.trim()) {
      toast.error('Please Enter Message!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    const numbers = number.slice(2, 12)
    setLoading(true)

    try {
      const response = await axios.post(
        `${BASE_URL}api/contactMessage/add`,
        {
          fullName: full_name,
          email_id: email,
          contact_no: numbers,
          message: message,
          contact_for: "Home"
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
        setFormData1({
          full_name: '',
          email: '',
          number: '',
          message: '',
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

  const [products, setProducts] = useState([]);

  const fetchPrducts = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/product/displayAllProductWithoutToken`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    setProducts(data.products);
  }

  useEffect(() => {
    fetchPrducts();
  }, []);

  const [searchTerm, setSearchTerm] = useState("")
  const [displayProduct, setDisplayProduct] = useState("")

  const handleFilter = (e) => {
    setSearchTerm(e.target.value)
    setDisplayProduct(true)
  }

  const handleSelectProduct = (e) => {
    setSearchTerm(e?.name_of_chemical)
    setDisplayProduct(false)
  }

  const handleSendFilteredData = () => {
    if (!searchTerm) {
      return;
    } else {
      navigate("/buying", { state: searchTerm })
    }
  }

  const containerRef = useRef(null);

  // Handle click outside of the div
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDisplayProduct(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(sectionRef.current); // Stop observing once it's visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className='my-container'>

      {/* Hero Section */}
      <div className='w-full p-2'>
        <div className="">
          <div className='grid grid-cols-1 sm:grid-cols-2 h-[60vh] sm:h-[80vh] lg:[80vh] xl:[100vh] ms-0 sm:ms-20 relative'>
            <div className='h-full flex flex-col justify-center px-5 sm:px-10'>

              {/* Search Section */}
              <div className='mb-14'>
                <div className='w-full flex justify-end items-center flex-col h-full'>
                  <div className='background-search w-full flex justify-center items-center flex-col relative px-3 sm:px-8'>
                    <input
                      value={searchTerm}
                      onChange={handleFilter}
                      type="text"
                      placeholder='Search by Chemical Name / API No. / CAS No...'
                      className='bg-white/[0.2] border border-white placeholder-white/[0.9] w-full rounded-lg sm:py-2 py-1 sm:px-4 px-2 outline-none text-white'
                    />
                    <FontAwesomeIcon
                      onClick={handleSendFilteredData}
                      icon={faMagnifyingGlass}
                      className='cursor-pointer absolute right-0 sm:mr-10 mr-4 text-white bg-[#FFFFFF]/[.3] rounded sm:py-2 sm:px-[9px] py-1 px-1 sm:text-md text-sm'
                    />
                    <p className='absolute sm:bottom-[20px] bottom-[5px] left-0 sm:ml-8 ml-4 text-white text-xs'>
                      Ex. Cas No.-147-93-3 Or 4-Acetamidobenzoic Acid
                    </p>
                    {displayProduct && (
                      <div ref={containerRef} className='absolute top-[70%] text-white w-[90%] px-5 py-5 rounded-lg bg-[#222262] min-h-[300px] h-[300px] overflow-y-auto'>
                        {products && products.filter((e) => e?.name_of_chemical.includes(searchTerm)).map((e) => (
                          <p
                            key={e._id}
                            className='my-2 py-1 cursor-pointer hover:bg-gray-400 px-2 rounded-lg'
                            onClick={() => handleSelectProduct(e)}>
                            {e.name_of_chemical}
                          </p>
                        ))}
                      </div>

                    )}
                  </div>
                </div>
              </div>

              {/* Main Content Section */}
              <div>
                <div className='h-full w-full flex flex-col justify-center pb-10'>
                  <h1 className='text-darkBlue text-xl md:text-3xl xl:text-4xl font-semibold mb-4 md:mb-8 leading-tight sm:leading-[52px]'>
                    Procuring <span style={gradientStyle}>chemicals</span> <br /> just got easier
                  </h1>
                  <p className='text-gray-600 text-sm sm:text-base'>
                    Gain access to the world's largest chemical marketplace, <br />
                    view live inventory and start transacting today.
                  </p>
                  <div className='flex flex-col md:flex-row items-center justify-start mt-8 gap-6'>
                    <button className='bg-darkBlue text-white font-medium px-4 py-3 rounded-lg w-full sm:w-auto' onClick={handlePricing}>
                      Start free trial
                    </button>
                    <button className='flex gap-3 items-center hover:bg-darkBlue px-4 py-3 rounded-lg hover:text-white w-full justify-center sm:w-auto border-2 border-darkBlue-400' onClick={() => setIsOpen(true)}>
                      <CalendarIcon className='w-6 h-6' /> Schedule demo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className='absolute top-0 h-full right-0 hidden sm:block'>
              <img src={homeback} alt="" className='h-full' />
            </div>
          </div>

        </div>
      </div>

      <ToastContainer />

      {/* Sourcing Options Section */}

      <div className='w-full md:p-10 pb-10 rounded-lg bg-gradient-to-l from-gray-400 to-bg2 via-bg1 md:mt-6 sm:mt-40 mt-0'>
        <div className='flex md:flex-row flex-col p-8'>
          <div className='flex-1 md:mb-0 mb-5'>
            <h1 className='text-white md:text-4xl sm:text-3xl text-3xl font-semibold'><span className='' style={{ color: "#9192FF" }}>!</span> your <br />  sourcing options</h1>
          </div>

          <div className='flex-1 mb-8'>
            <span className='text-md text-white font-thin opacity-70'>Utilize our network functionality to create new sourcing
              relationships and enhance existing ones, resulting in the best
              possible sourcing results. With features like real-time pricing,
              direct chat with sellers, and streamlined procurement
              processes, obtaining the products you need has never been
              easier.</span>
          </div>
        </div>
        <div className="">
          <img src={optionsImage} alt="" className="w-full object-contain" />
        </div>

      </div>
      <img src={pentagone} alt="" className='h-48' />

      {/* Plans Section */}

      <div className='md:p-10 w-full md:mb-0 mb-14 relative'>
        <div className='flex sm:p-8 p-0 flex-col items-center justify-center'>
          <div className='relative'>
            <h1 className='text-center sm:text-4xl text-3xl font-semibold sm:w-[650px]'>A <span style={gradientStyle}> simple </span>  four-click procurement <span style={gradientStyle}>solution </span>
              to save you time and money
            </h1>
            <img src={polygone3} alt="" className='absolute top-10 left-[-7%] h-[110px] hidden sm:block' />
          </div>
          <div
            ref={sectionRef}
            className="md:mt-20 sm:mt-12 mt-10 grid md:gap-16 sm:gap-10 gap-6 md:grid-cols-4 grid-cols-1 relative"
          >
            <div className="flex flex-col items-center">
              <img src={homeIcon1} alt="" className="h-[90px] mb-3" />
              <h1 className="sm:text-4xl text-2xl text-center font-medium" style={gradientStyle}>
                {isVisible && <CountUp end={156} suffix="m+" duration={2} />}
              </h1>
              <p className="text-sm mt-2 text-center">Of live inventory and growing</p>
            </div>

            <div className="flex flex-col items-center">
              <img src={homeIcon2} alt="" className="h-[90px] mb-3" />
              <h1 className="sm:text-4xl text-2xl text-center font-medium" style={gradientStyle}>
                {isVisible && <CountUp end={12000} suffix="k+" duration={2} />}
              </h1>
              <p className="text-sm mt-2 text-center">Integrated financial institutions</p>
            </div>

            <div className="flex flex-col items-center">
              <img src={homeIcon3} alt="" className="h-[90px] mb-3" />
              <h1 className="sm:text-4xl text-2xl text-center font-medium" style={gradientStyle}>
                {isVisible && <CountUp end={200} suffix="+" duration={2} />}
              </h1>
              <p className="text-sm mt-2 text-center">LTL and FTL carriers</p>
            </div>

            <div className="flex flex-col items-center">
              <img src={homeIcon4} alt="" className="h-[90px] mb-3" />
              <h1 className="sm:text-4xl text-2xl text-center font-medium" style={gradientStyle}>
                {isVisible && <CountUp end={99.3} suffix="%" duration={2} />}
              </h1>
              <p className="text-sm mt-2 text-center">Order acceptance rate</p>
            </div>

            <img src={polygone2} alt="" className="absolute left-[-20%] bottom-0 h-[300px] hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Contact Section */}

      <div className='lg:p-10 p-0 form-container'>
        <div style={{ background: "#5587FA1A" }} className='sm:p-10 p-0 flex md:flex-row flex-col'>

          {/* Form */}
          <div className="flex-1 ">
            {/* <h1 className='text-xl text-gray-500 text-center'>Reach out to us We'll get back to you.</h1> */}
            <p className='mt-8 text-gray-600 px-6 text-[#363D50] opacity-70'>Reach out to us</p>
            <p className='text-gray-600 px-6 text-[#363D50] opacity-70'>We'll get back to you.</p>
            <div className='px-6 pb-6 flex flex-col'>
              <input type="text" name="full_name" value={formData1.full_name} onChange={handleChange1} placeholder='Full Name' className='mt-8 py-3 px-2 border border-black' />
              <input type="text" name="email" value={formData1.email} onChange={handleChange1} placeholder='yourname@company.com' className='mt-8 py-3 px-2 border border-black' />

              <div className='mt-8 p-0'>
                <PhoneInput
                  country={'in'}
                  placeholder='Enter mobile number'
                  value={formData1.number}
                  onChange={(value, country, event) => {
                    setFormData1(prevState => ({
                      ...prevState,
                      number: value
                    }));
                  }}
                  inputStyle={{ width: "100%", margin: "10px", height: "50px" }}
                />
              </div>
              <textarea name="message" value={formData1.message} onChange={handleChange1} className='mt-8 py-3 px-2 border border-black' />
              {loading ? (
                <button className='bg-darkBlue mt-8 text-white px-4 py-3 rounded-md font-medium'>
                  <img src={loader} alt="" className='h-[25px] px-4 animate-spin' />
                </button>
              ) : (
                <button className='bg-darkBlue mt-8 text-white px-4 py-3 rounded-md font-medium' onClick={handleSendMessage}>Send Message</button>
              )}
            </div>
          </div>

          <div className="flex-1 p-8">
            <h1 className='text-3xl font-medium text-darkBlue font-semibold'>Buy. Sell. Market on </h1>
            <h1 className='text-3xl font-medium text-darkBlue mt-1 font-semibold'>ChemBizZ</h1>
            <p className='mt-8 text-[#363D50] opacity-70 '>Attract and Interact</p>
            <p className='text-[#363D50] opacity-70'>on your Company Profile.</p>
            <p className='text-[#363D50] opacity-70'>Transact on your Buying/Selling Dashboard.</p>
            <button className='bg-darkBlue mt-8 text-white px-4 py-3 rounded-md font-medium' onClick={() => navigate("/signup")}>Register now</button>

            <div className='md:mt-40 mt-10 flex flex-col gap-3'>
              <div className='flex gap-4 items-center'>
                <FontAwesomeIcon className='text-gray-500' icon={faPhoneVolume} />
                <span className='text-gray-500'>+91 999999999</span>
              </div>
              <div className='flex gap-4 items-center'>
                <FontAwesomeIcon className='text-gray-500' icon={faEnvelope} />
                <span className='text-gray-500'>support@ChemBiZZ.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Solution Section */}

      <div className='lg:px-10 md:px-10 lg:py-10 md:pt-10 w-full my-5 md:my-0 sm:my-20 md:w-[100%] sm:w-[80%] sm:mx-auto'>
        <div className='flex  md:flex-row flex-col  lg:px-8 md:px-8 lg:py-8 md:py-0'>
          <div className="flex-1 lg:px-8 md:px-2 sm:px-0 p-3">
            <h1 className='md:text-4xl text-3xl font-medium font-semibold'>Find the right </h1>
            <h1 className='md:text-4xl text-3xl font-medium font-semibold'> <span style={{ color: "#7677FF" }}> solution</span> for you</h1>
            <div className='pb-10'>
              {/* <img className='lg:h-[100%] md:h-[] lg:w-[100%] md:w-[700px] md:absolute lg:top-[-73px] md:top-[-15px] lg:left-[-40px] md:left-[-70px]' src={leftImage} alt="" /> */}
              <img src={solution} className='h-full' alt="" />
            </div>
          </div>
          <div className="flex-1 lg:px-8 md:px-2 md:mb-0 bg-white">
            <p className='text-gray-500 md:mb-20 sm:mb-10'>The BluePallet platform makes it easier for members to buy and sell wholesale chemicals and ingredients.</p>
            {AccordianData.map((item, index) => (
              <Accordion key={index} title={item.title} content={item.content} />
            ))}
          </div>

        </div>
      </div>

      <div className='w-full md:p-10 p-4 rounded-lg customer-stories mt-6'>
        <div className='flex flex-col items-center justify-center p-4 md:p-8'>
          <p className='text-white text-lg font-medium mb-3'>WHO WE ARE</p>
          <h1 className='text-white text-2xl md:text-4xl font-medium text-center'>Provide Industrial Solution</h1>
          <p className='mt-4 font-thin text-gray-200 text-center text-sm md:text-lg w-full md:w-[60%]'>
            We Are Able To Guarantee A Very High Level Of Satisfaction For Our Clients. We Offer The Cleanest Line Of Services.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-[1fr,2fr,1fr] gap-6 md:gap-[50px] md:mx-20 pb-10'>
          <div className='flex flex-col justify-between gap-4 sm:gap-0'>
            <div onClick={() => setTabs(1)} className={`cursor-pointer flex items-center gap-4 py-5 px-4 md:px-6 rounded-xl ${tabs === 1 ? 'bg-[#12A6F2]' : 'bg-white/[0.2]'} relative`}>
              <img src={setting} alt="" className='h-[45px] md:h-[55px]' />
              <p className='text-white text-base md:text-lg font-medium'>Modern <br /> Technology</p>
            </div>
            <div onClick={() => setTabs(2)} className={`cursor-pointer flex items-center gap-4 py-5 px-4 md:px-6 rounded-xl ${tabs === 2 ? 'bg-[#12A6F2]' : 'bg-white/[0.2]'} relative`}>
              <img src={setting} alt="" className='h-[45px] md:h-[55px]' />
              <p className='text-white text-base md:text-lg font-medium'>Modern <br /> Technology</p>
            </div>
            <div onClick={() => setTabs(3)} className={`cursor-pointer flex items-center gap-4 py-5 px-4 md:px-6 rounded-xl ${tabs === 3 ? 'bg-[#12A6F2]' : 'bg-white/[0.2]'} relative`}>
              <img src={setting} alt="" className='h-[45px] md:h-[55px]' />
              <p className='text-white text-base md:text-lg font-medium'>Modern <br /> Technology</p>
            </div>
          </div>
          <div className='text-white'>
            <h1 className='text-xl md:text-2xl font-medium mb-4'>Modern Technology</h1>
            <p className='text-sm md:text-md font-light opacity-[0.8] leading-7 mb-3'>
              We are able to guarantee a very high level of satisfaction for our clients. Pharetra libero non facilisis imperdiet, mi augue feugiat nisl sit amet mollis enim velit Vestibulum fringilla nulla ultricies.
            </p>
            <p className='text-sm md:text-md font-light opacity-[0.8] leading-7 mb-5'>
              We are able to guarantee a very high level of satisfaction for our clients. Pharetra libero non facilisis imperdiet, mi augue feugiat nisl sit amet mollis enim velit Vestibulum fringilla nulla ultricies.
            </p>
            <div>
              <p className='text-sm md:text-md font-light opacity-[0.8] leading-7 mb-3'>
                <FontAwesomeIcon icon={faCircleCheck} className='text-[#12A6F2] me-3 text-lg' /> Non potest verelet uterque
              </p>
              <p className='text-sm md:text-md font-light opacity-[0.8] leading-7 mb-3'>
                <FontAwesomeIcon icon={faCircleCheck} className='text-[#12A6F2] me-3 text-lg' /> Numquid aliquo tibi Et dicit quod videt te.
              </p>
              <p className='text-sm md:text-md font-light opacity-[0.8] leading-7'>
                <FontAwesomeIcon icon={faCircleCheck} className='text-[#12A6F2] me-3 text-lg' /> Vos ite post eum, fistulae, nunquam vivum.
              </p>
            </div>
          </div>
          <div className='h-full'>
            <img src={industrial} alt="" className='w-full h-auto md:h-full' />
          </div>
        </div>
      </div>


      <div className='w-full sm:mt-10 md:p-20 started-background mb-0 sm:mb-12'>
        <div className='md:p-20 px-2 sm:py-10 flex flex-col items-center justify-center w-full h-full rounded-lg'>
          <h1 className='text-center sm:text-4xl font-medium text-white sm:w-[450px]'>Efficiently expand your chemical business</h1>
          <h3 className='text-center sm:text-xl text-xs sm:mt-6 font-light text-white sm:w-[450px] sm:mb-0 mb-2'>Connect with more chemical professionals. More opportunities. More growth.</h3>
          <button className='bg-darkBlue sm:mt-8 text-white sm:px-4 sm:py-3 px-1 py-1 rounded-md font-medium sm:text-lg text-xs' onClick={checkToken}>Get Started</button>
        </div>
      </div>

      <ToastContainer />

      {/* pop ups  */}

      {isOpen && (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
            <div className="relative transform overflow-hidden rounded-lg bg-white mx-5 text-left shadow-xl transition-all sm:my-8 w-full sm:w-full sm:max-w-lg">
              <div className="bg-white py-3 ps-5">
                <div className="sm:flex sm:items-start">
                  <h3 className="font-medium text-xl">Schedule Demo</h3>
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-5 sm:px-6">
                <div>
                  <div className="mb-5">
                    <div className="w-full">
                      <p className="mb-1 text-xs">Company Name</p>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1"
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <div className="w-full">
                      <p className="mb-1 text-xs">Contact Person Name</p>
                      <input
                        type="text"
                        value={contactPersonName}
                        onChange={(e) => setContactPersonaName(e.target.value)}
                        className="bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1"
                        placeholder="Contact Person Name"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <div className="w-full">
                      <p className="mb-1 text-xs">Contact Number</p>
                      <input
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={10}
                        className="bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1"
                        placeholder="Contact Number"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <div className="w-full">
                      <p className="mb-1 text-xs">Contact Date</p>
                      <input
                        type="date"
                        min={tomorrow}
                        value={contactDate}
                        onChange={(e) => setContactDate(e.target.value)}
                        className="py-1 px-3 bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <div className="w-full">
                      <p className="mb-1 text-xs">Contact Time</p>
                      <select
                        value={contactTime}
                        onChange={(e) => setContactTime(e.target.value)}
                        className="py-1 px-3 bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500"
                      >
                        <option value="">Select</option>
                        <option value="09:00 - 12:00 AM">09:00 - 12:00 AM</option>
                        <option value="12:00 - 03:00 PM">12:00 - 03:00 PM</option>
                        <option value="03:00 - 06:00 PM">03:00 - 06:00 PM</option>
                        <option value="06:00 - 09:00 PM">06:00 - 09:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-end">
                  <div className="bg-darkBlue me-5 my-4 py-1 px-3 rounded-lg">
                    <img src={loader} alt="" className="h-[25px] px-4 animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="bg-white flex justify-end gap-3 mx-8 py-3">
                  <button onClick={() => setIsOpen(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                  <button onClick={handleSubmitForm} type="button" className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-[#0A122A] sm:mt-0 sm:w-auto">Submit</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
