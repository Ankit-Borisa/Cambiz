import React, { useEffect, useState } from 'react';
import { faL, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import invoice1 from "../images/invoice1.jpg"
import invoice2 from "../images/Invoice2.jpg"
import invoice3 from "../images/Invoice3.jpg"
import right from "../images/right.png"
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// toaster 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

const PoDesigns = () => {

    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedImageIndex2, setSelectedImageIndex2] = useState(null);
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [loopDesign, setLoopDesign] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedPo, setSelectedPo] = useState(false)

    const closeModal = () => {
        setIsOpen1(false);
    }


    const handleSelectPreview = () => {
        setIsOpen1(true);
    }

    const [previewImage, setPreviewImage] = useState("")

    const handlePreview = (index, e) => {
        setSelectedImageIndex(index);
        setPreviewImage(e)
        setIsOpen(true);
    }

    const handlePreviewInvoice = (index, e) => {
        setSelectedImageIndex2(index);
        setPreviewImage(e)
        setIsOpen(true);
    }

    const [userDesigns, setUserDesigns] = useState("")
    const [designs, setDesigns] = useState([])

    const fetchDesigns = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/design/displayByCompany`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setDesigns(data?.data)
    }

    const fetchUserSelectedDesigns = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/myDesign/displayDetails`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json();
        // console.log(data)
        setUserDesigns(data?.data?.[0])
    }

    useEffect(() => {
        fetchUserSelectedDesigns();
        fetchDesigns();
    }, []);

    const fetchDesignData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/design/displayByCompany`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setLoopDesign(data.data)
    }

    const selectedDesign = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/myDesign/displayList`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setSelected(data.data)
    }

    useEffect(() => {
        fetchDesignData();
        selectedDesign();
    }, []);

    const [selectedPoId, setSelectedPoId] = useState("");
    const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
    const [selectedCreditId, setSelectedCreditId] = useState("");
    const [selectedDebitId, setSelectedDebitId] = useState("");
    const [designPoId, setDesignPoId] = useState("");
    const [designInvoiceId, setDesignInvoiceId] = useState("");
    const [designCreditId, setDesignCreditId] = useState("");
    const [designDebitId, setDesignDebitId] = useState("");

    useEffect(() => {
        selected.forEach(item => {
            if (item.design_for === "po") {
                setDesignPoId(item._id);
            }
            if (item.design_for === "invoice") {
                setDesignInvoiceId(item._id);
            }
            if (item.design_for === "credit note") {
                setDesignCreditId(item._id);
            }
            if (item.design_for === "debit note") {
                setDesignDebitId(item._id);
            }
        });
    }, [selected]);



    const [po, setPo] = useState("")
    const [invoice, setInvoice] = useState("")
    // console.log(invoice)
    // console.log(po)

    const handleSelect = (e) => {
        handleSeletePO(e)
    }

    const handleSeletePO = (e) => {
        setPo(e.design_title)
    }

    const handleSelectInvoice = (e) => {
        handleSeleteInvoice(e)
    }

    const handleSeleteInvoice = (e) => {
        setInvoice(e.design_title)
    }

    const handleSelectedNull = () => {
        setSelectedPoId("")
        setSelectedInvoiceId("")
        setSelectedCreditId("")
        setSelectedDebitId("")
        closeModal()
    }

    const handleYes = async () => {
        setIsOpen1(false);
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

        try {
            // Create the request body dynamically
            const requestBody = {
                "credit_design": "design1",
                "debit_design": "design1",
            };

            if (po) {
                requestBody.po_design = po;
            }

            if (invoice) {
                requestBody.invoice_design = invoice;
            }

            const response = await axios.put(
                `${BASE_URL}api/myDesign/update/${userDesigns?._id}`,
                requestBody,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Designs Updated Successfully', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            } else {
                toast.error('Failed to update designs', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            console.error("Error updating design:", error.message);
            toast.error('Error updating design', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }
    };

    const poFunction = (designTitle) => {
        return designTitle === userDesigns?.po_design;
    };

    const invoiceFunction = (designTitle) => {
        return designTitle === userDesigns?.invoice_design;
    };


    return (
        <div className="w-full    overflow-x-hidden">
            <div className="flex flex-col p-2">
                <div className='flex justify-between'>
                    <div>
                        <h1 className="md:text-2xl text-xl font-semibold mb-1">Designs</h1>
                        <p className='text-gray-500 text-sm mb-3'>Select / Preview  Designs</p>
                    </div>
                    <div>
                        <button onClick={handleYes} className='mt-3 inline-flex w-full justify-center rounded-lg bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]'>Save Changes</button>
                    </div>
                </div>

                <ToastContainer />

                {/*------------------------- modal 1 --------------------------------*/}
                {isOpen1 && (
                    <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75" >
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
                            <div className="bg-white py-3">
                                <div className="flex flex-col items-center">
                                    <img src={right} alt="" className='h-[80px]' />
                                    <h3 className='font-semibold text-xl mt-4 text-center'>Are you sure you want to accept this template as your PO/Invoice?</h3>
                                </div>
                            </div>
                            <div className="bg-white mx-8 py-3">
                                <button onClick={() => { setIsOpen1(false) }} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                                <button onClick={handleSelectedNull} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                            </div>
                        </div>
                    </div>
                )}

                {/*------------------------- end modal 1 --------------------------------*/}

                {/*------------------------- modal 2 --------------------------------*/}
                {isOpen && (
                    <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-30" onClick={() => setIsOpen(false)}>
                        <div className="relative transform overflow-hidden rounded-lg text-left transition-all max-w-md py-4">
                            <div className="py-3">
                                {/* <div className='flex justify-center gap-2 mb-2'>
                                    <button onClick={() => setIsOpen(false)} className='bg-darkBlue text-white px-4 py-1 rounded-[20px]'>Download</button>
                                    <button onClick={handleSelectPreview} className='bg-darkBlue text-white px-5 py-1 rounded-[20px]'>Select</button>
                                </div> */}
                                <div className="">
                                    <img src={previewImage} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/*------------------------- end modal 2 --------------------------------*/}

                <hr />

                {/* <div className="flex gap-3 items-center relative">
                    <FontAwesomeIcon icon={faSearch} className="absolute top-3 left-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-gray-200 w-[100%] text-gray-800 pl-10 py-2 outline-none rounded-md"
                    />
                </div> */}

                {/* Table */}
                <div className='mt-7'>
                    <div>
                        <h3 className='text-xl font-semibold'>PO Designs</h3>
                    </div>
                    <div className='grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr] mt-3 gap-10'>
                        {designs && designs.map((item, index) => {
                            return (
                                <div key={index} className='relative' onMouseEnter={() => setSelectedImageIndex(index)} onMouseLeave={() => setSelectedImageIndex(null)}>
                                    <div className='relative h-full w-full'>
                                        <img src={item.design_photo} alt="" className='shadow-md' />
                                        <p className='mt-2 text-center'>{item?.design_title}</p>
                                        {poFunction(item.design_title) && po === "" && (
                                            <FontAwesomeIcon icon={faCheck} className='text-lg absolute bottom-[9%] bg-green-600 px-[5px] py-1 text-white rounded-[15px]' />
                                        )}
                                        {po !== "" && po === item?.design_title && (
                                            <FontAwesomeIcon icon={faCheck} className='text-lg absolute bottom-[9%] bg-green-600 px-[5px] py-1 text-white rounded-[15px]' />
                                        )}
                                    </div>
                                    <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${selectedImageIndex === index ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ease-in-out`}>
                                        <div className='text-white'>
                                            <p className='cursor-pointer text-center font-medium' onClick={() => handlePreview(index, item.design_photo)}>preview</p>
                                            <p className='bg-darkBlue cursor-pointer text-center mt-2 px-5 py-1 rounded-[20px]' onClick={() => { handleSelect(item) }}>select</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className='mt-10'>
                    <div>
                        <h3 className='text-xl font-semibold mb-4'>Invoice Designs</h3>
                    </div>
                    <div className='grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr] mt-3 gap-10'>
                        {designs && designs.map((item, index) => {
                            return (
                                <div key={index} className='relative' onMouseEnter={() => setSelectedImageIndex2(index)} onMouseLeave={() => setSelectedImageIndex2(null)}>
                                    <div className='relative h-full w-full'>
                                        <img src={item.design_photo} alt="" className='shadow-md' />
                                        <p className='mt-2 text-center'>{item?.design_title}</p>
                                        {invoiceFunction(item.design_title) && invoice === "" && (
                                            <FontAwesomeIcon icon={faCheck} className='text-lg absolute bottom-[9%] bg-green-600 px-[5px] py-1 text-white rounded-[15px]' />
                                        )}
                                        {invoice !== "" && invoice === item?.design_title && (
                                            <FontAwesomeIcon icon={faCheck} className='text-lg absolute bottom-[9%] bg-green-600 px-[5px] py-1 text-white rounded-[15px]' />
                                        )}
                                    </div>
                                    <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 ${selectedImageIndex2 === index ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ease-in-out`}>
                                        <div className='text-white'>
                                            <p className='cursor-pointer text-center font-medium' onClick={() => handlePreviewInvoice(index, item.design_photo)}>preview</p>
                                            <p className='bg-darkBlue cursor-pointer text-center mt-2 px-5 py-1 rounded-[20px]' onClick={() => { handleSelectInvoice(item) }}>select</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* <div className='mt-10'>
                    <div>
                        <h3 className='text-xl font-semibold mb-4'>Credit Note Designs</h3>
                    </div>
                </div>
                <div className='mt-10'>
                    <div>
                        <h3 className='text-xl font-semibold mb-4'>Debit Not Designs</h3>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default PoDesigns;
