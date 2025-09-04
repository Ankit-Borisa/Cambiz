import React, { useEffect, useState } from 'react';
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import loaderImage from "../images/loading.png"
import { BASE_URL } from '../BASE_URL';

const Terms = () => {

    const [loader, setLoader] = useState(false)
    const [title, setTitle] = useState("Add Terms & Conditions");

    const [formData, setFormData] = useState({
        values: '',
        terms_and_condition_title: '',
        design_for: '',
    });

    const [addresss, setAddresss] = useState([])
    const [standard, setStandard] = useState([])

    const [id, setId] = useState("")
    const [delteId, setDeleteId] = useState("")

    const fetchBillingAddress = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/teams_and_condition/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setAddresss(data.data);
    }

    const fetchStandardAddress = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/standard_terms_and_condition/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setStandard(data.data);
    }

    useEffect(() => {
        fetchBillingAddress();
        fetchStandardAddress();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleOpenModal = () => {
        setIsOpen(true)
        setTitle("Add New Terms & Conditoins");
        setFormData({
            values: '',
            terms_and_condition_title: '',
        })
    }

    const handleSubmit = async () => {

        const { values, terms_and_condition_title, design_for } = formData;

        if (!values.trim() && !terms_and_condition_title.trim() && !values) {
            toast.error('Please Fill All Fields!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!design_for.trim()) {
            toast.error('Please Select Terms Condition For!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!values.trim()) {
            toast.error('Please Enter Terms Condition !', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!terms_and_condition_title.trim()) {
            toast.error('Please Enter Terms & Condition!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        setLoader(true)

        if (title === "Edit Terms & Conditions") {
            try {
                const response = await axios.put(
                    `${BASE_URL}api/teams_and_condition/update/${id}`,
                    {
                        values: values,
                        terms_and_condition_title: terms_and_condition_title
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    setLoader(false)
                    fetchBillingAddress();
                    setIsOpen(false)
                    setTimeout(() => {
                        toast.success('Terms & Condition Edited Successfully!', {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 1000,
                        });
                    }, 1000);

                } else {

                }
            } catch (error) {
                console.error("Error adding category:", error.message);
            }
        } else {
            try {
                const response = await axios.post(
                    `${BASE_URL}api/teams_and_condition/insert`,
                    {
                        values: values,
                        terms_and_condition_title: terms_and_condition_title,
                        design_for: design_for,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    setLoader(false)
                    fetchBillingAddress();
                    setIsOpen(false)
                    setTimeout(() => {
                        toast.success('Terms & Condition Added Successfully!', {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 1000,
                        });
                    }, 1000);

                } else {

                }
            } catch (error) {
                console.error("Error adding category:", error.message);
            }
        }
    }

    const [isOpen, setIsOpen] = useState(false);

    const handleEdit = (e) => {
        setId(e._id)
        setTitle("Edit Terms & Conditions")
        setIsOpen(true);

        setFormData(prevData => ({
            ...prevData,
            terms_and_condition_title: e.terms_and_condition_title || '',
            values: e.values || '',
        }));
    }


    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const handleOpenDelteModal = (item) => {
        setIsOpenDelete(true)
        setDeleteId(item._id)
    };
    const handleDelete = () => {
        setLoader(true)
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        fetch(`${BASE_URL}api/teams_and_condition/delete/${delteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })
            .then(response => {
                fetchBillingAddress()
                setLoader(false)
                setIsOpenDelete(false)
                if (response.ok) {
                    toast.success('Terms & Condition Deleted Successfully!', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 1000,
                    });
                } else {
                    console.error('Error deleting address:', response.statusText);
                    toast.success(response.statusText, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 1000,
                    });
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            });
    };

    return (
        <div className="w-full overflow-x-hidden">
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className="md:text-3xl text-xl font-semibold mb-5">Terms & Conditions</h1>
                    <p className='mb-2'>Add your terms & conditions here</p>
                </div>
                <button onClick={handleOpenModal} className='bg-darkBlue md:flex items-center hidden text-white text-sm px-12 mb-3 rounded-[10px] h-[40px]'>Add New Terms & Condition</button>
                <button onClick={handleOpenModal} className="md:hidden bg-darkBlue flex items-center justify-center px-4 py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <hr />
            <ToastContainer />
            <div>
                <div className='mt-10'>

                    {addresss && addresss.length > 0 && (
                        <table style={{ border: "none" }} className="table-auto w-full border-0 mt-6">
                            <tbody>
                                {addresss && [...addresss].reverse().map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr className={`flex py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                                            <td className="px-2 py-2 flex flex-col sm:justify-center justify-start items-center font-semibold w-[5%]">
                                                {index + 1}
                                            </td>
                                            <td className="pe-6 py-2 flex flex-col justify-center gap-3 w-[10%]">
                                                <div>
                                                    <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Title</h2>
                                                    <p className='text-[15px] font-semibold'>{item.terms_and_condition_title}</p>
                                                </div>
                                            </td>
                                            <td className="pe-6 py-2 flex flex-col justify-center gap-3 w-[10%]">
                                                <div>
                                                    <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">For</h2>
                                                    <p className='text-[15px] font-semibold'>{item.design_for}</p>
                                                </div>
                                            </td>
                                            <td className="py-2 flex flex-col justify-center gap-3 w-[55%]">
                                                <div>
                                                    <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Terms & Conditions</h2>
                                                    <p className='text-[15px] font-semibold'>{item.values?.slice(0, 200)}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3 cursor-pointer" onClick={() => handleEdit(item)}>Edit <FontAwesomeIcon icon={faPencil} /> </td>
                                            <td className="px-4 py-2 flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3 cursor-pointer " onClick={() => handleOpenDelteModal(item)}>
                                                <button className='bg-red-500 text-white py-2 px-5 rounded-md text-sm'>DELETE</button>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {addresss.length < 1 && (
                        <table style={{ border: "none" }} className="table-auto w-full border-0 mt-6">
                            <tbody>
                                {standard && standard.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr className={`flex py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                                            <td className="pe-6 py-2 flex flex-col justify-center gap-3 w-[100%] ps-10">
                                                <div>
                                                    <h2 className="text-[#0A122A]/[.6] text-3xl font-semibold tracking-[2%] mb-5 text-center">Terms & Condition</h2>
                                                    <p className='text-[15px] font-semibold '>{item.details}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {isOpen && (
                        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                            <div className="fixed inset-0 z-10 flex items-center justify-center w-screen overflow-y-auto">
                                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                                    <div className="bg-white py-3 ps-5">
                                        <div className="sm:flex sm:items-start">
                                            <h3 className="font-medium text-xl">{title}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 px-4 py-5 sm:px-6">
                                        <div>
                                            <div className="mb-6">
                                                <div className="mb-5">
                                                    <div>
                                                        <p className="mb-1 text-sm font-medium">Terms & Condition For</p>
                                                        <select name="design_for" value={formData.design_for} onChange={handleChange} className="border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]">
                                                            <option value="">Select</option>
                                                            <option value="PO">PO</option>
                                                            <option value="Invoice">Invoice</option>
                                                            <option value="Credit Note">Credit Note</option>
                                                            <option value="Debit Note">Debit Note</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mb-5">
                                                    <div>
                                                        <p className="mb-1 text-sm font-medium">Title</p>
                                                        <input name="terms_and_condition_title" value={formData.terms_and_condition_title} onChange={handleChange} type="text" className="border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-sm font-medium">Terms & Condition</p>
                                                    <textarea name="values" value={formData.values} onChange={handleChange} className="border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2] h-[84%]"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white flex justify-end mx-8 py-3">
                                        {/* Cancel Button */}
                                        <button
                                            type="button"
                                            className="inline-flex w-full sm:w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            onClick={() => setIsOpen(false)}
                                            aria-label="Cancel"
                                        >
                                            Cancel
                                        </button>

                                        {/* Conditional Submit Button with Loader */}
                                        {loader ? (
                                            <button
                                                type="button"
                                                className="inline-flex w-full sm:w-auto justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm ml-4"
                                                aria-label="Loading"
                                                disabled
                                            >
                                                <img src={loaderImage} alt="Loading" className="h-[20px] animate-spin" />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="inline-flex w-full sm:w-auto justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm ml-4"
                                                onClick={handleSubmit}
                                                aria-label="Submit"
                                            >
                                                Submit
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}


                    {isOpenDelete && (
                        <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div class="bg-white py-3 pt-10">
                                            <div class="">
                                                <h3 className='font-medium text-xl text-center'>Are You Sure Want To Delete?</h3>
                                            </div>
                                        </div>
                                        <div class="bg-white flex justify-center gap-3 mx-8 pt-3 pb-8">
                                            <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => setIsOpenDelete(false)}>No</button>

                                            {loader ? (
                                                <>
                                                    <button type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-5 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4">
                                                        <img src={loaderImage} alt="" className='h-[20px] animate-spin' />
                                                    </button>
                                                </>
                                            ) : (
                                                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm bg-[#0A122A] sm:mt-0 sm:w-auto" onClick={handleDelete}>Yes</button>
                                            )}

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

export default Terms