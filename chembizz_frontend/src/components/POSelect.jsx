import React, { useEffect, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../index.css"
import invoice1 from "../images/invoice1.jpg"
import right from "../images/right.png"
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

const POgenarate = () => {

    const location = useLocation();

    const selectedProductId = location.state.productId;
    const selectedInquiryId = location.state.data;
    const navigate = useNavigate()

    const data = [

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

        {
            chemical: 'Amisulpride',
            seller: 'ChemBizZ Pvt Ltd',
            Amount: '100',
            PO_number: "123456789",
            PO_date: '20 Aug, 2024',
            delivery_time: 'Immediate',
            payment_terms: 'Advance',
            PO: 'Approved',
            invoice: 'Approved',
        },

    ];


    const [isOpenPhoto, setIsOpenPhoto] = useState(false);

    const photoView = () => {
        setIsOpenPhoto(true)
    }

    const [reason, setReason] = useState(false)

    const cancelSubmit = () => {
        setReason(false)
        handleSuccess()
    }

    const handleOfReason = () => {
        setReason(false)
    }

    const [isOpen1, setIsOpen1] = useState(false);

    const handleSuccess = () => {
        setIsOpen1(true)
    }

    const handleSuccessClose = () => {
        setIsOpen1(false)
    }

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [checkboxesChecked, setCheckboxesChecked] = useState(Array(data.length).fill(false));

    const checkedCount = checkboxesChecked.filter(checkbox => checkbox).length;

    const [deleteYes, setDeleteYes] = useState(false)
    const [successfull, setSuccessfull] = useState(false)

    const handleBack = () => {
        navigate(-1)
    }


    const [buyingInquiryList, setBuyingInquiryList] = useState([]);

    const fetchSellingInquiryList = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}api/inquiryRoutes/buyerCompanyAndSallerCompany/buyer`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await res.json();

        // Filter the data based on the selected product, status, and excluding a specific inquiry
        // console.log(data.data)
        // console.log(selectedProductId)
        const filtered = data.data.filter(item =>
            item.product._id === selectedProductId &&  // Product ID matches
            // ["pending", "approved", "negotiation"].includes(item.status) && 
            (item.status === "pending" || item.status === "approved" || item.status === "negotiation")&&
            item._id !== selectedInquiryId  // Exclude the selected inquiry ID
        );
        // console.log(filtered)
        setBuyingInquiryList(filtered);
    };
    ;

    useEffect(() => {
        fetchSellingInquiryList();
    }, []);

    // State to store _id of selected items
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;
        setSelectAllChecked(isChecked);
        setCheckboxesChecked(Array(buyingInquiryList.length).fill(isChecked));

        if (isChecked) {
            // Add all IDs to selectedIds
            const allIds = buyingInquiryList.map(item => item._id);
            setSelectedIds(allIds);
        } else {
            // Clear selectedIds
            setSelectedIds([]);
        }
    };

    const handleCheckboxChange = (index) => {
        const newCheckboxesChecked = [...checkboxesChecked];
        newCheckboxesChecked[index] = !newCheckboxesChecked[index];
        setCheckboxesChecked(newCheckboxesChecked);
        setSelectAllChecked(newCheckboxesChecked.every((checkbox) => checkbox));

        const itemId = buyingInquiryList[index]._id;
        if (newCheckboxesChecked[index]) {
            // Add item ID to selectedIds
            setSelectedIds([...selectedIds, itemId]);
        } else {
            // Remove item ID from selectedIds
            setSelectedIds(selectedIds.filter(id => id !== itemId));
        }
    };

    const handleSubmit = async () => {
        try {
            const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
            const response = await axios.put(
                `${BASE_URL}api/inquiryRoutes/allInquiryStatusCancel`,
                {
                    inquiryIds: selectedIds,
                },
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );

            setDeleteYes(false);
            setSelectAllChecked(false)

            if (response.status === 200) {
                setSuccessfull(true);
                fetchSellingInquiryList();
                setTimeout(() => {
                    toast.success('Inquiries Deleted Successfully!', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 2000,
                    });
                }, 2000);
            } else {
                toast.error('Failed to delete inquiries. Please try again later.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error("Error deleting inquiries:", error);
            toast.error('An error occurred while deleting inquiries. Please check your network and try again.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
        }
    }

    // console.log(buyingInquiryList)

    return (
        <div className="w-full   overflow-x-hidden">
            <div className="flex flex-col p-2">
                <div className=' mb-1'>
                    <h1 className="md:text-3xl text-xl font-semibold ">Do You Want To Delete Other Inquiries? <button className='ms-3 text-xs bg-gray-300 px-3 py-1 rounded-xl' onClick={handleBack}>skip</button></h1>
                    <p className='text-gray-400 text-xs mt-1'>Below Inquiries will expire Automatically from our system in 30 Days </p>
                </div>

                <ToastContainer />

                <hr className="mt-5 border-t-2 border-gray-200" />

                <div className='flex justify-between mt-6'>
                    <div className='flex gap-2'>
                        <input
                            type="checkbox"
                            checked={selectAllChecked}
                            onChange={handleSelectAllChange}
                            className='ms-4'
                        />
                        <p className='font-medium'>select all({checkedCount})</p>
                    </div>
                    <div className='flex items-center gap-2 bg-red-600 px-3 rounded-md py-1 pointer-cursor' onClick={() => setDeleteYes(true)}>
                        <FontAwesomeIcon icon={faTrash} className='text-white cursor-pointer' />
                        <p className='text-xs font-medium text-white cursor-pointer'>Cancel Inquiries({checkedCount})</p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-screen">
                    <table style={{ border: "none" }} className="table-auto w-full border-0 ">
                        <tbody>
                            {buyingInquiryList && buyingInquiryList.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr className={`flex py-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                                        <td className=" px-4 py-2 flex flex-col sm:justify-center justify-start font-semibold">
                                            <input
                                                type="checkbox"
                                                checked={checkboxesChecked[index]}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </td>
                                        <td className=" px-4 py-2 flex flex-col sm:justify-center justify-start font-semibold">
                                            {index + 1}
                                        </td>
                                        <td className=" ps-6 py-2 flex flex-col w-[250px]">
                                            <p className=' font-semibold text-[14px]'>{item.product.name_of_chemical}</p>
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">{item.product.CAS_number}</h2>
                                        </td>
                                        <td className="  py-2 flex flex-col w-[250px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Seller</h2>
                                            <p className='font-semibold text-[14px]'>{item.seller_company.company_name}</p>
                                        </td>
                                        <td className=" py-2 flex flex-col w-[130px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Amount</h2>
                                            <p className='font-semibold text-[14px] flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{item.min_price} - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                {item.max_price}</p>
                                        </td>
                                        <td className="  py-2 flex flex-col w-[170px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Status</h2>
                                            <p className='font-semibold text-[14px]'>{item.status}</p>
                                        </td>
                                        <td className="  py-2 flex flex-col w-[170px]">
                                            <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Payment Terms</h2>
                                            <p className='font-semibold text-[14px]'>{item.payment_terms}</p>
                                        </td>
                                        <td className="  py-2 flex flex-col w-[80px] justify-center items-center">
                                            <p className='font-semibold text-[14px]'><FontAwesomeIcon icon={faTrash} className='text-red-700 cursor-pointer' onClick={() => setDeleteYes(true)} /></p>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {isOpenPhoto && (
                        <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-30" onClick={() => setIsOpenPhoto(false)}>
                            <div className="relative transform overflow-hidden rounded-lg text-left transition-all max-w-md py-4">
                                <div className="py-3">
                                    <div className="">
                                        <img src={invoice1} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* delete modal  */}
                    {deleteYes && (
                        <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                        <div class="bg-white py-3">
                                            <div class="flex flex-col items-center">
                                                <img src={right} alt="" className='h-[80px]' />
                                                <h3 className='font-semibold text-2xl mt-4'>Are you sure you want to delete?</h3>
                                            </div>
                                        </div>
                                        <div class="bg-white mx-8 py-3">
                                            <button onClick={handleSubmit} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-3 text-xs font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                                            <button onClick={() => setDeleteYes(false)} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* close delete modal  */}

                    {/* successfull deleted message  */}
                    {successfull && (
                        <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75" onClick={() => setSuccessfull(false)}>
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
                                <div className="bg-white py-3 w-[400px]">
                                    <div className="flex flex-col items-center">
                                        <img src={right} alt="" className='h-[80px]' />
                                        <h3 className='font-semibold text-xl mt-4 text-center'>Inquiries Deleted Successfully</h3>
                                    </div>
                                </div>
                                <div className="bg-white mx-8 pb-3">
                                    <button onClick={() => setSuccessfull(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* end successfull deleted message  */}

                    {reason && (
                        <>
                            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                            <div class="bg-white pt-2">
                                                <p className='text-gray-600 font-semibold mb-2 px-5'>Give reason of cancelling?</p>
                                                <div className='bg-gray-100 px-5 py-5'>
                                                    <div>
                                                        <p className='text-xs font-medium text-gray-500'>Enter Your Prefix</p>
                                                        <input type="text" name="" id="" className='w-full py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none ps-5' />
                                                    </div>
                                                </div>
                                                <div class="bg-white pt-3 flex justify-end gap-3 px-5">
                                                    <button onClick={handleOfReason} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-xs font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                                                    <button onClick={cancelSubmit} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Submit</button>
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
                                            <button onClick={handleSuccessClose} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default POgenarate;
