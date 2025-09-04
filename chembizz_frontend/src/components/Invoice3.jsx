import React, { useContext, useEffect, useRef, useState } from 'react'
import invoiceCompany from "../images/invoice-company.png"
import QR2 from "../images/QR2.png"
import globalsign from "../images/globalsign.png"
import { useLocation, useParams } from 'react-router-dom'

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import RupeesIcon from '../assets/Rupees'
import { DisplayPoContext } from '../context/PoViewContext'
import { BASE_URL } from '../BASE_URL'


function numberToWords(num) {
    if (num === 0) return "Zero";

    const belowTwenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
        "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Million", "Billion"];

    function helper(num) {
        if (num === 0) return "";
        else if (num < 20) return belowTwenty[num] + " ";
        else if (num < 100) return tens[Math.floor(num / 10)] + " " + helper(num % 10);
        else return belowTwenty[Math.floor(num / 100)] + " Hundred " + helper(num % 100);
    }

    let result = "";
    let i = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
            result = helper(num % 1000) + thousands[i] + " " + result;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return result.trim();
}

const determineTaxType = (billToState, shipToState) => {
    return billToState === shipToState ? 'CGST_SGST' : 'IGST';
};


const formatDate = (dateString) => {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Extract the day, month, and year in UTC from the date
    const day = String(date.getUTCDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();

    // Return the formatted date as "DD-MM-YYYY"
    return `${day}-${month}-${year}`;
};



const Invoice3 = ({ data }) => {

    // console.log(data)

    const { setDisplayPo } = useContext(DisplayPoContext);

    const location = useLocation();

    const fullPath = location.pathname;
    const pathSegments = fullPath.split('/');

    const handleButtonClick = () => {
        if (pathSegments?.[2] === "generate-new-manual-po" || pathSegments?.[2] === "edit-po" || pathSegments?.[2] === "generate-po" || pathSegments?.[2] === "generate-new-inquiry-po" || pathSegments?.[2] === "sales-data") {
            navigate('/company/purchase-data');
            setDisplayPo(false);
        } else {
            setDisplayPo(false);
        }
    };

    const [userData, setUserData] = useState("")
    const [companyPhoto, setCompanyPhoto] = useState("")

    const fetchUserData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}company/cominfo`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setUserData(data.companyDetails?.[0]);
        if (data?.companyDetails?.[0]?.other_info?.length > 0) {
            setCompanyPhoto(data?.companyDetails?.[0]?.other_info?.[0]?.logo)
        }
    }


    useEffect(() => {
        fetchUserData();
    }, []);


    const navigate = useNavigate()

    const divRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleDownloadPdf = () => {
        const element = divRef.current;
        if (!element) {
            console.error("Element not found in the document.");
            return;
        }

        html2canvas(element, { logging: true, letterRendering: 1, useCORS: true })
            .then(canvas => {
                const imgWidth = 208;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const imgData = canvas.toDataURL('img/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`po_${data?.po_num}`);
            })
            .catch(error => {
                console.error("Error capturing the element with html2canvas:", error);
            });
    };

    useEffect(() => {

        const image = new Image();
        image.src = companyPhoto;

        image.onload = () => {
            setImageLoaded(true);
        };

        image.onerror = () => {
            console.error('Failed to load image.');
            setImageLoaded(false);
        };
    }, [companyPhoto]);


    const calculateTotals = (array) => {
        return array.reduce((totals, item) => {
            totals.totalQuantity += parseFloat(item.qty);
            totals.totalRate += parseFloat(item.rate);
            totals.totalTaxable += parseFloat(item.taxable_amount);
            totals.totalGst += parseFloat(item.igst);
            totals.totalGstAmount += parseFloat(item.gstAmount);
            totals.totalAmount += parseFloat(item.total);
            return totals;
        }, { totalQuantity: 0, totalRate: 0, totalGst: 0, totalGstAmount: 0, totalTaxable: 0, totalAmount: 0 });
    };

    const totals = calculateTotals(data?.product_details);


    const totalQty = data?.product_details.reduce((sum, item) => sum + item.qty, 0);
    const totalTaxableValue = data?.product_details.reduce((sum, item) => sum + item.taxable_amount, 0);
    const totalIGST = data?.product_details.reduce((sum, item) => sum + ((item.igst * item.taxable_amount) / 100), 0);
    const totalAmount = data?.product_details.reduce((sum, item) => sum + (((item.igst * item.taxable_amount) / 100) + item.taxable_amount), 0);
    const totalGstPercentage = totalTaxableValue > 0 ? (totalIGST / totalTaxableValue) * 100 : 0;

    const [gstCheck, setGstCheck] = useState("")

    useEffect(() => {
        if (!data?.seller_to_state || !data?.bill_to_state) {
            setGstCheck("igst")
        } else
            if (data?.seller_to_state === data?.bill_to_state) {
                setGstCheck("sgst")
            } else {
                setGstCheck("igst")
            }
    }, [data?.seller_to_state, data?.bill_to_state]);

    return (
        <div className='bg-transparent flex flex-col items-center justify-center'>
            <div className='flex gap-5 mb-4'>
                <button onClick={handleDownloadPdf} className='bg-darkBlue text-white text-sm px-14 font-semibold cursor-pointer rounded-[10px] py-2' >Download</button>
                <button onClick={handleButtonClick} className='bg-darkBlue text-white text-sm px-14 font-semibold cursor-pointer rounded-[10px] py-2'>Close</button>
            </div>
            <div ref={divRef} className='bg-white px-10 py-10 w-[50vw] text-xs'>
                <div>
                    <h1 className='text-4xl font-bold text-[#0070C0] text-center mb-3'>{data?.invoice_type?.toUpperCase()}</h1>
                </div>
                <div className='border-[3px] border-blue-400'>
                    <div className='grid grid-cols-[1fr,1fr]'>
                        <div className='border-r-[3px] border-blue-400'>
                            <div className='flex py-2 px-4 gap-4 border-b-[3px] border-blue-400'>
                                <div>
                                    {/* <img src={data?.bill_to_logo} alt="" className='max-h-[100px]' /> */}
                                    {data?.bill_to_logo ? (
                                        <img src={data?.bill_to_logo} alt="" className='w-[100px] h-[80px]' />
                                    ) : (
                                        <div className="w-20 bg-gray-200 h-[80px] rounded-md border-[4px] border-gray-300 flex items-center justify-center mb-2">
                                            <p className="text-2xl font-semibold text-gray-600">
                                                {data?.bill_to_name?.slice(0, 2)?.toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className='font-semibold text-[14px]'>{data?.bill_to_name}</p>
                                    <p className='font-medium'>{data?.bill_to_address}</p>
                                    <p className='font-medium'>{data?.bill_to_city}, {data?.bill_to_state}, {data?.bill_to_country} - {data?.bill_to_pincode}</p>
                                    <p className='font-medium'>GSTIN : {data?.bill_to_gst_in}</p>
                                </div>
                            </div>
                            <div className='py-2 px-4 border-b-[3px] border-blue-400'>
                                <div>
                                    <p className='font-semibold text-sm text-gray-500'>Details of Buyer :</p>
                                    <p className='font-semibold text-sm'>{data?.shipped_to_name}</p>
                                    <p className='font-medium'>{data?.shipped_to_address}</p>
                                    <p className='font-medium'>{data?.shipped_to_city}, {data?.shipped_to_state}, {data?.shipped_to_country} - {data?.shipped_to_pincode}</p>
                                    <div className='flex'>
                                        <p className='w-[45px] font-medium'>GSTIN</p>
                                        <p className='font-medium'>{data?.shipped_to_gst_in}</p>
                                    </div>
                                    <p className='font-medium'>{data?.shipped_to_phone}</p>
                                </div>
                            </div>
                            <div className='flex py-2 px-4 gap-8'>
                                <div>
                                    <p className='font-semibold text-sm text-gray-500'>Details of Seller :</p>
                                    <p className='font-semibold text-sm'>{data?.seller_to_name}</p>
                                    <p className='font-medium'>{data?.seller_to_address}</p>
                                    <p className='font-medium'>{data?.seller_to_state}, {data?.seller_to_country} - {data?.seller_to_pincode}</p>
                                    <div className='flex'>
                                        <p className='w-[45px] font-medium'>GSTIN</p>
                                        <p className='font-medium'>{data?.seller_to_gst_in}</p>
                                    </div>
                                    <p className='font-medium'>{data?.seller_to_phone}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='grid grid-cols-[1fr,1fr]'>

                                <div className='border-b-[3px] border-r-[3px] border-blue-400 py-2 ps-5'>
                                    <p className='font-medium'>P.O. No.</p>
                                    <p className='text-sm font-semibold'>{data?.po_num}</p>
                                </div>
                                <div className='border-b-[3px] border-blue-400 py-2 ps-5'>
                                    <p className='font-medium'>P.O. Date</p>
                                    <p className='text-sm font-semibold'>{formatDate(data?.po_date)}</p>
                                </div>
                                {data?.payment_terms !== "" && (
                                    <>
                                        <div className='border-b-[3px] border-r-[3px] border-blue-400 py-2 ps-5'>
                                            <p className='font-medium'>Payment Terms</p>
                                            <p className='text-sm font-semibold'>{data?.payment_terms}</p>
                                        </div>
                                        <div className='border-b-[3px] border-blue-400 py-2 ps-5'>
                                            <p className='font-medium'>Inco Terms</p>
                                            <p className='text-sm font-semibold'>{data?.inco_terms}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <table className="w-full table-auto mt-10">
                    <thead className=' bg-blue-100'>
                        <tr className='border-[3px] border-blue-400'>
                            <th className='border-blue-400 border-r-[3px] w-[5%] font-medium text-sm py-3'>Sr No.</th>
                            <th className='border-blue-400 border-r-[3px] w-[25%] font-semibold text-sm'>Name Of Product / Service</th>
                            <th className='border-blue-400 border-r-[3px] w-[7%] font-semibold text-sm text-center'>HSN / SAC</th>
                            <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>Qty</th>
                            <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>Rate</th>
                            <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>Taxable Value</th>
                            <th className='w-[5%] font-semibold text-sm border-blue-400 border-r-[3px]'>
                                {gstCheck === "igst" ? (
                                    <span>Amount(IGST)</span>
                                ) : (
                                    <span>Amount(sgst/cgst)</span>
                                )}
                            </th>
                            <th className='w-[5%] font-semibold text-sm border-blue-400 border-r-[3px]'>Total</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {data && data?.product_details.map((e, index) => (
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] border-l-[3px] font-medium ps-3 py-2 text-center align-baseline text-xs'>{index + 1}</td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-3 py-2 text-xs'>
                                    <p className='font-semibold'>{e.chem_name}</p>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium py-2 text-center text-xs'>{e.hsn}</td>
                                <td className='border-blue-400 border-r-[3px] font-medium py-2 text-center text-xs'>{e.qty}{e.qty_type} </td>
                                <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />
                                        {e.rate}
                                    </p>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />
                                        {e.taxable_amount}
                                    </p>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                    {gstCheck === "igst" ? (
                                        <span>{e.gstAmount}({e.igst}%)</span>
                                    ) : (
                                        <span>{e.gstAmount / 2}({e.igst / 2}%) <br /> {e.gstAmount / 2}({e.igst / 2}%)</span>
                                    )}
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />
                                        {e.total}
                                    </p>
                                </td>
                            </tr>
                        ))}

                        <tr className='border-blue-400 border-[3px] bg-blue-100 text-xs'>
                            <td colSpan={3} className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>Total</td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'></td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'></td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                <p className='flex items-center justify-center'>
                                    <RupeesIcon />
                                    {(totals.totalTaxable).toFixed(2)}
                                </p>
                            </td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                <p className='flex items-center justify-center'>
                                    <RupeesIcon />
                                    {(totals.totalGstAmount).toFixed(2)}
                                </p>
                            </td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                <p className='flex items-center justify-center'>
                                    <RupeesIcon />
                                    {(totals.totalAmount).toFixed(2)}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className='border-blue-400 border-[3px] border-t-0 py-2 px-5'>
                    <p className='font-medium'>Total in words</p>
                    <p className='text-[14px] font-semibold'>{numberToWords(totals.totalAmount.toFixed()).toUpperCase()}</p>
                </div>

                <table className="w-full table-auto">
                    <thead className=' bg-blue-100'>
                        <tr className='border-[3px] border-t-0 border-blue-400'>
                            <th className='border-blue-400 border-r-[3px] w-[5%] font-medium text-sm py-3'>Sr No.</th>
                            <th className='border-blue-400 border-r-[3px] w-[20%] font-semibold text-sm'>HSN / SAC</th>
                            <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>Taxable Value</th>
                            {gstCheck === "igst" && (
                                <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>IGST</th>
                            )}
                            {gstCheck !== "igst" && (
                                <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>SGST</th>
                            )}
                            {gstCheck !== "igst" && (
                                <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>CGST</th>
                            )}
                            <th className='w-[5%] font-semibold text-sm border-blue-400 border-r-[3px]'>Total</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {data && data?.product_details.map((e, index) => (
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] border-l-[3px] font-medium ps-3 py-2 text-center align-baseline text-xs'>{index + 1}</td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-3 py-2 text-xs'>
                                    <p className='font-semibold'>{e.hsn}</p>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />
                                        {e.taxable_amount}
                                    </p>
                                </td>
                                {gstCheck === "igst" && (
                                    <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                        <p className='flex items-center justify-center'>
                                            <RupeesIcon />
                                            {e.gstAmount}({e.igst}%)
                                        </p>
                                    </td>
                                )}
                                {gstCheck !== "igst" && (
                                    <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                        <p className='flex items-center justify-center'>
                                            <RupeesIcon />
                                            {e.gstAmount / 2}({e.igst / 2}%)
                                        </p>
                                    </td>
                                )}
                                {gstCheck !== "igst" && (
                                    <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                        <p className='flex items-center justify-center'>
                                            <RupeesIcon />
                                            {e.gstAmount / 2}({e.igst / 2}%)
                                        </p>
                                    </td>
                                )}
                                <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />
                                        {e.total}
                                    </p>
                                </td>
                            </tr>
                        ))}

                        <tr className='border-blue-400 border-[3px] bg-blue-100 text-xs'>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'></td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'></td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                <p className='flex items-center justify-center'>
                                    <RupeesIcon />
                                    {(totals.totalTaxable).toFixed(2)}
                                </p>
                            </td>
                            {gstCheck === "igst" && (
                                <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />
                                        {(totals.totalGstAmount).toFixed(2)}
                                    </p>
                                </td>
                            )}
                            {gstCheck !== "igst" && (
                                <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />
                                        {(totals.totalGstAmount / 2).toFixed(2)}
                                    </p>
                                </td>
                            )}
                            {gstCheck !== "igst" && (
                                <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />
                                        {(totals.totalGstAmount / 2).toFixed(2)}
                                    </p>
                                </td>
                            )}
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                <p className='flex items-center justify-center'>
                                    <RupeesIcon />
                                    {(totals.totalAmount).toFixed(2)}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className='border-blue-400 border-[3px] border-t-0 grid grid-cols-[1fr]'>
                    <div className='grid grid-cols-[1fr,1fr]'>
                        <div className='flex flex-col justify-end pb-3 ps-3'>
                            <p className='text-lg font-semibold'>Terms and Conditions:</p>
                            <p className='text-gray-500 font-medium'>{data?.termsand_condition}</p>
                        </div>
                        <div className='border-blue-400 border-[3px] border-b-0 border-r-0 border-t-0'>
                            <div className='px-3 pt-2'>
                                <p className='font-semibold text-end text-lg'>For Global Securities</p>
                                <div className='flex flex-col items-center'>
                                    <img src={data?.upload_stamp} alt="" className='h-[100px]' />
                                    <img src={data?.upload_sign} alt="" className='h-[20px]' />
                                    <p className='font-semibold text-lg'>Authorised Signatory</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Invoice3
