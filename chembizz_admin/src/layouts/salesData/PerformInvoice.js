import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from 'BASE_URL';

const borderStyle = '1px solid #0000FF';
const headerBgColor = '#ADD8E6';

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

function PerformaInvoice() {
    const { _id } = useParams();
    const [po_data, setPo_data] = useState(null);
    console.log(po_data)

    const fetchUserList = async () => {
        try {
            const token = `Bearer ${localStorage.getItem("chemToken")}`;
            const response = await axios.get(
                `${BASE_URL}/api/salesInvoice/invoicelist`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            const selectedPo = response?.data?.data?.find((e) => e?._id === _id)
            setPo_data(selectedPo)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, [_id]);

    useEffect(() => {
    }, [po_data]);

    if (!po_data) {
        return <Typography>Loading...</Typography>; // Placeholder while data is being fetched
    }

    const productDetails = po_data.product_details || [];
    const buyerDetails = po_data.buyer_company_details || [];

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

    const totals = calculateTotals(po_data?.product_details);

    return (
        <div className="mt-5">
            <Paper sx={{ maxWidth: 800, mx: 'auto', p: 2, boxShadow: 'none', border: borderStyle }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, borderBottom: borderStyle, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ p: 2, mr: 2 }}>
                            <img src={po_data?.bill_to_logo} alt="" style={{height: "70px"}} />
                        </Box>
                        <Box>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>{po_data?.seller_company_details?.[0]?.company_name}</h5>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>{po_data?.seller_company_details?.[0]?.address}</h5>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>{po_data?.seller_company_details?.[0]?.city}, {po_data?.seller_company_details?.[0]?.state}, {po_data?.seller_company_details?.[0]?.country} - {po_data.seller_company_details?.[0]?.pincode}</h5>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>{po_data?.seller_company_details?.[0]?.gst}</h5>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>{po_data?.seller_company_details?.[0]?.mobile_num}</h5>
                        </Box>
                    </Box>
                </Box>


                {/* Main content */}
                <Box
                    sx={{
                        border: '1px solid #ddd', // Outer border for the entire section
                        borderRadius: '8px', // Optional: Rounded corners
                        mb: 3,
                    }}
                >
                    {/* Header Section */}
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            bgcolor: '#F5F5F5', // Different background for the header
                            py: 1.5, // Padding for the header
                            borderBottom: '1px solid #ddd',
                            fontWeight: 'bold',
                        }}
                    >
                        TAX INVOICE
                    </Typography>

                    {/* Main Grid Layout */}
                    <Grid container sx={{ p: 2 }}>
                        {/* Buyer Details */}
                        <Grid item xs={12} sm={4} sx={{ borderRight: '1px solid #ddd', p: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Details of Buyer / Billed To :</Typography>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Name:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.bill_to_name}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                GSTIN:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.bill_to_gst_in}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Address:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.bill_to_address}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Country:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.bill_to_country}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                State:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.bill_to_state}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                City:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.bill_to_city}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Pincode:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.bill_to_pincode}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Phone:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.bill_to_phone}</p>
                            </h5>
                        </Grid>

                        {/* Seller Details */}
                        <Grid item xs={12} sm={4} sx={{ borderRight: '1px solid #ddd', p: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Seller Detail :</Typography>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Name:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.shipped_to_name}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                GSTIN:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.shipped_to_gst_in}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Address:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.shipped_to_address}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Country:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.shipped_to_country}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                State:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.shipped_to_state}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                City:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.shipped_to_city}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Pincode:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.shipped_to_pincode}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Phone:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.shipped_to_phone}</p>
                            </h5>
                        </Grid>

                        {/* Purchase Order Details */}
                        <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                PO No.:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.po_num}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                PO Date:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.po_date}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Invoice No:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.invoice_no}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Invoice Date:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.invoice_date}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Due Date:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.due_date}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Eway No:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.eway_no}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Inco Terms:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.inco_terms}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Payment Terms:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.payment_terms}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Packaging Type:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.packaging_type}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Total Units:
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.packaging_no_of_bags}</p>
                            </h5>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                1 Unit :
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.packaging_weight}{po_data?.packaging_weight_type}</p>
                            </h5>
                            {po_data.vehicle_no !== "" && (
                                <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                    Vehicle Number :
                                    <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.vehicle_no}</p>
                                </h5>
                            )}
                            {po_data.delivery_time !== "" && (
                                <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                    Delivery Time:
                                    <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.delivery_time}</p>
                                </h5>
                            )}
                            {po_data.mode_of_transport !== "" && (
                                <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                    Mode Of Transport:
                                    <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{po_data.mode_of_transport}</p>
                                </h5>
                            )}
                        </Grid>
                    </Grid>
                </Box>



                <div
                    className="margin-pricing-agency-wrapper"
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div
                        className="margin-pricing-agency-header"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr',
                            gap: '10px',
                            padding: '10px',
                            backgroundColor: '#f4f4f4', // Light background for the header
                            borderBottom: '2px solid #ddd', // Stronger border between header and body
                        }}
                    >
                        <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>No.</h5>
                        <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>Product Name</h5>
                        <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>HSN/SAC</h5>
                        <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>Qty</h5>
                        <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>Rate</h5>
                        <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>Taxable Value</h5>
                        {po_data?.bill_to_state === po_data?.shipped_to_state ? (
                            <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>CGST/SGST</h5>
                        ) : (
                            <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>IGST</h5>
                        )}
                        <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>Amount</h5>
                    </div>

                    {/* Body */}
                    {po_data && po_data?.product_details?.map((e, index) => (
                        <div
                            className="margin-pricing-agency-body"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr',
                                gap: '10px',
                                padding: '8px',
                                borderBottom: '1px solid #ddd', // Border between each row
                            }}
                            key={index} // Add a unique key for each item
                        >
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                {index + 1}
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                {e?.chem_name}
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                {e?.hsn}
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                {e?.qty} {e?.qty_type}
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                {e?.rate}
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                {e?.taxable_amount}
                            </p>
                            {po_data?.bill_to_state === po_data?.shipped_to_state ? (
                                <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    {e?.gstAmount / 2} ({e?.igst / 2}%) / {e?.gstAmount / 2} ({e?.igst / 2}%)
                                </p>
                            ) : (
                                <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    {e?.gstAmount} ({e?.igst}%)
                                </p>
                            )}
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                {e?.total}
                            </p>
                        </div>
                    ))}

                    {/* Footer */}
                    <div
                        className="margin-pricing-agency-footer"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '0.3fr 1.7fr 1fr 1fr 1fr 1fr 1fr 1fr',
                            gap: '10px',
                            padding: '10px',
                            backgroundColor: '#f9f9f9', // Slightly different background for the footer
                            borderTop: '2px solid #ddd', // Stronger border for footer
                        }}
                    >
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}></p>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}></p>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '0', display: 'flex', alignItems: 'center' }}>TOTAL</p>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                            {/* {totals.totalQuantity} Kg */}
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}></p>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                            {(totals.totalTaxable).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                            {(totals.totalGstAmount).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                            {(totals.totalAmount).toFixed(2)}
                        </p>
                    </div>
                </div>



                {/* Footer details */}
                <Grid container sx={{ border: borderStyle, mt: 2 }}>
                    <Grid item xs={6} sx={{ borderRight: borderStyle, p: 1 }}>
                        <Box sx={{ borderBottom: borderStyle, pb: 1, mb: 1 }}>
                            <h5 className="d-flex mb-2" style={{ fontSize: '16px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>
                                Total in Words :
                                <p className="ps-2" style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>{numberToWords(po_data?.grand_total)}</p>
                            </h5>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>BANK DETAILS</Typography>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
                                <h5 className='mb-0' style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>Bank Name</h5>
                                <p className='mb-0' style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    {po_data?.bank_details?.[0]?.bank_name}
                                </p>
                                <h5 className='mb-0' style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>Account Number</h5>
                                <p className='mb-0' style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    {po_data?.bank_details?.[0]?.bank_account_num}
                                </p>
                                <h5 className='mb-0' style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>IFSC Code</h5>
                                <p className='mb-0' style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    {po_data?.bank_details?.[0]?.bank_IFSC_code}
                                </p>
                                <h5 className='mb-0' style={{ fontSize: '14px', fontWeight: 'bold', color: '#044711', marginBottom: '0' }}>Branch Name</h5>
                                <p className='mb-0' style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                    {po_data?.bank_details?.[0]?.bank_branch}
                                </p>
                            </div>
                        </Box>
                        <Box className="mt-3">
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>TERMS & CONDITIONS</Typography>
                            <p className='mb-0' style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                {po_data?.termsand_condition}
                            </p>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{ p: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Taxable Amount :</h5>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>
                                {(totals.totalTaxable).toFixed(2)}
                            </p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Add: IGST</h5>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>
                                {(totals.totalGstAmount).toFixed(2)}
                            </p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Total Tax</h5>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>
                                {(totals.totalGstAmount).toFixed(2)}
                            </p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Total Amount After Tax</h5>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>
                                {(po_data.grand_total).toFixed(2)}
                            </p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Taxable Amount After Tax</h5>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>
                                (E & O.E)
                            </p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>GST Payable on reverse charge</h5>
                            <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '0' }}>
                                N.A
                            </p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: "10px 0px" }}>
                            <img src={po_data?.upload_stamp} alt="" style={{ height: "70px" }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#044711', marginBottom: '0' }}>Authority Signatory</h5>
                            <img src={po_data?.upload_sign} alt="" style={{ height: "30px" }} />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default PerformaInvoice;