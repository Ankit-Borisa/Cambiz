import axios from 'axios';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../BASE_URL';

const Sign = forwardRef(({ logoReturnValue, data }, ref) => {

    const [selectedStamp, setSelectedStamp] = useState(null);
    const [selectedSign, setSelectedSign] = useState(null);
    const [displayStamp, setDisplayStamp] = useState(null);
    const [displaySign, setDisplaySign] = useState(null);
    const [data1, setData1] = useState(null);

    useEffect(() => {
        if (data) {
            const stampData = data?.stampData?.[0];
            if (stampData) {
                setSelectedStamp(stampData.stampImage);
                setSelectedSign(stampData.signImage);
                setData1(stampData);
            }
        }
    }, [data]);

    const handleStampChange = (e) => {
        const file = e.target.files[0];
        setSelectedStamp(file);
        setDisplayStamp(URL.createObjectURL(file));
    }

    const handleSignChange = (e) => {
        const file = e.target.files[0];
        setSelectedSign(file);
        setDisplaySign(URL.createObjectURL(file));
    }

    useImperativeHandle(ref, () => ({
        handleSubmit
    }));

    const handleSubmit = async () => {

        logoReturnValue(true)

        if (!selectedStamp ) {
            toast.error('Please Select Stamp Photos!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            logoReturnValue(false)
            return;
        }
        if (!selectedSign ) {
            toast.error('Please Select Sign Photos!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            logoReturnValue(false)
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('stampImage', selectedStamp);
        formDataToSend.append('signImage', selectedSign);

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

        try {
            let response;
            if (data1) {
                response = await axios.put(
                    `${BASE_URL}api/stamp/update/${data1._id}`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: token,
                        },
                    }
                );
            } else {
                response = await axios.post(
                    `${BASE_URL}api/stamp/insert-stamp`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: token,
                        },
                    }
                );
            }

            logoReturnValue(false)

            if (response.status === 200) {
                toast.success('Stamp & Sign Updated Successfully!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            logoReturnValue(false)
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }
    }

    return (
        <div className='my-10 relative'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-16 mb-6'>
                <div>
                    <div className='w-full sm:w-[65%]'>
                        <p className='font-semibold text-2xl mb-4'>Stamp</p>
                        <p className='mb-1 text-sm font-medium'>Upload Stamp <span className='text-xs font-thin'>(png, jpg or jpeg Only)</span></p>
                        <input onChange={handleStampChange} accept="image/jpeg, image/png" name="stamp" type="file" className='file:bg-black file:text-white file:rounded border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                        <div className='h-[200px]'>
                            {(displayStamp || selectedStamp) && (
                                <div className='flex items-center justify-center border border-gray-400 mt-5 rounded-lg h-[200px]'>
                                    <img src={displayStamp || selectedStamp} alt="" className='h-[90%] w-[90%]' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <div className='w-full sm:w-[65%]'>
                        <p className='font-semibold text-2xl mb-4'>Sign</p>
                        <p className='mb-1 text-sm font-medium'>Upload Sign <span className='text-xs font-thin'>(png, jpg or jpeg Only)</span></p>
                        <input onChange={handleSignChange} accept="image/jpeg, image/png" name="sign" type="file" className='file:bg-black file:text-white file:rounded border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                        <div className='h-[200px]'>
                            {(displaySign || selectedSign) && (
                                <div className='flex items-center justify-center border border-gray-400 mt-5 rounded-lg h-[200px]'>
                                    <img src={displaySign || selectedSign} alt="" className='h-[90%] w-[90%]' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
});

export default Sign;
