import React, { useEffect, useState } from 'react';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Pricingcards from './Pricingcards';
import { BASE_URL } from '../BASE_URL';

const Packages = () => {

    const [membershipPlan, setMembershipPlan] = useState([])

    useEffect(() => {
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
        fetchCategoryList();
    }, []);

    return (
        <div className="w-full overflow-x-hidden">
            <div className='flex justify-between items-end'>
                <div className=''>
                    <h1 className="md:text-3xl text-xl font-semibold mb-2 ">Package Details</h1>
                    <p className='mb-2 text-sm text-gray-400'>Select Your Packages</p>
                </div>
            </div>
            <hr />
            <ToastContainer />
            <div>
                <div className='mt-10'>
                    <div className='flex justify-center'>
                        <div className='grid lg:grid-cols-[1fr,1fr,1fr] md:grid-cols-[1fr,1fr,1fr,1fr] gap-10'>
                            {membershipPlan && membershipPlan.map((e) => (
                                <Pricingcards onNavigate={e} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Packages