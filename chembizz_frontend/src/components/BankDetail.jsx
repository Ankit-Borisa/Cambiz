import React, { useEffect, useState } from 'react'

import { faL, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import right from "../images/right.png"
import cancelCheck from "../images/cancel-check.webp"

import countries from "../pages/CountryStateCity.json"
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';
import loader from "../images/loading.png"

const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
};

const extractPincode = (address) => {
    const match = address.match(/\b\d{6}\b/);
    return match ? match[0] : '';
};

const BankDetail = ({ isOpen1, toggleBillingAddressModal1 }) => {

    const [what, setWhat] = useState("Added")
    const [bank, setBank] = useState("");

    const fetchBankData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/bank_details/getall`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setBank(data.bank_details);
    }

    useEffect(() => {
        fetchBankData();
    }, []);

    const [formData, setFormData] = useState({
        bank_name: '',
        IFSC_code: '',
        account_number: '',
        branch_address: '',
        country: '',
        state: '',
        city: '',
        pinCode: '',
        cancel_cheque_photo: []
    });

    const [preview, setPreviewPhoto] = useState("")

    const [selectedPhoto, setSelectedPhoto] = useState([])

    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const [selectedUrl, setSelectedUrl] = useState("")
    // console.log(selectedUrl)
    // console.log(selectedPhoto)

    const handleChange = async (e) => {
        const { name, value, type, files } = e.target;

        if (name === 'cancel_cheque_photo') {
            setSelectedPhoto(files[0])
            setPreviewPhoto(URL.createObjectURL(files[0]));
        }

        if (name === 'country') {
            const selectedCountry = countries.find(country => country.name === value);
            setStates(selectedCountry.states);
            setFormData(prevState => ({
                ...prevState,
                [name]: selectedCountry.name,
                state: '',
                city: ''
            }));
        }

        if (name === 'state') {
            const selectedState = states.find(state => state.name === value);
            setCities(selectedState.cities)
            setFormData(prevState => ({
                ...prevState,
                [name]: selectedState.name,
                city: ''
            }));
        }

        if (name === 'IFSC_code') {
            const ifscPattern = /^[A-Za-z]{4}\d{7}$/;
            if (!ifscPattern.test(value)) {
                setFormData(prevState => ({
                    ...prevState,
                    country: "",
                    state: "",
                    city: "",
                    pinnCode: "",
                }));
            } else {

                try {
                    const response = await fetch(`https://ifsc.razorpay.com/${value}`);
                    if (!response.ok) {
                        throw new Error('Invalid IFSC code or server error');
                    }
                    const data = await response.json();

                    // console.log(data)

                    const selectedCountry = countries.find(country => country.name === "India");
                    const selectedState = selectedCountry.states.find(state => state.name === toTitleCase(data.STATE));
                    setStates(selectedCountry?.states);
                    setCities(selectedState?.cities);

                    setFormData(prevState => ({
                        ...prevState,
                        branch_address: data.ADDRESS,
                        bank_name: data.BANK,
                        country: "India",
                        state: toTitleCase(data.STATE),
                        city: toTitleCase(data.CITY),
                        pinCode: extractPincode(data.ADDRESS),
                    }));


                } catch (err) {
                    console.log(err);
                }
            }
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [title, setTitle] = useState("Add Bank Details");
    const [successGenratePo, setSuccessGenratePo] = useState(false);
    // console.log(title)

    const successGeneratePOclose = () => {
        setSuccessGenratePo(false)
    }

    const successClose = () => {
        setSuccessGenratePo(false)
    }

    const [bankId, setBankId] = useState("")

    const handleSubmit1111 = async () => {

        const IFSCRegex = /^[A-Za-z]{4}[0][\d]{6}$/;

        const { bank_name, IFSC_code, account_number, branch_address, country, state, city, pinCode, cancel_cheque_photo, } = formData;

        if (!bank_name.trim() && !IFSC_code.trim() && !account_number.trim() && !branch_address.trim() && !country.trim() && !state.trim() && !city.trim() && !pinCode.trim() && selectedPhoto.length < 1) {
            toast.error('Please Fill All Fields!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!bank_name.trim()) {
            toast.error('Please Enter Bank Name!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!IFSC_code.trim()) {
            toast.error('Please Enter IFSC Code!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!IFSCRegex.test(IFSC_code)) {
            toast.error('Please Enter Valid IFSC Code!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!account_number.trim()) {
            toast.error('Please Enter Account Number!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if(account_number.trim().length<9 || account_number.trim().length>18){
            toast.error('Account number must be between 9-18 digits!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }


        // if (account_number.trim().length < 1) {
        //     toast.error('Account number must have at least 12 digits!', {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 2000,
        //     });
        //     return;
        // }
        if (!branch_address.trim()) {
            toast.error('Please Enter Branch Address!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!country.trim()) {
            toast.error('Please Select Country!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!state.trim()) {
            toast.error('Please Select State!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!city.trim()) {
            toast.error('Please Select City!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!pinCode) {
            toast.error('Please Enter Pincode!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (pinCode.length < 6) {
            toast.error('Please Enter Valid Pincode!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (title === "Edit Bank Detail" && !bankId) {
            toast.error('Bank Id Missing!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (title != "Edit Bank Detail" && selectedPhoto.length < 1) {
            toast.error('Please Enter Check Photo!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        const formDataToSend = new FormData();

        // Append form data
        formDataToSend.append('account_number', account_number);
        formDataToSend.append('branch_address', branch_address);
        formDataToSend.append('IFSC_code', IFSC_code);
        formDataToSend.append('country', country);
        formDataToSend.append('state', state);
        formDataToSend.append('city', city);
        formDataToSend.append('pinCode', pinCode);
        formDataToSend.append('bank_name', bank_name);
        formDataToSend.append('status', "active");

        // if (title === "Edit Bank Detail") {
        //     formDataToSend.append('cancel_cheque_photo', cancel_cheque_photo);
        // } else {
        //     formDataToSend.append('cancel_cheque_photo', selectedPhoto);
        // }

        formDataToSend.append('cancel_cheque_photo', selectedPhoto);


        const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        if (title === "Edit Bank Detail") {
            try {
                const response = await axios.put(
                    `${BASE_URL}api/bank_details/edit/${bankId}`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    setTimeout(() => {
                        toggleBillingAddressModal1(false)
                        setSuccessGenratePo(true)
                    }, 1000);
                    setFormData({
                        bank_name: '',
                        IFSC_code: '',
                        account_number: '',
                        branch_address: '',
                        country: '',
                        state: '',
                        city: '',
                        pinCode: '',
                        cancel_cheque_photo: []
                    })
                    fetchBankData();
                    setTitle("Add Bank Details");
                    setWhat("Updated");

                } else {
                }
            } catch (error) {
                setTitle("Add Bank Details");
                toast.error(error.response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
                toggleBillingAddressModal1(false)
                setFormData({
                    bank_name: '',
                    IFSC_code: '',
                    account_number: '',
                    branch_address: '',
                    country: '',
                    state: '',
                    city: '',
                    pinCode: '',
                    cancel_cheque_photo: []
                })

            }
        } else {
            try {
                const response = await axios.post(
                    `${BASE_URL}api/bank_details/add`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    setTimeout(() => {
                        toggleBillingAddressModal1(false)
                        setSuccessGenratePo(true)
                    }, 1000);
                    setFormData({
                        bank_name: '',
                        IFSC_code: '',
                        account_number: '',
                        branch_address: '',
                        country: '',
                        state: '',
                        city: '',
                        pinCode: '',
                        cancel_cheque_photo: []
                    })
                    fetchBankData();

                } else {
                }
            } catch (error) {
                toast.error(error.response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
                toggleBillingAddressModal1(false)
                setFormData({
                    bank_name: '',
                    IFSC_code: '',
                    account_number: '',
                    branch_address: '',
                    country: '',
                    state: '',
                    city: '',
                    pinCode: '',
                    cancel_cheque_photo: []
                })
                setWhat("Added");
            }
        }
    }

    const [cancelCheckPhoto, setCancelChackPhoto] = useState('')

    const handleEdit = (index, item) => {
        // console.log(item)
        setSelectedUrl(item?.cancel_cheque_photo)
        toggleBillingAddressModal1(true);
        const selectedData = item;
        setBankId(selectedData._id)
        setFormData({
            bank_name: selectedData.bank_name || '',
            IFSC_code: selectedData.IFSC_code || '',
            account_number: selectedData.account_number || '',
            branch_address: selectedData.branch_address || '',
            country: selectedData.country || '',
            pinCode: selectedData.pinCode || '',
            cancel_cheque_photo: selectedData.cancel_cheque_photo || '',
        });

        const selectedCountry = countries.find(country => country.name === item.country);
        setStates(selectedCountry ? selectedCountry.states : []);

        if (selectedCountry && selectedCountry.states.length > 1) {
            const selectedState = selectedCountry.states.find(state => state.name === item.state);
            setFormData(prevData => ({
                ...prevData,
                state: selectedState ? selectedState.name : '',
            }));
            setCities(selectedState ? selectedState.cities : []);
        } else {
            setFormData(prevData => ({
                ...prevData,
                state: item.state || '',
            }));
        }

        if (selectedCountry || selectedCountry.states.length > 1) {
            setFormData(prevData => ({
                ...prevData,
                city: item.city || '',
            }));
        }
        setTitle("Edit Bank Detail");
    }

    const handleCancel = () => {
        toggleBillingAddressModal1(false)
        setFormData({
            bank_name: '',
            IFSC_code: '',
            account_number: '',
            branch_address: '',
            country: '',
            state: '',
            city: '',
            pinCode: '',
            cancel_cheque_photo: []
        })
    }

    const [imageTrue, setImageTrue] = useState(false)
    const [updateBanks, setUpdateBanks] = useState(false)
    const [selectedId, setSelectedId] = useState("")
    const [loading, setLoading] = useState(false)

    const handleUpdateBank = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        setLoading(true)

        try {
            const response = await fetch(`${BASE_URL}api/bank_details/updateBankPriority/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
            });

            if (response.ok) {
                const data = await response.json();
                fetchBankData()
                toast.success('Bank priority updated successfully!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
                setLoading(false)
                setUpdateBanks(false)

            } else {
                fetchBankData()
                const errorData = await response.json();
                setLoading(false)
                setUpdateBanks(false)
                toast.error('Error updating bank priority!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            fetchBankData()
            setLoading(false)
            setUpdateBanks(false)
            console.error("Error updating bank priority", error);
            toast.error('Error updating bank priority!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }
    };

    return (
        <div className='mt-2 relative'>
            <ToastContainer />

            {imageTrue && (
                <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50" onClick={() => setImageTrue(false)}>
                    <div className="relative transform overflow-hidden rounded-lg text-left transition-all max-w-md py-4">
                        <div className="py-3">
                            <div className="">
                                <img src={cancelCheckPhoto} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className='overflow-x-auto'>
                <table style={{ border: "none" }} className="table-auto w-full border-0 mt-6">
                    <tbody>
                        {bank && bank.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr className={`flex py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                                    <td className="px-2 py-2 flex flex-col sm:justify-center justify-start items-center font-semibold w-[40px]">
                                        {index + 1}
                                    </td>
                                    <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Bank Name</h2>
                                            <p className='text-[15px] font-semibold sm:w-[150px] w-[120px]'>{item.bank_name}</p>
                                        </div>
                                    </td>
                                    <td className="py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">IFSC Code</h2>
                                            <p className='text-[15px] font-semibold sm:w-[120px] w-[120px]'>{item.IFSC_code}</p>
                                        </div>
                                    </td>
                                    <td className=" py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Account Number</h2>
                                            <p className='text-[15px] font-semibold sm:w-[150px] w-[120px]'>{item.account_number}</p>
                                        </div>
                                    </td>
                                    <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Country</h2>
                                            <p className='text-[15px] font-semibold sm:w-[90px] w-[120px]'>{item.country}</p>
                                        </div>
                                    </td>
                                    <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">State</h2>
                                            <p className='text-[15px] font-semibold sm:w-[80px] w-[120px]'>{item.state}</p>
                                        </div>
                                    </td>
                                    <td className=" py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">City</h2>
                                            <p className='text-[15px] font-semibold sm:w-[120px] w-[120px]'>{item.city}</p>
                                        </div>
                                    </td>
                                    <td className=" py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Pincode</h2>
                                            <p className='text-[15px] font-semibold sm:w-[90px] w-[120px]'>{item.pinCode}</p>
                                        </div>
                                    </td>
                                    <td className=" py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Priority</h2>
                                            {item?.priority !== "primary" ? (
                                                <p className='text-[15px] font-semibold sm:w-[90px] w-[120px] cursor-pointer' onClick={() => (setUpdateBanks(true), setSelectedId(item._id))}>{item.priority}</p>
                                            ) : (
                                                <p className='text-[15px] font-semibold sm:w-[90px] w-[120px]'>{item.priority}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className=" py-2 flex flex-col justify-center text-center gap-3">
                                        <p className='text-blue-600 font-semibold underline w-[130px] sm:text-sm text-xs cursor-pointer' onClick={() => { setImageTrue(true), setCancelChackPhoto(item.cancel_cheque_photo) }}>View Bank Account Details</p>
                                    </td>
                                    <td className="px-4 py-2 flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3 cursor-pointer" onClick={() => handleEdit(index, item)}>
                                        Edit <FontAwesomeIcon icon={faPencil} />
                                    </td>
                                    {/* Conditionally render the Delete button only if there is more than one bank entry */}
                                    {bank.length > 1 && (
                                        <td className="px-4 py-2 flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3 cursor-pointer" onClick={() => handleDelete(index)}>
                                            Delete <FontAwesomeIcon icon={faTrashAlt} />
                                        </td>
                                    )}
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {updateBanks && (
                <>
                    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 bg-black bg-opacity-35 transition-opacity"></div>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                    <div className="bg-white py-4 px-5">
                                        <p className='font-semibold text-xl text-center mb-2 px-5'>Are you sure want to change bank priority?</p>
                                        {loading ? (
                                            <div className="flex justify-center">
                                                <div className="bg-darkBlue mt-3 py-2 px-5 w-[100px] flex justify-center items-center rounded-lg">
                                                    <img src={loader} alt="" className='animate-spin h-[25px]' />
                                                </div>
                                            </div>
                                        ) : (

                                            <div className="bg-white pt-3 flex justify-center gap-3 mt-3 px-5">
                                                <button onClick={() => setUpdateBanks(false)} type="button" className="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">No</button>
                                                <button
                                                    onClick={handleUpdateBank}
                                                    type="button"
                                                    className="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0"
                                                >
                                                    Yes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
            }


            {isOpen1 && (
                <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                                <div class="bg-white py-3 ps-5">
                                    <div class="sm:flex sm:items-start">
                                        <h3 className='font-medium text-xl'>{title}</h3>
                                    </div>
                                </div>
                                <div class="bg-gray-100 px-4 py-5 sm:px-6">
                                    <div>
                                        <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,1fr,1fr] gap-4 mb-6'>
                                            <div>
                                                <p className='mb-1 text-sm font-medium'>Account Number</p>
                                                {/* // here we need to change for backaccount  */}
                                                <input name="account_number" value={formData.account_number} onChange={handleChange}
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    // maxLength={12} 
                                                    type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                {formData.account_number.length > 0 &&
                                                    (formData.account_number.length < 9 ||
                                                        formData.account_number.length > 18) && (
                                                        <p className="text-red-600 text-xs mt-1">
                                                        Enter a 9-18 digit account number.
                                                        </p>
                                                    )}
                                            </div>
                                            
                                            <div>
                                                <p className='mb-1 text-sm font-medium'>IFSC Code</p>
                                                <input name="IFSC_code" value={formData.IFSC_code} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                            </div>
                                            <div>
                                                <p className='mb-1 text-sm font-medium'>Bank Name</p>
                                                <input name="bank_name" value={formData.bank_name} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr] md:grid-cols-[1fr,2.17fr] gap-4 mb-6'>
                                            <div>
                                                <p className='mb-1 text-sm font-medium'>Branch Address</p>
                                                <textarea name="branch_address" value={formData.branch_address} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2] h-[84%]'></textarea>
                                            </div>
                                            <div className=''>
                                                <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] gap-4 mb-6  '>
                                                    <div>
                                                        <p className='mb-1 text-sm font-medium'>Country</p>
                                                        <select name='country' value={formData.country} onChange={handleChange} id="country" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]'>
                                                            <option value="">Select Country</option>
                                                            {countries.map((country, index) => (
                                                                <option key={index} value={country.name}>{country.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <p className='mb-1 text-sm font-medium'>State</p>
                                                        <select name='state' value={formData.state} onChange={handleChange} id="country" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]'>
                                                            <option value="">Select State</option>
                                                            {states && states.map((state) => (
                                                                <option value={state.name}>{state.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] gap-4'>
                                                    <div>
                                                        <p className='mb-1 text-sm font-medium'>City</p>
                                                        <select name='city' onChange={handleChange} value={formData.city} id="country" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]'>
                                                            <option value="">Select City</option>
                                                            {cities && cities.map((city) => (
                                                                <option value={city.name}>{city.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <p className='mb-1 text-sm font-medium'>Pincode</p>
                                                        <input name="pinCode" value={formData.pinCode} onChange={handleChange} onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={6} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='grid grid-cols-[1fr] sm:grid-cols-[2fr,1fr,] gap-4 mb-6'>
                                            <div>
                                                <p className='m text-sm font-medium'>Bank Details Proof <span className='text-xs font-thin '>(ex. cancel cheque, passbook photo etc.)</span></p>
                                                <input name="cancel_cheque_photo" onChange={handleChange} accept="image/*" type="file" className='file:bg-black file:text-white file:rounded border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                                                <p className='text-xs font-thin mt-1'>(png, jpg or jpeg Only)</p>
                                                {formData?.cancel_cheque_photo?.length < 1 ? (
                                                    null
                                                ) : (
                                                    <a
                                                        href={title === "Edit Bank Detail" && selectedPhoto?.length === 0 ? selectedUrl : preview}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className='underline text-blue-800 text-sm cursor-pointer'
                                                    >
                                                        View Bank Account Details
                                                    </a>
                                                )}
                                                {/* {formData.cancel_cheque_photo.length < 1 ? (
                                                    null
                                                ) : (
                                                    <a
                                                        href={preview}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className='underline text-blue-800 text-sm cursor-pointer'
                                                    >
                                                        View Bank Account Details
                                                    </a>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white flex justify-end gap-3 mx-8 py-3">
                                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={handleCancel}>Cancel</button>
                                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-[#0A122A] sm:mt-0 sm:w-auto" onClick={handleSubmit1111}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {successGenratePo && (
                <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75" onClick={successClose}>
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
                        <div className="bg-white py-3 w-[400px]">
                            <div className="flex flex-col items-center">
                                <img src={right} alt="" className='h-[80px]' />
                                <h3 className='font-semibold text-xl mt-4 text-center'>Bank Detail {what} Successfully</h3>
                            </div>
                        </div>
                        <div className="bg-white mx-8 pb-3">
                            <button onClick={successGeneratePOclose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                        </div>
                    </div>
                </div>
            )}

            {/* <div onClick={() => toggleBillingAddressModal1(true)} className='absolute cursor-pointer bg-white h-[34px] w-[152px] top-[-24.5%] right-[0.03%] opacity-0 '>
                whySOserious
            </div> */}

        </div>
    )
}

export default BankDetail
