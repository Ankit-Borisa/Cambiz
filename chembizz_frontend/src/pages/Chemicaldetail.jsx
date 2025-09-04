import React, { useState } from 'react';
import { faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import chem1 from "../images/chemical-main.png"
import right from "../images/right.png"
import L from "../images/L.png"
import earth from "../images/pruthvi.png"
import bund from "../images/tipu.png"
import box from "../images/weight.png"
import rupees from "../images/rupees.png"
import { useNavigate } from 'react-router-dom';

const ChemicalDetail = ({ onhandlechange }) => {

    const [modalTitle, setModalTitle] = useState('');
    const [buttonChange, setButtonChange] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
        setModalTitle("Catalog Updated Successfully!")
        setButtonChange("Submit")
    };

    const closeModal = () => {
        setIsOpen(false);
        onhandlechange();
    };


    const array = [
        { name: "yurvaj" },
        { name: "yurvaj" },
        { name: "yurvaj" },
        { name: "yurvaj" },
        { name: "yurvaj" },
        { name: "yurvaj" },
    ]

    const navigate = useNavigate();


    const handleNavigate = () => {
        navigate("/company-profile")
    }

    const abc = "3883"
    const handleNavigate1 = () => {
        navigate("/payment2", { state: { abc: abc } });
    }

    
    const handleNavigate2 = () => {
        navigate("/payment2")
    }

    return (
        <div className='bg-black/[.02]'>
            <div className='profile-container'>
                <div className="w-full overflow-x-hidden">
                    <div className="flex flex-col p-2">
                        <div className='mt-10'>
                            <div className='flex bg-white gap-6 border py-10 px-10 rounded-lg shadow-md'>
                                <div className='border h-100% flex items-center rounded-md'>
                                    <img src={chem1} alt="" className='w-[500px] py-16' />
                                </div>
                                <div className='w-full'>
                                    <h2 className='text-3xl font-semibold w-full pb-3'>Amisulpride</h2>
                                    <hr />
                                    <div className='py-3'>
                                        <ul className='flex justify-between me-3' >
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500'>CAS Number :</p>
                                                <p>71675-85-9</p>
                                            </li>
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500'>Molecular Formula :</p>
                                                <p>C17H27N3O4S</p>
                                            </li>
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500'>Mol Weight :</p>
                                                <p>369.48</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <hr />

                                    <div className='mt-3'>
                                        <ul className='flex flex-col gap-2' >
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500 w-[200px]'>Synonyms </p>
                                                <p>OCIAN</p>
                                            </li>
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500 w-[200px]'>IUPAC Name </p>
                                                <p>4-amino-N-[(1-ethylpyrrolidin-2-yl)methyl]-5-ethylsulfonyl-2-
                                                    methoxybenzamide</p>
                                            </li>
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500 w-[200px]'>Storage </p>
                                                <p>2-8  °C</p>
                                            </li>
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500 w-[200px]'>Appearance </p>
                                                <p>Off white solid</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex items-center gap-10 my-7'>
                    <h1 className='text-3xl font-semibold pb-3'>Suppliers</h1>
                    <div className='w-full h-0 border-b-2 border-gray '></div>
                </div>

                <div className=''>
                    <div className="mb-10 grid grid-cols-[1fr,1fr,1fr,1fr] gap-10 bg-white border border-[#0A122A1A]/0.3 px-10 py-10 rounded-3xl">
                        {array && array.map((e) => (
                            <div className='border border-[#0A122A1A]/0.3 rounded-xl py-5 px-4'>
                                <div className='flex gap-4 border-b-2 border-gray pb-4 mb-4'>
                                    <div>
                                        <img src={L} alt="" className='h-[70px]' />
                                    </div>
                                    <div>
                                        <p className='text-slate-500'>Manufacturer</p>
                                        <p className='text-lg font-medium'>Guanjoi Trading LLC</p>
                                        <div className='flex justify-between'>
                                            <p className='underline text-blue-500 font-medium'>COA</p>
                                            <p className='underline text-blue-500 font-medium cursor-pointer' onClick={handleNavigate}>More Details</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='flex justify-between mb-2'>
                                        <p className='text-slate-600 flex items-center gap-4'><img src={rupees} alt="" className='h-[20px]' />200 - 300</p>
                                        <p className='text-slate-600 flex items-center gap-4'><img src={bund} alt="" className='h-[20px]' />100%</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-slate-600 flex items-center gap-3'><img src={box} alt="" className='h-[20px]' />1000Kg/month</p>
                                        <p className='text-slate-600 flex items-center gap-3'><img src={earth} alt="" className='h-[20px]' />India</p>
                                    </div>
                                    <div className='mt-7 flex gap-2'>
                                        <button className='bg-darkBlue text-xs text-white font-medium py-2 rounded-lg w-full text-md font-thin' onClick={handleNavigate1}>Buying Inquiry</button>
                                        <button className=' border border-darkBlue text-xs font-semibold py-2 rounded-lg w-full text-md font-thin' onClick={handleNavigate2}>Sample Inquiry</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>


    )
}

export default ChemicalDetail