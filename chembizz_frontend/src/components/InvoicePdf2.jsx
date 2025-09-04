import React, { useContext, useEffect, useRef, useState } from 'react'

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import RupeesIcon from '../assets/Rupees';
import { DisplayContext } from '../context/PdfViewContext';
import { BASE_URL } from '../BASE_URL';


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


const InvoicePdf2 = ({ data }) => {

    // console.log(data)

    const [inquiryType, setInquiryType] = useState("")
    // console.log(inquiryType)

    useEffect(() => {

        if (data?.inq_type && data?.inq_type !== "") {
            setInquiryType(data?.inq_type)
        }

    }, [data]);


    const { setDisplay } = useContext(DisplayContext);

    const location = useLocation()

    const fullPath = location.pathname;
    const pathSegments = fullPath.split('/');
    const basePath = pathSegments.length > 4 ? pathSegments.slice(0, 4).join('/') : fullPath;

    const handleButtonClick = () => {

        if (pathSegments?.[2] === "genarate-manual-invoice" || pathSegments?.[2] === "generate-inquiry-invoice" || pathSegments?.[2] === "edit-invoice") {
            navigate('/company/sales-data');
            setDisplay(false);
        } else {
            setDisplay(false);
        }

    };

    const [userData, setUserData] = useState("")
    const [companyPhoto, setCompanyPhoto] = useState("")
    const [gstCheck, setGstCheck] = useState("")

    useEffect(() => {
        if (!data?.seller_company_details?.[0]?.state || !data?.bill_to_state) {
            setGstCheck("igst")
        } else
            if (data?.seller_company_details?.[0]?.state === data?.bill_to_state) {
                setGstCheck("sgst")
            } else {
                setGstCheck("igst")
            }
    }, [data?.seller_company_details?.[0]?.state, data?.bill_to_state]);

    // console.log(gstCheck)

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

        let pdfName;

        if(data?.invoice_type === "tax_invoice"){
            pdfName = `invoice_${data?.invoice_no}`
        } else {
            pdfName = `performa_${data?.invoice_no}`
        }

        html2canvas(element, { logging: true, letterRendering: 1, useCORS: true })
            .then(canvas => {
                const imgWidth = 208;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const imgData = canvas.toDataURL('img/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`${pdfName}`);
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

    // console.log(data?.invoice_type)

    return (
        <div className='bg-transparent flex flex-col items-center justify-center'>
            <div className='flex gap-5 mb-4'>
                <button onClick={handleDownloadPdf} className='bg-darkBlue text-white text-sm px-14 font-semibold cursor-pointer rounded-[10px] py-2' >Download</button>
                <button onClick={handleButtonClick} className='bg-darkBlue text-white text-sm px-14 font-semibold cursor-pointer rounded-[10px] py-2'>Close</button>
            </div>
            <div ref={divRef} className='bg-white px-10 py-10 w-[50vw]'>
                <div className='mb-10'>
                    <div className='flex justify-between items-center'>
                        <div className=''>
                            <p className='font-semibold text-xl text-[#0070C0]'>{data?.invoice_type === "tax_invoice" && <>TAX INVOICE</>}</p>
                            <p className='font-semibold text-md'>{data?.seller_company_details?.[0]?.company_name}</p>
                            <p className='font-semibold text-md'>GSTIN <span className='font-medium'>{data?.seller_company_details?.[0]?.gst}</span></p>
                            <p className='font-medium text-sm'>{data?.seller_company_details?.[0]?.address}</p>
                            <p className='font-medium text-sm'>{data?.seller_company_details?.[0]?.city}, {data?.seller_company_details?.[0]?.state} - {data?.seller_company_details?.[0]?.pincode}</p>
                            <p className='font-medium text-sm'><span className='font-semibold'>PHONE :</span> {data?.seller_company_details?.[0]?.mobile_num}</p>
                        </div>
                        <div>
                            {data?.bill_to_logo !== "" ? (
                                <img src={data?.bill_to_logo} alt="" className='w-[100px] h-[80px]' />
                            ) : (
                                <div className="w-20 bg-gray-200 h-[80px] rounded-md border-[4px] border-gray-300 flex items-center justify-center mb-2">
                                    <p className="text-2xl font-semibold text-gray-600">
                                        {data?.seller_company_details?.[0]?.company_name?.slice(0, 2)?.toUpperCase()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='grid grid-cols-[1fr,1fr,1fr] mt-10 text-xs gap-5'>
                        <div>
                            <p className=''><span className='font-semibold'>Buyer Details | Bill To:</span> {data?.bill_to_name}</p>
                            <p>{data?.bill_to_address}, {data?.bill_to_city}, {data?.bill_to_state}, {data?.bill_to_country} - {data?.bill_to_pincode}</p>
                            <p>GSTIN: {data?.bill_to_gst_in}</p>
                            <p>Phone: {data?.bill_to_phone}</p>
                        </div>
                        <div className=''>
                            <p className=''><span className='font-semibold'>Shipping address: </span> {data?.shipped_to_name}</p>
                            <p>{data?.shipped_to_address}, {data?.shipped_to_city}, {data?.shipped_to_state} </p>
                            <p className=''>{data?.shipped_to_country} - {data?.shipped_to_pincode}</p>
                            <p className='mb-4'> Phone : {data?.shipped_to_phone}</p>
                            {data?.packaging_type !== "" && (
                                <p className=''><span className='font-semibold'>Packaging Type :</span> {data?.packaging_type}</p>
                            )}
                            {data?.packaging_type !== "" && (
                                <p className=''><span className='font-semibold'>Number Of {data?.packaging_type} :</span> {data?.packaging_no_of_bags}</p>
                            )}
                            {data?.packaging_type !== "" && (
                                <p className=''><span className='font-semibold'>Weight :</span> {data?.packaging_weight}{data?.packaging_weight_type}</p>
                            )}
                        </div>
                        <div className=''>
                            {data?.invoice_no && (
                                <p className=''><span className='font-semibold'>Invoice No. :</span> {data?.invoice_no}</p>
                            )}
                            {data?.invoice_date && (
                                <p className=''><span className='font-semibold'>Invoice Date :</span> {formatDate(data?.invoice_date)}</p>
                            )}
                            <p className=''><span className='font-semibold'>P.O. No. :</span> {data?.po_num}</p>
                            <p className=''><span className='font-semibold'>P.O. Date :</span> {formatDate(data?.po_date)}</p>
                            {(data?.due_date || inquiryType === "commercial") && (
                                <p className=''><span className='font-semibold'>Due Date :</span> {formatDate(data?.due_date)}</p>
                            )}
                            {data?.eway_no !== "" && inquiryType === "commercial" &&  (
                                <p className=''><span className='font-semibold'>EWB :</span> {data?.eway_no}</p>
                            )}
                            {data?.eway_no !== "" && inquiryType === "sample inquiry" && (
                                <p className=''><span className='font-semibold'>EWB :</span> {data?.eway_no}</p>
                            )}
                            {(data?.payment_terms || inquiryType === "commercial") && (
                                <p className=''><span className='font-semibold'>Payment Terms :</span> {data?.payment_terms}</p>
                            )}
                            {(data?.inco_terms || inquiryType === "commercial") && (
                                <p className=''><span className='font-semibold'>Inco Terms :</span> {data?.inco_terms}</p>
                            )}
                            {(data?.vehicle_no !== "") && (
                                <p className=''><span className='font-semibold'>Vehicle Number :</span> {data?.vehicle_no}</p>
                            )}
                            {data?.delivery_time !== "" && data?.delivery_time !== "undefined" && (
                                <p className=''><span className='font-semibold'>Delivery Time :</span> {data?.delivery_time}</p>
                            )}
                            {data?.mode_of_transport !== "" && data?.mode_of_transport !== undefined && (
                                <p className=''><span className='font-semibold'>Mode Of Transport :</span> {data?.mode_of_transport}</p>
                            )}
                        </div>
                    </div>
                </div>

                <table className="w-full table-auto mt-10 text-xs">
                    <thead className=' bg-[#0070C0] text-white'>
                        <tr className='text-xs'>
                            <th className=' w-[5%] font-medium py-3'>Sr No.</th>
                            <th className=' w-[25%] font-semibold text-start ps-5'>Name Of Product / Service</th>
                            <th className=' w-[7%] font-semibold text-center'>HSN / SAC</th>
                            <th className='w-[7%] font-semibold '>Qty</th>
                            <th className='w-[7%] font-semibold '>Rate</th>
                            <th className='w-[7%] font-semibold '>Taxable Value</th>
                            <th className='w-[5%] font-semibold '>{gstCheck === 'IGST' ? 'Amount (IGST)' : 'Amount (CGST/SGST)'}</th>
                            <th className='w-[5%] font-semibold '>Total</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {data && data?.product_details.map((e, index) => (
                            <tr className='border-b-[3px]'>
                                <td className=' font-medium ps-3 py-2 text-center align-baseline'>{index + 1}. </td>
                                <td className=' font-medium ps-5 py-2'>
                                    <p className='font-semibold'>{e.chem_name}</p>
                                </td>
                                <td className=' font-medium py-2 text-center'>{e.hsn}</td>
                                <td className=' font-medium py-2 text-center'>{e.qty}{e.qty_type} </td>
                                <td className=' font-medium  py-2 text-center'>
                                    <p className='flex items-center justify-center'>
                                        <RupeesIcon />{e.rate}</p></td>
                                <td className=' font-medium  py-2 text-center '>
                                    <p className='flex items-center justify-center '>
                                        <RupeesIcon />{e.taxable_amount}</p></td>
                                {gstCheck === 'igst' ? (
                                    <td className=' font-medium  py-2 text-center'>{(e.gstAmount?.toFixed())}({e.igst}%)</td>
                                ) : (
                                    <td className=' font-medium  py-2 text-center'>{e.gstAmount?.toFixed() / 2}({e.igst / 2}%) <br /> {e.gstAmount?.toFixed() / 2}({e.igst / 2}%)</td>
                                )}
                                <td className='font-medium  py-2 text-center'>
                                    <p className='flex items-center '>
                                        <RupeesIcon />
                                        {e.total}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='grid grid-cols-[2fr,1fr] mt-4 text-xs'>
                    <div></div>
                    <div>
                        <div className='flex justify-between mb-2'>
                            <p className='font-bold'>Taxable Amount</p>
                            <p className='me-4 font-bold flex items-center '>
                                <RupeesIcon />
                                {totals?.totalTaxable}</p>
                        </div>
                        {gstCheck === 'igst' && (
                            <div className='flex justify-between mb-2'>
                                <p className='font-bold'>Add:IGST</p>
                                <p className='me-4 font-bold flex items-center '>
                                    <RupeesIcon />
                                    {totals?.totalGstAmount}</p>
                            </div>
                        )}
                        {gstCheck !== 'igst' && (
                            <div className='flex justify-between mb-2'>
                                <p className='font-bold'>Add:SGST</p>
                                <p className='me-4 font-bold flex items-center '>
                                    <RupeesIcon />
                                    {totals?.totalGstAmount / 2} ({totals?.totalGst / 2}%)</p>
                            </div>
                        )}
                        {gstCheck !== 'igst' && (
                            <div className='flex justify-between mb-2'>
                                <p className='font-bold'>Add:CGST</p>
                                <p className='me-4 font-bold flex items-center '>
                                    <RupeesIcon />
                                    {totals?.totalGstAmount / 2} ({totals?.totalGst / 2}%)</p>
                            </div>
                        )}
                        <div className='flex justify-between mb-2'>
                            <p className='font-bold'>Total Tax</p>
                            <p className='me-4 font-bold flex items-center '>
                                <RupeesIcon />
                                {totals?.totalGstAmount}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p className='font-bold'>Final Amount</p>
                            <p className='me-4 font-bold flex items-center '>
                                <RupeesIcon />
                                {totals?.totalAmount}</p>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between border-b-[3px] border-blue-400 mt-5 pb-2 text-xs'>
                    <div>
                        <p className=''>Total Qty : {totalQty} kg</p>
                    </div>
                    <div>
                        <p className='font-medium'>Total amount (in words): {numberToWords(totalAmount).toUpperCase()}</p>
                    </div>
                </div>

                <div className='grid grid-cols-[2fr,1fr] mt-10 text-xs'>
                    <div className=''>
                        {data?.invoice_type !== "po" && (
                            <div className=''>
                                <p className='font-semibold'>Bank Details</p>
                                <div className='grid grid-cols-[1fr,3fr] mt-2'>
                                    <p className='text-gray-500'>Name :</p>
                                    <p className='font-semibold'>{data?.bank_details?.[0]?.bank_name}</p>
                                </div>
                                <div className='grid grid-cols-[1fr,3fr]'>
                                    <p className='text-gray-500'>Branch :</p>
                                    <p className='font-semibold'>{data?.bank_details?.[0]?.bank_branch}</p>
                                </div>
                                <div className='grid grid-cols-[1fr,3fr]'>
                                    <p className='text-gray-500'>Acc. Number: :</p>
                                    <p className='font-semibold'>{data?.bank_details?.[0]?.bank_account_num}</p>
                                </div>
                                <div className='grid grid-cols-[1fr,3fr]'>
                                    <p className='text-gray-500'>IFSC Code :</p>
                                    <p className='font-semibold'>{data?.bank_details?.[0]?.bank_IFSC_code}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col items-center'>
                        <p className='font-semibold'>For Global Securities</p>
                        <img src={data.upload_stamp} alt="" className='h-[100px]' />
                        <img src={data.upload_sign} alt="" className='h-[20px]' />
                    </div>
                </div>
                <div className=' text-xs'>
                    <p className='text-lg font-semibold'>Terms and Conditions:</p>
                    <p className='text-gray-500 font-medium'>{data?.termsand_condition}</p>
                </div>
            </div>
        </div>
    )
}

export default InvoicePdf2
