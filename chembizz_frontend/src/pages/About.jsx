import React, { useState } from 'react'
import GalleryImage from "../images/about-us-header.png"
import whoWeAre from "../images/who-we-are.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faUserTie, faLink, faRocket } from '@fortawesome/free-solid-svg-icons'
import PointLine from "../images/about-point-line.png"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from "../images/loading.png"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../BASE_URL'

const Data = [
  {
    title: "Go Global",
    st: "Global",
    description: "Chemical buyers and sellers from all over the world",
    icon: faGlobe
  },

  {
    title: "Multiple",
    st: "Vendors",
    description: "Search multiple vendors for your requirement",
    icon: faUserTie
  },

  {
    title: "Direct ",
    st: "Connection",
    description: "Send and recieve inquiry directly",
    icon: faLink
  },

  {
    title: "Simple",
    st: "Easy and smart",
    description: "Search ,connect buy or sell it's that simple",
    icon: faRocket
  },
]


const gradientStyle = {
  background: `-webkit-linear-gradient(left, #7677FF, #00AEEF)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const About = () => {

  const navigate = useNavigate()

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

  return (
    <div className='my-container'>
      <div className='md:px-20 bg-gray-100'>

        {/* Hero Section */}
        <div className='w-full sm:px-10 pt-14 px-5 mb-16'>
          <div className='flex md:flex-row flex-col items-center justify-between'>

            <div className="flex-1">
              <img className='' src={GalleryImage} alt="" />
            </div>

            <div className="flex-1 md:p-10 p-4">
              <h1 className='text-darkBlue font-semibold  md:text-5xl text-3xl'>About <span style={gradientStyle}>ChemBizz</span></h1>
              <h2 className='text-xl text-[363D50] leading-8 mt-8'>Welcome to ChemBizz, your premier platform for buying and selling chemicals. Connect with trusted suppliers and buyers worldwide for all your chemical needs.</h2>

              <div className='flex md:flex-row flex-col gap-6'>
                <button className='bg-darkBlue mt-8 text-white px-10 py-3 rounded-md font-medium' onClick={() => setIsOpen(true)}>Request Demo</button>
                <button className='border-darkBlue border sm:mt-8 mt-2 px-10 py-3 rounded-md font-medium' onClick={() => navigate("/signup")}> Register Now</button>
              </div>
            </div>

          </div>
        </div>

        <div className='border border-black w-[79%] m-auto'></div>

        {/*  */}

        <div className='w-full md:p-0 sm:p-10 px-5 sm:mt-28 mt-8'>
          <div className='grid gap-5 md:grid-cols-4 grid-cols-1'>

            {
              Data.map((item, index) => (
                <div key={index} className='flex shadow bg-white py-6 px-4 rounded-lg  gap-3'>

                  <div className='flex flex-col items-center'>
                    <span className='py-[7px] px-[6px] rounded-full text-white' style={{ background: "#5587FA" }}>
                      <FontAwesomeIcon className='text-2xl px-2 py-1' icon={item.icon} />
                    </span>
                  </div>

                  <div className=''>
                    <h1 className='font-semibold text-darkBlue text-xl'>{item.title}</h1>
                    <h1 className='font-semibold text-darkBlue text-xl'>{item.st}</h1>
                    <p className='font-thin  mt-2 text-[15px]  text-gray-600'>{item.description}</p>
                  </div>
                </div>
              ))
            }


          </div>
        </div>

        {/* Who we are Section */}

        <div className='w-full sm:mt-10 mt-5 sm:p-10 px-5 py-5'>

          <div className="flex md:flex-row flex-col md:p-8 justify-between">

            <div className="flex-1 md:p-6">
              <h1 className='text-4xl text-darkBlue font-semibold '>Who we Are ? </h1>
              <p className='text-md text-darkBlue mt-6'>We are a team of enthusiastic professionals, who like everything about chemicals. As individual from chemical industries we identify problems which arise in our day to day life which need:</p>

              <div className='flex items-center gap-4 mt-8'>
                <img className='h-3' src={PointLine} alt="" />
                <p>A comman platform for all requirements</p>
              </div>


              <div className='flex items-center gap-4 mt-8'>
                <img className='h-3' src={PointLine} alt="" />
                <p>Integrity</p>
              </div>



              <div className='flex items-center gap-4 mt-8'>
                <img className='h-3' src={PointLine} alt="" />
                <p>Professional competence</p>
              </div>


              <div className='flex items-center gap-4 mt-8'>
                <img className='h-3' src={PointLine} alt="" />
                <p>Powerful</p>
              </div>

              <p className='text-darkBlue mt-8 text-md'>All these requirement motivate us to develop ChemBiZZ.</p>


            </div>

            <div className="flex-1">
              <div className='flex justify-end'>
                <img className='' src={whoWeAre} alt="" />
              </div>
            </div>

          </div>

        </div>

        {/* Research Section */}

        <div className='w-full mt-10 md:p-10 sm:p-4 px-5'>
          <div className="bg-white flex flex-col items-center justify-center  px-8 py-8">
            <h1 className='text-center text-3xl font-semibold'>Start Your Research Today</h1>

            <h2 className='text-gray-600 mt-4 text-center text-xl'>Start searching for chemicals and connect with valuable people like you in minutes.</h2>

            <button className='bg-darkBlue mt-8 text-white px-6 py-2 rounded-md font-medium' onClick={() => navigate("/buying")}>Browse Listings</button>
          </div>
        </div>

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
                    <button onClick={handleSubmitForm} type="button" className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-[#0A122A] hover:bg-gray-50 sm:mt-0 sm:w-auto">Submit</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default About