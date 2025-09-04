import axios from 'axios';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import lodear from "../images/loading.png"
import { BASE_URL } from '../BASE_URL';

const OtherDetails = forwardRef(({ returnValue, other }, ref) => {


    const [formData, setFormData] = useState({
        mobileNo: '',
        email: '',
        websiteUrl: '',
        instagramUrl: '',
        facebookUrl: '',
        twitterUrl: '',
        linkedInUrl: '',
        logo: '',
    });

    useEffect(() => {
        if (other) {
            setFormData({
                mobileNo: other.other_contactno || '',
                email: other.other_emailid || '',
                websiteUrl: other.website || '',
                instagramUrl: other.insta || '',
                facebookUrl: other.fb || '',
                twitterUrl: other.twitter || '',
                linkedInUrl: other.linkedin || '',
                logo: other.logo || '',
            });
        }
    }, [other]);


    const [selectedPhoto, setSelectedPhoto] = useState([])
    const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'logo') {
            const file = files[0];
            setSelectedPhoto(file);

            if (file) {
                // Generate a local preview URL for the selected image
                const previewUrl = URL.createObjectURL(file);
                setSelectedPhotoPreview(previewUrl);
            } else {
                // Clear preview if no file is selected
                setSelectedPhotoPreview(null);
            }
        }
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useImperativeHandle(ref, () => ({
        handleSubmit
    }));

    const handleSubmit = async () => {
        returnValue(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isValidURL = (url) => {
            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
            return urlRegex.test(url);
        };

        const { mobileNo, email, websiteUrl, instagramUrl, facebookUrl, twitterUrl, linkedInUrl } = formData;

        if (mobileNo && mobileNo.length < 10) {
            toast.error('Please Enter Valid Mobile Number!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            returnValue(false);
            return;
        }
        if (email && !emailRegex.test(email.trim())) {
            toast.error('Please Enter Valid Email Address!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            returnValue(false);
            return;
        }
        if (websiteUrl && !isValidURL(websiteUrl)) {
            toast.error('Please Enter Valid Website URL!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            returnValue(false);
            return;
        }
        if (instagramUrl && !isValidURL(instagramUrl)) {
            toast.error('Please Enter Valid Instagram URL!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            returnValue(false);
            return;
        }
        if (facebookUrl && !isValidURL(facebookUrl)) {
            toast.error('Please Enter Valid Facebook URL!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            returnValue(false);
            return;
        }
        if (twitterUrl && !isValidURL(twitterUrl)) {
            toast.error('Please Enter Valid Twitter URL!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            returnValue(false);
            return;
        }
        if (linkedInUrl && !isValidURL(linkedInUrl)) {
            toast.error('Please Enter Valid LinkedIn URL!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            returnValue(false);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('website', websiteUrl);
        formDataToSend.append('other_emailid', email);
        formDataToSend.append('other_contactno', mobileNo);
        formDataToSend.append('fb', facebookUrl);
        formDataToSend.append('insta', instagramUrl);
        formDataToSend.append('twitter', twitterUrl);
        formDataToSend.append('linkedin', linkedInUrl);
        formDataToSend.append('logo', selectedPhoto);

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

        try {
            const response = other
                ? await axios.put(
                    `${BASE_URL}api/companyotherinfo/updates/${other._id}`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: token,
                        }
                    }
                )
                : await axios.post(
                    `${BASE_URL}api/companyotherinfo/a`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: token,
                        }
                    }
                );

            returnValue(false);

            if (response.status === 200) {
                setTimeout(() => {
                    toast.success('Other Details Updated Successfully!', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 1000,
                    });
                }, 1000);
            } else {
                returnValue(false);
            }
        } catch (error) {
            returnValue(false);
            console.error("Error adding other details:", error.response);
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }
    }

    return (
        <div className='mt-10 '>
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,1fr,1fr] gap-4 sm:gap-7 md:gap-16 mb-6'>
                <div>
                    <p className='mb-1 text-sm font-medium'>Mobile No.</p>
                    <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={10} />
                </div>
                <div>
                    <p className='mb-1 text-sm font-medium'>Email</p>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
                <div>
                    <p className='mb-1 text-sm font-medium'>Website URL</p>
                    <input type="text" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
            </div>
            <ToastContainer />
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,1fr,1fr] gap-4 sm:gap-7 md:gap-16 mb-6'>
                <div>
                    <p className='mb-1 text-sm font-medium'>Instagram URL</p>
                    <input type="text" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
                <div>
                    <p className='mb-1 text-sm font-medium'>Facebook URL</p>
                    <input type="text" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
                <div>
                    <p className='mb-1 text-sm font-medium'>Twitter URL</p>
                    <input type="text" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
            </div>
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,1fr,1fr] gap-4 sm:gap-7 md:gap-16 mb-6'>
                <div>
                    <p className='mb-1 text-sm font-medium'>LinkedIn URL</p>
                    <input type="text" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleChange} className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                </div>
                <div>
                    <p className='m text-sm font-medium'>Company Logo</p>
                    <input name="logo" onChange={handleChange} type="file" className='file:bg-black file:text-white file:rounded border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                    <p className='text-xs font-thin mt-1'>(png, jpg or jpeg Only)</p>
                    {selectedPhotoPreview ? (
                        // If a new photo is selected, show "View" button with local preview URL
                        <>
                            <a href={selectedPhotoPreview} target="_blank" rel="noopener noreferrer" className='underline text-blue-800 text-sm cursor-pointer'>View</a>
                        </>
                    ) : formData.logo ? (
                        // If there's an existing logo URL from the API, show "View" button with API URL
                        <>
                            <a href={formData.logo} target="_blank" rel="noopener noreferrer" className='underline text-blue-800 text-sm cursor-pointer'>View</a>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
});

export default OtherDetails
