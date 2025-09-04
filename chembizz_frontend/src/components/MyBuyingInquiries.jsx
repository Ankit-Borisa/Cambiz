import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import chemical from "../images/chemical.png"
import truck from "../images/truck.png"
import messagepay from "../images/messagepay.png"
import { useActiveContext } from '../context/ActiveLink';
import ch1 from "../images/ch1.png"
import right from "../images/right.png"
import axios from 'axios';
import loaderImage from "../images/loading.png"
import RupeesIcon from '../assets/Rupees';
import exclamation from "../images/exclamation.png"
import { BASE_URL } from '../BASE_URL';

function getPriceRangeForEnteredValue(enteredValue, baseQty, baseQtyType, minPrice, maxPrice, myQuantityType) {

    let conversionFactor;

    if (baseQtyType === myQuantityType) {
        conversionFactor = enteredValue / baseQty;
    } else if (baseQtyType === "gm" && myQuantityType === "kg") {
        conversionFactor = (enteredValue / baseQty) * 1000;
    } else if (baseQtyType === "kg" && myQuantityType === "gm") {
        conversionFactor = (enteredValue / baseQty) / 1000;
    }

    const newMinPrice = minPrice * conversionFactor;
    const newMaxPrice = maxPrice * conversionFactor;

    return {
        minPrice: newMinPrice,
        maxPrice: newMaxPrice
    };
}

const MyBuyingInquiry = () => {

    const { activeTab, setActiveTab } = useActiveContext();

    const [loader, setLoader] = useState(false)

    const [catalogs, setCatalogs] = useState([])

    const { _id } = useParams();

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

    const [abc, setAlreadyData] = useState("")
    const [myData, setMyData] = useState("")
    const [id, setId] = useState("")

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const location = useLocation();
    const topRef = useRef(null);

    const handleBuyingInquiry = (e) => {
        setMyData(e)
        setId(e?._id)
        setAlreadyData("3883")
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleSampleInquiry = (e) => {
        setMyData(e)
        setAlreadyData("")
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    useEffect(() => {
        setAlreadyData(location.state?.abc)
        setMyData(location.state?.data)
        setId(location.state?.id)
    }, [location]);

    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState("Immediate");
    const [incoTerms, setIncoTerms] = useState("EXW - Ex Works");
    const [paymentTerms, setPaymentTerms] = useState("Immediate");

    const [packageExpire, setPackageExpire] = useState(false);
    const [notPremium, setNotPremium] = useState(false);

    const submitInquiry = async () => {

        if (Number(qtyValue) < 1) {
            toast.error("Please Enter Quantity", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (Number(priceRange.maxPrice) < 1) {
            toast.error("Invalid Quantity", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        setLoader(true)

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        const formData = new FormData();

        formData.append('seller_company_id', myData?.catalog?.company_id);
        formData.append('product_id', myData?.catalog?.product_id);
        formData.append('category', myData?.catalog?.category);
        formData.append('subcategory', myData?.catalog?.subcategory);
        formData.append('grade', myData?.catalog?.grade);
        formData.append('country_origin', myData?.catalog?.country_origin);
        formData.append('hsn_code', myData?.catalog?.hsn_code);
        formData.append('supply_capacity', myData?.catalog?.supply_capacity);
        formData.append('purity', myData?.catalog?.purity);
        formData.append('COA', myData?.catalog?.COA);


        if (abc === "3883") {
            formData.append('inq_type', "commercial");
            formData.append('inquiry_qty', qtyValue);
            formData.append('qty_type', qtyType);
            formData.append('min_price', priceRange.minPrice);
            formData.append('max_price', priceRange.maxPrice);
            formData.append('payment_terms', paymentTerms);
            formData.append('delivery_time', deliveryTime);
            formData.append('inco_terms', incoTerms);
        } else {
            formData.append('inq_type', "sample inquiry");
            formData.append('one_lot_qty', myData?.catalog?.one_lot_qty);
            formData.append('one_lot_qty_type', myData?.catalog?.one_lot_qty_type);
            formData.append('one_lot_qty_price', myData?.catalog?.one_lot_qty_price);
            formData.append('payment_type', "COD");
            formData.append('total_lot', selectedLot);
            formData.append('payment_status', "pending");
        }

        const membershipStatus = localStorage.getItem("membershipStatus")
        // console.log(membershipStatus)
        if (membershipStatus === "free") {
            setNotPremium(true)
        } else {

            try {
                const response = await axios.post(
                    `${BASE_URL}api/inquiryRoutes/inquiries`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    setLoader(false)
                    setIsOpen(true)

                } else {

                }
            } catch (error) {
                setLoader(false)
                console.error("Error adding category:", error.message);
                toast.error(error.response.data.error, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        }



    }

    const [selectedLot, setSelectedLot] = useState(1);

    const handleLotChange = (event) => {
        setSelectedLot(parseInt(event.target.value));
    };

    const [qtyType, setQtyType] = useState('');
    const [qtyValue, setQtyValue] = useState('');

    useEffect(() => {
        if (myData?.catalog?.qty_type) {
            setQtyType(myData.catalog.qty_type);
        } else {
            setQtyType('kg');
        }

        if (myData?.catalog?.qty_type === "gm") {
            setQtyValue("10")
        } else {
            setQtyValue("1")
        }
    }, [myData]);

    const handleQtyTypeChange = (e) => {
        const selectedValue = e.target.value;
        setQtyType(e.target.value);
        if (selectedValue === "gm") {
            setQtyValue("10")
        } else if (selectedValue === "kg") {
            setQtyValue("1")
        }
    };

    useEffect(() => {
        if (myData?.catalog?.qty_type) {
            setQtyType(myData.catalog.qty_type);
        }
    }, [myData]);


    const handleQtyValueChange = (e) => {
        const maxLimit = 1000000000000; // 10000Cr

        const value = e.target.value.replace(/[^0-9]/g, '');
        const checkTotal = myData?.catalog?.min_price * value
        if (Number(value) <= maxLimit && checkTotal <= maxLimit) {
            setQtyValue(value);
            updatePrice(value);
        } else if (value.length < qtyValue.length) { // allow removal of digits
            setQtyValue(value);
            updatePrice(value);
        } else {
            toast.error("Can't Inquiry More Than 10000Cr", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }
    };

    const updatePrice = (qtyValue) => {
        let conversionFactor = 1;

        if (myData?.catalog?.qty_type === 'gm' && qtyType === 'kg') {
            conversionFactor = 1000;
        } else if (myData?.catalog?.qty_type === 'kg' && qtyType === 'gm') {
            conversionFactor = 1 / 1000;
        }

        const adjustedQtyValue = qtyValue * conversionFactor;

    };

    const [priceRange, setPriceRange] = useState([])

    useEffect(() => {
        const priceRange = getPriceRangeForEnteredValue(qtyValue, myData?.catalog?.qty, myData?.catalog?.qty_type, myData?.catalog?.min_price, myData?.catalog?.max_price, qtyType);
        setPriceRange(priceRange)
    }, [qtyValue, myData?.catalog?.qty, myData?.catalog?.qty_type, myData?.catalog?.min_price, myData?.catalog?.max_price, qtyType]);

    const handleNavigate = () => {
        setActiveTab("Buying Inquiry");
        navigate('/company/buying-inquiry');
    }

    const formatNumber = (num) => {
        const maxLimit = 100000000000;

        if (num > maxLimit) {
            num = maxLimit;
        }

        if (num >= 10000000) {
            return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
        } else if (num >= 100000) {
            return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toString();
    }

    const handleNavigatePackage = () => {
        navigate("/company/packages")
    }

    // console.log(myData?.catalog)

    return (
        <div className='pt-2'>
            <div className='profile-container'>
                <div ref={topRef} className='flex md:flex-row flex-col bg-white rounded-2xl border border-[#0A122A]/0.1 rounded-2xl shadow '>
                    <ToastContainer />
                    <div className='p-4 flex flex-col items-center justify-center rounded-2xl w-full'>
                        <div className='w-full h-full'>
                            <div className='grid xl:grid-cols-[3fr,1fr] lg:grid-cols-[3fr,1.5fr] gap-4 h-full'>
                                <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-5'>
                                    <div className='w-full'>
                                        <div className='rounded mb-5'>
                                            <div className='grid xl:grid-cols-[1.3fr,5fr,1.3fr] lg:grid-cols-[1fr] md:grid-cols-[1fr]'>
                                                <div className=''>
                                                    <img src={myData?.product?.structure} alt="" className='mb-2 h-[80px] lg:block md:none ' />
                                                </div>
                                                <div className=''>
                                                    <h1 className='sm:text-xl text-md font-semibold mb-2'>{myData?.product?.name_of_chemical}</h1>

                                                    <div className='xl:flex block mb-2'>
                                                        <p className='text-slate-500 sm:text-xs text-[11px] w-[190px]' >CAS No: {myData?.product?.CAS_number}</p>
                                                        <p className='text-slate-500 sm:text-xs text-[11px]' >Category: {myData?.catalog?.category}</p>
                                                    </div>
                                                    <div className='xl:flex block mb-2'>
                                                        <p className='text-slate-500 sm:text-xs text-[11px] w-[190px]' >Country Origin / Make: {myData?.catalog?.country_origin}</p>
                                                        {myData?.catalog?.subcategory && myData?.catalog?.subcategory !== "undefined" && (
                                                            <p className='text-slate-500 sm:text-xs text-[11px]'>
                                                                Sub-Category: {myData?.catalog?.subcategory}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className='xl:flex block mb-2'>
                                                        <p className='text-slate-500 sm:text-xs text-[11px] w-[190px]' >Purity: {myData?.catalog?.purity}%</p>
                                                        {myData?.catalog?.grade && myData?.catalog?.grade !== "undefined" && (
                                                            <p className='text-slate-500 sm:text-xs text-[11px]'>
                                                                Grade: {myData?.catalog?.grade?.join(",")}
                                                            </p>
                                                        )}
                                                        {/* <p className='text-slate-500 text-xs' >Grade: {myData?.catalog?.grade === "undefined" ? '' : myData?.catalog?.grade}</p> */}
                                                    </div>
                                                    <div className='xl:flex block mb-2'>
                                                        {abc ? (
                                                            <>
                                                                <p className='text-slate-500 sm:text-xs text-[11px] w-[190px]' >Quantity: {myData?.catalog?.qty}{myData?.catalog?.qty_type} </p>
                                                            </>
                                                        ) : (
                                                            <p className='text-slate-500 sm:text-xs text-[11px] w-[190px]' >Quantity: {myData?.catalog?.one_lot_qty}{myData?.catalog?.one_lot_qty_type} </p>
                                                        )}
                                                        <a href={myData?.catalog?.COA} target='_blank' className='text-blue-600 sm:text-xs text-[11px] underline cursor-pointer font-semibold'>COA</a>
                                                    </div>
                                                    <div className='mb-2'>
                                                        {abc ? (
                                                            <p className='text-slate-500 sm:text-xs text-[11px] w-[190px] flex items-center' >Price Range : <RupeesIcon />{myData?.catalog?.min_price} -<RupeesIcon />{myData?.catalog?.max_price} </p>
                                                        ) : (
                                                            <p className='text-slate-500 sm:text-xs text-[11px] flex items-center' >Price : <RupeesIcon />{myData?.catalog?.one_lot_qty_price}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {abc ? (
                                                    <div>
                                                        <div className='flex xl:justify-end justify-start'>
                                                            <div className='flex border rounded-lg'>
                                                                <input type="text"
                                                                    value={qtyValue}
                                                                    onInput={handleQtyValueChange}
                                                                    className='outline-none text-gray-500 py-1 px-2 w-[150px] placeholder:text-gray-300 placeholder:text-xs rounded-s-lg' placeholder='Enter Quantity'
                                                                />
                                                                <select
                                                                    name="qty_type"
                                                                    id="qty_type"
                                                                    className='outline-none bg-gray-100 py-1 px-2 text-gray-400 text-xs rounded-e-lg'
                                                                    value={qtyType}
                                                                    onChange={handleQtyTypeChange}
                                                                >
                                                                    <option value="kg">kg</option>
                                                                    <option value="gm">gm</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='mt-4 flex xl:justify-end justify-start'>
                                                            <div className='flex gap-1 items-center justify-between sm:w-[280px] w-[230px]'>
                                                                <p className='sm:w-[120px] w-[60px] sm:text-xs text-[11px]'>Payment Terms</p>
                                                                <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} name="" id="" className='outline-none bg-gray-100 py-2 font-medium px-3 text-xs rounded-lg'>
                                                                    <option value="Advance">Advance</option>
                                                                    <option value="Immediate">Immediate</option>
                                                                    <option value="15 Days Credit">Credit (15 Days)</option>
                                                                    <option value="30 Days Credit">Credit (30 Days)</option>
                                                                    <option value="45 Days Credit">Credit (45 Days)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='mt-4 flex xl:justify-end justify-start'>
                                                            <div className='flex gap-1 items-center justify-between sm:w-[280px] w-[230px]'>
                                                                <p className='sm:w-[120px] w-[60px] sm:text-xs text-[11px]'>Delivery Time</p>
                                                                <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} name="" id="" className='outline-none bg-gray-100 py-2 font-medium px-3 text-xs rounded-lg'>
                                                                    <option value="Immediate">Immediate</option>
                                                                    <option value="Delivery in 15 Days">Delivery in 15 Days</option>
                                                                    <option value="Delivery in 30 Days">Delivery in 30 Days</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='mt-4 flex xl:justify-end justify-start'>
                                                            <div className='flex gap-1 items-center justify-between sm:w-[300px] w-[230px]'>
                                                                <p className='sm:w-[120px] w-[100px] sm:text-xs text-[11px]'>Inco Terms</p>
                                                                <select value={incoTerms} onChange={(e) => setIncoTerms(e.target.value)} name="" id="" className='outline-none bg-gray-100 py-2 font-medium px-3 text-xs rounded-lg sm:w-auto w-[150px]'>
                                                                    <option value="EXW - Ex Works" >EXW - Ex Works</option>
                                                                    <option value="FOB - Free on Board" >FOB - Free on Board</option>
                                                                    <option value="CIF - Cost, insurance & Fright" >CIF - Cost, insurance & Fright</option>
                                                                    <option value="DDP - Delivered Duty Paid" >DDP - Delivered Duty Paid</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='mt-2'>
                                                            <p className='text-[9px] xl:text-end text-start text-red-500'>*this delivery time will consider after confirmation of order</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-col items-center'>
                                                        <p className='text-slate-400 sm:text-xs text-[11px]'>Quantity: {myData?.catalog?.one_lot_qty}{myData?.catalog?.one_lot_qty_type} </p>
                                                        <p className='mb-0'>*</p>
                                                        <div className='flex gap-3 mb-4'>
                                                            <select name="" id="" className='bg-gray-100 px-3 py-1 rounded sm:text-sm text-[12px]' onChange={handleLotChange} value={selectedLot}>
                                                                {myData?.catalog?.max_lot_qty && [...Array(myData.catalog.max_lot_qty)].map((_, index) => (
                                                                    <option key={index + 1} value={index + 1}>{index + 1} Lot</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <p className='sm:text-xs text-[11px] font-medium'>Total Quantity: {selectedLot * myData?.catalog?.one_lot_qty} {myData?.catalog?.one_lot_qty_type}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className='border border-gray mb-5'></div>
                                        <div className='rounded mb-4'>
                                            <div className='grid grid-cols-[0.5fr,5fr] gap-8'>
                                                <div className=''>
                                                    {myData?.company_otherInfo?.length !== 0 && myData?.company_otherInfo?.logo !== "" ? (
                                                        <a href={`/company-profile/${myData?.catalog?.company_id}`} className='cursor-pointer' target='_blank'>
                                                            <img src={myData?.company_otherInfo?.logo} alt="" className='mb-2 rounded-full' />
                                                        </a>
                                                    ) : (
                                                        <a href={`/company-profile/${myData?.catalog?.company_id}`} className='cursor-pointer' target='_blank'>
                                                            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                                                <p className="text-xl font-semibold text-gray-600">
                                                                    {myData?.company_info?.company_name.slice(0, 2).toUpperCase()}
                                                                </p>
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                                <div className=''>
                                                    <div className='lg:flex block items-center justify-between mb-2'>
                                                        <a href={`/company-profile/${myData?.company_otherInfo?.company_id}`} className='cursor-pointer' target='_blank'>
                                                            <h1 className='sm:text-xl text-md font-semibold'>{myData?.company_info?.company_name}</h1>
                                                        </a>
                                                        <p className='sm:text-xl text-xs font-semibold'>{myData?.company_info?.mode_of_business.join(",")} </p>
                                                    </div>
                                                    <div className='flex gap-20 mb-2'>
                                                        <p className='text-slate-500 sm:text-xs text-[11px]' >GST No: {myData?.company_info?.gst}</p>
                                                    </div>
                                                    <div className='flex gap-[73px] mb-2'>
                                                        <p className='text-slate-500 sm:text-xs text-[11px]' >Address: {myData?.company_info?.address}</p>
                                                    </div>
                                                    <div className='mb-2'>
                                                        <p className='text-slate-500 sm:text-xs text-[11px]' >{myData?.company_info?.city}, {myData?.company_info?.state}, {myData?.company_info?.country},-382428</p>
                                                    </div>
                                                    <div className='mb-2'>
                                                        {myData && myData.document_details && myData?.document_details?.some(e => e?.status === "active") && (
                                                            <div className='sm:flex block flex-wrap gap-5 items-center'>
                                                                <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-xs'> Facility Documents</p>
                                                                {myData.document_details.map((e) => (
                                                                    <>
                                                                        {e?.status === "active" && (
                                                                            <a key={e.id} href={e.doc_file} target='_blank' className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-xs text-blue-500 underline'>{e?.certificate_name}</a>
                                                                        )}
                                                                    </>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=''>
                                            <button className='w-[220px] py-2 bg-darkBlue text-white text-sm rounded-lg' onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} className='me-2' /> Back To Chemicals </button>
                                        </div>

                                    </div>
                                </div>
                                <div className='w-full'>
                                    {abc ? (
                                        <>
                                            <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7  px-5 w-full overflow-scroll'>
                                                <h1 className='text-lg font-medium'>Quatation Details</h1>
                                                <div className='w-full h-0 border-b-2 border-gray mb-4 mt-1 '></div>
                                                <div className='flex justify-between mb-2 flex-wrap'>
                                                    <p className='text-[#0A122A]/[0.6] text-xs'>Sub Total</p>
                                                    <p className='text-xs flex items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10">
                                                            </path>
                                                        </svg>
                                                        {formatNumber(priceRange?.minPrice?.toFixed())}
                                                        -
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10">
                                                            </path>
                                                        </svg>
                                                        {formatNumber(priceRange?.maxPrice?.toFixed())}
                                                    </p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-xs'>Discount</p>
                                                    <p className='text-xs text-[#FA3434] flex items-center'>- <RupeesIcon />0.0</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-xs'>Tax</p>
                                                    <p className='text-xs text-[#00B517] flex items-center'>+ <RupeesIcon />0.0</p>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <p className='text-[#0A122A]/[0.6] text-xs'>Delivery Charge</p>
                                                    <p className='text-xs text-[#00B517] flex items-center'>+ <RupeesIcon />0.0</p>
                                                </div>
                                                <div className='border my-3'></div>
                                                <div className=' overflow-scroll'>
                                                    <p className='text-md font-semibold'>Total</p>
                                                    <p className='text-md font-semibold flex flex-col justify-center w-full'>
                                                        <span className='flex items-center'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path>
                                                            </svg>
                                                            {priceRange?.minPrice?.toFixed()}
                                                        </span>
                                                        <span className='text-sm'>
                                                            to
                                                        </span>
                                                        <span className='flex items-center'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10">
                                                                </path>
                                                            </svg>
                                                            {priceRange?.maxPrice?.toFixed()}
                                                        </span>
                                                    </p>

                                                </div>
                                                <div className='mt-3'>

                                                    {loader ? (
                                                        <>
                                                            <button className='w-full bg-darkBlue text-white text-sm flex justify-center px-4 py-2 rounded-lg'>
                                                                <img src={loaderImage} alt="" className='h-[20px] animate-spin' />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className='w-full bg-darkBlue text-white text-sm px-4 py-2 rounded-lg' onClick={submitInquiry}>Submit Inquiry</button>
                                                    )}

                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7 mb-6    px-5'>
                                                <h1 className='text-sm font-medium mb-3 text-gray-500'>Have a coupon?</h1>
                                                <div className='flex'>
                                                    <input type="text" placeholder='Add coupon' className='border-2 border-gray-300 px-2 rounded-bl-md rounded-ss-md text-sm' />
                                                    <button className='text-blue-500 border-2 border-gray-300 px-2 py-1 rounded-br-md rounded-se-md text-sm'>Apply</button>
                                                </div>
                                            </div>
                                            {/* yuvraj */}
                                            <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7  px-5'>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-xs'>Sub Total</p>
                                                    <p className='text-xs flex items-center'><RupeesIcon />{(selectedLot * myData?.catalog?.one_lot_qty_price)}</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-xs'>Discount</p>
                                                    <p className='text-xs text-[#FA3434] flex items-center'>- <RupeesIcon />0.0</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-xs'>Tax</p>
                                                    <p className='text-xs text-[#00B517] flex items-center'>+ <RupeesIcon />0.0</p>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <p className='text-[#0A122A]/[0.6] text-xs'>Delivery Charge</p>
                                                    <p className='text-xs text-[#00B517] flex items-center'>+ <RupeesIcon />0.0</p>
                                                </div>
                                                <div className='border my-3'></div>
                                                <div className='flex justify-between'>
                                                    <p className='text-md font-semibold'>Total</p>
                                                    <p className='text-md font-semibold flex items-center'><RupeesIcon />{(selectedLot * myData?.catalog?.one_lot_qty_price)}</p>
                                                </div>
                                                <div className='mt-3'>
                                                    {/* <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg text-sm' onClick={handleCheckout}>Checkout</button> */}

                                                    {loader ? (
                                                        <>
                                                            <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg text-sm'>
                                                                <img src={loaderImage} alt="" className='h-[20px] animate-spin' />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg text-sm' onClick={submitInquiry}>Submit Inquiry</button>
                                                    )}

                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex md:flex-row flex-col bg-white border border-[#0A122A]/0.1 rounded-2xl shadow mt-10 rounded-2xl'>
                    <ToastContainer />
                    <div className='px-10 py-7 flex flex-col items-center justify-center rounded-2xl w-full'>
                        <div className='w-full h-full'>
                            <div className='h-full'>
                                <div className='h-full w-full px-5'>
                                    <div className='w-full block sm:flex justify-between'>
                                        <div className='flex items-center gap-2 mb-2 sm:mb-0'>
                                            <img src={truck} alt="" className='h-[50px]' />
                                            <div>
                                                <p className='font-medium text-md'>Secure Payment</p>
                                                <p className='stext-xs text-gray-400 text-md'>Have you ever finally just </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 mb-2 sm:mb-0'>
                                            <img src={messagepay} alt="" className='h-[50px]' />
                                            <div>
                                                <p className='font-medium text-md'>Customer support</p>
                                                <p className='stext-xs text-gray-400 text-md'>Have you ever finally just </p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <img src={truck} alt="" className='h-[50px]' />
                                            <div>
                                                <p className='font-medium text-md'>Instant delivery</p>
                                                <p className='stext-xs text-gray-400 text-md'>Have you ever finally just </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='flex md:flex-row flex-col bg-white border border-[#0A122A]/0.1 rounded-2xl shadow mt-10 rounded-2xl'>
                    <ToastContainer />
                    <div className='px-10 py-7 flex flex-col items-center justify-center rounded-2xl w-full'>
                        <div className='w-full h-full'>
                            <div className='h-full'>
                                <div className='h-full w-full '>
                                    <div className='mb-5'>
                                        <h1 className='text-2xl font-semibold'> Other Products from Seller</h1>
                                    </div>
                                    <div className='w-full grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr,1fr,1fr] gap-10'>
                                        {catalogs && catalogs.map((e) => (
                                            <div className='px-3 py-4 shadow rounded-lg'>
                                                <img src={e?.product?.structure} alt="" />
                                                <div>
                                                    <p className='font-medium text-lg mt-2 mb-1'>{e?.product?.name_of_chemical}</p>
                                                    <div className='flex justify-between'>
                                                        <div>
                                                            <p className='text-sm text-gray-400'>CAS No:</p>
                                                            <p className='text-sm'>{e?.product?.CAS_number}</p>
                                                        </div>
                                                        <div>
                                                            <p className='text-sm text-gray-400'>Price:</p>
                                                            <p className='text-sm flex items-center'><RupeesIcon />{e?.catalog?.min_price} - <RupeesIcon />{e?.catalog?.max_price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='mt-4 flex gap-2'>
                                                    <button onClick={() => handleBuyingInquiry(e)} className='bg-darkBlue text-xs text-white font-medium py-2 rounded-lg w-full text-md font-thin'>Buying Inquiry</button>
                                                    <button onClick={() => handleSampleInquiry(e)} className=' border border-darkBlue text-xs font-semibold py-2 rounded-lg w-full text-md font-thin'>Sample Inquiry</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {isOpen && (
                    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div class="flex min-h-full sm:items-end items-center justify-center p-4 text-center sm:items-center sm:p-0">

                                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                    <div class="bg-white py-3">
                                        <div class="flex flex-col items-center">
                                            <img src={right} alt="" className='h-[80px]' />
                                            <h3 className='font-semibold text-2xl mt-4'>Inquiry Successfully!</h3>
                                            <p className='text-xs px-5 text-center mt-3'>Your inquiry submitted successfully seller will connect with you soon.</p>
                                        </div>
                                    </div>
                                    <div class="bg-white mx-8 py-3">
                                        <button onClick={handleNavigate} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-md font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {packageExpire && (
                <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={() => { setPackageExpire(false); setLoader(false) }}>
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                <div class="bg-white py-3">
                                    <div class="flex flex-col items-center">
                                        <img src={exclamation} alt="" className='h-[120px] border border-black rounded-full p-3' />
                                        <h3 className='font-semibold text-xl text-center px-5 mt-4'>With Your Current Membership Plan You Can Add Only {localStorage.getItem("catalogLimit")} Chemicals Into Your Catalog</h3>
                                    </div>
                                </div>
                                <div class="bg-white mx-8 py-3">
                                    <button onClick={handleNavigatePackage} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Browse</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {notPremium && (
                <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={() => { setNotPremium(false); setLoader(false) }}>
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" ></div>

                    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4" >
                                <div class="bg-white py-3">
                                    <div class="flex flex-col items-center">
                                        <img src={exclamation} alt="" className='h-[120px] border border-black rounded-full p-3' />
                                        <h3 className='font-semibold text-xl text-center px-5 mt-4'>You Are Not Premium Member</h3>
                                    </div>
                                </div>
                                <div class="bg-white mx-8 py-3">
                                    <button onClick={handleNavigatePackage} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Browse</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default MyBuyingInquiry
