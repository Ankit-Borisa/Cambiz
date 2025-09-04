import React, { useState } from 'react';
import { faPencil, faPlus, faSearch, faLock, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import chem1 from "../images/chemical-1.jpg"
import right from "../images/right.png"

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import loader from "../images/loading.png"
import { BASE_URL } from '../BASE_URL';

const ChangePassword = () => {

  const [loading, setLoading] = useState(false)

  const [isOpen, setIsOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const closeModal = () => {
    setIsOpen(false);
  };


  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async () => {

    if (!oldPassword && !newPassword && !confirmPassword) {
      toast.error('Please Fill All Fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!oldPassword) {
      toast.error('Please Enter Old Password!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!newPassword) {
      toast.error('Please Enter New Password!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!confirmPassword) {
      toast.error('Please Enter Confirm Password!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (newPassword != confirmPassword) {
      toast.error('New Password And Confirm Password Not Matched!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

    setLoading(true)

    try {
      const response = await axios.put(
        `${BASE_URL}company/change`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            'Authorization': token,
          },
        }
      );
      setLoading(false)

      if (response.status === 200) {
        setTimeout(() => {
          toast.success('Password Changed Successfully Successfully!', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
          setOldPassword('')
          setNewPassword('')
          setConfirmPassword('')
        }, 1000);

      } else {

      }
    } catch (error) {
      setLoading(false)
      console.error("Error adding category:", error.message);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }

  }


  return (
    <div className="w-full  overflow-x-hidden">
      <h1 className="md:text-3xl text-xl font-semibold mb-5 ms-3 sm:ms-0">Change Password</h1>
      <hr />
      <ToastContainer />
      <div>
        <div className='flex justify-center mt-28'>
          <div className='bg-white h-[500px] w-[300px] sm:h-[500px] sm:w-[500px] shadow-lg'>
            <h1 className='text-center'><FontAwesomeIcon icon={faLock} className='bg-slate-200 px-6 py-5 rounded-full text-4xl' /></h1>
            <h2 className='text-center text-xl sm:text-4xl font-semibold mt-3'>Change Password</h2>
            <p className='text-center mt-2 sm:mt-5 text-sm sm:text-lg font-medium mx-5 sm:mx-10'>To change your password please fill in the fields below.</p>
            <div className='px-5 sm:px-20 mt-10'>
              <div className='relative mb-7'>
                <input type={showOldPassword ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder='Old Password' className='border-2 border-gray-200 rounded w-full py-1 ps-8' />
                <FontAwesomeIcon icon={faEye} onClick={toggleShowOldPassword} className='absolute right-0 top-[25%] mr-3 text-slate-400 cursor-pointer' />
                <FontAwesomeIcon icon={faLock} className='absolute left-0 top-[25%] ml-2 text-slate-400' />
              </div>
              <div className='relative mb-7'>
                <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' className='border-2 border-gray-200 rounded w-full py-1 ps-8' />
                <FontAwesomeIcon icon={faEye} onClick={toggleShowNewPassword} className='absolute right-0 top-[25%] mr-3 text-slate-400 cursor-pointer' />
                <FontAwesomeIcon icon={faLock} className='absolute left-0 top-[25%] ml-2 text-slate-400' />
              </div>
              <div className='relative'>
                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm Password' className='border-2 border-gray-200 rounded w-full py-1 ps-8' />
                <FontAwesomeIcon icon={faEye} onClick={toggleShowConfirmPassword} className='absolute right-0 top-[25%] mr-3 text-slate-400 cursor-pointer' />
                <FontAwesomeIcon icon={faLock} className='absolute left-0 top-[25%] ml-2 text-slate-400' />
              </div>
            </div>
            <div className='mx-10 sm:mx-20'>
              {loading ? (
                <button className='bg-darkBlue mt-8 text-white py-1 rounded-md font-medium w-full '>
                  <img src={loader} alt="" className='h-[30px] animate-spin' />
                </button>
              ) : (
                <button onClick={handleSubmit} className='bg-darkBlue mt-8 text-white py-2 rounded-md font-medium w-full '>
                  <p className=''>Change Password</p>
                </button>
              )}
            </div>
          </div>


          {isOpen && (
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white py-3">
                      <div class="flex flex-col items-center">
                        <img src={right} alt="" className='h-[80px]' />
                        <h3 className='font-semibold text-2xl mt-4'>Password Changed!</h3>
                        <p className='text-sm'>Your password has been changed successfully.</p>
                      </div>
                    </div>
                    <div class="bg-white mx-8 py-3">
                      <button onClick={closeModal} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Back to Login</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  )
}

export default ChangePassword