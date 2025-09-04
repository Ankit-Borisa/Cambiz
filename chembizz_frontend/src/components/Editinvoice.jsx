import React, { useContext, useEffect, useRef, useState } from 'react'
import sign from "../images/sign.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import right from "../images/right.png"
import countries from "../pages/CountryStateCity.json"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Invoice1 from './Invoice1';
import { useSharedState } from '../context/ManageOpenContext';
import InvoicePdf from './InvoicePdf';
import InvoicePdf2 from './InvoicePdf2';
import InvoicePdf3 from './InvoicePdf3';
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

const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, pad to ensure 2 digits
    const day = String(date.getDate()).padStart(2, '0'); // Pad to ensure 2 digits
    return `${year}-${month}-${day}`;
};

const Editinvoice = () => {

    const { display, setDisplay } = useContext(DisplayContext);

    const { _id } = useParams()

    const [abc, setAlreadyData] = useState("")

    const [sendData, setSendData] = useState("");

    const [inputDiable, setInputDisable] = useState(false)
    const [buyerCompanyId, setBuyerCompanyId] = useState("")

    useEffect(() => {
        if (_id) {
            setInputDisable(true)
        }
    }, [_id]);

    const [editable, setEditable] = useState(false)

    const [productDetailArray, setProductDetailArray] = useState([])
    const [bankArray, setBankArray] = useState([])
    const [data, setData] = useState("")

    const location = useLocation();

    useEffect(() => {
        setAlreadyData(location.state?.abc)
    }, [location]);

    const navigate = useNavigate()

    const [editBank, setEditBank] = useState(false)
    const [editTerms, setEditTerms] = useState(false)

    const [isProforma, setIsProforma] = useState(false);

    const handleCheckboxChange = () => {
        setIsProforma(!isProforma);
    };

    const [yesOrNo, setYesOrNo] = useState(false)
    const [success, setSuccess] = useState(false)


    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [shippedStates, setShippedStates] = useState([])
    const [shippedCities, setShippedCities] = useState([])

    const [formData, setFormData] = useState({
        bill_to_gst_in: '',
        bill_to_name: '',
        bill_to_country: '',
        bill_to_address: '',
        bill_to_state: '',
        bill_to_city: '',
        bill_to_pincode: null,
        bill_to_phone: null,
        shipped_to_gst_in: '',
        shipped_to_name: '',
        shipped_to_country: '',
        shipped_to_address: '',
        shipped_to_state: '',
        shipped_to_city: '',
        shipped_to_pincode: null,
        shipped_to_phone: null,
        invoice_no: '',
        po_num: "",
        due_date: '',
        invoice_date: getFormattedDate(),
        po_date: '',
        upload_po: null,
        vehicle_no: '',
        upload_COA: null,
        eway_no: '',
        packaging_no_of_bags: 0,
        packaging_type: '',
        packaging_weight: 0,
        packaging_weight_type: '',
        bank_details: productDetailArray,
        product_details: bankArray,
        upload_sign: null,
        upload_stamp: null,
        grand_total: null,
        termsand_condition: '',
        invoice_type: "tax_invoice",
        invoice_mode: "manual",

    });

    const fetchFinalDetails = async (e) => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/chat/displayNegotation/${_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()

        const allData = data.data

        if (productDetailArray.length === 0 || e === "edit") {
            setSearchInputValue(allData?.product_details?.name_of_chemical)
            setProductCas(allData?.product_details?.CAS_number);
            setProductName(allData?.product_details?.name_of_chemical);
            setProductFormula(allData?.product_details?.molecularFormula);
            setHsn(allData?.inquiryDetails?.hsn_code);
            setQuantity(allData?.quantity);
            setQuantityType(allData?.quantity_type);
            setRate(allData?.final_price);
        } else {
            setSearchInputValue('')
            setProductCas('');
            setProductName('');
            setProductFormula('');
            setHsn('');
            setQuantity('');
            setQuantityType('');
            setRate(null);
        }

        setEditable(false)


        // setFormData(prevFormData => ({
        //     ...prevFormData,
        //     bill_to_gst_in: buyerCompany.gst,
        // }));


    }

    useEffect(() => {
        fetchFinalDetails();
    }, [_id]);

    const generateUniqueNumber = () => {
        return Math.floor(Math.random() * 10000); // Replace this with your actual unique number logic
    };

    useEffect(() => {
        // Check if location.state exists and has the necessary data
        if (location.state?.prefix) {
            // Generate unique number
            const number = generateUniqueNumber();

            // Extract prefix from location.state
            const prefixFromLocation = location.state.prefix;

            // Concatenate prefix and unique number
            const invoiceNum = prefixFromLocation + number;


            // Update the formData state with the new invoice_no
            setFormData((prevData) => ({
                ...prevData,
                invoice_no: invoiceNum // Set invoice_no to the concatenated value
            }));
        }
    }, [location]);

    const inquiryDetail = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}api/inquiryRoutes/inquiryDetailsForCompany/${_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        const data = await res.json();

        if (data.success) {
            const allData = data?.data?.[0];
            const buyerCompany = allData?.buyer_company;
            const sellerCompany = allData?.seller_company;
            setBuyerCompanyId(buyerCompany?._id)

            const selectedStates = countries.find((e) => e.name === buyerCompany?.country);
            setStates(selectedStates?.states || []);

            if (selectedStates) {
                const selectedCities = selectedStates.states.find((e) => e.name === buyerCompany.state);
                setCities(selectedCities?.cities || []);
            }

            const selectedStatesForShipped = countries.find((e) => e.name === sellerCompany.country);
            setShippedStates(selectedStatesForShipped?.states || []);

            if (selectedStatesForShipped) {
                const selectedCities = selectedStatesForShipped.states.find((e) => e.name === sellerCompany.state);
                setShippedCities(selectedCities?.cities || []);
            }

            if (allData?.inq_type === "sample inquiry") {
                // console.log(allData)
                setSearchInputValue(allData?.product?.name_of_chemical)
                setProductCas(allData?.product?.CAS_number);
                setProductName(allData?.product?.name_of_chemical);
                setProductFormula(allData?.product?.molecularFormula);
                setHsn(allData?.hsn_code);
                setQuantity(allData?.one_lot_qty);
                setQuantityType(allData?.one_lot_qty_type);
                setRate(allData?.one_lot_qty_price);
            }

            setFormData(prevFormData => ({
                ...prevFormData,
                bill_to_gst_in: buyerCompany.gst,
                bill_to_name: buyerCompany.company_name,
                bill_to_address: buyerCompany.address,
                bill_to_country: buyerCompany.country,
                bill_to_state: buyerCompany.state,
                bill_to_city: buyerCompany.city,
                bill_to_pincode: buyerCompany.pincode,
                bill_to_phone: buyerCompany.mobile_num,
                // shipped_to_gst_in: sellerCompany.gst,
                // shipped_to_name: sellerCompany.company_name,
                // shipped_to_address: sellerCompany.address,
                // shipped_to_country: sellerCompany.country,
                // shipped_to_state: sellerCompany.state,
                // shipped_to_city: sellerCompany.city,
                // shipped_to_pincode: sellerCompany.pincode,
                // shipped_to_phone: sellerCompany.mobile_num,
                payment_terms: allData.payment_terms,
                inco_terms: allData.inco_terms,
                po_num: allData.po_data[0]?.po_num,
                po_date: allData.po_data[0]?.po_date,
                invoice_type: 'tax_invoice',
                invoice_mode: 'auto',
            }));
        }
    };

    useEffect(() => {
        if (_id) {
            inquiryDetail();
        }
    }, [_id]);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            product_details: productDetailArray
        }));
    }, [productDetailArray]);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            bank_details: bankArray
        }));
    }, [bankArray]);


    const handleChange = async (e) => {
        const { name, value, files } = e.target;
        let updatedFormData = {};

        if (name === "bill_to_country") {
            const selectedCountryName = value;
            const selectedCountry = countries.find((country) => country.name === selectedCountryName);

            setStates(selectedCountry?.states || []);
            updatedFormData = {
                bill_to_state: "",
                bill_to_city: "",
            };
        }

        if (name === "bill_to_state") {
            const selectedStateName = value;
            const selectedState = states.find((state) => state.name === selectedStateName);

            setCities(selectedState?.cities || []);
            updatedFormData = {
                bill_to_city: "",
            };
        }

        if (name === "shipped_to_country") {
            const selectedCountryName = value;
            const selectedCountry = countries.find((country) => country.name === selectedCountryName);

            setShippedStates(selectedCountry?.states || []);
            updatedFormData = {
                shipped_to_state: "",
                shipped_to_city: "",
            };
        }

        if (name === "shipped_to_state") {
            const selectedStateName = value;
            const selectedState = shippedStates.find((state) => state.name === selectedStateName);
            setShippedCities(selectedState?.cities || []);
            updatedFormData = {
                shipped_to_city: "",
            };
        }

        if (name === "upload_COA") {
            updatedFormData = {
                upload_COA: files[0],
            };
        }

        if (name === "upload_po") {
            updatedFormData = {
                upload_po: files[0],
            };
        }

        setFormData((prevData) => {
            return {
                ...prevData,
                ...updatedFormData,
                [name]: files ? files[0] : value // Handle both file and non-file inputs
            };
        });

        if (name === 'payment_terms') {
            handlePaymentTermsChange(value);
        }

        if (name === "bill_to_pincode" && value.length === 6) {
            await fetchFetailsFromPincode(value);
        }

        if (name === "shipped_to_pincode" && value.length === 6) {
            await fetchFetailsFromPincodeShipped(value);
        }

        if (name === "bill_to_pincode" && value.length !== 6) {
            setFormData((prevData) => ({
                ...prevData,
                bill_to_country: "",
                bill_to_state: "",
                bill_to_city: "",
            }));
        }

        if (name === "shipped_to_pincode" && value.length !== 6) {
            setFormData((prevData) => ({
                ...prevData,
                shipped_to_country: "",
                shipped_to_state: "",
                shipped_to_city: "",
            }));
        }
    };

    const handlePaymentTermsChange = (value) => {
        let newDueDate = '';

        if (value === 'Advance') {
            newDueDate = '';
        } else if (value === 'Immediate') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            newDueDate = tomorrow.toISOString().split('T')[0];
        } else if (value === '15 Days Credit') {
            const in15Days = new Date();
            in15Days.setDate(in15Days.getDate() + 15);
            newDueDate = in15Days.toISOString().split('T')[0];
        } else if (value === '30 Days Credit') {
            const in30Days = new Date();
            in30Days.setDate(in30Days.getDate() + 30);
            newDueDate = in30Days.toISOString().split('T')[0];
        } else if (value === '45 Days Credit') {
            const in45Days = new Date();
            in45Days.setDate(in45Days.getDate() + 45);
            newDueDate = in45Days.toISOString().split('T')[0];
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            due_date: newDueDate
        }));
    };

    const fetchFetailsFromPincode = async (pincode) => {
        try {
            const res = await fetch(`https://api.chembizz.in/api/public/getPincodeDetails/${pincode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await res.json();
            // console.log(response[0]?.PostOffice[0]);
            const data = response[0]?.PostOffice[0]

            if (data) {
                // console.log(data); // Log the fetched data for verification

                // Extract country, state, and city from the API response
                const countryName = data.Country;
                const stateName = data.State;
                const cityName = data.District;

                // Find the corresponding country object
                const selectedCountry = countries.find((country) => country.name === countryName);
                const countryStates = selectedCountry?.states || [];

                // Find the corresponding state object
                const selectedState = countryStates.find((state) => state.name === stateName);
                const stateCities = selectedState?.cities || [];

                // Update form data and states
                setStates(countryStates);
                setCities(stateCities);

                setFormData((prevData) => ({
                    ...prevData,
                    bill_to_country: countryName,
                    bill_to_state: stateName,
                    bill_to_city: cityName,
                    bill_to_pincode: pincode,
                }));
            } else {
                console.error("No PostOffice data found for the provided pincode.");
            }

        } catch (error) {
            console.error("Error fetching pincode details:", error);
        }
    };

    const fetchFetailsFromPincodeShipped = async (pincode) => {
        try {
            const res = await fetch(`https://api.chembizz.in/api/public/getPincodeDetails/${pincode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await res.json();
            // console.log(response[0]?.PostOffice[0]);
            const data = response[0]?.PostOffice[0]

            if (data) {
                // console.log(data); // Log the fetched data for verification

                // Extract country, state, and city from the API response
                const countryName = data.Country;
                const stateName = data.State;
                const cityName = data.District;

                // Find the corresponding country object
                const selectedCountry = countries.find((country) => country.name === countryName);
                const countryStates = selectedCountry?.states || [];

                // Find the corresponding state object
                const selectedState = countryStates.find((state) => state.name === stateName);
                const stateCities = selectedState?.cities || [];

                // Update form data and states
                setShippedStates(countryStates);
                setShippedCities(stateCities);

                setFormData((prevData) => ({
                    ...prevData,
                    shipped_to_country: countryName,
                    shipped_to_state: stateName,
                    shipped_to_city: cityName,
                    shipped_to_pincode: pincode,
                }));
            } else {
                console.error("No PostOffice data found for the provided pincode.");
            }

        } catch (error) {
            console.error("Error fetching pincode details:", error);
        }
    };

    const getMaxPoDate = () => {
        return formData.invoice_date ? formData.invoice_date : null;
    };

    const [isSameAsBillTo, setIsSameAsBillTo] = useState(false);

    const handleCheckboxsesChange = () => {
        setIsSameAsBillTo((prev) => !prev);
    };

    useEffect(() => {
        // If "Same as Bill to" checkbox is checked, copy the bill_to values to shipped_to
        if (isSameAsBillTo) {
            setFormData((prevData) => ({
                ...prevData,
                shipped_to_gst_in: prevData.bill_to_gst_in,
                shipped_to_name: prevData.bill_to_name,
                shipped_to_address: prevData.bill_to_address,
                shipped_to_country: prevData.bill_to_country,
                shipped_to_state: prevData.bill_to_state,
                shipped_to_city: prevData.bill_to_city,
                shipped_to_pincode: prevData.bill_to_pincode,
                shipped_to_phone: prevData.bill_to_phone,
            }));

            // Update the shipped states and cities based on the "bill to" values
            const selectedCountry = countries.find(
                (country) => country.name === formData.bill_to_country
            );
            setShippedStates(selectedCountry ? selectedCountry.states : []);
            const selectedState = selectedCountry?.states.find(
                (state) => state.name === formData.bill_to_state
            );
            setShippedCities(selectedState ? selectedState.cities : []);
        } else {
            setFormData((prevData) => ({
                ...prevData,
                shipped_to_gst_in: "",
                shipped_to_name: "",
                shipped_to_address: "",
                shipped_to_country: "",
                shipped_to_state: "",
                shipped_to_city: "",
                shipped_to_pincode: "",
                shipped_to_phone: "",
            }));
        }
    }, [isSameAsBillTo, formData.bill_to_country, formData.bill_to_state]);


    const generatePo = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

        const formDataToSend = new FormData();

        // Check if the invoice mode is 'auto' and add 'inquiry_id' if true
        if (formData.invoice_mode === 'auto') {
            formDataToSend.append('inquiry_id', _id);
            formDataToSend.append('buyer_company_id', buyerCompanyId);
        }

        const appendFormData = (data, root = '') => {
            Object.keys(data).forEach((key) => {
                const value = data[key];
                const formKey = root ? `${root}[${key}]` : key;

                if (value && typeof value === 'object' && !(value instanceof File)) {
                    if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            appendFormData(item, `${formKey}[${index}]`);
                        });
                    } else {
                        appendFormData(value, formKey);
                    }
                } else {
                    formDataToSend.append(formKey, value);
                }
            });
        };

        const filteredData = !isProforma
            ? formData
            : {
                // upload_po

                // product_details
                // bank_details

                bill_to_gst_in: formData.bill_to_gst_in,
                bill_to_name: formData.bill_to_name,
                bill_to_address: formData.bill_to_address,
                bill_to_country: formData.bill_to_country,
                bill_to_state: formData.bill_to_state,
                bill_to_city: formData.bill_to_city,
                bill_to_pincode: formData.bill_to_pincode,
                bill_to_phone: formData.bill_to_phone,

                shipped_to_gst_in: formData.shipped_to_gst_in,
                shipped_to_name: formData.shipped_to_name,
                shipped_to_address: formData.shipped_to_address,
                shipped_to_country: formData.shipped_to_country,
                shipped_to_state: formData.shipped_to_state,
                shipped_to_city: formData.shipped_to_city,
                shipped_to_pincode: formData.shipped_to_pincode,
                shipped_to_phone: formData.shipped_to_phone,

                invoice_no: formData.invoice_no,
                invoice_date: formData.invoice_date,
                po_num: formData.po_num,
                po_date: formData.po_date,
                invoice_type: "performa_invoice",
                invoice_mode: "manual",

                termsand_condition: formData?.termsand_condition,
                inco_terms: formData?.inco_terms,
                payment_terms: formData?.payment_terms,
                upload_stamp: formData?.upload_stamp,
                upload_sign: formData?.upload_sign,
                grand_total: formData?.grand_total,

                upload_po: formData.upload_po,
                product_details: formData.product_details,
                bank_details: formData.bank_details

            };

        appendFormData(filteredData);

        try {
            const response = await fetch(`${BASE_URL}api/salesInvoice/insert`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                },
                body: formDataToSend,
            });

            const responseData = await response.json();

            if (!response.ok) {
                toast.error(responseData.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            } else {
                setDisplay(true)
                setSendData(responseData?.data)
                toast.success('Invoice Successfully Generated', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [catelogs, setCatelogs] = useState([]);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [showCatalogs, setShowCatalogs] = useState(false);

    const [productCas, setProductCas] = useState("")
    const [productName, setProductName] = useState("")
    const [productFormula, setProductFormula] = useState("")
    const [hsn, setHsn] = useState("")
    const [quantity, setQuantity] = useState("")
    const [quantityType, setQuantityType] = useState("")
    const [rate, setRate] = useState("")
    const [texable, setTexable] = useState("")
    const [gst, setGst] = useState("")

    useEffect(() => {
        setTexable(quantity * rate)
    }, [rate, quantity]);

    useEffect(() => {
        const totals = computeTotals(formData.product_details);
        setFormData((prevFormData) => ({
            ...prevFormData,
            grand_total: totals.totalCompound
        }));
    }, [formData.product_details]);

    const [filteredCatalogs, setFilteredCatalogs] = useState([]);
    const [banks, setBanks] = useState([])

    const fetchCatelogData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}api/product/displayAllProductWithoutToken`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Authorization: token,
            },
        });
        const data = await res.json();
        setCatelogs(data?.products);
    };

    const fetchStampData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/stamp/stamp`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()

        if (data.stampData && data.stampData.length > 0) {
            const stampImage = data.stampData[0].stampImage || null;
            const signImage = data.stampData[0].signImage || null;

            setFormData(prevState => ({
                ...prevState,
                upload_sign: signImage,
                upload_stamp: stampImage
            }));
        }

    }

    const fetchAlreadyData = async () => {
        const id = "665f0e656721318e8e53c2fb"
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}api/salesInvoice/displayDetails`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await res.json();

        if (data.success) {
            const invoiceData = data.data[0];

            const selectedStates = countries.find((e) => e.name === invoiceData.bill_to_country);
            setStates(selectedStates?.states || []);

            if (selectedStates) {
                const selectedCities = selectedStates.states.find((e) => e.name === invoiceData.bill_to_state);
                setCities(selectedCities?.cities || []);
            }

            const selectedStatesForShipped = countries.find((e) => e.name === invoiceData.shipped_to_country);
            setShippedStates(selectedStatesForShipped?.states || []);

            if (selectedStatesForShipped) {
                const selectedCities = selectedStatesForShipped.states.find((e) => e.name === invoiceData.shipped_to_state);
                setShippedCities(selectedCities?.cities || []);
            }

            setFormData({
                bill_to_gst_in: invoiceData.bill_to_gst_in,
                bill_to_name: invoiceData.bill_to_name,
                bill_to_address: invoiceData.bill_to_address,
                bill_to_country: invoiceData.bill_to_country,
                bill_to_city: invoiceData.bill_to_city,
                bill_to_pincode: invoiceData.bill_to_pincode,
                bill_to_phone: invoiceData.bill_to_phone,
                shipped_to_gst_in: invoiceData.shipped_to_gst_in,
                shipped_to_name: invoiceData.shipped_to_name,
                shipped_to_address: invoiceData.shipped_to_address,
                shipped_to_country: invoiceData.shipped_to_country,
                shipped_to_state: invoiceData.shipped_to_state,
                shipped_to_city: invoiceData.shipped_to_city,
                shipped_to_pincode: invoiceData.shipped_to_pincode,
                shipped_to_phone: invoiceData.shipped_to_phone,
                po_num: invoiceData.po_num,
                po_date: invoiceData.po_date,
                payment_terms: invoiceData.payment_terms,
                inco_terms: invoiceData.inco_terms,
                grand_total: invoiceData.grand_total,
                termsand_condition: invoiceData.termsand_condition,
                upload_sign: invoiceData.upload_sign,
                upload_stamp: invoiceData.upload_stamp,
                invoice_type: invoiceData.invoice_type,
                invoice_mode: invoiceData.invoice_mode,
                bank_details: invoiceData.bank_details,
                product_details: invoiceData.product_details
            });

        }

    };


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
        setData(data.companyDetails?.[0]);
    }

    useEffect(() => {
        fetchAlreadyData();
        fetchUserData();
    }, []);


    const fetchBankData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/bank_details/getall`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setBanks(data.bank_details)
    }

    useEffect(() => {
        fetchCatelogData();
        fetchStampData();
        fetchBankData();
    }, []);

    useEffect(() => {
        const filteredCatalogs = catelogs.filter(catalog =>
            catalog?.name_of_chemical && catalog?.name_of_chemical?.toLowerCase()?.includes(searchInputValue?.toLowerCase())
        );
        setFilteredCatalogs(filteredCatalogs);
    }, [searchInputValue, catelogs]);

    const handleInputClick = () => {
        setShowCatalogs(true);
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchInputValue(inputValue);

        const foundCatalog = catelogs.some(catalog =>
            catalog.name_of_chemical && catalog.name_of_chemical.toLowerCase().includes(inputValue.toLowerCase())
        );

        setCatalogFound(foundCatalog);
    };


    const handleCatalogSelect = (product) => {
        setShowCatalogs(false);
        setSearchInputValue(product?.name_of_chemical)
        setProductName(product?.name_of_chemical)
        setProductCas(product?.CAS_number)
        setProductFormula(product?.molecularFormula)
    };

    const handleProductAdd = () => {

        if (!productCas && !productName && !productFormula && !hsn && !quantity && !quantityType && !rate && !gst) {
            toast.error('Please Fill All Fields', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!productCas || !productName && !productFormula) {
            toast.error('Please Select Product', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!hsn) {
            toast.error('Please Enter HSN Code', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!quantity) {
            toast.error('Please Enter Quantity Of Product', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!quantityType) {
            toast.error('Please Select Quantity Type', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!rate) {
            toast.error('Please Enter Rate Of Product', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!gst) {
            toast.error('Please Select Gst', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }


        const newProductDetail = {
            cas_no: productCas,
            chem_name: productName,
            mol_formula: productFormula,
            hsn: hsn,
            qty: quantity,
            qty_type: quantityType,
            taxable_amount: quantity * rate,
            rate: rate,
            igst: gst
        };

        // Push the new object into the productDetailArray
        setProductDetailArray(prevArray => [...prevArray, newProductDetail]);

        // Clear the input fields if needed
        setSearchInputValue("")
        setProductCas("");
        setProductName("");
        setProductFormula("");
        setHsn("");
        setQuantity("");
        setQuantityType("");
        setRate("");
        setGst("");
    };

    const handleProductEdit = (index) => {
        setEditable(true);
        setProductDetailArray([])
        fetchFinalDetails("edit")
    };

    const handleProductRemove = (index) => {
        setProductDetailArray(prevArray => prevArray.filter((_, i) => i !== index));
    };

    const [selectedBankAccountNumber, setSelectedBankAccountNumber] = useState("")

    const handleAddBank = () => {
        const selectedBank = banks.find(bank => bank.account_number === selectedBankAccountNumber);

        if (selectedBank) {
            const newBankDetail = {
                bank_branch: selectedBank.branch_address || "",
                bank_name: selectedBank.bank_name || "",
                bank_IFSC_code: selectedBank.IFSC_code || "",
                bank_account_num: selectedBank.account_number || ""
            };

            setBankArray(prevArray => [...prevArray, newBankDetail]);

            // Clear the selected bank account number and close the edit bank modal
            setSelectedBankAccountNumber("");
            setEditBank(false);
        } else {
            console.error("Selected bank not found");
        }
    };

    const totalTaxableAmount = formData?.product_details && formData?.product_details.reduce((total, e) => total + Number(e.taxable_amount), 0);
    const totalTaxAmount = formData?.product_details && formData?.product_details.reduce((total, e) => total + (Number(e.taxable_amount) * Number(e.igst)) / 100, 0);
    const totalTaxInPercentage = formData?.product_details && formData?.product_details.reduce((total, e) => total + (Number(e.igst)), 0);
    const totalAmount = formData?.product_details && formData?.product_details.reduce((total, e) => total + Number(e.taxable_amount) + ((Number(e.rate) * Number(e.igst)) / 100), 0);

    const [newVariable, setNewVariable] = useState("");

    // Function to check states and update newVariable
    const checkStates = () => {
        const { bill_to_state } = formData;

        if (bill_to_state === data.state) {
            setNewVariable("same");
        } else {
            setNewVariable("different");
        }
    };

    useEffect(() => {
        checkStates();
    }, [formData.bill_to_state]);


    const computeTotals = (productDetails) => {
        const totals = productDetails.reduce((acc, e) => {
            const qty = Number(e.qty || 0);
            const rate = Number(e.rate || 0);
            const taxableAmount = Number(e.taxable_amount || 0);
            const igst = Number(e.igst || 0);

            // Calculate IGST for the product
            const igstValue = (taxableAmount * igst) / 100;

            // Update the totals in the accumulator
            acc.totalQty += qty;
            acc.totalRate += rate;
            acc.totalTaxableAmount += taxableAmount;
            acc.totalIGST += igstValue;
            acc.totalCompound += (rate * qty) + igstValue;

            return acc;
        }, {
            totalQty: 0,
            totalRate: 0,
            totalTaxableAmount: 0,
            totalIGST: 0,
            totalCompound: 0
        });

        return totals;
    };

    // Compute totals
    const totals = computeTotals(formData.product_details);

    useEffect(() => {
        const totals = computeTotals(formData.product_details);
        setFormData((prevFormData) => ({
            ...prevFormData,
            grand_total: totals.totalCompound
        }));
    }, [formData.product_details]);


    const [addresss, setAddresss] = useState([])
    const [standard, setStandard] = useState([])

    const fetchBillingAddress = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/teams_and_condition/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setAddresss(data.data);
        fetchStandardAddress()

    }

    const fetchStandardAddress = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/standard_terms_and_condition/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setStandard(data.data);
        if (addresss.length < 1) {
            setFormData((prevData) => ({
                ...prevData,
                termsand_condition: data.data[0]?.details || '',
            }));
        }
    }

    useEffect(() => {
        fetchBillingAddress();
    }, []);

    const handleTermsConditionSelect = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            termsand_condition: e.target.value,
        }));
    }

    const calculateMinDueDate = () => {
        if (formData.invoice_date) {
            // Get invoice_date as a Date object
            const invoiceDate = new Date(formData.invoice_date);

            // Calculate next day from invoice_date
            const dueDate = new Date(invoiceDate);
            dueDate.setDate(invoiceDate.getDate() + 1);

            // Format dueDate to 'YYYY-MM-DD' for input type 'date'
            return dueDate.toISOString().split('T')[0];
        }
        return ''; // Default to empty string if invoice_date is not set
    };

    const manual = location.state.manual || '';

    return (
        <>
            <div className='bg-gray-600 h-[100vh] max-w-[80vw]'>
                <div className='bg-white pe-4 pb-10'>
                    <div className='mb-10 flex justify-between'>
                        <h1 className="md:text-3xl text-xl font-semibold">Generate {abc === "PO" ? "PO" : "Invoice"}</h1>
                        <button onClick={() => setYesOrNo(true)} className='bg-darkBlue text-white text-xs px-20 rounded-[10px]'>Generate {abc === "PO" ? "PO" : "Invoice"}</button>
                    </div>
                    <table className="w-full border-[3px] border-blue-400 border-b-0 table-auto" onClick={() => setShowCatalogs(false)}>
                        <thead className='border-[3px] border-blue-400 border-b-0'>
                            <tr className='border-[3px] border-blue-400 border-b-0'>
                                <th className='border-blue-400 border-r-[3px] w-1/3 font-medium text-2xl py-3'>
                                    <div className='flex justify-center items-center gap-4'>
                                        <span className='font-semibold'>GSTIN : </span> <input type="text" className='border-2 border-gray-300 px-2 text-xl py-1 rounded-md w-[220px]' onChange={handleChange} name='bill_to_gst_in' maxLength={15} value={formData?.bill_to_gst_in}
                                            onInput={(e) => {
                                                const regex = /^[A-Za-z0-9]+$/;
                                                const sanitizedValue = e.target.value.replace(/[^A-Za-z0-9]/g, '');
                                                e.target.value = sanitizedValue.toUpperCase();
                                            }}
                                        />
                                    </div>
                                </th>
                                <th className='border-blue-400 border-r-[3px] w-1/3'>
                                    {abc === "PO" ? (

                                        <p className='font-semibold text-2xl text-[#0070C0]'>PURCHASE ORDER</p>
                                    ) : (
                                        <>
                                            {isProforma ? (
                                                <>
                                                    <p className='font-semibold text-2xl text-[#0070C0]'>PERFORMA INVOICE</p>
                                                    <div className='flex items-center justify-center '>
                                                        <input type="checkbox" name="" id="" checked={!isProforma} onChange={handleCheckboxChange} />
                                                        <p className='text-xs ms-2 font-medium'>Tax Invoice</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <p className='font-semibold text-2xl text-[#0070C0]'>TAX INVOICE</p>
                                                    <div className='flex items-center justify-center '>
                                                        <input type="checkbox" name="" id="" onChange={handleCheckboxChange} />
                                                        <p className='text-xs ms-2 font-medium'>Proforma Invoice</p>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                    {abc === "PO" ? (
                                        <></>
                                    ) : <>
                                    </>}
                                </th>
                                <th className='w-1/3 font-semibold text-lg '>
                                    {!isProforma && abc != "PO" && (
                                        "ORIGINAL FOR RECIPIENT"
                                    )}

                                </th>
                            </tr>
                        </thead>
                        <tbody className='border-[3px] border-blue-400'>
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] border-t-[3px] border-blue-400 font-medium ps-5 pt-5 pb-3'>Details of Buyer | Billed to : </td>
                                <td className='border-blue-400 border-r-[3px] border-t-[3px] border-blue-400 font-medium ps-5 py-2'>Details of Consignee | Shipped to  :
                                    <span className='text-[10px] text-blue-800 float-end me-2'>
                                        <input
                                            type="checkbox"
                                            className='h-[8px]'
                                            checked={isSameAsBillTo}
                                            onChange={handleCheckboxsesChange}
                                        />{' '}
                                        Same as Bill to
                                    </span>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4'>
                                    <div className="grid grid-cols-[2fr,3fr,] items-center">
                                        <p className=''>Invoice No.</p>
                                        <p className='flex items-center gap-2'>:
                                            <input
                                                type='text'
                                                name='invoice_no'
                                                value={formData?.invoice_no}
                                                onChange={handleChange}
                                                className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                            </tr>
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4'>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center pb-2">
                                        <p className=''>Name</p>
                                        <p className='flex items-center gap-2'>:
                                            <input type='text' name='bill_to_name' value={formData?.bill_to_name} onChange={handleChange} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' />
                                        </p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>Name</p>
                                        <p className='flex items-center gap-2'>:
                                            <input type='text' name='shipped_to_name' value={formData?.shipped_to_name} onChange={handleChange} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2'>
                                    <div className="grid grid-cols-[2fr,3fr,] items-center">
                                        <p className=''>Invoice Date</p>
                                        <p className='flex items-center gap-2'>:
                                            <input type='date' onChange={handleChange} name='invoice_date' value={formData?.invoice_date} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                            </tr>
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-1 pb-2'>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center ">
                                        <p className=''>Address</p>
                                        <p className='flex items-center gap-2 me-3'>:
                                            <textarea onChange={handleChange} name='bill_to_address' value={formData?.bill_to_address} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-1 pb-2'>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>Address</p>
                                        <p className='flex items-center gap-2 me-3'>:
                                            <textarea onChange={handleChange} name='shipped_to_address' value={formData?.shipped_to_address} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2'>
                                    <div className="grid grid-cols-[2fr,3fr,] items-center pb-3">
                                        <p className=''>PO No.</p>
                                        <p className='flex items-center gap-2'>: <input
                                            type='text'
                                            name='po_num'
                                            value={formData?.po_num}
                                            onChange={handleChange}
                                            className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                    <div className="grid grid-cols-[2fr,3fr,] items-center">
                                        <p className=''>PO Date</p>
                                        <p className='flex items-center gap-2'>: <input
                                            type='date'
                                            name='po_date'
                                            value={formData?.po_date}
                                            onChange={handleChange}
                                            max={getMaxPoDate()}
                                            disabled={!formData.invoice_date}
                                            className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>

                            </tr>
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>Pincode</p>
                                        <p className='flex items-center gap-2'>:
                                            <input
                                                type='text'
                                                value={formData?.bill_to_pincode}
                                                onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                maxLength={6}
                                                name='bill_to_pincode'
                                                onChange={handleChange}
                                                className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>Pincode</p>
                                        <p className='flex items-center gap-2'>:
                                            <input
                                                type='text'
                                                name='shipped_to_pincode'
                                                onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                maxLength={6}
                                                value={formData?.shipped_to_pincode}
                                                onChange={handleChange}
                                                className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 py-6'>
                                    <div className="grid grid-cols-[2fr,3fr,] items-center">
                                        <p className=''>Payment Terms</p>
                                        <p className='flex items-center gap-2'>:
                                            <select value={formData.payment_terms} onChange={handleChange} name='payment_terms' className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' id="">
                                                <option value="">select</option>
                                                <option value="Advance">Advance</option>
                                                <option value="Immediate">Immediate</option>
                                                <option value="15 Days Credit">Credit (15 Days)</option>
                                                <option value="30 Days Credit">Credit (30 Days)</option>
                                                <option value="45 Days Credit">Credit (45 Days)</option>
                                            </select>
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>Country</p>
                                        <p className='flex items-center gap-2'>:
                                            <select name='bill_to_country' value={formData?.bill_to_country} onChange={handleChange} className='w-full border-2 border-gray-300 w-[70%] px-2 py-1 rounded-md'>
                                                <option value="">select</option>
                                                {countries && countries.map((e) => (
                                                    <option value={e.name}>{e.name}</option>
                                                ))}
                                            </select>
                                        </p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>Country</p>
                                        <p className='flex items-center gap-2'>:
                                            <select name='shipped_to_country' value={formData?.shipped_to_country} onChange={handleChange} className='w-full border-2 border-gray-300 w-[70%] px-2 py-1 rounded-md'>
                                                <option value="">select</option>
                                                {countries && countries.map((e) => (
                                                    <option value={e.name}>{e.name}</option>
                                                ))}
                                            </select>
                                        </p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2'>
                                    <div className="grid grid-cols-[2fr,3fr,] items-center pb-3">
                                        <p className=''>Due Date</p>
                                        <p className='flex items-center gap-2'>:   <input
                                            onChange={handleChange}
                                            disabled={!formData.payment_terms || formData.payment_terms === 'Advance'}
                                            name='due_date'
                                            value={formData?.due_date}
                                            min={calculateMinDueDate()}
                                            type='date'
                                            className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                        />

                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>State</p>
                                        <p className='flex items-center gap-2'>:
                                            <select name='bill_to_state' onChange={handleChange} value={formData?.bill_to_state} className='w-full border-2 border-gray-300 w-[70%] px-2 py-1 rounded-md'>
                                                <option value="">select</option>
                                                {states && states.map((e) => (
                                                    <option value={e.name}>{e.name}</option>
                                                ))}
                                            </select></p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>State</p>
                                        <p className='flex items-center gap-2'>:
                                            <select name='shipped_to_state' value={formData?.shipped_to_state} onChange={handleChange} className='w-full border-2 border-gray-300 w-[70%] px-2 py-1 rounded-md'>
                                                <option value="">select</option>
                                                {shippedStates && shippedStates.map((e) => (
                                                    <option value={e.name}>{e.name}</option>
                                                ))}
                                            </select></p>
                                    </div>
                                </td>

                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2'>
                                    <div className="grid grid-cols-[2fr,3fr,] items-center">
                                        <p className=''>Upload PO</p>
                                        <p className='flex items-center gap-3'>: <input name="upload_po" onChange={handleChange} accept="application/pdf" type="file" className='file:bg-black file:text-white file:rounded border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' /></p>
                                    </div>
                                </td>
                            </tr>
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>City</p>
                                        <p className='flex items-center gap-2'>:
                                            <select name='bill_to_city' value={formData?.bill_to_city} onChange={handleChange} className='w-full border-2 border-gray-300 w-[70%] px-2 py-1 rounded-md'>
                                                <option value="">select</option>
                                                {cities && cities.map((e) => (
                                                    <option value={e.name}>{e.name}</option>
                                                ))}
                                            </select></p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>City</p>
                                        <p className='flex items-center gap-2'>:
                                            <select name='shipped_to_city' value={formData?.shipped_to_city} onChange={handleChange} className='w-full border-2 border-gray-300 w-[70%] px-2 py-1 rounded-md'>
                                                <option value="">select</option>
                                                {shippedCities && shippedCities.map((e) => (
                                                    <option value={e.name}>{e.name}</option>
                                                ))}
                                            </select></p>
                                    </div>
                                </td>
                                {!isProforma && (
                                    <>
                                        <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2'>
                                            <div className="grid grid-cols-[2fr,3fr,] items-center">
                                                <p className=''>E-Way No.</p>
                                                <p className='flex items-center gap-2'>:
                                                    <input
                                                        type='text'
                                                        name='eway_no'
                                                        value={formData?.eway_no}
                                                        onChange={handleChange}
                                                        className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                            </div>
                                        </td>
                                    </>
                                )}
                                {isProforma && (
                                    <>
                                        <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2'>
                                            <div className="grid grid-cols-[2fr,3fr,] items-center">
                                                <p className=''>Inco Terms</p>
                                                <p className='flex items-center gap-2'>:
                                                    <select onChange={handleChange} name='inco_terms' value={formData?.inco_terms} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'>
                                                        <option value="">select</option>
                                                        <option value="EXW - Ex Works" >EXW - Ex Works</option>
                                                        <option value="FOB - Free on Board" >FOB - Free on Board</option>
                                                        <option value="CIF - Cost, insurance & Fright" >CIF - Cost, insurance & Fright</option>
                                                        <option value="DDP - Delivered Duty Paid" >DDP - Delivered Duty Paid</option>
                                                    </select></p>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                            <tr className=''>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>Phone</p>
                                        <p className='flex items-center gap-2'>:
                                            <input
                                                type='tel'
                                                name='bill_to_phone'
                                                onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                maxLength={10}
                                                value={formData?.bill_to_phone}
                                                onChange={handleChange}
                                                className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                                <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2 '>
                                    <div className="grid grid-cols-[1fr,3fr,] items-center">
                                        <p className=''>Phone</p>
                                        <p className='flex items-center gap-2'>:
                                            <input
                                                type='text'
                                                name='shipped_to_phone'
                                                onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                maxLength={10}
                                                value={formData?.shipped_to_phone}
                                                onChange={handleChange}
                                                className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                    </div>
                                </td>
                                {!isProforma && (
                                    <>
                                        <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2'>
                                            <div className="grid grid-cols-[2fr,3fr,] items-center">
                                                <p className=''>Vehicle No.</p>
                                                <p className='flex items-center gap-2'>:
                                                    <input
                                                        type='text'
                                                        name='vehicle_no'
                                                        value={formData?.vehicle_no}
                                                        onInput={(e) => {
                                                            const regex = /^[A-Za-z0-9]+$/; // Allow only letters and numbers
                                                            const sanitizedValue = e.target.value.replace(/[^A-Za-z0-9]/g, '');
                                                            e.target.value = sanitizedValue.toUpperCase(); // Convert to uppercase
                                                        }}
                                                        onChange={handleChange}
                                                        className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                            <tr className='mb-4'>
                                <td className='border-blue-400 border-r-[3px] border-b-[3px]  font-medium ps-5 pe-4 pb-5'>

                                </td>
                                <td className='border-blue-400 border-r-[3px] border-b-[3px]  font-medium ps-5 pe-4 pb-5 '>

                                </td>
                                {!isProforma && (
                                    <>
                                        <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pb-2'>
                                            {/* <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>Quatation Date</p>
                                            <p className='flex items-center gap-2'>: <input type='date' onChange={handleChange} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                        </div> */}
                                        </td>
                                    </>
                                )}
                            </tr>
                            <tr className='mb-4'>
                                {!isProforma && (
                                    <td className='font-medium ps-5 py-6'>
                                        <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>Upload COA</p>
                                            <input name="upload_COA" onChange={handleChange} type="file" accept="application/pdf" className='file:bg-black file:text-white file:rounded border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                                        </div>
                                    </td>
                                )}
                                {!isProforma && (
                                    <td className='font-medium ps-5 py-6 pe-4'>
                                        <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>Mode Of Transport</p>
                                            <p className='flex items-center gap-2'>:
                                                <select onChange={handleChange} name='mode_of_transport' value={formData?.mode_of_transport} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    <option value="By Air">By Air</option>
                                                    <option value="By Sea">By Sea</option>
                                                    <option value="By Road">By Road</option>
                                                </select></p>
                                        </div>
                                    </td>
                                )}
                            </tr>
                            <tr className='mb-4'>
                                {!isProforma && (
                                    <>
                                        <td className='font-medium ps-5 pe-4 pt-3 pb-7'>
                                            <div className="grid grid-cols-[2fr,3fr,] items-center">
                                                <p className=''>Inco Terms</p>
                                                <p className='flex items-center gap-2'>:
                                                    <select onChange={handleChange} name='inco_terms' value={formData?.inco_terms} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'>
                                                        <option value="">select</option>
                                                        <option value="EXW - Ex Works" >EXW - Ex Works</option>
                                                        <option value="FOB - Free on Board" >FOB - Free on Board</option>
                                                        <option value="CIF - Cost, insurance & Fright" >CIF - Cost, insurance & Fright</option>
                                                        <option value="DDP - Delivered Duty Paid" >DDP - Delivered Duty Paid</option>
                                                    </select></p>
                                            </div>
                                        </td>
                                    </>
                                )}

                                {!isProforma && (
                                    <td className=' font-medium ps-5 pt-3 pb-7 '>
                                        <div className="grid grid-cols-[0.6fr,1.3fr,1fr] gap-4 me-4 items-center">
                                            <div>
                                                <p className='text-xs font-semibold'>NO OF BAG</p>
                                                <input
                                                    type="text"
                                                    name='packaging_no_of_bags'
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    maxLength={3}
                                                    value={formData?.packaging_no_of_bags}
                                                    onChange={handleChange}
                                                    className='border border-[#0A122A]/[.2] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2] text-xs w-[30px]' />
                                            </div>
                                            <div>
                                                <p className='text-xs font-semibold'>PACKAGING TYPE</p>
                                                <input type="text" name='packaging_type' value={formData?.packaging_type} onChange={handleChange} className='border border-[#0A122A]/[.2] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2] text-xs w-[50px]' />
                                            </div>
                                            <div>
                                                <p className='text-xs font-semibold'>WEIGHT</p>
                                                <div className='grid grid-cols-[1fr,1fr] gap-2'>
                                                    <input
                                                        type="text"
                                                        name='packaging_weight'
                                                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                        maxLength={4}
                                                        value={formData?.packaging_weight}
                                                        onChange={handleChange}
                                                        className='border border-[#0A122A]/[.2] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2] text-xs w-[50px]' />
                                                    <select name="packaging_weight_type" value={formData?.packaging_weight_type} onChange={handleChange} id="" className='border border-[#0A122A]/[.2] rounded-[4px] py-1w-full outline-none bg-white/[0.2] text-xs'>
                                                        <option value="" disabled>Select</option>
                                                        <option value="gm">Gm</option>
                                                        <option value="kg">Kg</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>

                    <ToastContainer />

                    {_id && formData?.product_details.length < 1 && (
                        <div className='border-blue-400 border-[3px] my-8'>
                            <div className='grid grid-cols-[3fr,1fr,1.4fr,1fr,1.2fr,2fr,1fr]'>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px] relative'>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchInputValue}
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-8 w-full '
                                        onClick={handleInputClick}
                                        onChange={handleInputChange}
                                        disabled={inputDiable}
                                    />
                                    {showCatalogs && (
                                        <div className="absolute top-[140%] bg-white shadow border-2 border-gray-100 w-full px-4 py-3 rounded-lg">
                                            {filteredCatalogs.map(catalog => (
                                                <div key={catalog.id} onClick={() => handleCatalogSelect(catalog)} className='py-2 ps-3 hover:bg-gray-200 rounded-lg font-medium'>
                                                    {catalog.name_of_chemical}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute top-[36%] left-6 text-gray-500' />
                                </div>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                    <input
                                        type="text"
                                        onChange={(e) => setHsn(e.target.value)}
                                        name='hsn'
                                        value={hsn}
                                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                        maxLength={8}
                                        disabled={inputDiable}
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-3 w-full'
                                        placeholder='HSN/SAC'
                                    />
                                </div>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px] flex gap-2'>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                        maxLength={5}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        name='qty'
                                        disabled={inputDiable}
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-3 w-full'
                                        placeholder='Qty'
                                    />
                                    <select
                                        name='qty_type'
                                        value={quantityType}
                                        onChange={(e) => setQuantityType(e.target.value)}
                                        disabled={inputDiable}
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md text-gray-500 text-xs ps-3 w-full'>
                                        <option value="gm">Gm</option>
                                        <option value="kg">Kg</option>
                                    </select>
                                </div>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                    <input
                                        type="text"
                                        value={rate}
                                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                        maxLength={7}
                                        onChange={(e) => setRate(e.target.value)}
                                        name='rate'
                                        disabled={inputDiable}
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-3 w-full'
                                        placeholder='Rate'
                                    />
                                </div>

                                <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                    <input type="text" value={texable} className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs  ps-3 w-full ' placeholder='Texable Value' readOnly />
                                </div>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                    <select value={gst} onChange={(e) => setGst(e.target.value)} name="" id="" className='border-2 border-gray-400 py-2 outline-none rounded-md text-gray-500 text-xs  ps-3 w-full '>
                                        <option value="IGST Amount(%)">IGST Amount(%)</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                        <option value="28">28%</option>
                                    </select>
                                </div>
                                <div className='py-3 px-3'>
                                    <button className='w-full py-1 outline-none rounded-md text-white bg-blue-400' onClick={handleProductAdd}>Add</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {manual === "manual" && (
                        <div className='border-blue-400 border-[3px] my-8'>
                            <div className='grid grid-cols-[3fr,1fr,1.4fr,1fr,1.2fr,2fr,1fr]'>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px] relative'>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchInputValue}
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-8 w-full '
                                        onClick={handleInputClick}
                                        onChange={handleInputChange}
                                    />
                                    {showCatalogs && (
                                        <div className="absolute top-[140%] bg-white shadow border-2 border-gray-100 w-full px-4 py-3 rounded-lg">
                                            {filteredCatalogs.map(catalog => (
                                                <div key={catalog.id} onClick={() => handleCatalogSelect(catalog)} className='py-2 ps-3 hover:bg-gray-200 rounded-lg font-medium'>
                                                    {catalog.name_of_chemical}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute top-[36%] left-6 text-gray-500' />
                                </div>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                    <input
                                        type="text"
                                        onChange={(e) => setHsn(e.target.value)}
                                        name='hsn'
                                        value={hsn}
                                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                        maxLength={6}
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-3 w-full'
                                        placeholder='HSN/SAC'
                                    />
                                </div>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px] flex gap-2'>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                        maxLength={5}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        name='qty'
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-3 w-full'
                                        placeholder='Qty'
                                    />
                                    <select
                                        name='qty_type'
                                        value={quantityType}
                                        onChange={(e) => setQuantityType(e.target.value)}
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md text-gray-500 text-xs ps-3 w-full'>
                                        <option value="gm">Gm</option>
                                        <option value="kg">Kg</option>
                                    </select>
                                </div>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                    <input
                                        type="text"
                                        value={rate}
                                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                        maxLength={7}
                                        onChange={(e) => setRate(e.target.value)}
                                        name='rate'
                                        className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-3 w-full'
                                        placeholder='Rate'
                                    />
                                </div>

                                <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                    <input type="text" value={texable} className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs  ps-3 w-full ' placeholder='Texable Value' readOnly />
                                </div>
                                <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                    <select value={gst} onChange={(e) => setGst(e.target.value)} name="" id="" className='border-2 border-gray-400 py-2 outline-none rounded-md text-gray-500 text-xs  ps-3 w-full '>
                                        <option value="IGST Amount(%)">IGST Amount(%)</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                        <option value="28">28%</option>
                                    </select>
                                </div>
                                <div className='py-3 px-3'>
                                    <button className='w-full py-1 outline-none rounded-md text-white bg-blue-400' onClick={handleProductAdd}>Add</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="w-full border-[3px] border-blue-400 table-auto mt-6 mb-8" onClick={() => setShowCatalogs(false)}>
                        <thead className='border-[3px] border-blue-400 bg-blue-100'>

                            <tr className='border-[3px] border-blue-400'>
                                <th className='border-blue-400 border-r-[3px] w-[5%] font-medium text-xl py-3'>Sr No.</th>
                                <th className='border-blue-400 border-r-[3px] w-[22%] font-semibold text-xl'>Name Of Product / Service</th>
                                <th className='border-blue-400 border-r-[3px] w-[7%] font-semibold text-lg text-center'>HSN / SAC</th>
                                <th className='w-[5%] font-semibold text-lg border-blue-400 border-r-[3px]'>Qty</th>
                                <th className='w-[7%] font-semibold text-lg border-blue-400 border-r-[3px]'>Rate</th>
                                <th className='w-[7%] font-semibold text-lg border-blue-400 border-r-[3px]'>Taxable Value</th>
                                {newVariable === "same" ? (
                                    <th className='w-[10%] font-semibold text-lg border-blue-400 border-r-[3px]'>
                                        <div className='border-blue-400 border-b-[3px]'>GST</div>
                                        <div className='grid grid-cols-[1fr,1fr]'>
                                            {/* <div className='border-blue-400 border-r-[3px]'>SGST</div> */}
                                            <div className='text-sm pt-1 px-2 border-r-[3px] border-blue-400'>SGST</div>
                                            <div className='text-sm pt-1 px-2'>CGST</div>
                                        </div>
                                    </th>
                                ) : (
                                    <th className='w-[7%] font-semibold text-lg border-blue-400 border-r-[3px]'>
                                        <div className='border-blue-400'>IGST</div>
                                    </th>
                                )}
                                <th className='w-[5%] font-semibold text-lg border-blue-400 border-r-[3px]'>Total</th>
                                <th className='w-[5%] font-semibold text-lg border-blue-400 border-r-[3px]'>Remove</th>
                            </tr>

                        </thead>
                        <tbody className='border-[3px] border-blue-400'>
                            {formData?.product_details && formData?.product_details.map((e, index) => (
                                <tr className=''>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-3 py-2 text-center align-baseline'>{index + 1}</td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 py-2'>
                                        <p className='font-semibold'>{e.chem_name}</p>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium py-2 text-center'>{e.hsn}</td>
                                    <td className='border-blue-400 border-r-[3px] font-medium py-2 text-center'>{e.qty}</td>
                                    <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>{e.rate}</td>
                                    <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>{e.rate * e.qty}</td>
                                    {newVariable === "same" ? (
                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                            <div className='grid grid-cols-[1fr,1fr]'>
                                                <div className='border-blue-400 border-r-[3px] h-full'>{((e.taxable_amount * e.igst) / 100) / 2} ({e.igst / 2}%)</div>
                                                <div className=' h-full'>{((e.taxable_amount * e.igst) / 100) / 2} ({e.igst / 2}%)</div>
                                            </div>
                                        </td>
                                    ) : (
                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                            <div className='grid grid-cols-[1fr]'>
                                                <div className=' h-full text-center'>{(e.taxable_amount * e.igst) / 100} ({e.igst}%)</div>
                                            </div>
                                        </td>
                                    )}
                                    {newVariable === "same" ? (
                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>{(e.rate * e.qty) + (Number(e.taxable_amount || 0) * Number(e.igst || 0) / 100)}</td>
                                    ) : (
                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>{(e.rate * e.qty) + (Number(e.taxable_amount || 0) * Number(e.igst || 0) / 100)}</td>
                                    )}
                                    <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                        {inputDiable ? (
                                            <button onClick={() => handleProductEdit(index)} className='text-black bg-gray-300 rounded-lg px-4 py-2 text-xs cursor-pointer'>EDIT</button>
                                        ) : (
                                            <button onClick={() => handleProductRemove(index)} className='text-white bg-red-600 rounded-lg px-4 py-2 text-xs cursor-pointer'>REMOVE</button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {formData?.product_details.length > 0 && (
                                <tr className='border-blue-400 border-[3px] bg-blue-100'>
                                    <td></td>
                                    <td></td>
                                    <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>Total</td>

                                    {/* Total Quantity */}
                                    <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>
                                        {totals.totalQty}
                                    </td>

                                    {/* Total Rate */}
                                    <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>
                                        <p className='flex justify-end items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                            {totals.totalRate}
                                        </p>
                                    </td>

                                    {/* Total Taxable Amount */}
                                    <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>

                                        <p className='flex justify-end items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                            {totals.totalTaxableAmount}
                                        </p>
                                    </td>

                                    {/* Total IGST */}
                                    <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>
                                        <p className='flex justify-end items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                            {totals.totalIGST}
                                        </p>
                                    </td>

                                    {/* Total for (rate * qty) + ((taxable_amount * igst) / 100) */}
                                    <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>
                                        <p className='flex justify-end items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                            {totals.totalCompound}
                                        </p>
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>


                    <div className='border-blue-400 border-[3px] border-t-0 border-r-0 grid grid-cols-[1fr]' onClick={() => setShowCatalogs(false)}>
                        <div className='grid grid-cols-[1.8fr,1.2fr,]'>
                            <div className='border-blue-400 '>
                                <div className='font-medium text-center border-blue-400 border-b-[3px] border-t-[3px] py-1'>
                                    Total In Words
                                </div>
                                <div className='font-semibold text-center border-blue-400 border-b-[3px] py-1'>
                                    {numberToWords(totals.totalCompound).toUpperCase()} RUPEES ONLY
                                </div>
                                <div className='font-semibold text-center border-blue-400 border-b-[3px] py-1'>
                                    BANK DETAILS <span className='bg-blue-700 text-white px-1 ms-1 cursor-pointer' onClick={() => setEditBank(true)}>+</span>
                                </div>
                                <div className='border-blue-400 border-b-[3px] py-2 px-5'>
                                    <div className='grid grid-cols-[4.7fr,1.3fr]'>
                                        <div className=''>
                                            <div className='grid grid-cols-[0.7fr,1.3fr]'>
                                                <p className='font-medium'>Name</p>
                                                <p className='font-medium'>{formData?.bank_details?.[0]?.bank_name}</p>
                                            </div>
                                            <div className='grid grid-cols-[0.7fr,1.3fr]'>
                                                <p className='font-medium'>Branch</p>
                                                <p className='font-medium'>{formData?.bank_details?.[0]?.bank_branch}</p>
                                            </div>
                                            <div className='grid grid-cols-[0.7fr,1.3fr]'>
                                                <p className='font-medium'>Account Number</p>
                                                <p className='font-medium'>{formData?.bank_details?.[0]?.bank_account_num}</p>
                                            </div>
                                            <div className='grid grid-cols-[0.7fr,1.3fr]'>
                                                <p className='font-medium'>IFSC Code</p>
                                                <p className='font-medium'>{formData?.bank_details?.[0]?.bank_IFSC_code}</p>
                                            </div>
                                            {/* <div className='grid grid-cols-[0.7fr,1.3fr]'>
                                            <p className='font-medium'>UPI ID</p>
                                            <p className='font-medium'>{selectedBank}</p>
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className='font-semibold text-center border-blue-400 border-b-[3px] py-1'>
                                    TERMS & CONDITIONS <span className='bg-blue-700 text-white px-1 ms-1 cursor-pointer' onClick={() => setEditTerms(true)}>+</span>
                                </div>
                                <div className='py-2 px-3'>
                                    <p className='font-semibold'>{formData?.termsand_condition}</p>
                                </div>
                            </div>
                            <div className='border-blue-400 border-b-0 border-[3px]'>
                                <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                    <p className='font-semibold'>Taxable Amount</p>
                                    <p className='font-semibold flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                        {totals.totalTaxableAmount}
                                    </p>
                                </div>
                                {newVariable === "same" ? (
                                    <>
                                        <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                            <p className='font-semibold'>Add: SGST</p>
                                            <p className='font-semibold flex items-center gap-1'>
                                                <p>{totalTaxInPercentage / 2}%</p>
                                                <p className='flex items-center'>
                                                    (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                    {totals.totalIGST / 2})
                                                </p>
                                            </p>
                                        </div>
                                        <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                            <p className='font-semibold'>Add: CGST</p>
                                            <p className='font-semibold flex items-center gap-1'>
                                                <p>{totalTaxInPercentage / 2}%</p>
                                                <p className='flex items-center'>
                                                    (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                    {totals.totalIGST / 2})
                                                </p>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                            <p className='font-semibold'>Add: IGST</p>
                                            <p className='font-semibold flex gap-1'>
                                                <p>{totalTaxInPercentage}%</p>
                                                <p className='flex items-center'>
                                                    (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                    {totals.totalIGST})
                                                </p>
                                            </p>
                                        </div>
                                    </>
                                )}
                                <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                    <p className='font-semibold'>Total Tax</p>
                                    <p className='font-semibold flex items-center gap-1'>
                                        <p className='flex items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                            {totals.totalIGST}
                                        </p>
                                        <p>({totalTaxInPercentage}%)</p>
                                    </p>
                                </div>
                                <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                    <p className='font-semibold'>Total Amount After Tax</p>
                                    <p className='font-semibold flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                        {totals.totalCompound}</p>
                                </div>
                                <div className='flex justify-end border-blue-400 border-b-[3px] py-1 px-2'>
                                    <p className='font-semibold'>(E & O.E)</p>
                                </div>
                                <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                    <p className='font-semibold'>GST Payable on reverse chagrge</p>
                                    <p className='font-semibold'>N.A</p>
                                </div>
                                <div className='flex justify-center py-3 border-blue-400 border-b-[3px] py-1 px-2'>
                                    <img src={formData?.upload_stamp} alt="" className='h-[60px]' />
                                </div>
                                <div className='flex justify-between items-center py-1 px-2'>
                                    <p className='font-bold'>Authority Signatory</p>
                                    <img src={formData?.upload_sign} alt="" className='h-[30px]' />
                                </div>
                            </div>
                        </div>
                    </div>

                    {yesOrNo && (
                        <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
                                <div className="bg-white py-3 w-[400px]">
                                    <div className="flex flex-col items-center">
                                        <img src={right} alt="" className='h-[80px]' />
                                        <h3 className='font-semibold text-xl mt-4 text-center'>Are You Sure You Want To Generate Invoice?</h3>
                                    </div>
                                </div>
                                <div className="bg-white mx-8 pb-3">
                                    <button onClick={generatePo} type="button" className="mt-3 mb-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Yes</button>
                                    <button onClick={() => setYesOrNo(false)} type="button" className=" inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
                                <div className="bg-white py-3 w-[400px]">
                                    <div className="flex flex-col items-center">
                                        <img src={right} alt="" className='h-[80px]' />
                                        <h3 className='font-semibold text-xl mt-4 text-center'>Invoice Generated Successfully!</h3>
                                    </div>
                                </div>
                                <div className="bg-white mx-8 pb-3">
                                    <button onClick={() => navigate("/company/sales-data")} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {editBank && (
                        <>
                            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                <div class="fixed inset-0 bg-black bg-opacity-35 transition-opacity"></div>

                                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                            <div className="bg-white">
                                                <p className='font-semibold text-lg mb-2 px-5'>Your Bank Details</p>
                                                <div className='bg-gray-50 px-7 pt-5 pb-6'>
                                                    <div className='grid grid-cols-[1fr] gap-y-5 gap-x-5 max-h-[200px] overflow-y-scroll'>
                                                        {banks && banks.map((e) => (
                                                            <div key={e.account_number} className='flex gap-3'>
                                                                <div>
                                                                    <input
                                                                        type="radio"
                                                                        name="bank"
                                                                        onChange={() => setSelectedBankAccountNumber(e.account_number)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className='text-sm font-medium'>{e.bank_name}</p>
                                                                    <p className='text-sm'>{e.account_number}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-white pt-3 flex justify-end gap-3 mt-3 px-5">
                                                    <button onClick={() => setEditBank(false)} type="button" className="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                                                    <button
                                                        onClick={handleAddBank}
                                                        type="button"
                                                        className="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {editTerms && (
                        <>
                            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                <div class="fixed inset-0 bg-black bg-opacity-35 transition-opacity"></div>

                                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                            <div class="bg-white ">
                                                <p className=' font-semibold text-lg mb-2 px-5'>Add Terms & Condition</p>
                                                <div className='bg-gray-50 px-7 pt-5 pb-2'>
                                                    <div className='grid grid-cols-[1fr] gap-y-5 gap-x-5'>
                                                        <div>
                                                            <p className='text-sm mb-1'>Select terms & condition</p>
                                                            <select onChange={handleTermsConditionSelect} name="" id="" className='bg-transparent outline-none border-2 border-gray-300 rounded text-sm placeholder:text-slate-500 px-3 py-2 w-full'>
                                                                <option value="">select invoice ters & condition</option>
                                                                {addresss && [...addresss].reverse().map((e) => (
                                                                    <option value={e.values?.slice(0, 200)}>{e.terms_and_condition_title}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <p className='text-sm mb-1'>Edit terms & condition</p>
                                                            <textarea value={formData?.termsand_condition} onChange={handleChange} name="termsand_condition" id="" rows="4" className='bg-transparent outline-none border-2 border-gray-300 rounded text-sm placeholder:text-slate-500 px-3 py-2 w-full'></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="bg-white pt-3 flex justify-end gap-3 mt-3 px-5">
                                                    <button onClick={() => setEditTerms(false)} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                                                    <button onClick={() => setEditTerms(false)} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
            {display && (
                <div className="absolute left-0 top-0 z-10 w-full bg-black bg-opacity-30 h-[100vh] overflow-y-scroll">
                    <div className="relative py-4">
                        <div className="py-3">
                            <div className="">
                                {sendData?.design === "design1" && (
                                    <InvoicePdf data={sendData} />
                                )}
                                {sendData?.design === "design2" && (
                                    <InvoicePdf2 data={sendData} />
                                )}
                                {sendData?.design === "design3" && (
                                    <InvoicePdf3 data={sendData} />
                                )}
                                {sendData?.design === "" && (
                                    <InvoicePdf data={sendData} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Editinvoice
