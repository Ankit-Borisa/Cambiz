import React from 'react';
import buyChemical from "../images/buy-chemical.png"
import { useNavigate } from 'react-router-dom';
import RupeesIcon from '../assets/Rupees';

const Buycard = ({ dataArray }) => {

    const navigate = useNavigate()

    const handleNavigate = (id) => {
        const token = localStorage.getItem("chemicalToken")
        if (token) {
            navigate(`/company/product-detail-and-suppliers/${id}`);
        } else {
            navigate(`/login`);
        }
    }

    const abc = "3883"
    const handleNavigate1 = (id) => {
        navigate(`/payment2/${id}`, { state: { abc: abc } });
    }

    const handleNavigate2 = (id) => {
        navigate(`/payment2/${id}`)
    }

    return (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {dataArray && dataArray.map((e,index) => (
                    <div key={index}>
                        <div className='rounded-lg bg-white px-4 py-3 shadow h-full'>
                            <div className='flex flex-col h-full items-center'>
                                <img
                                    src={e.structure}
                                    alt=""
                                    className={e.structure === "https://chembizzstorage.blob.core.windows.net/chembizz-files/chembizzchem.png" ? 'w-[70%]' : ''}
                                />
                                <div className='flex justify-between pt-3'>
                                    <h3 className='font-medium text-xl'>{e.name_of_chemical?.slice(0, 15)}</h3>
                                    {e.verified == false && <img className='w-[25px] h-[25px]' src="https://chembizzstorage.blob.core.windows.net/chembizz-files/unverify_selected_logo.png" alt="" />}
                                    
                                </div>
                                <div className='md:flex block justify-between mt-2 mb-4'>
                                    <div>
                                        <p className='text-slate-400'>CAS No:</p>
                                        <p className='font-medium'>{e.CAS_number}</p>
                                    </div>
                                    <div>
                                        <p className='text-slate-400'>Price </p>
                                        {e.catalog?.[0]?.min_price ? (
                                            <>
                                                <p className='font-medium flex items-center'><RupeesIcon /> {e.catalog?.[0]?.min_price} - <RupeesIcon /> {e.catalog?.[0]?.max_price}</p>
                                            </>
                                        ) : (
                                            <p className='font-medium flex items-center'>-</p>
                                        )}
                                    </div>
                                </div>
                                <button className='bg-darkBlue text-white text-sm mt-auto px-4 py-2 rounded-lg w-full' onClick={() => handleNavigate(e._id)}>Inquiry Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Buycard