import React, { useContext, useEffect, useRef, useState } from 'react'
import sign from "../images/sign.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import right from "../images/right.png";
import countries from "../pages/CountryStateCity.json"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Invoice1 from './Invoice1';
import Invoice2 from './Invoice2';
import Invoice3 from './Invoice3';
import { getStepConnectorUtilityClass } from '@mui/material';
import { DisplayPoContext } from '../context/PoViewContext';
import { BASE_URL } from '../BASE_URL';

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        //   style: 'currency', 
        currency: 'INR',
        minimumFractionDigits: 2, // At least two decimal places
        maximumFractionDigits: 2 // No more than two decimal places
    }).format(price);
};


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

const GeneratePo = () => {

    // const generateUniqueNumber = () => {
    //     let newNumber;
    //     const usedNumbers = JSON.parse(localStorage.getItem("usedNumbers")) || [];

    //     do {
    //         newNumber = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    //     } while (usedNumbers.includes(newNumber));

    //     // Add the new number to the list and save it to local storage
    //     usedNumbers.push(newNumber);
    //     localStorage.setItem("usedNumbers", JSON.stringify(usedNumbers));

    //     return newNumber;
    // };

    const { displayPo, setDisplayPo } = useContext(DisplayPoContext);

    const { _id } = useParams();

    const [inputDiable, setInputDisable] = useState(false)


    useEffect(() => {
        if (_id) {
            setInputDisable(true)
        }
    }, [_id]);

    // const

    const [isOpenPhoto, setIsOpenPhoto] = useState(false);
    const [sendData, setSendData] = useState("");

    const [data, setData] = useState("")

    const [productCas, setProductCas] = useState("")
    const [productName, setProductName] = useState("")
    const [productFormula, setProductFormula] = useState("")
    const [hsn, setHsn] = useState("")
    const [quantity, setQuantity] = useState(null)
    const [quantityType, setQuantityType] = useState("")
    const [rate, setRate] = useState(null)
    const [texable, setTexable] = useState("")
    const [gst, setGst] = useState("")

    const [addressArray, setAddressArray] = useState([])

    const [selectAddress, setSelectAddress] = useState(false)

    const [productDetailArray, setProductDetailArray] = useState([])
    const [sellerCompanyId, setSellerCompanyId] = useState("")

    const location = useLocation();

    const [formData, setFormData] = useState({
        bill_to_gst_in: '',
        bill_to_name: '',
        bill_to_address: '',
        bill_to_country: '',
        bill_to_state: '',
        bill_to_city: '',
        bill_to_pincode: null,
        bill_to_phone: null,
        shipped_to_gst_in: '',
        shipped_to_name: '',
        shipped_to_address: '',
        shipped_to_country: '',
        shipped_to_state: '',
        shipped_to_city: '',
        shipped_to_pincode: null,
        shipped_to_phone: null,
        po_num: '',
        po_date: getFormattedDate(),
        delivery_time: '',
        payment_terms: '',
        inco_terms: '',
        grand_total: null,
        termsand_condition: '',
        upload_sign: null,
        upload_stamp: null,
        invoice_type: "po",
        invoice_mode: "manual",
        product_details: []
    });

    // console.log(formData?.product_details)

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


        // setFormData(prevFormData => ({
        //     ...prevFormData,
        //     bill_to_gst_in: buyerCompany.gst,
        // }));


    }

    useEffect(() => {
        fetchFinalDetails();
    }, [_id]);

    const [allDataInquiry, setAllDataInquiry] = useState("")

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
            setSellerCompanyId(sellerCompany?._id)
            setAllDataInquiry(allData)

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
                setSearchInputValue(allData?.product?.name_of_chemical)
                setProductCas(allData?.product?.CAS_number);
                setProductName(allData?.product?.name_of_chemical);
                setProductFormula(allData?.product?.molecularFormula);
                setHsn(allData?.hsn_code);
                setQuantity(allData?.one_lot_qty);
                setQuantityType(allData?.one_lot_qty_type);
                setRate(allData?.one_lot_qty_price * allData?.total_lot);
            }

            // const newProductDetail = {
            //     cas_no: allData?.product?.CAS_number,
            //     chem_name: allData?.product?.name_of_chemical,
            //     mol_formula: allData?.product?.molecularFormula,
            //     hsn: 123123,
            //     qty: allData?.inquiry_qty,
            //     qty_type: allData?.qty_type,
            //     taxable_amount: 100,
            //     rate: 80,
            //     igst: 0,
            // };

            // const updatedProductDetails = [...productDetailArray, newProductDetail];

            // setProductDetailArray(updatedProductDetails);

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
                shipped_to_gst_in: sellerCompany.gst,
                shipped_to_name: sellerCompany.company_name,
                shipped_to_address: sellerCompany.address,
                shipped_to_country: sellerCompany.country,
                shipped_to_state: sellerCompany.state,
                shipped_to_city: sellerCompany.city,
                shipped_to_pincode: sellerCompany.pincode,
                shipped_to_phone: sellerCompany.mobile_num,
                delivery_time: allData.delivery_time,
                payment_terms: allData.payment_terms,
                inco_terms: allData.inco_terms,
                invoice_type: 'po',
                invoice_mode: 'auto',
            }));
        }
    };

    useEffect(() => {
        if (_id) {
            inquiryDetail();
        }
    }, [_id]);

    const navigate = useNavigate()

    const [editTerms, setEditTerms] = useState(false)

    const [yesOrNo, setYesOrNo] = useState(false)

    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [shippedStates, setShippedStates] = useState([])
    const [shippedCities, setShippedCities] = useState([])

    const generateUniqueNumber = () => {
        return Math.floor(Math.random() * 10000);
    };

    // prefix start

    useEffect(() => {
        // Check if location.state exists and has the necessary data
        if (location.state?.prefix) {
            // Generate unique number
            const number = generateUniqueNumber();

            // Extract prefix from location.state
            const prefixFromLocation = location.state.prefix;

            // Concatenate prefix and unique number
            const poNum = prefixFromLocation + number;


            // Update the formData state with the new po_num
            setFormData((prevData) => ({
                ...prevData,
                po_num: poNum // Set po_num to the concatenated value
            }));
        }
    }, [location]);

    // prefix end

    // product array start

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            product_details: productDetailArray
        }));
    }, [productDetailArray]);

    // product array end


    // onChange evert start 

    const handleChange = async (e) => {
        const { name, value } = e.target;
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

        if (name === "bill_to_gst_in") {
            updatedFormData = {
                bill_to_gst_in: value,
                shipped_to_gst_in: value
            };
        }

        setFormData((prevData) => {
            return {
                ...prevData,
                ...updatedFormData,
                [name]: value
            };
        });

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

    // onChange evert end


    // data from PINCODE api start 

    const fetchFetailsFromPincode = async (pincode) => {
        try {
            const res = await fetch(`https://api.chembizz.in/api/public/getPincodeDetails/${pincode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await res.json();
            const data = response[0]?.PostOffice[0]

            if (data) {

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
            const data = response[0]?.PostOffice[0]

            if (data) {

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

    // data from PINCODE api end

    // stamp and sign data start 

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

    useEffect(() => {
        fetchStampData();
    }, []);


    // stamp and sign data end

    // generate PO start fo]eom here

    const generatePo = async () => {
        const gstCheck = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (formData?.product_details?.length < 1) {
            toast.error('Please Add Product', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

        const formDataToSend = new FormData();

        if (formData.invoice_mode === 'auto') {

            formDataToSend.append('inq_type', allDataInquiry?.inq_type);
            formDataToSend.append('inquiry_id', _id);
            formDataToSend.append('seller_company_id', sellerCompanyId);
        }

        // Append all other form data fields to formDataToSend
        Object.keys(formData).forEach((key) => {
            if (key === 'product_details') {
                // Special handling for 'product_details' array
                formData[key].forEach((item, index) => {
                    Object.keys(item).forEach((subKey) => {
                        formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
                    });
                });
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            // Send a POST request to the server with the form data
            const response = await fetch(`${BASE_URL}api/salesInvoice/insert`, {
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: formDataToSend
            });

            // Parse the response JSON data
            const responseData = await response.json();

            // Handle the response status
            if (!response.ok) {
                toast.error(responseData.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            } else {
                // Update the UI state based on the response data
                setIsOpenPhoto(true);
                setSendData(responseData?.data);
                toast.success('PO Generated Successfully', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            // Log any errors that occurred during the fetch
            console.error("Error generating PO:", error);
        }
    };


    // generate PO start fo]eom here

    const [filteredCatalogs, setFilteredCatalogs] = useState([]);

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchInputValue(inputValue);
    };

    const [catelogs, setCatelogs] = useState([]);
    const [searchInputValue, setSearchInputValue] = useState("");
    const [showCatalogs, setShowCatalogs] = useState(false);

    const fetchCatelogData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}api/product/displayAllProductWithoutToken`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await res.json();
        setCatelogs(data?.products);
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
        fetchCatelogData();
        fetchUserData();
    }, []);

    useEffect(() => {
        const filteredCatalogs = catelogs?.filter(catalog =>
            catalog?.name_of_chemical && catalog?.name_of_chemical?.toLowerCase()?.includes(searchInputValue?.toLowerCase())
        );
        setFilteredCatalogs(filteredCatalogs);
    }, [searchInputValue, catelogs]);

    const handleInputClick = () => {
        setShowCatalogs(true);
    };

    useEffect(() => {
        if (allDataInquiry?.inq_type === "sample inquiry") {
            const value = allDataInquiry?.one_lot_qty_price * allDataInquiry?.total_lot
            setTexable(value)
        } else {
            setTexable(quantity * rate)
        }
    }, [rate, quantity, allDataInquiry]);

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

        if (!hsn.trim()) {
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

        if (!gst.trim()) {
            toast.error('Please Select Gst', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        let qty = quantity;
        let qtytyp = quantityType;

        if (quantityType === "gm") {
            qty = quantity / 1000;
            qtytyp = "kg"
        }

        const tax = ((qty * rate) * gst) / 100
        const total = (qty * rate) + tax;

        const newProductDetail = {
            cas_no: productCas,
            chem_name: productName,
            mol_formula: productFormula,
            hsn: hsn,
            qty: qty,
            qty_type: qtytyp,
            taxable_amount: tax,
            rate: rate,
            igst: gst,
            gstAmount: tax,
            total: total,
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
        setProductDetailArray([])
        fetchFinalDetails("edit")
        setInputDisable(false)
        inquiryDetail()
    };

    const handleProductRemove = (index) => {
        setProductDetailArray(prevArray => prevArray.filter((_, i) => i !== index));
    };

    const [selectedAddress, setSelectedAddress] = useState("")

    const handleAddAddress = () => {
        const selectedAddres = addressArray.find(address => address._id === selectedAddress);

        const selectedCountry = countries.find(
            (country) => country.name === selectedAddres.country
        );
        setStates(selectedCountry ? selectedCountry.states : []);
        const selectedState = selectedCountry?.states.find(
            (state) => state.name === selectedAddres.state
        );
        setCities(selectedState ? selectedState.cities : []);

        setFormData((prevData) => ({
            ...prevData,
            bill_to_address: selectedAddres.address_details,
            bill_to_country: selectedAddres.country,
            bill_to_state: selectedAddres.state,
            bill_to_city: selectedAddres.city,
            bill_to_pincode: selectedAddres.pincode,
            bill_to_name: data.company_name,
            bill_to_phone: data.mobile_num,
            bill_to_gst_in: data.gst,
        }));

        setSelectAddress(false)
    }

    const totalTaxableAmount = formData?.product_details && formData?.product_details.reduce((total, e) => total + Number(e.taxable_amount), 0);
    const totalTaxAmount = formData?.product_details && formData?.product_details.reduce((total, e) => total + (Number(e.rate) * Number(e.igst)) / 100, 0);
    const totalTaxInPercentage = formData?.product_details && formData?.product_details.reduce((total, e) => total + (Number(e.igst)), 0);
    const totalAmount = formData?.product_details && formData?.product_details.reduce((total, e) => total + Number(e.taxable_amount) + ((Number(e.rate) * Number(e.igst)) / 100), 0);

    const [newVariable, setNewVariable] = useState("");

    const checkStates = () => {
        const { bill_to_state } = formData;

        if (!bill_to_state || !data.state) {
            setNewVariable("not got");
        } else if (bill_to_state === data.state) {
            setNewVariable("same");
        } else {
            setNewVariable("different");
        }
    };

    useEffect(() => {
        checkStates();
    }, [formData.bill_to_state, data.state]);


    const computeTotals = (productDetails) => {

        const totals = productDetails.reduce((acc, e) => {
            const qty = Number(e.qty || 0);
            const rate = Number(e.rate || 0);
            const taxableAmount = Number(e.taxable_amount || 0);
            const igst = Number(e.igst || 0);

            const igstValue = (rate * igst) / 100;

            acc.totalQty += qty;
            acc.totalRate += rate;
            acc.totalTaxableAmount += taxableAmount;
            acc.totalIGST += igstValue;
            acc.totalCompound += rate + igstValue;

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

    const totals = computeTotals(formData?.product_details);

    useEffect(() => {
        const totals = computeTotals(formData?.product_details);
        setFormData((prevFormData) => ({
            ...prevFormData,
            grand_total: totals.totalCompound
        }));
    }, [formData?.product_details]);

    const [addresss, setAddresss] = useState([])

    const fetchCompanyTermsCondition = async () => {
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

        if (addresss.length < 1) {
            setFormData((prevData) => ({
                ...prevData,
                termsand_condition: data.data[0]?.details || '',
            }));
        }
    }

    useEffect(() => {
        fetchCompanyTermsCondition();
    }, []);


    const handleTermsConditionSelect = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            termsand_condition: e.target.value,
        }));
    }

    const handleYesNo = () => {
        setYesOrNo(true)
    }


    const fetchBillingAddress = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/company_address/display`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setAddressArray(data.data);
    }

    useEffect(() => {
        fetchBillingAddress();
    }, []);

    const manual = location.state.manual || '';

    return (
        <>
            <div className='h-[100vh] max-w-[80vw] pt-2'>

                <div className='bg-white pe-5 pb-10'>
                    <div className='mb-10 flex justify-between'>
                        <h1 className="md:text-3xl text-xl font-semibold">Generate PO</h1>
                        <button onClick={handleYesNo} className='bg-darkBlue text-white text-xs px-20 rounded-[10px]'>Generate PO</button>
                    </div>

                    <div>

                        <table className="w-full border-[3px] border-blue-400 border-b-0 table-auto " onClick={() => setShowCatalogs(false)}>
                            <thead className='border-[3px] border-blue-400 border-b-0'>
                                <tr className='border-[3px] border-blue-400 border-b-0'>
                                    <th className='border-blue-400 border-r-[3px] w-1/3 font-medium text-2xl py-3'>

                                        <p className='font-semibold text-2xl text-[#0070C0] flex items-center justify-center gap-2'>Buyer Detail <span className='bg-blue-700 text-lg cursor-pointer text-white px-1 leading-[20px]' onClick={() => setSelectAddress(true)}>+</span> <span className='text-xs flex items-center'><input type="checkbox" className='me-1' />same as bill to</span> </p>
                                        <p className='text-xs'>(shipping address)</p>
                                    </th>
                                    <th className='border-blue-400 border-r-[3px] w-1/3'>
                                        <p className='font-semibold text-2xl text-[#0070C0]'>Seller Detail </p>
                                    </th>
                                    <th className='w-1/3 font-semibold text-lg '>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='border-[3px] border-blue-400'>
                                <tr className=''>

                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pt-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center pb-2">
                                            <p className=''>GSTIN</p>
                                            <p className='flex items-center gap-2 leading-[40px]'>:
                                                {/* <span className='bg-blue-700 text-white px-1 leading-[20px] '>+</span> */}
                                                <input onChange={handleChange} name='shipped_to_gst_in' type="text" value={formData?.bill_to_gst_in} className='w-full border border-gray-300 px-2 rounded-md' /></p>
                                        </div>
                                    </td>

                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pt-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center pb-2">
                                            <p className=''>GSTIN</p>
                                            <p className='flex items-center gap-2 leading-[40px]'>:
                                                <input onChange={handleChange} name='shipped_to_gst_in' type="text" value={formData?.shipped_to_gst_in} className='w-full border border-gray-300 px-2 rounded-md' /></p>
                                        </div>
                                    </td>

                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4'>
                                        <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>PO No.</p>
                                            <p className='flex items-center gap-2'>:
                                                <input
                                                    name='po_num'
                                                    value={formData.po_num}
                                                    type="tel"
                                                    className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                                />
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className=''>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center pb-2">
                                            <p className=''>Name</p>
                                            <p className='flex items-center gap-2 leading-[40px]'>:
                                                <input onChange={handleChange} name='shipped_to_name' type="text" value={formData?.bill_to_name} className='w-full border border-gray-300 px-2 rounded-md' /></p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Name</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <input onChange={handleChange} name='shipped_to_name' value={formData?.shipped_to_name} type="text" className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>PO Date</p>
                                            <p className='flex items-center gap-2'>: <input name='po_date' onChange={handleChange} type='date' value={formData?.po_date} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className=''>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-2'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Address</p>
                                            <p className='flex items-center gap-2 me-3'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <textarea onChange={handleChange} name='shipped_to_address' value={formData?.bill_to_address} className='border-2 border-gray-300 px-2 py-1 rounded-md w-full'></textarea></p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-2'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Address</p>
                                            <p className='flex items-center gap-2 me-3'>:
                                                <textarea onChange={handleChange} name='shipped_to_address' value={formData?.shipped_to_address} className='border-2 border-gray-300 px-2 py-1 rounded-md w-full'></textarea></p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className=''>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Pincode</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <input
                                                    type="tel"
                                                    name='shipped_to_pincode'
                                                    onChange={handleChange}
                                                    value={formData?.bill_to_pincode}
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    maxLength={6}
                                                    className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                                />
                                            </p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Pincode</p>
                                            <p className='flex items-center gap-2'>:
                                                <input
                                                    name='shipped_to_pincode'
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    maxLength={6}
                                                    onChange={handleChange}
                                                    value={formData?.shipped_to_pincode}
                                                    type="text"
                                                    className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                                />
                                            </p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>Delivery Time</p>
                                            <p className='flex items-center gap-2'>:
                                                <select value={formData.delivery_time} onChange={handleChange} name='delivery_time' className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    <option value="Immediate">Immediate</option>
                                                    <option value="Delivery in 15 Days">Delivery in 15 Days</option>
                                                    <option value="Delivery in 30 Days">Delivery in 30 Days</option>
                                                </select></p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className=''>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Country</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <select name='shipped_to_country' value={formData.bill_to_country} onChange={handleChange} className='w-full border-2 border-gray-300 w-[70%] px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {countries && countries.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select>
                                            </p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Country</p>
                                            <p className='flex items-center gap-2'>:
                                                <select name='shipped_to_country' value={formData.shipped_to_country} onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {countries && countries.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select>
                                            </p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>Payment Terms</p>
                                            <p className='flex items-center gap-2'>:
                                                <select value={formData.payment_terms} onChange={handleChange} name='payment_terms' className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    <option value="Advance">Advance</option>
                                                    <option value="Immediate">Immediate</option>
                                                    <option value="15 Days Credit">Credit (15 Days)</option>
                                                    <option value="30 Days Credit">Credit (30 Days)</option>
                                                    <option value="45 Days Credit">Credit (45 Days)</option>
                                                </select></p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className=''>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>State</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <select name='shipped_to_state' value={formData.bill_to_state} onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {states && states.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select></p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>State</p>
                                            <p className='flex items-center gap-2'>:
                                                <select value={formData.shipped_to_state} name='shipped_to_state' onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {shippedStates && shippedStates.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select></p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>Inco Terms</p>
                                            <p className='flex items-center gap-2'>:
                                                <select onChange={handleChange} name='inco_terms' value={formData?.inco_terms} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'>
                                                    <option value="">Select</option>
                                                    <option value="EXW - Ex Works" >EXW - Ex Works</option>
                                                    <option value="FOB - Free on Board" >FOB - Free on Board</option>
                                                    <option value="CIF - Cost, insurance & Fright" >CIF - Cost, insurance & Fright</option>
                                                    <option value="DDP - Delivered Duty Paid" >DDP - Delivered Duty Paid</option>
                                                </select></p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className=''>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>City</p>
                                            <p className='flex items-center gap-2'>:
                                                <select name='shipped_to_city' value={formData?.bill_to_city} onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {cities && cities.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select></p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>City</p>
                                            <p className='flex items-center gap-2'>:
                                                <select name='shipped_to_city' value={formData?.shipped_to_city} onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {shippedCities && shippedCities.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select></p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2'>
                                    </td>
                                </tr>
                                <tr className=''>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Phone</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <input
                                                    name='shipped_to_phone'
                                                    onChange={handleChange}
                                                    value={formData?.bill_to_phone}
                                                    type="tel"
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    maxLength={10}
                                                    className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                                />
                                            </p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Phone</p>
                                            <p className='flex items-center gap-2'>:
                                                <input
                                                    name='shipped_to_phone'
                                                    onChange={handleChange}
                                                    value={formData?.shipped_to_phone}
                                                    type="tel"
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    maxLength={10}
                                                    className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                                />
                                            </p>
                                        </div>
                                    </td>
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2'>
                                    </td>
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
                                                {filteredCatalogs && filteredCatalogs?.map(catalog => (
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
                                            disabled={inputDiable}
                                        />
                                        {showCatalogs && (
                                            <div className="absolute top-[140%] bg-white shadow border-2 border-gray-100 w-full px-4 py-3 rounded-lg">
                                                {filteredCatalogs?.map(catalog => (
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
                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                            {allDataInquiry?.inq_type === "sample inquiry" ? (
                                                <>{allDataInquiry?.one_lot_qty_price * allDataInquiry?.total_lot}</>
                                            ) : (
                                                <>{e.rate * e.qty}</>
                                            )}
                                        </td>
                                        {newVariable === "same" ? (
                                            <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                                <div className='grid grid-cols-[1fr,1fr]'>
                                                    <div className='border-blue-400 border-r-[3px] h-full'>{((e.rate * e.igst) / 100) / 2} ({e.igst / 2}%)</div>
                                                    <div className=' h-full'>{((e.rate * e.igst) / 100) / 2} ({e.igst / 2}%)</div>
                                                </div>
                                            </td>
                                        ) : (
                                            <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                                <div className='grid grid-cols-[1fr]'>
                                                    <div className=' h-full text-center'>{(e.rate * e.igst) / 100} ({e.igst}%)</div>
                                                </div>
                                            </td>
                                        )}
                                        {newVariable === "same" ? (
                                            <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                                {(e.rate) + (Number(e.rate || 0) * Number(e.igst || 0) / 100)}
                                            </td>
                                        ) : (
                                            <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                                {/* {(e.rate * e.qty) + (Number(e.rate || 0) * Number(e.igst || 0) / 100)} */}
                                            </td>
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
                                        TERMS & CONDITIONS <span className='bg-blue-700 text-white px-1 ms-1 cursor-pointer' onClick={() => setEditTerms(true)}>+</span>
                                    </div>
                                    <div className='py-2 px-3'>
                                        <p className='font-semibold'>{formData?.termsand_condition}</p>
                                    </div>
                                </div>
                                <div className='border-blue-400 border-b-0 border-[3px]'>
                                    <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                        <p className='font-semibold'>Taxable Amount</p>
                                        <p className='font-semibold'>
                                            <p className='flex justify-end items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                {totalTaxableAmount}
                                            </p>
                                        </p>
                                    </div>
                                    {newVariable === "same" ? (
                                        <>
                                            <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                                <p className='font-semibold'>Add: SGST</p>
                                                <p className='font-semibold flex items-center gap-3'>{totalTaxInPercentage / 2}%
                                                    <span className='flex items-center'>
                                                        (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg> {totalTaxAmount / 2})
                                                    </span></p>
                                            </div>
                                            <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                                <p className='font-semibold'>Add: CGST</p>
                                                <p className='font-semibold flex items-center gap-3'>{totalTaxInPercentage / 2}%
                                                    <span className='flex items-center'>
                                                        (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg> {totalTaxAmount / 2})
                                                    </span></p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                                <p className='font-semibold'>Add: IGST</p>
                                                <p className='font-semibold flex items-center'>{totalTaxInPercentage}% (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{totalTaxAmount})</p>
                                            </div>
                                        </>
                                    )}
                                    <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                        <p className='font-semibold'>Total Tax</p>
                                        <p className='font-semibold flex items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10">
                                                </path>
                                            </svg>{totalTaxAmount} ({totalTaxInPercentage}%)</p>
                                    </div>
                                    <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                        <p className='font-semibold'>Total Amount After Tax</p>
                                        <p className='font-semibold flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{totals.totalCompound}</p>
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
                    </div>


                    {yesOrNo && (
                        <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
                                <div className="bg-white py-3 w-[400px]">
                                    <div className="flex flex-col items-center">
                                        <img src={right} alt="" className='h-[80px]' />
                                        <h3 className='font-semibold text-xl mt-4 text-center'>Are You Sure You Want To Generate PO?</h3>
                                    </div>
                                </div>
                                <div className="bg-white mx-8 pb-3">
                                    <button onClick={generatePo} type="button" className="mt-3 mb-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Yes</button>
                                    <button onClick={() => setYesOrNo(false)} type="button" className=" inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                                </div>
                            </div>
                        </div>
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

                    {selectAddress && (
                        <>
                            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                <div class="fixed inset-0 bg-black bg-opacity-35 transition-opacity"></div>

                                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                            <div className="bg-white">
                                                <p className='font-semibold text-lg mb-2 px-5'>Select Address For Buyer</p>
                                                <div className='bg-gray-50 px-7 pt-5 pb-6'>
                                                    <div className='grid grid-cols-[1fr] gap-y-5 gap-x-5 max-h-[200px] overflow-y-scroll'>
                                                        {addressArray && addressArray.map((e) => (
                                                            <div key={e.account_number} className='flex gap-3'>
                                                                <div>
                                                                    <input
                                                                        type="radio"
                                                                        name="address"
                                                                        onChange={() => setSelectedAddress(e._id)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className='text-sm font-medium'>{e.address_type}</p>
                                                                    <p className='text-sm'>{e.city},{e.state},{e.country} - {e.pincode}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-white pt-3 flex justify-end gap-3 mt-3 px-5">
                                                    <button onClick={() => setSelectAddress(false)} type="button" className="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                                                    <button
                                                        onClick={handleAddAddress}
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

                </div>

            </div>

            {displayPo && (
                <div className="absolute left-0 top-0 z-10 w-full bg-black bg-opacity-30 h-[100vh] overflow-y-scroll">
                    <div className="relative py-4">
                        <div className="py-3">
                            <div className="">
                                {sendData?.design === "design1" && (
                                    <Invoice1 data={photoData} />
                                )}
                                {sendData?.design === "design2" && (
                                    <Invoice2 data={photoData} />
                                )}
                                {sendData?.design === "design3" && (
                                    <Invoice3 data={photoData} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default GeneratePo
