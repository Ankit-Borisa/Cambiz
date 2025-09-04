import React, { useEffect, useRef, useState } from 'react';
import { faPrint, faDownload, faArrowUp, faEllipsisVertical, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../index.css";
import invoice1 from "../images/invoice1.jpg"
import right from "../images/right.png";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../BASE_URL';


const Salesreturn = () => {


    const [focused, setFocused] = useState(false);
    const [focused1, setFocused1] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [focused3, setFocused3] = useState(false);
    const [focusedD, setFocusedD] = useState(true);
    const [focused4, setFocused4] = useState(true);
    const [focused5, setFocused5] = useState(true);
    const [focusedS, setFocusedS] = useState(true);

    const [isOpenPhoto, setIsOpenPhoto] = useState(false);

    const photoView = () => {
        setIsOpenPhoto(true)
    }

    const [reason, setReason] = useState(false)

    const handleGenrate = () => {
        setReason(true)
    }

    const cancelSubmit = () => {
        navigate("/company/generate-po", { state: { abc: "PO" } })
    }

    const handleOfReason = () => {
        setReason(false)
    }

    const [isOpen1, setIsOpen1] = useState(false);

    const handleSuccess = () => {
        setIsOpen1(true)
    }


    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    const navigate = useNavigate();

    const handleBuyingNavigate = () => {
        navigate("/company/buy-inquiry")
    }

    // const handleNavigate = () => {
    //     navigate("/company/buying-inquiry-detail", { state: { abc: "approved" } })
    // }

    const [isOpen, setIsOpen] = useState(false)

    const [ascending, setAscending] = useState(true);

    const toggleOrder = () => {
        setAscending(prevState => !prevState);
    };


    const [list, setList] = useState([])

    const fetchPaymentHistory = async () => {

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        const res = await fetch(`${BASE_URL}api/return_order/displayList/seller`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        // console.log(data.data)
        setList(data.data)
    }

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [buyerQuery, setBuyerQuery] = useState('');
    const [amountQuery, setAmountQuery] = useState('');
    const [inquiryTypeQuery, setInquiryTypeQuery] = useState('');
    const [ponumberQuery, setPonumberQuery] = useState('');
    const [dateQuery, setDateQuery] = useState('');
    const [statusQuery, setStatusQuery] = useState('');

    const handleSearchChange = (event) => setSearchQuery(event.target.value);
    const handleBuyerChange = (event) => setBuyerQuery(event.target.value);
    const handleAmountChange = (event) => setAmountQuery(event.target.value);
    const handleInquiryTypeChange = (event) => setInquiryTypeQuery(event.target.value);
    const handlePoNumberChange = (event) => setPonumberQuery(event.target.value);
    const handleDateChange = (event) => setDateQuery(event.target.value);
    const handleStatusChange = (event) => setStatusQuery(event.target.value);


    const filteredData = list.filter(item => {
        const matchesChemicalName = item?.inquiry_details[0]?.product_details?.[0]?.name_of_chemical.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBuyerName = item?.buyer_details?.[0]?.company_name.toLowerCase().includes(buyerQuery.toLowerCase());
        const matchesAmount = amountQuery === '' || item?.inquiry_details[0]?.negotations_details?.[0]?.final_price >= parseFloat(amountQuery);
        const matchesInquiry = item?.inquiry_details[0]?.inq_type.toLowerCase().includes(inquiryTypeQuery.toLowerCase());
        const matchesPoNumber = item?.inquiry_details[0]?.po_details?.[0]?.po_num.toLowerCase().includes(ponumberQuery.toLowerCase());
        const matchesDate = dateQuery === '' || item?.inquiry_details[0]?.po_details?.[0]?.po_date === dateQuery;
        const matchesStatus = item?.inquiry_details[0]?.status.toLowerCase().includes(statusQuery.toLowerCase());


        return (
            matchesChemicalName &&
            matchesBuyerName &&
            matchesAmount &&
            matchesPoNumber &&
            matchesDate &&
            matchesStatus &&
            matchesInquiry
        );
    });



    return (
        <div className="w-full   overflow-x-hidden">
            <div className="flex flex-col p-2">
                <div className='flex justify-between mb-2'>
                    <h1 className="md:text-3xl text-xl font-semibold ">Sales Return</h1>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-40" onClick={() => setIsOpen(false)}>
                        <div className="relative transform overflow-hidden rounded-lg text-left transition-all max-w-md py-4">
                            <div className="py-3">
                                <div className='flex justify-center gap-2 mb-2'>
                                    <button onClick={() => navigate("/company/buying-inquiry-detail")} className='bg-darkBlue text-sm text-white px-4 py-1 rounded-[20px]'>Edit PO</button>
                                    <button onClick={() => handleSuccess()} className='bg-darkBlue text-white px-5 py-1 rounded-[20px] text-sm'>Generate PO</button>
                                </div>
                                <div className="">
                                    <img src={invoice1} alt="" className='h-[550px]' />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer />

                <div className='mt-3'>
                    <div className='grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] gap-4 overflow-scroll'>

                        <div className='flex w-[100px] justify-center items-center' onClick={toggleOrder}>
                            <div className='flex border px-4 py-2 mt-1 rounded-lg items-center cursor-pointer'>
                                <FontAwesomeIcon icon={ascending ? faArrowDown : faArrowUp} className='text-gray-500' />
                                <p className='ms-2 text-sm'>{ascending ? "1 to 9" : "9 to 1"}</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Chemical Name
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setFocused(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused1 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Seller Name
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                onChange={handleBuyerChange}
                                value={buyerQuery}
                                onFocus={() => setFocused1(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused1(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused2 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused2 ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Amount
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                value={amountQuery}
                                onChange={handleAmountChange}
                                onFocus={() => setFocused2(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused2(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="selectField"
                                className={`transition-all ${focusedS ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focusedS ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Inquiry Type
                            </label>
                            <select
                                id="selectField"
                                value={inquiryTypeQuery}
                                onChange={handleInquiryTypeChange}
                                onFocus={() => setFocusedS(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocusedS(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            >
                                <option value="" disabled selected></option>
                                <option value="">Sample Inquiry</option>
                                <option value="">Commercial Inquiry</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused3 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                PO Number
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                value={ponumberQuery}
                                onChange={handlePoNumberChange}
                                onFocus={() => setFocused3(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused3(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <div className="flex flex-col justify-center items-center relative">
                                <label
                                    htmlFor="inputDate"
                                    className={`transition-all ${focusedD ? 'text-xs top-0 left-[2%] bg-white' : 'text-base'} ${focusedD ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                                >
                                    PO Date
                                </label>
                                <input
                                    id="inputDate"
                                    type="date"
                                    value={dateQuery}
                                    onChange={handleDateChange}
                                    className={`border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 ${focusedD ? 'focused' : ''}`}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="selectField"
                                className={`transition-all ${focused5 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused5 ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Status
                            </label>
                            <select
                                id="selectField"
                                value={statusQuery}
                                onChange={handleStatusChange}
                                onFocus={() => setFocused5(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused5(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            >
                                <option value="" disabled selected></option>
                                <option value="delivered">Delivered</option>
                                <option value="in transit">In Transit</option>
                                <option value="dispatched">Dispatched</option>
                            </select>
                        </div>
                    </div>
                </div>

                <hr className="mt-5 border-t-2 border-gray-200" />

                {/* Table */}
                <div className="overflow-x-auto max-h-screen">
                    <table style={{ border: "none" }} className="table-auto w-full border-0 mt-6">
                        <tbody>
                            {filteredData.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr className={`flex py-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                                        <td className=" ps-2 text-center py-2 flex flex-col sm:justify-center justify-start font-semibold">
                                            <span className={`px-2`}>{index + 1}</span>
                                        </td>
                                        <td className="ps-4 py-2 flex flex-col w-[150px]">
                                            <p className=' font-semibold text-[14px]'>{item.inquiry_details[0]?.product_details?.[0]?.name_of_chemical}</p>
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">{item.inquiry_details[0]?.product_details?.[0]?.CAS_number}</h2>
                                        </td>
                                        <td className="  py-2 flex flex-col w-[150px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Seller</h2>
                                            <p className='font-semibold text-[14px]'>{item.buyer_details?.[0]?.company_name}</p>
                                        </td>
                                        <td className=" py-2 flex flex-col w-[85px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Amount</h2>
                                            <p className='font-semibold text-[14px] flex items-center'>{item.inquiry_details[0]?.negotations_details?.[0]?.final_price}</p>
                                        </td>
                                        <td className=" py-2 flex flex-col w-[100px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Inquiry Type</h2>
                                            <p className='font-semibold text-[14px]'>{item.inquiry_details[0]?.inq_type}</p>
                                        </td>

                                        <td className="  py-2 flex flex-col w-[100px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">PO Number</h2>
                                            <p className='font-semibold text-[14px]'>{item.inquiry_details[0]?.po_details?.[0]?.po_num}</p>
                                        </td>

                                        <td className="  py-2 flex flex-col w-[140px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">PO Date</h2>
                                            <p className='font-semibold text-[14px]'>{item.inquiry_details[0]?.po_details?.[0]?.po_date}</p>
                                        </td>

                                        <td className="  py-2 flex flex-col w-[115px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Delivery Time</h2>
                                            <p className='font-semibold text-[14px]'>{item.inquiry_details[0]?.delivery_time}</p>
                                        </td>

                                        <td className="  py-2 flex flex-col w-[120px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Payment Terms</h2>
                                            <p className='font-semibold text-[14px]'>{item.inquiry_details[0]?.payment_terms}</p>
                                        </td>

                                        <td className="  py-2 flex flex-col w-[90px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Status</h2>
                                            <p className='font-semibold text-[14px]'>{item.inquiry_details[0]?.status}</p>
                                        </td>

                                        <td className="  py-2 flex flex-col items-center justify-center w-[70px]">
                                            <p 
                                            // onClick={() => navigate(`/company/buying-inquiry-detail`, { state: { orderStatus: item.inquiry_details[0]?.status } })} 
                                            className='text-blue-600 underline font-semibold text-sm cursor-pointer'>Details</p>

                                        </td>
                                        <td className="py-2 flex flex-col items-center justify-center w-[40px] relative">
                                            <div onClick={() => toggleDropdown(index)} className="cursor-pointer">
                                                <FontAwesomeIcon icon={faEllipsisVertical} />
                                            </div>
                                            {openDropdownIndex === index && (
                                                <div ref={dropdownRef} className="absolute z-10 right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                                                    <div className="py-1">
                                                        <button className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 focus:outline-none" onClick={handleBuyingNavigate}>Repeat Inquiry</button>
                                                        <button className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 focus:outline-none" onClick={photoView}>View/Print PO</button>
                                                        <button className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 focus:outline-none" onClick={photoView}>View/Print Invoice</button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {/* <div className="mt-10">
                        <DatePicker />
                    </div> */}

                    {isOpenPhoto && (
                        <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50" onClick={() => setIsOpenPhoto(false)}>
                            <div className="relative transform overflow-hidden rounded-lg text-left transition-all max-w-md py-4">
                                <div className="py-3">
                                    <div className='flex justify-center gap-2 mb-2'>
                                        <button className='bg-darkBlue text-sm text-white px-4 py-1 rounded-[20px]'><FontAwesomeIcon icon={faDownload} className='me-1' /> Doqnload</button>
                                        <button className='bg-darkBlue text-white px-5 py-1 rounded-[20px] text-sm'><FontAwesomeIcon icon={faPrint} className='me-1' /> Print</button>
                                    </div>
                                    <div className="">
                                        <img src={invoice1} alt="" className='w-[380px]' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {reason && (
                        <>
                            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                            <div class="bg-white pt-2">
                                                <p className='text-gray-600 font-semibold mb-2 px-5'>Generate Your PO</p>
                                                <div className='bg-gray-100 px-5 py-5'>
                                                    <div>
                                                        <p className='text-xs font-medium text-gray-500'>Enter Your Prefix</p>
                                                        <input type="text" name="" id="" className='w-full py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none ps-5' />
                                                    </div>
                                                </div>
                                                <div class="bg-white pt-3 flex justify-end gap-3 px-5">
                                                    <button onClick={handleOfReason} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-xs font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                                                    <button onClick={cancelSubmit} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Ok</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {isOpen1 && (
                        <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                        <div class="bg-white py-3">
                                            <div class="flex flex-col items-center">
                                                <img src={right} alt="" className='h-[80px]' />
                                                <h3 className='font-semibold text-2xl mt-4'>PO Generated Successfully!</h3>
                                            </div>
                                        </div>
                                        <div class="bg-white mx-8 py-3">
                                            <button onClick={() => navigate("/company/select-po")} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                </div>
            </div>
        </div >
    );
};

export default Salesreturn;
