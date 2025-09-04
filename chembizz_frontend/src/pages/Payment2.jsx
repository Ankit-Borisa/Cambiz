import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bank from "../images/bank.png"
import upi from "../images/upi.png"
import paymentback from "../images/payment-back.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import chemical from "../images/chemical.png"
import truck from "../images/truck.png"
import messagepay from "../images/messagepay.png"
import ch1 from "../images/ch1.png"
import ch2 from "../images/ch2.png"
import ch3 from "../images/ch3.png"
import ch4 from "../images/ch4.png"
import bg from "../images/confirmbg.png"
import right from "../images/right.png"

const Payment2 = () => {

    const [abc, setAlreadyData] = useState("")

    const location = useLocation();

    useEffect(() => {
        setAlreadyData(location.state?.abc)
    }, [location]);

    const handleNullAbc = () => {
        setAlreadyData("")
    }

    const navigate = useNavigate()



    const handleCheckout = () => {
        navigate("/payment");
    }

    const [isOpen, setIsOpen] = useState(false);

    const submitInquiry = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
        navigate("/company/buying-inquiry");
    };

    // Define state variable for the counter
    const [count, setCount] = useState(1);

    // Function to handle incrementing the counter
    const incrementCounter = () => {
        setCount(prevCount => prevCount + 1);
    };

    // Function to handle decrementing the counter
    const decrementCounter = () => {
        // Ensure count doesn't go below 1
        if (count > 1) {
            setCount(prevCount => prevCount - 1);
        }
    };


    return (
        <div className='bg-gray-100 pt-10'>
            <div className='profile-container'>
                <div className=''>
                    <div className='flex items-center mb-6'>
                        <h1 className='text-2xl font-semibold w-[280px]'>My Buying Inquiry</h1>
                        <div className='border w-full h-0'></div>
                    </div>
                </div>
                <div className='flex md:flex-row flex-col bg-white rounded-2xl border border-[#0A122A]/0.1 rounded-2xl shadow '>
                    <ToastContainer />
                    <div className='p-10 flex flex-col items-center justify-center rounded-2xl w-full'>
                        <div className='w-full h-full'>
                            <div className='grid grid-cols-[3fr,1fr] gap-4 h-full'>
                                <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-5'>
                                    <div className='w-full'>
                                        <div className='rounded mb-14'>
                                            <div className='grid grid-cols-[1fr,5fr,1fr]'>
                                                <div className=''>
                                                    <img src={chemical} alt="" className='mb-2' />
                                                </div>
                                                <div className=''>
                                                    <h1 className='text-xl font-semibold mb-5'>Amisulpride</h1>

                                                    <div className='flex mb-2'>
                                                        <p className='text-slate-500 text-sm w-[240px]' >CAS No: 7167-586-9</p>
                                                        <p className='text-slate-500 text-sm ' >Category: API</p>
                                                    </div>
                                                    <div className='flex mb-2'>
                                                        <p className='text-slate-500 text-sm w-[240px]' >Country Origin / Make: India</p>
                                                        <p className='text-slate-500 text-sm ' >Sub-Category: Intermediate</p>
                                                    </div>
                                                    <div className='flex mb-2'>
                                                        <p className='text-slate-500 text-sm w-[240px]' >Purity: 90%</p>
                                                        <p className='text-slate-500 text-sm' >Grade: IB, BP, In House</p>
                                                    </div>
                                                    <div className='flex mb-2'>
                                                        {abc ? (
                                                            <p className='text-slate-500 text-sm w-[240px]' >Quantity: 10kg</p>
                                                        ) : (
                                                            <p className='text-slate-500 text-sm w-[240px]' >Quantity: 100gm</p>
                                                        )}
                                                        <a target='_blank' className='text-blue-600 text-sm underline cursor-pointer font-semibold'>COA</a>
                                                    </div>
                                                    <div className='mb-2'>
                                                        {abc ? (
                                                            <p className='text-slate-500 text-sm flex items-center' >Price Range : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>1500 -<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>200</p>
                                                        ) : (
                                                            <p className='text-slate-500 text-sm flex items-center' >Price : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>150</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {abc ? (
                                                    <div>
                                                        <div className='flex justify-end'>
                                                            <div className='flex border rounded-lg'>
                                                                <input type="text" className='outline-none text-gray-500 py-1 px-2 w-[150px] placeholder:text-gray-300 placeholder:text-sm rounded-s-lg' placeholder='Enter Quantity' />
                                                                <select name="" id="" className='outline-none bg-gray-100 py-1 px-2 text-gray-400 text-sm rounded-e-lg'>
                                                                    <option value="kg">Kg</option>
                                                                    <option value="gm">Gm</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='mt-4'>
                                                            <div className='flex gap-1 items-center justify-between w-[280px]'>
                                                                <p className='w-[120px] text-sm'>Payment Terms</p>
                                                                <select name="" id="" className='outline-none bg-gray-100 py-2 font-medium px-3 text-sm rounded-lg'>
                                                                    <option value="kg">Advance</option>
                                                                    <option value="gm">Immediate</option>
                                                                    <option value="gm">Credit (15 Days)</option>
                                                                    <option value="gm">Credit (30 Days)</option>
                                                                    <option value="gm">Credit (45 Days)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='mt-4'>
                                                            <div className='flex gap-1 items-center justify-between w-[280px]'>
                                                                <p className='w-[120px] text-sm'>Delivery Time</p>
                                                                <select name="" id="" className='outline-none bg-gray-100 py-2 font-medium px-3 text-sm rounded-lg'>
                                                                    <option value="gm">Immediate</option>
                                                                    <option value="gm">Delivery in 15 Days</option>
                                                                    <option value="gm">Delivery in 30 Days</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='mt-4 flex justify-end'>
                                                            <div className='flex gap-1 items-center justify-between w-[280px]'>
                                                                <p className='w-[120px] text-sm'>Inco Terms</p>
                                                                <select name="" id="" className='outline-none bg-gray-100 py-2 font-medium px-3 text-xs rounded-lg'>
                                                                    <option value="EXW">EXW</option>
                                                                    <option value="FOB">FOB</option>
                                                                    <option value="CIF">CIF</option>
                                                                    <option value="DDP">DDP</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='mt-2'>
                                                            <p className='text-[9px] text-end text-red-400'>*this delivery time will consider after confirmation of order</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-col items-center'>
                                                        <p className='text-slate-400 text-sm' >Quantity: 100gm</p>
                                                        <p className='mb-0'>*</p>
                                                        <div className='flex gap-3 mb-4'>
                                                            <select name="" id="" className='bg-gray-100 px-3 py-1 rounded'>
                                                                <option value="">1 Lot</option>
                                                                <option value="">2 Lot</option>
                                                                <option value="">3 Lot</option>
                                                                <option value="">4 Lot</option>
                                                            </select>
                                                        </div>
                                                        <p className='text-sm font-medium'>Total Quantity</p>
                                                        <p className='text-sm font-medium'>100gm</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='border border-gray mb-5'></div>
                                        <div className='rounded mb-14'>
                                            <div className='grid grid-cols-[0.8fr,5fr]'>
                                                <div className=''>
                                                    <img src={chemical} alt="" className='mb-2' />
                                                </div>
                                                <div className=''>
                                                    <div className='flex items-center justify-between mb-5'>
                                                        <h1 className='text-xl font-semibold'>Seller Name</h1>
                                                        <p className='text-xl font-semibold' >Manufacturer / Trader </p>
                                                    </div>
                                                    <div className='flex gap-20 mb-2'>
                                                        <p className='text-slate-500 text-sm' >GST No: 22AAAAA0000A1Z5</p>
                                                    </div>
                                                    <div className='flex gap-[73px] mb-2'>
                                                        <p className='text-slate-500 text-sm' >Address: 22 Cradle, EDII, Gandhinagar - Ahmedabad Rd, next to APOLLO HOSPITAL, GIDC Bhat,</p>
                                                    </div>
                                                    <div className='mb-2'>
                                                        <p className='text-slate-500 text-sm' >Bhat, Ahmedabad, Gujarat, India-382428</p>
                                                    </div>
                                                    <div className='mb-2'>
                                                        <div className='flex gap-5 items-center'>
                                                            <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'> Facility Document </p>
                                                            :
                                                            <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm text-blue-500 underline'> GMP</p>
                                                            <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm text-blue-500 underline'> cGMP</p>
                                                            <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm text-blue-500 underline'> FDA</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <button className='w-[300px] bg-darkBlue text-white  px-4 py-2 rounded-lg'><FontAwesomeIcon icon={faArrowLeft} className='me-2' /> Back To Chemicals </button>
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    {abc ? (
                                        <>
                                            <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7  px-5'>
                                                <h1 className='text-xl font-medium mb-3'>Approx Quatation Details</h1>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Sub Total</p>
                                                    <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>1500 - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>2000</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Discount</p>
                                                    <p className='text-sm text-[#FA3434] flex items-center'>- <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>60.00</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Tax</p>
                                                    <p className='text-sm text-[#00B517] flex items-center'>+ <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>14.00</p>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Delivery Charge</p>
                                                    <p className='text-sm text-[#00B517] flex items-center'>+ <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>14.00</p>
                                                </div>
                                                <div className='border my-3'></div>
                                                <div className='flex justify-between'>
                                                    <p className='text-md font-semibold'>Total</p>
                                                    <p className='text-md font-semibold flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>1500 - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>2000</p>
                                                </div>
                                                <div className='mt-3'>
                                                    <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg' onClick={submitInquiry}>Submit Inquiry</button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7 mb-6    px-5'>
                                                <h1 className='text-md font-medium mb-3 text-gray-500'>Have a coupon?</h1>
                                                <div className='flex'>
                                                    <input type="text" placeholder='Add coupon' className='border-2 border-gray-300 px-2 rounded-bl-md rounded-ss-md' />
                                                    <button className='text-blue-500 border-2 border-gray-300 px-2 py-1 rounded-br-md rounded-se-md'>Apply</button>
                                                </div>
                                            </div>

                                            <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7  px-5'>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Sub Total</p>
                                                    <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>1500</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Discount</p>
                                                    <p className='text-sm text-[#FA3434] flex items-center'>- <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>60.00</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Tax</p>
                                                    <p className='text-sm text-[#00B517] flex items-center'>+ <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>14.00</p>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Delivery Charge</p>
                                                    <p className='text-sm text-[#00B517] flex items-center'>+ <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>14.00</p>
                                                </div>
                                                <div className='border my-3'></div>
                                                <div className='flex justify-between'>
                                                    <p className='text-md font-semibold'>Total</p>
                                                    <p className='text-md font-semibold flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>1500</p>
                                                </div>
                                                <div className='mt-3'>
                                                    <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg' onClick={handleCheckout}>Checkout</button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='flex md:flex-row flex-col bg-white border border-[#0A122A]/0.1 rounded-2xl shadow mt-10 rounded-2xl'>
                    <ToastContainer />
                    <div className='px-10 py-7 flex flex-col items-center justify-center rounded-2xl w-full'>
                        <div className='w-full h-full'>
                            <div className='h-full'>
                                <div className='h-full w-full px-5'>
                                    <div className='w-full flex justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <img src={truck} alt="" className='h-[60px]' />
                                            <div>
                                                <p className='font-medium text-lg'>Secure Payment</p>
                                                <p className='stext-sm text-gray-400 text-lg'>Have you ever finally just </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <img src={messagepay} alt="" className='h-[60px]' />
                                            <div>
                                                <p className='font-medium text-lg'>Customer support</p>
                                                <p className='stext-sm text-gray-400 text-lg'>Have you ever finally just </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <img src={truck} alt="" className='h-[60px]' />
                                            <div>
                                                <p className='font-medium text-lg'>Instant delivery</p>
                                                <p className='stext-sm text-gray-400 text-lg'>Have you ever finally just </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className='flex md:flex-row flex-col bg-white border border-[#0A122A]/0.1 rounded-2xl shadow mt-10 rounded-2xl'>
                    <ToastContainer />
                    <div className='px-10 py-7 flex flex-col items-center justify-center rounded-2xl w-full'>
                        <div className='w-full h-full'>
                            <div className='h-full'>
                                <div className='h-full w-full px-5'>
                                    <div className='mb-5'>
                                        <h1 className='text-2xl font-semibold'> Other Products from Seller</h1>
                                    </div>
                                    <div className='w-full grid grid-cols-[1fr,1fr,1fr,1fr] gap-10'>
                                        <div className='px-3 py-4 shadow rounded-lg'>
                                            <img src={ch1} alt="" />
                                            <div>
                                                <p className='font-medium text-lg mt-2 mb-1'>Amisulpride</p>
                                                <div className='flex justify-between'>
                                                    <div>
                                                        <p className='text-xs text-gray-400'>CAS No:</p>
                                                        <p className='text-sm'>71782-20-3</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-gray-400'>Price:</p>
                                                        <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>200 - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>300</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-4 flex gap-2'>
                                                <button className='bg-darkBlue text-xs text-white font-medium py-2 rounded-lg w-full text-md font-thin'>Buying Inquiry</button>
                                                <button className=' border border-darkBlue text-xs font-semibold py-2 rounded-lg w-full text-md font-thin'>Sample Inquiry</button>
                                            </div>
                                        </div>
                                        <div className='px-3 py-4 shadow rounded-lg'>
                                            <img src={ch2} alt="" />
                                            <div>
                                                <p className='font-medium text-lg mt-2 mb-1'>Methanol</p>
                                                <div className='flex justify-between'>
                                                    <div>
                                                        <p className='text-xs text-gray-400'>CAS No:</p>
                                                        <p className='text-sm'>67-56-1</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-gray-400'>Price:</p>
                                                        <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>200 - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>300</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-4 flex gap-2'>
                                                <button className='bg-darkBlue text-xs text-white font-medium py-2 rounded-lg w-full text-md font-thin'>Buying Inquiry</button>
                                                <button className=' border border-darkBlue text-xs font-semibold py-2 rounded-lg w-full text-md font-thin'>Sample Inquiry</button>
                                            </div>
                                        </div>
                                        <div className='px-3 py-4 shadow rounded-lg'>
                                            <img src={ch3} alt="" />
                                            <div>
                                                <p className='font-medium text-lg mt-2 mb-1'>Sodium chloride</p>
                                                <div className='flex justify-between'>
                                                    <div>
                                                        <p className='text-xs text-gray-400'>CAS No:</p>
                                                        <p className='text-sm'>71782-20-3</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-gray-400'>Price:</p>
                                                        <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>200 - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>300</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-4 flex gap-2'>
                                                <button className='bg-darkBlue text-xs text-white font-medium py-2 rounded-lg w-full text-md font-thin'>Buying Inquiry</button>
                                                <button className=' border border-darkBlue text-xs font-semibold py-2 rounded-lg w-full text-md font-thin'>Sample Inquiry</button>
                                            </div>
                                        </div>
                                        <div className='px-3 py-4 shadow rounded-lg'>
                                            <img src={ch4} alt="" />
                                            <div>
                                                <p className='font-medium text-lg mt-2 mb-1'>Ethyl chloro formate</p>
                                                <div className='flex justify-between'>
                                                    <div>
                                                        <p className='text-xs text-gray-400'>CAS No:</p>
                                                        <p className='text-sm'>563-89-2</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-gray-400'>Price:</p>
                                                        <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>200 - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>300</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-4 flex gap-2'>
                                                <button className='bg-darkBlue text-xs text-white font-medium py-2 rounded-lg w-full text-md font-thin'>Buying Inquiry</button>
                                                <button className=' border border-darkBlue text-xs font-semibold py-2 rounded-lg w-full text-md font-thin' onClick={handleNullAbc}>Sample Inquiry</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='w-full h-full mt-10'>
                    <img src={bg} alt="" />
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
                                            <h3 className='font-semibold text-2xl mt-4'>Inquiry Successfully!</h3>
                                            <p className='text-sm px-5 text-center mt-3'>Your inquiry submitted successfully seller will connect with you soon.</p>
                                        </div>
                                    </div>
                                    <div class="bg-white mx-8 py-3">
                                        <button onClick={closeModal} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-md font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Payment2
