import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import countries from "../pages/CountryStateCity.json"
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';
import { ProfileUpdateContext } from '../context/ProfileUpdateContect';

const PersonalDetails = ({ isOpen2 }) => {

    const { updateProfile , setUpdateProfile } = useContext(ProfileUpdateContext);

    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const [formData, setFormData] = useState({
        contactPersonName: '',
        companyName: '',
        gstNo: '',
        mobileNo: '',
        landlineNo: '',
        email: '',
        address: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        modeOfBusiness: [],
    });

    const fetchUserData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}company/cominfo`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        const profile = data.companyDetails?.[0];

        setFormData({
            contactPersonName: profile?.contact_person_name || '',
            companyName: profile?.company_name || '',
            gstNo: profile?.gst || '',
            mobileNo: profile?.mobile_num || '',
            landlineNo: profile?.landline_num || '',
            email: profile?.emailid || '',
            address: profile?.address || '',
            pincode: profile?.pincode || '',
            modeOfBusiness: profile?.mode_of_business || [],
        });

        setFormData(prevState => ({
            ...prevState,
            country: profile?.country || ''
        }));

        if (profile?.country && countries.some(country => country.name === profile?.country)) {
            const selectedCountry = countries.find(country => country.name === profile?.country);
            setStates(selectedCountry.states);
            setFormData(prevState => ({
                ...prevState,
                state: profile?.state || ''
            }));
        }

        if (profile?.country && countries.some(country => country.name === profile?.country)) {
            const selectedCountry = countries.find(country => country.name === profile?.country);
            const selectedState = selectedCountry.states.find(state => state.name === profile?.state);
            setCities(selectedState.cities);
            setFormData(prevCity => ({
                ...prevCity,
                city: profile?.city || ''
            }));
        }
    }

    useEffect(() => {
        fetchUserData()
    }, []);

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (checked) {
                setFormData(prevState => ({
                    ...prevState,
                    modeOfBusiness: [...prevState.modeOfBusiness, value]
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    modeOfBusiness: prevState.modeOfBusiness.filter(item => item !== value)
                }));
            }
        } else {
            if (name === 'country') {
                const selectedCountry = countries.find(country => country.name === value);
                setStates(selectedCountry.states);
                setFormData(prevState => ({
                    ...prevState,
                    [name]: selectedCountry.name,
                    state: '',
                    city: ''
                }));
            } else if (name === 'state') {
                const selectedState = states.find(state => state.name === value);
                setCities(selectedState.cities);
                setFormData(prevState => ({
                    ...prevState,
                    [name]: selectedState.name,
                    city: ''
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value,
                }));
            }

            if (name === "pincode" && value.length === 6) {
                await fetchFetailsFromPincodeShipped(value);
            }

            if (name === "pincode" && value.length !== 6) {
                setFormData((prevData) => ({
                    ...prevData,
                    country: "",
                    state: "",
                    city: "",
                }));
            }
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

            const data = response[0]?.PostOffice[0]

            if (data) {

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

        setUpdateProfile(false)

        const { contactPersonName, companyName, modeOfBusiness, gstNo, mobileNo, landlineNo, email, address, country, state, city, pincode } = formData;

        const gstCheck = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!contactPersonName.trim() && !companyName.trim() && !gstNo.trim() && !mobileNo.trim() && !landlineNo.trim() && !email.trim() && !address.trim() && !country.trim() && !state.trim() && !city.trim() && !pincode.trim()) {
            toast.error('Please Fill All Fields!', {
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
        if (!companyName.trim()) {
            toast.error('Please Enter Company Name!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!gstNo.trim()) {
            toast.error('Please Enter GST Number!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!gstCheck.test(gstNo.trim())) {
            toast.error('Please Enter Valid GST Number!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!mobileNo) {
            toast.error('Please Enter Mobile Number!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (mobileNo.length < 10) {
            toast.error('Please Enter Valid Mobile Number!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (landlineNo && landlineNo.length < 10) {
            toast.error('Please Enter Valid Landline Number!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!email.trim()) {
            toast.error('Please Enter Email Address!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!emailRegex.test(email.trim())) {
            toast.error('Please Enter Valid Email Address!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (modeOfBusiness.length < 1 || !modeOfBusiness) {
            toast.error('Please Select Mode Of Business!', {
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
            toast.error('Please Select City!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }



        const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        try {
            const response = await axios.put(
                `${BASE_URL}company/edit`,
                {
                    company_name: companyName,
                    gst: gstNo,
                    contact_person_name: contactPersonName,
                    address: address,
                    mobile_num: mobileNo,
                    landline_num: landlineNo,
                    emailid: email,
                    mode_of_business: modeOfBusiness,
                    country: country,
                    state: state,
                    city: city,
                    pincode: pincode,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            toast.success('Profile Updated Successfully!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });

        } catch (error) {
            console.error("Error adding category:", error.response.data.message);
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }

    }

    useEffect(() => {
        if (updateProfile) {
            handleSubmit()
        }
    }, [updateProfile]);

    return (
        <div className='my-10 relative'>
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,1fr,1fr] gap-4 sm:gap-7 md:gap-16 mb-6'>
                <div>
                    <p className='mb-1 text-sm font-medium'>Contact Person Name</p>
                    <input name='contactPersonName' value={formData.contactPersonName} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
                <div>
                    <p className='mb-1 text-sm font-medium'>Company Name</p>
                    <input name='companyName' value={formData.companyName} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
                <div>
                    <p className='mb-1 text-sm font-medium'>GST No.</p>
                    <input name='gstNo' readOnly value={formData.gstNo} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
            </div>
            <ToastContainer />
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,1fr,1fr] gap-4 sm:gap-7 md:gap-16 mb-6'>
                <div>
                    <p className='mb-1 text-sm font-medium'>Mobile No.</p>
                    <input name='mobileNo' value={formData.mobileNo} onChange={handleChange} onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={10} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
                <div>
                    <p className='mb-1 text-sm font-medium'>Company Number</p>
                    <input name='landlineNo' value={formData.landlineNo} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
                <div>
                    <p className='mb-1 text-sm font-medium'>Email</p>
                    <input name='email' value={formData.email} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
            </div>
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,1fr,1fr] gap-4 sm:gap-7 md:gap-16 mb-6'>
                <div>
                    <p className='mb-2 text-sm font-medium'>Mode of Business</p>
                    <div className='flex justify-between'>
                        <div>
                            <input
                                type="checkbox"
                                name="manufacture"
                                id="manufacture"
                                value="manufacture"
                                className='me-2'
                                checked={formData?.modeOfBusiness?.includes('manufacture')}
                                onChange={handleChange}
                            />
                            <span>Manufacture</span>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                name="trader"
                                id="trader"
                                value="trader"
                                className='me-2'
                                checked={formData?.modeOfBusiness?.includes('trader')}
                                onChange={handleChange}
                            />
                            <span>Trader</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,2fr] gap-4 sm:gap-7 md:gap-16 mb-6'>
                <div>
                    <p className='mb-1 text-sm font-medium'>Address</p>
                    <textarea name='address' value={formData.address} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none h-[84%]'></textarea>
                </div>
                <div className=''>
                    <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] gap-4 sm:gap-16 mb-6  '>
                        <div>
                            <p className='mb-1 text-sm font-medium'>Country</p>
                            <select name='country' value={formData.country} onChange={handleChange} id="country" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none'>
                                <option value="">Select Country</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country.name}>{country.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className='mb-1 text-sm font-medium'>State</p>
                            <select name='state' onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' value={formData.state}>
                                <option value="">Select State</option>
                                {states && states.map((state, index) => (
                                    <option key={index} value={state.name}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] gap-4 sm:gap-16 mb-6'>
                        <div>
                            <p className='mb-1 text-sm font-medium'>City</p>
                            <select name='city' onChange={handleChange} value={formData.city} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none'>
                                <option value="">Select City</option>
                                {cities && cities.map((city, index) => (
                                    <option key={index} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className='mb-1 text-sm font-medium'>Pincode</p>
                            <input name='pincode' value={formData.pincode} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                maxLength={10} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PersonalDetails
