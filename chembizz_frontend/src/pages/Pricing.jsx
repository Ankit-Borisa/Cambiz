import React, { useEffect, useState } from 'react';
import Pricingcards from '../components/Pricingcards';
import pricingBackground from "../images/package-heading-banner.png"
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

const Pricing = () => {

    const [membershipPlan, setMembershipPlan] = useState([])

    const fetchCategoryList = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}api/membership_plan/display`
            );

            setMembershipPlan(response.data.data);
            setIsLoading(false);
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchCategoryList();
    }, []);


    return (
        <>
            <section className='pricing-container'>
                <div className='mt-12 mb-20 hidden sm:block'>
                    <img src={pricingBackground} alt="" className='rounded-[30px]' />
                </div>
                <div className='mb-20 mt-10 sm:mt-0 mx-7 sm:mx-0'>
                    <div className='flex items-center gap-4 sm:gap-10 mb-12'>
                        <h1 className='text-3xl sm:text-5xl font-semibold pb-3'>Pricing</h1>
                        <div className='w-full h-0 border-b-2 border-black '></div>
                    </div>
                    <div>
                        <div className='grid lg:grid-cols-[1fr,1fr,1fr,1fr] md:grid-cols-[1fr,1fr,1fr,1fr] gap-12'>
                            {membershipPlan && membershipPlan.map((e) => (
                                <Pricingcards onNavigate={e} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Pricing
