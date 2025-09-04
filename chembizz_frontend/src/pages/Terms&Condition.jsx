import React, { useEffect, useState } from 'react'
import GalleryImage from "../images/about-us-header.png"
import whoWeAre from "../images/who-we-are.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faUserTie, faLink, faRocket } from '@fortawesome/free-solid-svg-icons'
import PointLine from "../images/about-point-line.png"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from "../images/loading.png"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../BASE_URL'

const TermsCondition = () => {

    const [terms_condition, setTerms_conditions] = useState("")

    const fetchTermsCondition = async () => {

        // const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        const res = await fetch(`${BASE_URL}api/admin_teams_and_condition/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Authorization: token,
            },
        })
        const data = await res.json()
        setTerms_conditions(data?.data?.[0])
        // console.log(data?.data?.[0])
    }

    useEffect(() => {
        fetchTermsCondition();
    }, []);

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

export default TermsCondition;