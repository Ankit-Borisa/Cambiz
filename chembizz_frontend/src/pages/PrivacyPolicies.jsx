import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../BASE_URL';

const PrivacyPolicies = () => {

    const [terms_condition, setTerms_conditions] = useState("")

    const fetchTermsCondition = async () => {

        // const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        const res = await fetch(`${BASE_URL}api/privacy_policy/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Authorization: token,
            },
        })
        const data = await res.json()
        setTerms_conditions(data?.data?.[0])
    }

    useEffect(() => {
        fetchTermsCondition();
    }, []);

    // console.log(terms_condition)

    return (
        <div className='my-container'>
            <div className='mx-20 py-10'>
                <div
                    dangerouslySetInnerHTML={{
                        __html: terms_condition?.values
                    }}
                ></div>
            </div>
        </div>
    )
}

export default PrivacyPolicies;