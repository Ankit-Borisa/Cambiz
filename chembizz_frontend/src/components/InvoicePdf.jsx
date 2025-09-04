import React, { useContext, useEffect, useRef, useState } from 'react'
import invoiceCompany from "../images/invoice-company.png"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSharedState } from '../context/ManageOpenContext';
import RupeesIcon from '../assets/Rupees';
import { DisplayContext } from '../context/PdfViewContext';
import { BASE_URL } from '../BASE_URL';

function numberToWords(num) {
    if (num === 0) return "Zero";

    const belowTwenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
        "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Lakh", "Crore"]; // Indian scales

    function helper(num) {
        if (num === 0) return "";
        else if (num < 20) return belowTwenty[num] + " ";
        else if (num < 100) return tens[Math.floor(num / 10)] + " " + helper(num % 10);
        else return belowTwenty[Math.floor(num / 100)] + " Hundred " + helper(num % 100);
    }

    let result = "";
    let i = 0;

    // Handling numbers in the Indian numbering system
    while (num > 0) {
        let part = num % (i === 1 ? 100 : 1000); // Split by 100 after 'Thousand', then by 1000 for the rest
        if (part !== 0) {
            result = helper(part) + scales[i] + " " + result;
        }
        num = Math.floor(num / (i === 1 ? 100 : 1000)); // Switch division by 100 for thousands place
        i++;
    }

    return result.trim();
}

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
  


const InvoicePdf = ({ data }) => {

    // console.log(data)

    const [inquiryType, setInquiryType] = useState("")

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

    const companyId = localStorage.getItem("myCompanyId")
    const [userPost, setUserPost] = useState("")

    useEffect(() => {

        if (data?.buyer_company_id === companyId) {
            setUserPost("buyer")
        } else {
            setUserPost("seller")
        }

    }, [data, companyId]);

    const { sharedState, setSharedState } = useSharedState();

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
        if (!data?.seller_to_state || !data?.bill_to_state) {
            setGstCheck("igst")
        } else
            if (data?.seller_to_state === data?.bill_to_state) {
                setGstCheck("sgst")
            } else {
                setGstCheck("igst")
            }
    }, [data?.seller_to_state, data?.bill_to_state]);

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

        // console.log(pdfName)

        html2canvas(element, {
            logging: true,
            letterRendering: 1,
            useCORS: true,
            scale: 3,
        })
            .then(canvas => {
                const imgWidth = 208;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');

                // Set the image quality and scale in jsPDF
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST', {
                    quality: 0.98  // Adjust the quality (0 to 1), 1 being the highest
                });

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

    return (
        <div className='bg-transparent flex flex-col items-center justify-center'>
            <div className='flex gap-5 mb-4'>
                <button onClick={handleDownloadPdf} className='bg-darkBlue text-white text-sm px-14 font-semibold cursor-pointer rounded-[10px] py-2' >Download</button>
                <button
                    // onClick={handleButtonClick}
                    onClick={handleButtonClick}
                    className='bg-darkBlue text-white text-sm px-14 font-semibold cursor-pointer rounded-[10px] py-2'>Close</button>
            </div>
            <div ref={divRef} className='bg-white px-10 py-10 w-[50vw]'>
                <div className='mb-10'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2'>
                            <div className='h-full'>
                            {data?.bill_to_logo !== "" ? (
                                    <img src={data?.bill_to_logo} alt="" className='w-[100px] h-[80px]' />
                                ) : (
                                    <div className="h-full w-20 bg-gray-200 rounded-md border-[4px] border-gray-300 flex items-center justify-center mb-2">
                                        <p className="text-2xl font-semibold text-gray-600">
                                            {data?.invoice_type === "po" ? data?.seller_company_details?.[0]?.company_name?.slice(0, 2)?.toUpperCase() : data?.seller_company_details?.[0]?.company_name?.slice(0, 2)?.toUpperCase()}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className='font-medium text-sm'>{data?.invoice_type === "po" ? data?.buyer_company_details?.[0]?.company_name : data?.seller_company_details?.[0]?.company_name}</p>
                                <p className='font-medium text-sm'>{data?.invoice_type === "po" ? data?.buyer_company_details?.[0]?.address : data?.seller_company_details?.[0]?.address}</p>
                                <p className='font-medium text-sm'>{data?.invoice_type === "po" ? data?.buyer_company_details?.[0]?.city : data?.seller_company_details?.[0]?.city},
                                    {data?.invoice_type === "po" ? data?.buyer_company_details?.[0]?.state : data?.seller_company_details?.[0]?.state}
                                    -
                                    {data?.invoice_type === "po" ? data?.buyer_company_details?.[0]?.pincode : data?.seller_company_details?.[0]?.pincode}
                                </p>
                                <p className='font-medium text-sm'>{data?.invoice_type === "po" ? data?.buyer_company_details?.[0]?.gst : data?.seller_company_details?.[0]?.gst}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <table className="w-full border-[3px] border-blue-400 table-auto">
                    <thead className='border-b-[3px] border-blue-400'>
                        <tr className=''>
                            <th className='border-blue-400 border-r-[3px] w-1/3 font-medium text-md leading-48'>
                                {/* <p className='py-2'><span className='font-semibold'>GSTIN</span> : {data?.bill_to_gst_in}</p> */}
                            </th>
                            <th className='border-blue-400 border-r-[3px] w-1/3 font-semibold text-md text-[#0070C0] '>
                                {data.invoice_type === "po" ? (
                                    <p className=''>PURCHASE ORDER</p>
                                ) : data.invoice_type === "performa_invoice" ? (
                                    <p>PERFORMA INVOICE</p>
                                ) : (
                                    <p>TAX INVOICE</p>
                                )}
                            </th>
                            <th className='w-1/3 font-semibold text-md '>
                                {data?.invoice_type === "tax_invoice" && (
                                    <p>ORIGINAL FOR RECIPIENT</p>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 py-2 text-xs'>Details of Buyer | Billed to : </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 py-2 text-xs'>Details of Consignee | Shipped to : </td>
                            <td className='font-medium ps-3'>
                                <div className='grid grid-cols-[1fr,1fr,]'>
                                    <p className='text-xs'>P.O. No :</p>
                                    <p className='text-xs'>{data?.po_num}</p>
                                </div>
                            </td>

                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Name :</p>
                                    <p className='text-xs'>{data?.bill_to_name}</p>
                                </div>
                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top '>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Name :</p>
                                    <p className='text-xs'>{data?.shipped_to_name}</p>
                                </div>
                            </td>
                            <td className='font-medium ps-3 align-top'>
                                <div className='grid grid-cols-[1fr,1fr,]'>
                                    <p className='text-xs'>P.O. Date :</p>
                                    <p className='text-xs'>{data?.po_date && formatDate(data?.po_date)}</p>
                                </div>
                            </td>
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>GSTIN :</p>
                                    <p className='text-xs'>{data?.bill_to_gst_in}</p>
                                </div>
                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                {/* <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>GSTIN :</p>
                                    <p className='text-xs'>{data?.bill_to_gst_in}</p>
                                </div> */}
                            </td>
                            <td className='font-medium ps-3 py-2 align-top'>
                                <div className='grid grid-cols-[1fr,1fr,]'>
                                    <p className='text-xs'>Invoice No :</p>
                                    <p className='text-xs'>{data?.invoice_no}</p>
                                </div>
                            </td>

                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Address :</p>
                                    <p className='text-xs'>{data?.bill_to_address}</p>
                                </div>
                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Address :</p>
                                    <p className='text-xs'>{data?.shipped_to_address}</p>
                                </div>
                            </td>
                            <td className='font-medium ps-3 align-top'>
                                <div className='grid grid-cols-[1fr,1fr]'>
                                    <p className='text-xs'>Invoice Date :</p>
                                    <p className='text-xs'>{formatDate(data?.invoice_date)}</p>
                                </div>
                                {data?.due_date !== "" && (
                                    <div className='grid grid-cols-[1fr,1fr]'>
                                        <p className='text-xs'>Due Date :</p>
                                        <p className='text-xs'>{formatDate(data?.due_date)}</p>
                                    </div>
                                )}
                                {data?.eway_no !== "" && (
                                    <div className='grid grid-cols-[1fr,1fr,]'>
                                        <p className='text-xs'>{inquiryType === "commercial" ? "E-Way No" : "EWB"} :</p>
                                        <p className='text-xs'>{data?.eway_no}</p>
                                    </div>
                                )}
                            </td>
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Country :</p>
                                    <p className='text-xs'>{data?.bill_to_country}</p>
                                </div>
                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Country :</p>
                                    <p className='text-xs'>{data?.shipped_to_country}</p>
                                </div>
                            </td>
                            {data?.inco_terms !== "" && (
                                <td className='font-medium ps-3 align-top'>
                                    <div className='grid grid-cols-[1fr,1fr]'>
                                        <p className='text-xs'>Inco Terms : </p>
                                        <p className='text-xs'>{data?.inco_terms}</p>
                                    </div>
                                </td>
                            )}
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>State :</p>
                                    <p className='text-xs'>{data?.bill_to_state}</p>
                                </div>
                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>State :</p>
                                    <p className='text-xs'>{data?.shipped_to_state}</p>
                                </div>
                            </td>
                            {data?.payment_terms !== "" && (
                                <td className='font-medium ps-3 align-top'>
                                    <div className='grid grid-cols-[1fr,1fr]'>
                                        <p className='text-xs'>Payment Terms : </p>
                                        <p className='text-xs'>{data?.payment_terms}</p>
                                    </div>
                                </td>
                            )}
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>City :</p>
                                    <p className='text-xs'>{data?.bill_to_city}</p>
                                </div>
                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>City :</p>
                                    <p className='text-xs'>{data?.shipped_to_city}</p>
                                </div>
                            </td>
                            {data?.packaging_type !== "" && (
                                <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                    <div className="grid grid-cols-[2.5fr,2.4fr,]">
                                        <p className='text-xs'>Packaging Type :</p>
                                        <p className='text-xs'>{data?.packaging_type}</p>
                                    </div>
                                </td>
                            )}
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Pincode:</p>
                                    <p className='text-xs'>{data?.bill_to_pincode}</p>
                                </div>
                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Pincode:</p>
                                    <p className='text-xs'>{data?.shipped_to_pincode}</p>
                                </div>
                            </td>
                            {data?.packaging_type !== "" && (
                                <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                    <div className="grid grid-cols-[3.4fr,2.4fr,]">
                                        <div>
                                            <p className='text-xs'>Packaging Weight : <span className='text-[8px] leading-1'>(1 unit)</span></p>
                                        </div>
                                        <p className='text-xs'>{data?.packaging_weight}{data?.packaging_weight_type}</p>
                                    </div>
                                </td>
                            )}
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                {data?.bill_to_phone && <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Phone :</p>
                                    <p className='text-xs'>{data?.bill_to_phone}</p>
                                </div>}
                                
                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                {data?.shipped_to_phone && <div className="grid grid-cols-[1fr,2.4fr,]">
                                    <p className='text-xs'>Phone :</p>
                                    <p className='text-xs'>{data?.shipped_to_phone}</p>
                                </div>}
                                
                            </td>
                            {data?.packaging_type !== "" && (
                                <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                    <div className="grid grid-cols-[2.5fr,2.4fr,]">
                                        <p className='text-xs'>Total Units :</p>
                                        <p className='text-xs'>{data?.packaging_no_of_bags}</p>
                                    </div>
                                </td>
                            )}
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 pb-5 align-top'>

                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 pb-5 align-top'>

                            </td>
                            {data?.vehicle_no !== "" && (
                                <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                    <div className="grid grid-cols-[2.5fr,2.4fr,]">
                                        <p className='text-xs'>Vehicle Number :</p>
                                        <p className='text-xs'>{data?.vehicle_no}</p>
                                    </div>
                                </td>
                            )}
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 pb-5 align-top'>

                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 pb-5 align-top'>

                            </td>
                            {/* {data?.delivery_time !== "" && data?.delivery_time !== "undefined" && (
                                <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                    <div className="grid grid-cols-[2.5fr,2.4fr,]">
                                        <p className='text-xs'>Delivery Time :</p>
                                        <p className='text-xs'>{data?.delivery_time}</p>
                                    </div>
                                </td>
                            )} */}
                        </tr>
                        <tr className=''>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 pb-5 align-top'>

                            </td>
                            <td className='border-blue-400 border-r-[3px] font-medium ps-3 pb-5 align-top'>

                            </td>
                            {data?.mode_of_transport && data?.mode_of_transport !== "" && (
                                <td className='border-blue-400 border-r-[3px] font-medium ps-3 align-top'>
                                    <div className="grid grid-cols-[2.5fr,2.4fr,]">
                                        <p className='text-xs'>Mode Of Transport :</p>
                                        <p className='text-xs'>{data?.mode_of_transport}</p>
                                    </div>
                                </td>
                            )}
                        </tr>

                    </tbody>
                </table>

                <table className="w-full table-auto mt-10">
                    <thead className=' bg-blue-100'>
                        <tr className='border-[3px] border-blue-400'>
                            <th className='border-blue-400 border-r-[3px] w-[5%] font-medium text-sm py-3'>Sr No.</th>
                            <th className='border-blue-400 border-r-[3px] w-[25%] font-semibold text-sm'>Name Of Product / Service</th>
                            <th className='border-blue-400 border-r-[3px] w-[7%] font-semibold text-sm text-center'>HSN / SAC</th>
                            <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>Qty</th>
                            <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>Rate</th>
                            <th className='w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]'>Taxable Value</th>
                            {gstCheck === "igst" && (
                                <th className='w-[5%] font-semibold text-sm border-blue-400 border-r-[3px]'>Amount(IGST)</th>
                            )}
                            {gstCheck === "sgst" && (
                                <>
                                    <th className='w-[10%] font-semibold text-lg border-blue-400 border-r-[3px]'>
                                        <div className='border-blue-400 border-b-[3px]'>GST</div>
                                        <div className='grid grid-cols-[1fr,1fr]'>
                                            <div className='text-sm pt-1 px-2 border-r-[3px] border-blue-400'>SGST</div>
                                            <div className='text-sm pt-1 px-2'>CGST</div>
                                        </div>
                                    </th>
                                </>
                            )}
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
                                {gstCheck === "igst" && (
                                    <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>{(e.gstAmount).toFixed()}({e.igst}%)</td>
                                )}
                                {gstCheck === "sgst" && (
                                    <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs'>
                                        <div className='grid grid-cols-[1fr,1fr]'>
                                            <div className='border-blue-400 border-r-[3px] h-full'>{(e.gstAmount / 2).toFixed(2)} ({e.igst / 2}%)</div>
                                            <div className=' h-full'>{(e.gstAmount / 2).toFixed(2)} ({e.igst / 2}%)</div>
                                        </div>
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
                            <td colSpan={3} className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>Total</td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>{totals.totalQuantity}Kg</td>
                            <td className='py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2'>
                                <p className='flex items-center justify-center'>
                                    {/* <RupeesIcon />
                                    {totals.totalRate} */}
                                </p>
                            </td>
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

                <div className='border-blue-400 border-l-[3px] border-b-[3px] grid grid-cols-[1fr]'>
                    <div className='py-4 border-blue-400 border-blue-400 border-r-[3px]'></div>
                    <div className='grid grid-cols-[1.8fr,1.2fr,]'>
                        <div className='border-blue-400 '>
                            <div className='text-xs font-medium text-center border-blue-400 border-b-[3px] border-t-[3px] py-1'>
                                Total In Words
                            </div>
                            <div className='font-semibold text-center border-blue-400 border-b-[3px] py-1 text-xs'>
                                {numberToWords((totals.totalAmount).toFixed(2)).toUpperCase()} RUPESS ONLY
                            </div>
                            {data?.invoice_type !== "po" && (
                                <>
                                    <div className='font-semibold text-center border-blue-400 border-b-[3px] py-1 text-sm'>
                                        BANK DETAILS
                                    </div>
                                    <div className='border-blue-400 border-b-[3px] py-2 px-5'>
                                        <div className='grid grid-cols-[3fr,1fr]'>
                                            <div className='text-xs'>
                                                <div className='grid grid-cols-[1.7fr,2.5fr]'>
                                                    <p className='font-medium'>Name</p>
                                                    <p className='font-medium'>{data?.bank_details?.[0]?.bank_name}</p>
                                                </div>
                                                <div className='grid grid-cols-[1.7fr,2.5fr]'>
                                                    <p className='font-medium'>Branch</p>
                                                    <p className='font-medium'>{data?.bank_details?.[0]?.bank_branch}</p>
                                                </div>
                                                <div className='grid grid-cols-[1.7fr,2.5fr]'>
                                                    <p className='font-medium'>Acc. Number</p>
                                                    <p className='font-medium'>{data?.bank_details?.[0]?.bank_account_num}</p>
                                                </div>
                                                <div className='grid grid-cols-[1.7fr,2.5fr]'>
                                                    <p className='font-medium'>IFSC</p>
                                                    <p className='font-medium'>{data?.bank_details?.[0]?.bank_IFSC_code}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className='font-semibold text-center border-blue-400 border-b-[3px] py-1 text-sm'>
                                TERMS & CONDITIONS
                            </div>
                            <div className='py-2 px-3 text-xs'>
                                <p className='font-semibold'>{data?.termsand_condition}</p>
                            </div>
                        </div>
                        <div className='border-blue-400 border-b-0 border-[3px] text-xs'>
                            <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                <p className='font-semibold'>Taxable Amount</p>
                                <p className='font-semibold flex items-center justify-end'>
                                    <RupeesIcon />
                                    {totals?.totalGstAmount}
                                </p>
                            </div>
                            {gstCheck === "igst" && (
                                <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                    <p className='font-semibold'>Add: IGST</p>
                                    <p className='font-semibold flex items-center justify-end'>
                                        <RupeesIcon />
                                        {(totals.totalGstAmount).toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {gstCheck === "sgst" && (
                                <>
                                    <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                        <p className='font-semibold'>Add: SGST</p>
                                        <p className='font-semibold flex items-center justify-end'>
                                            <RupeesIcon />
                                            {(totals.totalGstAmount / 2).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                        <p className='font-semibold'>Add: CGST</p>
                                        <p className='font-semibold flex items-center justify-end'>
                                            <RupeesIcon />
                                            {(totals.totalGstAmount / 2).toFixed(2)}
                                        </p>
                                    </div>

                                </>
                            )}
                            <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                <p className='font-semibold'>Total Tax</p>
                                <p className='font-semibold flex items-center justify-end'>
                                    <RupeesIcon />
                                    {totals?.totalGstAmount}
                                </p>
                            </div>
                            <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                <p className='font-semibold'>Total Amount After Tax</p>
                                <p className='font-semibold flex justify-end items-center'>
                                    <RupeesIcon />
                                    {(totals.totalAmount).toFixed(2)}</p>
                            </div>
                            <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                <p className='font-semibold'>Taxable Amount After Tax</p>
                                <p className='font-semibold'>(E & O.E)</p>
                            </div>
                            <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                <p className='font-semibold'>GST Payable on reverse chagrge</p>
                                <p className='font-semibold'>N.A</p>
                            </div>
                            <div className='flex justify-center py-3 border-blue-400 border-b-[3px] py-1 px-2'>
                                <img src={data?.upload_stamp} alt="" className='h-[60px]' />
                            </div>
                            <div className='flex justify-between py-1 px-2 items-center'>
                                <p className='font-bold'>Authority Signatory</p>
                                <img src={data?.upload_sign} alt="" className='h-[20px]' />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default InvoicePdf