import React from 'react';
import pricing1 from "../images/pricing1.png"
import { useLocation, useNavigate } from 'react-router-dom';
import RupeesIcon from '../assets/Rupees';

const Pricingcards = (onNavigate) => {

    // console.log(onNavigate)

    const pricePerDay = onNavigate?.onNavigate?.plan_selling_price / onNavigate?.onNavigate.plan_days;

    const token = localStorage.getItem("chemicalToken")
    const location = useLocation()

    const navigate = useNavigate()
    const abc = "3883"
    const handleNavigate = () => {
        if (token) {
            navigate(`/company/PackagePayment/${onNavigate?.onNavigate?._id}`);
        } else {
            navigate("/login" , {state : location.pathname});
        }
    }

    return (
        <div className='bg-white border rounded-xl pb-10 shadow-lg'>
            <div className='h-full'>
                <div>
                    <img src={pricing1} alt="" className='w-full' />
                </div>
                <div className='flex justify-center'>
                    <div className='mt-6 flex flex-col h-full'>
                        <h1 className='text-center font-semibold text-2xl mb-4'>{onNavigate?.onNavigate?.plan_name}</h1>
                        <ul className='mx-[60px]'>
                            {onNavigate?.onNavigate?.membership_feature_name.map((e) => (
                                <li className='list-disc mb-3 text-sm'>{e.feature_name}</li>
                            ))}
                            <li className='list-disc mb-3 text-sm'>Plan Days {onNavigate?.onNavigate?.plan_days}</li>
                        </ul>
                        <div className='mt-auto'>
                            <div className='flex justify-center items-end gap-2 mb-4 pt-4'>
                                <p className='text-lg'>From</p>
                                <h2 className='text-xl font-semibold ms-2 flex items-center'><RupeesIcon /> {onNavigate?.onNavigate?.plan_selling_price?.toFixed(2)} <del className='ms-2 text-xs flex items-center'><RupeesIcon />{onNavigate?.onNavigate?.plan_original_price?.toFixed(2)}</del> </h2>
                                {/* <p>/ day</p> */}
                            </div>
                            {onNavigate?.onNavigate?.plan_name !== "Free Trial" && (
                                <div className="flex justify-center mt-auto">
                                <button
                                    className="bg-darkBlue text-white text-sm  px-4 py-2 rounded-lg"
                                    onClick={handleNavigate}
                                >
                                    Checkout
                                </button>
                                </div>
                            )}
                            {/* <div className='flex justify-center mt-auto'>
                                <button className='bg-darkBlue text-white text-sm  px-4 py-2 rounded-lg' onClick={handleNavigate}>Checkout</button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pricingcards
