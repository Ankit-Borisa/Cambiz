import React, { useEffect, useState } from 'react';
import companyProfile from "../images/company-profile.png";
import back from "../images/Back.png";
import companyLogo from "../images/company-logo.png";
import location from "../images/location.png";
import telephone from "../images/telephone.png";
import phone from "../images/phone.png";
import mail from "../images/mail.png";
import earth from "../images/earth.png";
import insta from "../images/insta.png";
import face from "../images/face.png";
import x from "../images/x.png";
import link from "../images/link.png";
import grayRect from "../images/other-profile-detail-2.png";
import companyBackground from "../images/companyList-background.png";
import companies from "../images/companies.png";
import banner from "../images/new-bg-profile.png";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../BASE_URL';

function getInitials(companyName) {
    if (!companyName) return '';
    const firstCharacter = companyName.charAt(0) || '';
    const secondCharacter = companyName.charAt(1) || '';
    return `${firstCharacter}${secondCharacter}`.toUpperCase();
}

const CompanyProfile = () => {

    const { _id } = useParams()

    const [catalogs, setCatalogs] = useState([])
    const [companies, setCompanies] = useState([])
    // console.log(companies)

    const fetchCompanyData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}company/companyDisplayByCatalog/${_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await res.json();
        setCatalogs(data.data);
    };

    const fetchCompanyDetails = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}company/compnayDetails`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await res.json();
        setCompanies(data.data?.filter((e) => e.other_info?.length > 0));
    };

    useEffect(() => {
        fetchCompanyData();
        fetchCompanyDetails();
    }, []);

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(-1)
    }

    const handleNavigate3 = (id) => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate(`/company/product-detail-and-suppliers/${id}`);
        } else {
            navigate(`/company/product-detail-and-suppliers/${id}`);
        }
    }

    const abc = "3883"
    const handleNavigate1 = (e) => {
        const token = localStorage.getItem("chemicalToken")
        if (token) {
            navigate(`/company/buy-inquiry/${e.catalog?.company_id}`, { state: { abc: abc, data: e } });
        } else {
            navigate("/company/payment2", { state: { abc: abc } });
        }
    }


    const handleNavigate2 = (e) => {
        const token = localStorage.getItem("chemicalToken")
        if (token) {
            navigate(`/company/buy-inquiry/${e.catalog?.company_id}`, { state: { data: e } });
        } else {
            navigate("/payment2");
        }
    }

    return (
        <>
            <section>
                <div className='profile-container'>
                    <div className='mb-20'>
                        <div className='relative'>
                            <img src={banner} alt="" className='rounded-xl mt-10' />
                            {/* <img src={back} alt="" className='absolute top-0 h-[100px] left-[-100px] cursor-pointer' onClick={handleNavigate} /> */}
                        </div>
                        <div className='mt-[-30px] relative'>
                            <div className='flex justify-between gap-10'>
                                <div className='flex gap-6 items-end'>
                                    <div>
                                        {catalogs?.[0]?.company_otherInfo?.logo ? (
                                            <img src={catalogs?.[0]?.company_otherInfo?.logo} alt="" className='h-[170px] w-[170px] mt-[-50px] rounded-md ms-4' />
                                        ) : (
                                            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center h-[170px] w-[170px] mt-[-50px]">
                                                <p className="text-[60px] font-semibold text-gray-600">
                                                    {getInitials(catalogs?.[0]?.company_info?.company_name.slice(0, 2).toUpperCase())}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className='flex  gap-3 pt-10'>
                                            <h2 className='text-xl font-semibold'>{catalogs?.[0]?.company_info?.company_name}</h2>
                                            <div className='border-r border-black my-1'></div>
                                            <p className='text-lg font-medium text-slate-500'>{catalogs?.[0]?.company_info?.mode_of_business?.join(",")}</p>
                                        </div>
                                        <div className='mt-3'>
                                            <span style={{ width: "max-content" }} className='border-2 border-[#0A122A]/[.3] flex gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={location} alt="" className='h-[20px]' /> {catalogs?.[0]?.company_info?.address}</span>
                                            <div className='flex gap-5 mt-4'>
                                                <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={telephone} alt="" className='h-[17px]' /> {catalogs?.[0]?.company_info?.landline_num}</p>
                                                <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'>
                                                    <img src={phone} alt="" className='h-[17px]' />
                                                    {catalogs?.[0]?.company_info?.mobile_num}
                                                </p>
                                                <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={mail} alt="" className='h-[14px]' /> {catalogs?.[0]?.company_info?.emailid}
                                                </p>
                                                <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={location} alt="" className='h-[20px]' /> {catalogs?.[0]?.company_info?.city},  {catalogs?.[0]?.company_info?.state}, {catalogs?.[0]?.company_info?.country}</p>
                                            </div>
                                            {catalogs?.[0]?.document_details?.some(e => e?.status === "active") && (
                                                <div className='flex gap-5 mt-4 items-center'>
                                                    <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'> Facility Document </p>
                                                    {catalogs?.[0]?.document_details.map((e) => (
                                                        <>
                                                            {e?.status === "active" && (
                                                                <a href={e.doc_file} target='_blank' className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-xs text-blue-500 underline'>
                                                                    {e?.certificate_name}
                                                                </a>
                                                            )}
                                                        </>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                                <div className='mt-14'>
                                    {catalogs?.[0]?.company_otherInfo?.website && (
                                        <div className='flex justify-end gap-3'>
                                            {catalogs?.[0]?.company_otherInfo?.website && (
                                                <a href={catalogs?.[0]?.company_otherInfo?.website} target='_blank' rel='noopener noreferrer'>
                                                    <img src={earth} alt="Website" className='h-[30px]' />
                                                </a>
                                            )}
                                            {catalogs?.[0]?.company_otherInfo?.fb && catalogs?.[0]?.company_otherInfo?.fb !== "" && (
                                                <a href={catalogs?.[0]?.company_otherInfo?.fb} target='_blank' rel='noopener noreferrer'>
                                                    <img src={face} alt="Facebook" className='h-[30px]' />
                                                </a>
                                            )}
                                            {catalogs?.[0]?.company_otherInfo?.insta && catalogs?.[0]?.company_otherInfo?.insta !== "" && (
                                                <a href={catalogs?.[0]?.company_otherInfo?.insta} target='_blank' rel='noopener noreferrer'>
                                                    <img src={insta} alt="Instagram" className='h-[30px]' />
                                                </a>
                                            )}
                                            {catalogs?.[0]?.company_otherInfo?.twitter && catalogs?.[0]?.company_otherInfo?.twitter !== "" && (
                                                <a href={catalogs?.[0]?.company_otherInfo?.twitter} target='_blank' rel='noopener noreferrer'>
                                                    <img src={x} alt="Twitter" className='h-[30px]' />
                                                </a>
                                            )}
                                            {catalogs?.[0]?.company_otherInfo?.linkedin && catalogs?.[0]?.company_otherInfo?.linkedin !== "" && (
                                                <a href={catalogs?.[0]?.company_otherInfo?.linkedin} target='_blank' rel='noopener noreferrer'>
                                                    <img src={link} alt="LinkedIn" className='h-[30px]' />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-black/[.026] py-10'>
                    <div className='profile-container'>
                        <div className='flex justify-center mx-20'>
                            <div className='grid grid-cols-[1fr,1fr,1fr,1fr] gap-4'>
                                {catalogs && catalogs.map((e) => (
                                    <>
                                        <div className='rounded-lg bg-white px-4 py-3 shadow h-full flex flex-col'>
                                            <div className=''>
                                                <img src={e.product?.structure} alt="" className='w-full h-[200px]' />
                                            </div>
                                            <div className='py-3 flex flex-col h-full'>
                                                <h3 className='font-medium text-lg'>{e.product?.name_of_chemical}</h3>
                                                <div className='flex justify-between mt-auto mb-4'>
                                                    <div>
                                                        <p className='text-slate-400 text-sm'>CAS No:</p>
                                                        <p className='font-medium text-sm'>{e.product?.CAS_number}</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-slate-400 text-sm'>Price </p>
                                                        <p className='font-medium flex items-center text-sm '><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg> {e.catalog?.min_price} - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg> {e.catalog?.max_price}</p>
                                                    </div>
                                                </div>
                                                <div className='flex gap-2 mt-1'>
                                                    <button className='bg-darkBlue text-white text-xs py-1 rounded-lg w-[130px]' onClick={() => handleNavigate1(e)}>Buying Inquiry</button>
                                                    <button className='border border-darkBlue  text-darkBlue text-xs py-2 rounded-lg w-[130px]' onClick={() => handleNavigate2(e)}>Sample Inquiry</button>
                                                </div>

                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className="profile-container">
                        <img src={grayRect} alt="" className='rounded-xl' />
                    </div>
                </div>
                <div className='mt-10'>
                    <div className='profile-container'>
                        <div className='bg-darkBlue px-10 py-10 rounded-xl'>
                            <Swiper
                                slidesPerView={7}
                                spaceBetween={100}
                                pagination={{
                                    clickable: true,
                                    el: '.custom-pagination', // Custom class for pagination
                                    bulletClass: 'custom-bullet', // Custom class for pagination bullets
                                    bulletActiveClass: 'custom-bullet-active' // Custom class for active pagination bullet
                                }}
                                navigation={true}
                                modules={[Pagination, Navigation]}
                                className="yuvraj-mySwiper mx-10"
                            >
                                {companies && [...companies]?.reverse()?.map((e) => (
                                    <SwiperSlide key={e.id}><img src={e?.other_info?.[0]?.logo} alt="" className='h-[100px] w-full' /></SwiperSlide>
                                ))}
                                <div className="custom-pagination"></div> {/* Add this div for pagination */}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CompanyProfile
