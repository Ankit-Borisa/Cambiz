import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { faL, faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import countries from "../pages/CountryStateCity.json"
import { BASE_URL } from '../BASE_URL';

const BillingAddress = ({ isOpen, toggleBillingAddressModal }) => {


    const [title, setTitle] = useState("Add Address");

    const [formData, setFormData] = useState({
        address: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        address_type: '',
    });

    const [addresss, setAddresss] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [id, setId] = useState("")
    const [delteId, setDeleteId] = useState("")

    const fetchBillingAddress = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/company_address/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setAddresss(data.data);
    }

    useEffect(() => {
        fetchBillingAddress();
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;

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

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === "pincode" && value.length === 6) {
            await fetchFetailsFromPincodeShipped(value);
        }

        if (name === "pincode" && value.length !== 6) {
            setFormData((prevData) => ({
                ...prevData,
                bill_to_country: "",
                bill_to_state: "",
                bill_to_city: "",
            }));
        }

    };

    const fetchFetailsFromPincodeShipped = async (pincode) => {
        try {
            const res = await fetch(`https://api.chembizz.in/api/public/getPincodeDetails/${pincode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await res.json();
            // console.log(response[0]?.PostOffice[0]);
            const data = response[0]?.PostOffice[0]

            if (data) {
                // console.log(data); // Log the fetched data for verification

                // Extract country, state, and city from the API response
                const countryName = data.Country;
                const stateName = data.State;
                const cityName = data.District;

                // Find the corresponding country object
                const selectedCountry = countries.find((country) => country.name === countryName);
                const countryStates = selectedCountry?.states || [];

                // Find the corresponding state object
                const selectedState = countryStates.find((state) => state.name === stateName);
                const stateCities = selectedState?.cities || [];

                // Update form data and states
                setStates(countryStates);
                setCities(stateCities);

                setFormData((prevData) => ({
                    ...prevData,
                    country: countryName,
                    state: stateName,
                    city: cityName,
                    pincode: pincode,
                }));
            } else {
                console.error("No PostOffice data found for the provided pincode.");
            }

        } catch (error) {
            console.error("Error fetching pincode details:", error);
        }
    };

    const handleSubmit = async () => {

        const { address, country, state, city, pincode, address_type } = formData;

        if (!address.trim() && !address_type && !country.trim() && !state.trim() && !city.trim() && !pincode.trim()) {
            toast.error('Please Fill All Fields!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!address.trim()) {
            toast.error('Please Enter Address!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!address_type) {
            toast.error('Please Select Address Type!', {
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
        if (!pincode) {
            toast.error('Please Enter Pincode!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (pincode.length < 6) {
            toast.error('Please Enter Valid Pincode!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        if (title === "Edit Address") {
            try {
                const response = await axios.put(
                    `${BASE_URL}api/company_address/update/${id}`,
                    {
                        address_type: address_type,
                        address_details: address,
                        country: country,
                        state: state,
                        city: city,
                        pincode: pincode
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    fetchBillingAddress();
                    closeModal()
                    setTimeout(() => {
                        toast.success('Address Updated Successfully!', {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 1000,
                        });
                    }, 1000);

                } else {

                }
            } catch (error) {
                console.error("Error adding category:", error.message);
                toast.error(error.response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } else {
            try {
                const response = await axios.post(
                    `${BASE_URL}api/company_address/insert`,
                    {
                        address_type: address_type,
                        address_details: address,
                        country: country,
                        state: state,
                        city: city,
                        pincode: pincode
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    fetchBillingAddress();
                    closeModal()
                    setTimeout(() => {
                        toast.success('Address Added Successfully!', {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 1000,
                        });
                    }, 1000);

                } else {

                }
            } catch (error) {
                toast.error(error.response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
                console.error("Error adding category:", error.message);
            }
        }
    }


    const handleEdit = (e) => {
        setId(e._id)
        setTitle("Edit Address")
        toggleBillingAddressModal(true);

        setFormData(prevData => ({
            ...prevData,
            address_type: e.address_type || '',
            address: e.address_details || '',
            country: e.country || '',
            pincode: e.pincode || '',
            state: e.state || prevData.state, // Preserve previous state if not provided in e
            city: e.city || prevData.city, // Preserve previous city if not provided in e
        }));

        const selectedCountry = countries.find(country => country.name === e.country);
        setStates(selectedCountry.states);

        if (selectedCountry && selectedCountry.states.length > 1) {
            const selectedState = selectedCountry.states.find(state => state.name === e.state);
            setFormData(prevData => ({
                ...prevData,
                state: e.state || '', // Preserve previous state if not provided in e
            }));
            setCities(selectedState ? selectedState.cities : []);
        }

        if (selectedCountry && selectedCountry.states.length <= 1) {
            setFormData(prevData => ({
                ...prevData,
                city: e.city || '', // Preserve previous city if not provided in e
            }));
        }
    }


    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const handleOpenDelteModal = (item) => {
        setIsOpenDelete(true)
        setDeleteId(item._id)
    };
    const handleDelete = () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        fetch(`${BASE_URL}api/company_address/delete/${delteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        })
            .then(response => {
                fetchBillingAddress()
                setIsOpenDelete(false)
                if (response.ok) {
                    toast.success('Address Deleted Successfully!', {
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

    const closeModal = () => {
        setFormData({
            address: '',
            country: '',
            state: '',
            city: '',
            pincode: '',
            address_type: '',
        });
        toggleBillingAddressModal(false);
    }


    return (
        <div className='my-4 sm:my-10 relative'>
            <ToastContainer />
            <div className='overflow-x-auto'>
                <table style={{ border: "none" }} className="table-auto w-full border-0 mt-2 sm:mt-6">
                    <tbody>
                        {addresss && addresss.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr className={`flex py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                                    <td className="px-2 py-2 flex flex-col sm:justify-center justify-start items-center font-semibold w-[50px]">
                                        {index + 1}
                                    </td>
                                    <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Address</h2>
                                            <p className='text-[15px] font-semibold sm:w-[200px] w-[120px]'>{item.address_details}</p>
                                        </div>
                                    </td>
                                    <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Address Type</h2>
                                            <p className='text-[15px] font-semibold sm:w-[140px] w-[120px]'>{item.address_type}</p>
                                        </div>
                                    </td>
                                    <td className="py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Country</h2>
                                            <p className='text-[15px] font-semibold sm:w-[140px] w-[120px]'>{item.country}</p>
                                        </div>
                                    </td>
                                    <td className=" py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">State</h2>
                                            <p className='text-[15px] font-semibold sm:w-[140px] w-[120px]'>{item.state}</p>
                                        </div>
                                    </td>
                                    <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                                        <div>
                                            <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">City</h2>
                                            <p className='text-[15px] font-semibold sm:w-[140px] w-[120px]'>{item.city}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3 cursor-pointer" onClick={() => handleEdit(item)}>Edit <FontAwesomeIcon icon={faPencil} /> </td>
                                    <td className="px-4 py-2 w-[200px] flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3 cursor-pointer " onClick={() => handleOpenDelteModal(item)}>
                                        <button className='bg-red-500 text-white py-2 px-5 rounded-md sm:text-sm text-xs'>DELETE</button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {isOpen && (
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
                                        <div className='grid grid-cols-[1fr,1fr,1fr] gap-4'>
                                            <div>
                                                <p className='mb-1 text-sm font-medium'>Address Type</p>
                                                <select name='address_type' value={formData.address_type} onChange={handleChange} id="country" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]'>
                                                    <option value="">Address Type</option>
                                                    <option value="Company Office">Company Office</option>
                                                    <option value="Warehouse">Warehouse</option>
                                                    <option value="Manufacturing Site">Manufacturing Site</option>
                                                    <option value="Others">Others</option>
                                                </select>
                                            </div>
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
                                            <div>
                                                <p className='mb-1 text-sm font-medium'>Address</p>
                                                <textarea name="address" value={formData.address} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]'></textarea>
                                            </div>
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
                                                <input name="pincode" value={formData.pincode} onChange={handleChange} onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={6} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                            </div>
                                        </div>
                                        {/* <div className='grid grid-cols-[1fr,2.17fr] gap-4 mb-6'>
                                            <div>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Address Type</p>
                                                    <select name='address_type' value={formData.address_type} onChange={handleChange} id="country" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]'>
                                                        <option value="">Address Type</option>
                                                        <option value="Office">Office</option>
                                                        <option value="Godown">Godown</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Address</p>
                                                    <textarea name="address" value={formData.address} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]'></textarea>
                                                </div>
                                            </div>
                                            <div className=''>
                                                <div className='grid grid-cols-[1fr,1fr] gap-4 mb-6  '>
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
                                                <div className='grid grid-cols-[1fr,1fr] gap-4'>
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
                                                        <input name="pincode" value={formData.pincode} onChange={handleChange} onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={6} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                    </div>
                                                </div>

                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                                <div class="bg-white flex justify-end mx-8 py-3">
                                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={closeModal}>Cancel</button>
                                    <button type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4" onClick={handleSubmit}>Submit</button>
                                </div>
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
                                <div class="bg-white flex justify-center mx-8 pt-3 pb-8">
                                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-7 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => setIsOpenDelete(false)}>No</button>
                                    <button type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-7 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4" onClick={handleDelete}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BillingAddress
