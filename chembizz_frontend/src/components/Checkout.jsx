import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bank from "../images/bank.png"
import upi from "../images/upi.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import paymentback from "../images/payment-back.png"
import right from "../images/right.png"


const Checkout = () => {

    const location = useLocation();
    const abc = location.state?.abc;

    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false);

    const handlecheck = () => {
        setIsOpen(true);
        // navigate("/company/profile")
    }

    const closeModal = () => {
        setIsOpen(true);
        navigate("/company/buying-inquiry")
    }

    const [option, setOption] = useState("qr")

    return (
        <div>
            <div className='xl:px-20 lg:px-20 md:px-10 md:py-10'>
                <div className='flex md:flex-row flex-col bg-white border border-gray-200 rounded-2xl'>
                    <ToastContainer />
                    <div className='p-10 flex flex-col items-center justify-center md:h-[550px] rounded-2xl w-full'>
                        <div className='w-full h-full'>
                            <div className='grid grid-cols-[3.5fr,2.5fr] gap-4 h-full'>
                                <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-8'>
                                    <div className='w-full'>
                                        <div className='mb-4'>
                                            <h1 className='text-xl font-medium'>Select Payment Method</h1>
                                        </div>
                                        <div className=' border border-[#0A122A]/0.5 rounded px-3 py-3 mb-14'>
                                            <div className='grid grid-cols-[1fr,1fr,1fr]'>
                                                <div className='flex flex-col justify-center items-center'>
                                                    <img src={upi} alt="" className='mb-2' />
                                                    <p className='mb-2'>UPI / QR</p>
                                                    <input type="radio" name="why" id="" onClick={() => setOption("qr")} />
                                                </div>
                                                <div className='flex flex-col justify-center items-center'>
                                                    <img src={bank} alt="" className='w-[30px] mb-2 ' />
                                                    <p className='mb-2'>Net Banking</p>
                                                    <input type="radio" name="why" id="" onClick={() => setOption("net")} />
                                                </div>
                                                <div className='flex flex-col justify-center items-center'>
                                                    <img src={bank} alt="" className='w-[30px] mb-2' />
                                                    <p className='mb-2'>Debit / Credit Card</p>
                                                    <input type="radio" name="why" id="" onClick={() => setOption("debit")} />
                                                </div>
                                            </div>
                                        </div>
                                        {option === "debit" ? (
                                            <div>
                                                <div className='mb-4'>
                                                    <p>Name On Card</p>
                                                    <input type="text" className='border-2 border-black-500 rounded w-full px-5 py-1' />
                                                </div>
                                                <div className='mb-4'>
                                                    <p>Card Number</p>
                                                    <input type="text" className='border-2 border-black-300 rounded w-full px-5 py-1' />
                                                </div>
                                                <div className='grid grid-cols-[2fr,2fr] gap-4'>
                                                    <div>
                                                        <p>Expire Date</p>
                                                        <input type="text" className='border-2 border-black-300 rounded w-full px-5 py-1' />
                                                    </div>
                                                    <div>
                                                        <p>CVC</p>
                                                        <input type="text" className='border-2 border-black-300 rounded w-full px-5 py-1' />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : option === "net" ? (
                                            <>
                                                <div>
                                                    <div className='mb-4'>
                                                        <p>Select Your Bank</p>
                                                        <select name="" id="" className='border-2 border-black-500 rounded w-full px-5 py-1'>
                                                            <option value="">State Bank Of India</option>
                                                            <option value="">Axis Bank</option>
                                                            <option value="">HDFC Bank</option>
                                                            <option value="">ICICI Bank</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (<>
                                            <div>
                                                <div className='mb-4'>
                                                    <p>Enter UPI Id</p>
                                                    <input type="text" className='border-2 border-black-500 rounded w-full px-5 py-1' />
                                                </div>
                                                <div className='mb-4'>
                                                    <p className='text-center'>-OR-</p>
                                                </div>
                                                <div className='mb-4'>
                                                    <p>Scan QR Code</p>
                                                    <img src="" alt="" />
                                                </div>
                                            </div>
                                        </>)}

                                    </div>
                                </div>
                                <div>
                                    {abc ? (
                                        <>
                                            <div className='border border-[#0A122A]/0.1 rounded-2xl pb-5 pt-3 px-5 shadow'>
                                                <h3 className='text-slate-500 font-medium mb-3'>Plan Details</h3>
                                                <h1 className='text-xl font-medium'>Standard Plan</h1>
                                                <div className='grid grid-cols-[1fr,1fr] gap-2 mt-2'>
                                                    <div>
                                                        <FontAwesomeIcon icon={faCheck} className='text-sm' /><span className='ms-2 text-sm'>Online Subscription</span>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faCheck} className='text-sm' /><span className='ms-2 text-sm'>Online Subscription</span>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faCheck} className='text-sm' /><span className='ms-2 text-sm'>Online Subscription</span>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faCheck} className='text-sm' /><span className='ms-2 text-sm'>Online Subscription</span>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faCheck} className='text-sm' /><span className='ms-2 text-sm'>Online Subscription</span>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faCheck} className='text-sm' /><span className='ms-2 text-sm'>Online Subscription</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>


                                    ) : (
                                        <>
                                            <div className='border border-[#0A122A]/0.1 rounded-2xl pb-5 pt-3 ps-5 shadow'>
                                                <div className='flex gap-2'>
                                                    <div>
                                                        <img src={paymentback} alt="" />
                                                    </div>
                                                    <div>
                                                        <h1 className='text-xl font-medium'>Standard Plan</h1>
                                                        <div className='grid grid-cols-[1fr,1fr]  gap-x-5'>
                                                            <div>
                                                                <p className='text-slate-500 text-sm' >CAS No: 7167-586-9</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-slate-500 text-sm'>Purity: 90%</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-slate-500 text-sm'>Category: API</p>
                                                            </div>
                                                            <div>
                                                                <p className='text-slate-500 text-sm'>Quantity: 10kg </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </>
                                    )}


                                    <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7  px-5 mt-5'>
                                        <h1 className='text-xl font-medium mb-3'>Order Summary</h1>
                                        <div className='flex justify-between mb-2'>
                                            <p className='text-[#0A122A]/[0.6] text-sm'>Sub Total</p>
                                            <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>320</p>
                                        </div>
                                        <div className='flex justify-between mb-2'>
                                            <p className='text-[#0A122A]/[0.6] text-sm'>Discount</p>
                                            <p className='text-sm text-[#FA3434] flex items-center'>- <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>24</p>
                                        </div>
                                        <div className='flex justify-between mb-2'>
                                            <p className='text-[#0A122A]/[0.6] text-sm'>Tax</p>
                                            <p className='text-sm text-[#00B517] flex items-center'>+ <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>61.99</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <p className='text-[#0A122A]/[0.6] text-sm'>Delivery Charges</p>
                                            <p className='text-sm text-[#00B517] flex items-center'>+ <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>61.99</p>
                                        </div>
                                        <div className='border my-3'></div>
                                        <div className='flex justify-between'>
                                            <p className='text-md'>Total</p>
                                            <p className='text-md flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>357.99</p>
                                        </div>
                                        <div className='mt-3'>
                                            <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg' onClick={handlecheck}>Proceed To Payment <FontAwesomeIcon icon={faArrowRight} className='ms-2' /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                                <h3 className='font-semibold text-2xl mt-4'>Thank You!</h3>
                                                <p className='text-sm px-5 text-center mt-3'>Payment done successfully.</p>
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
        </div>
    )
}

export default Checkout
