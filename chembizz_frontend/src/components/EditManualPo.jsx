import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import right from "../images/right.png";
import countries from "../pages/CountryStateCity.json"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Invoice1 from './Invoice1';
import Invoice2 from './Invoice2';
import Invoice3 from './Invoice3';
import RupeesIcon from '../assets/Rupees';
import { DisplayPoContext } from '../context/PoViewContext';
import { BASE_URL } from '../BASE_URL';
import { XCircle } from "lucide-react";

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

const EditManualPo = () => {

    const { displayPo, setDisplayPo } = useContext(DisplayPoContext);

    const { _id } = useParams();
    const [displayAddProductInput, setDisplayAddProductInput] = useState(false)


    // const

    const [isOpenPhoto, setIsOpenPhoto] = useState(false);
    const [sendData, setSendData] = useState("");
    const [data, setData] = useState("")
    const [addressArray, setAddressArray] = useState([])
    const [selectAddress, setSelectAddress] = useState(false)
    const [productDetailArray, setProductDetailArray] = useState([])
    const [alreadyData, setAlreadyData] = useState("")
    const [poStatus,setPostatus]=useState("invoice")
    const [openCancelPo,setCancelPo]= useState(false);

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
        seller_to_gst_in: '',
        seller_to_name: '',
        seller_to_address: '',
        seller_to_country: '',
        seller_to_state: '',
        seller_to_city: '',
        seller_to_pincode: null,
        seller_to_phone: null,
        po_num: '',
        po_date: null,
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

    const [companyDetails, setCompanyDetails] = useState(null);
    const [isSameAsBillTo, setIsSameAsBillTo] = useState(false);

    const fetchAlreadyPodetail = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}api/salesInvoice/displayDetails/${_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await res.json();

        const allData = data?.data?.[0]
        setProductDetailArray(allData?.product_details)

        setAlreadyData(allData)

        setPostatus(allData?.inquiry_details?.[0]?.status)

        const selectedSHipineCountry = countries.find((country) => country.name === allData.shipped_to_country);
        setShippedStates(selectedSHipineCountry?.states || []);

        const selectedShippingState = selectedSHipineCountry?.states?.find((state) => state.name === allData.shipped_to_state);
        setShippedCities(selectedShippingState?.cities || []);

        const selectedCountry = countries.find((country) => country.name === allData.seller_to_country);
        setStates(selectedCountry?.states || []);

        const selectedState = selectedCountry?.states?.find((state) => state.name === allData.seller_to_state);
        setCities(selectedState?.cities || []);

        setFormData((prevData) => ({
            ...prevData,
            bill_to_gst_in: allData?.bill_to_gst_in,
            bill_to_name: allData?.bill_to_name,
            bill_to_address: allData?.bill_to_address,
            bill_to_country: allData?.bill_to_country,
            bill_to_state: allData?.bill_to_state,
            bill_to_city: allData?.bill_to_city,
            bill_to_pincode: allData?.bill_to_pincode,
            bill_to_phone: allData?.bill_to_phone,
            shipped_to_gst_in: allData?.shipped_to_gst_in,
            shipped_to_name: allData?.shipped_to_name,
            shipped_to_address: allData?.shipped_to_address,
            shipped_to_country: allData?.shipped_to_country,
            shipped_to_state: allData?.shipped_to_state,
            shipped_to_city: allData?.shipped_to_city,
            shipped_to_pincode: allData?.shipped_to_pincode,
            shipped_to_phone: allData?.shipped_to_phone,
            seller_to_gst_in: allData?.seller_to_gst_in,
            seller_to_name: allData?.seller_to_name,
            seller_to_address: allData?.seller_to_address,
            seller_to_country: allData?.seller_to_country,
            seller_to_state: allData?.seller_to_state,
            seller_to_city: allData?.seller_to_city,
            seller_to_pincode: allData?.seller_to_pincode,
            seller_to_phone: allData?.seller_to_phone,
            po_num: allData?.po_num,
            po_date: allData?.po_date,
            payment_terms: allData?.payment_terms,
            inco_terms: allData?.inco_terms,
            grand_total: allData?.grand_total,
            termsand_condition: allData?.termsand_condition,
            upload_sign: allData?.upload_sign,
            upload_stamp: allData?.upload_stamp,
            invoice_type: "po",
            invoice_mode: allData?.invoice_mode,
            product_details: allData?.product_details,
        }));
    };

    useEffect(() => {
        fetchAlreadyPodetail();
    }, []);

    const fetchBuyerDetailsToken = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}company/cominfo`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        const data = await res.json();
        setCompanyDetails(data?.companyDetails?.[0]);
        const companyDetails = data?.companyDetails?.[0]

        const selectedCountry = countries.find((country) => country.name === companyDetails.country);
        setShippedStates(selectedCountry?.states || []);

        const selectedState = shippedStates.find((state) => state.name === companyDetails.state);
        setShippedCities(selectedState?.cities || []);

        setFormData((prevData) => ({
            ...prevData,
            bill_to_gst_in: companyDetails.gst || '',
            bill_to_name: companyDetails.company_name || '',
            bill_to_address: companyDetails.address || '',
            bill_to_country: companyDetails.country || '',
            bill_to_state: companyDetails.state || '',
            bill_to_city: companyDetails.city || '',
            bill_to_pincode: companyDetails.pincode || '',
            bill_to_phone: companyDetails.mobile_num || companyDetails.landline_num || '',
            shipped_to_gst_in: companyDetails.gst || '',
            shipped_to_name: companyDetails.company_name || '',
            shipped_to_address: companyDetails.address || '',
            shipped_to_country: companyDetails.country || '',
            shipped_to_state: companyDetails.state || '',
            shipped_to_city: companyDetails.city || '',
            shipped_to_pincode: companyDetails.pincode || '',
            shipped_to_phone: companyDetails.mobile_num || companyDetails.landline_num || ''
        }));
        setIsSameAsBillTo(true)
    };

    useEffect(() => {
        if (isSameAsBillTo) {
            fetchBuyerDetailsToken();
        }
    }, [isSameAsBillTo]);

    useEffect(() => {
        if (!isSameAsBillTo) {
            setFormData((prevData) => ({
                ...prevData,
                shipped_to_gst_in: '',
                shipped_to_name: '',
                shipped_to_address: '',
                shipped_to_country: '',
                shipped_to_state: '',
                shipped_to_city: '',
                shipped_to_pincode: '',
                shipped_to_phone: ''
            }));
        }
    }, [isSameAsBillTo]);

    const setShippedToDetails = (details) => {
        setFormData((prevData) => ({
            ...prevData,
            shipped_to_gst_in: details.gst || '',
            shipped_to_name: details.company_name || '',
            shipped_to_address: details.address || '',
            shipped_to_country: details.country || '',
            shipped_to_state: details.state || '',
            shipped_to_city: details.city || '',
            shipped_to_pincode: details.pincode || '',
            shipped_to_phone: details.mobile_num || details.landline_num || ''
        }));
    };

    const clearShippedToDetails = () => {
        setFormData((prevData) => ({
            ...prevData,
            shipped_to_gst_in: '',
            shipped_to_name: '',
            shipped_to_address: '',
            shipped_to_country: '',
            shipped_to_state: '',
            shipped_to_city: '',
            shipped_to_pincode: null,
            shipped_to_phone: null
        }));
    };

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setIsSameAsBillTo(isChecked);
        if (isChecked) {
            setShippedToDetails(companyDetails);
        } else {
            clearShippedToDetails();
        }
    };

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

    // onChange evert start 

    const handleChange = async (e) => {
        const { name, value } = e.target;
        let updatedFormData = {};

        if (name === "seller_to_country") {
            const selectedCountryName = value;
            const selectedCountry = countries.find((country) => country.name === selectedCountryName);

            setStates(selectedCountry?.states || []);
            updatedFormData = {
                seller_to_state: "",
                seller_to_city: "",
            };
        }

        if (name === "seller_to_state") {
            const selectedStateName = value;
            const selectedState = states.find((state) => state.name === selectedStateName);

            setCities(selectedState?.cities || []);
            updatedFormData = {
                seller_to_city: "",
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

        if (name === "shipped_to_gst_in") {
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

        if (name === "shipped_to_pincode" && value.length === 6) {
            await fetchFetailsFromPincodeShipped(value);
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

    // find company detail from gst number start

    const fetchDetailsFromGst = async (gst) => {
        try {
            const res = await fetch('https://gsttocompany.onrender.com', {
                method: "POST",
                body: JSON.stringify({ gstno: gst }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await res.json();

            // console.log(response);

        } catch (error) {
            console.error("Error fetching GST details:", error);
        }
    };


    useEffect(() => {
        fetchDetailsFromGst(formData?.shipped_to_gst_in)
    }, [formData?.shipped_to_gst_in]);

    // find company detail from gst number end


    // data from PINCODE api start 

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

    const editPo = async () => {
        const gstCheck = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

        // Create an object to send as raw JSON
        const formDataToSend = {};

        if (formData.invoice_mode === 'auto') {
            formDataToSend.inq_type = alreadyData?.inq_type;
            formDataToSend.inquiry_id = alreadyData?.inquiry_id;
            formDataToSend.seller_company_id = alreadyData?.seller_company_id;
        }

        Object.keys(formData).forEach((key) => {
            if (key === 'product_details') {
                formDataToSend[key] = formData[key].map((item) => ({ ...item }));
            } else {
                formDataToSend[key] = formData[key];
            }
        });

        try {
            // Send a PUT request to the server with the form data as JSON
            const response = await fetch(`${BASE_URL}api/salesInvoice/updatepo?poId=${_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataToSend)
            });

            const responseData = await response.json();

            if (!response.ok) {
                toast.error(responseData.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            } else {
                setIsOpenPhoto(true);
                setSendData(responseData?.data);
                setYesOrNo(false)
                toast.success('PO Edited Successfully', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            console.error("Error generating PO:", error);
        }
    };

    // generate PO start fo]eom here


    const [products, setProducts] = useState([]);

    // product array start

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            product_details: productDetailArray
        }));
    }, [productDetailArray]);

    // product array end

    // in use 

    useEffect(() => {

        const fetchProducts = async () => {
            const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
            const res = await fetch(`${BASE_URL}api/product/displayAllProductWithoutToken`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
            const data = await res.json();
            setProducts(data?.products);
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


        fetchProducts();
        fetchUserData();
    }, []);

    const [selectedProductId, setSelectedProductId] = useState("");
    const [productCas, setProductCas] = useState("")
    const [productName, setProductName] = useState("")
    const [productFormula, setProductFormula] = useState("")

    const [hsn, setHsn] = useState("")
    const [quantity, setQuantity] = useState(null)
    const [quantityType, setQuantityType] = useState("")
    const [rate, setRate] = useState(null)
    const [texable, setTexable] = useState("")
    const [gst, setGst] = useState("")
    const [gstAmount, setGstAmount] = useState("")

    const handleProductSelect = (e) => {
        const selectedProductChemName = e.target.value;
        const selectedProduct = products?.find((pr) => pr?.name_of_chemical === selectedProductChemName)

        setSelectedProductId(selectedProductChemName);
        setProductCas(selectedProduct?.CAS_number)
        setProductName(selectedProduct?.name_of_chemical)
        setProductFormula(selectedProduct?.molecularFormula)
    }

    const handleGst = (e) => {
        const selectedGstPercentage = e.target.value;
        setGst(selectedGstPercentage)
        setGstAmount(rate * selectedGstPercentage / 100)
    }

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

        const tax = (texable * gst) / 100
        const total = texable + tax;

        const newProductDetail = {
            cas_no: productCas,
            chem_name: productName,
            mol_formula: productFormula,
            hsn: hsn,
            qty: qty,
            qty_type: qtytyp,
            taxable_amount: texable,
            rate: rate,
            igst: gst,
            gstAmount: tax,
            total: total,
        };

        setProductDetailArray(prevArray => [...prevArray, newProductDetail]);

        setSelectedProductId("")
        setProductCas("");
        setProductName("");
        setProductFormula("");
        setHsn("");
        setQuantity("");
        setQuantityType("");
        setRate("");
        setGst("");
        setDisplayAddProductInput(false);
    };

    const handleCancelPo = async(e) => {


        e.preventDefault(); // Prevent page reload
        const reasonData = new FormData(e.target);
        const reason = reasonData.get("cancelReason").trim();

        // console.log("reason", reason);

        const updatedProduct = productDetailArray.map((product)=>{

            return {
                ...product,
                qty:0,
                taxable_amount: 0,
                igst: 0,
                gstAmount: 0,
                total: 0,
            }
        })

        setProductDetailArray(updatedProduct);

       

            const newData= { ...formData, product_details: updatedProduct }
            setFormData(newData);

            const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
            
            // Create an object to send as raw JSON
            const formDataToSend = {};

            if (formData.invoice_mode === 'auto') {
                formDataToSend.inq_type = alreadyData?.inq_type;
                formDataToSend.inquiry_id = alreadyData?.inquiry_id;
                formDataToSend.seller_company_id = alreadyData?.seller_company_id;
            }

            formDataToSend.cancelMessage= reason;
            formDataToSend.poId= _id;

            Object.keys(newData).forEach((key) => {
                if (key === 'product_details') {
                    formDataToSend[key] = newData[key].map((item) => ({ ...item }));
                } else {
                    formDataToSend[key] = newData[key];
                }
            });

            try {
                
                const response = await fetch(`${BASE_URL}api/salesInvoice/cancelPo`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formDataToSend)
                });
    
                const responseData = await response.json();
    
                if (!response.ok) {
                    toast.error(responseData.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 1000,
                    });
                } else {
                    setIsOpenPhoto(true);
                    setSendData(responseData?.data);
                    toast.success('PO Cancel Successfully', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 1000,
                    });
                }
            } catch (error) {
                console.error("Error updating PO:", error);
            }


        setCancelPo(false);
      
    };

    const handleProductEdit = (e) => {
        // console.log(e);
        setProductDetailArray(prevArray => prevArray.filter(product => product._id !== e._id));

        const selectedProduct = products?.find((pr) => pr?.name_of_chemical === e.chem_name)

        setDisplayAddProductInput(true);
        setSelectedProductId(selectedProduct._id)
        setProductCas(selectedProduct?.CAS_number)
        setProductName(selectedProduct?.name_of_chemical)
        setProductFormula(selectedProduct?.molecularFormula)
        setTexable(e.taxable_amount)
        setHsn(e.hsn)
        setQuantity(e.qty)
        setQuantityType(e.qty_type)
        setRate(e.rate)
        setGst(e.igst)
        setGstAmount(gstAmount)
    };

    useEffect(() => {
        setGstAmount(rate * gst / 100)
    }, [quantity, rate, gst]);

    // console.log(formData?.product_details)


    // useable 

    const [selectedAddress, setSelectedAddress] = useState("")

    const handleAddAddress = () => {
        const selectedAddres = addressArray.find(address => address._id === selectedAddress);

        const selectedCountry = countries.find(
            (country) => country.name === selectedAddres.country
        );
        setShippedStates(selectedCountry ? selectedCountry.states : []);
        const selectedState = selectedCountry?.states.find(
            (state) => state.name === selectedAddres.state
        );
        setShippedCities(selectedState ? selectedState.cities : []);

        setFormData((prevData) => ({
            ...prevData,
            shipped_to_address: selectedAddres.address_details,
            shipped_to_country: selectedAddres.country,
            shipped_to_state: selectedAddres.state,
            shipped_to_city: selectedAddres.city,
            shipped_to_pincode: selectedAddres.pincode,
            shipped_to_name: data.company_name,
            shipped_to_phone: data.mobile_num,
            shipped_to_gst_in: data.gst,
        }));

        setSelectAddress(false)
    }

    const [newVariable, setNewVariable] = useState("");

    const checkStates = () => {
        const { bill_to_state, seller_to_state } = formData;

        if (!bill_to_state || !seller_to_state) {
            setNewVariable("not got");
        } else if (bill_to_state === seller_to_state) {
            setNewVariable("same");
        } else {
            setNewVariable("different");
        }
    };

    useEffect(() => {
        checkStates();
    }, [formData.bill_to_state, formData.seller_to_state]);


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

    const totals = calculateTotals(formData?.product_details);

    useEffect(() => {

        setFormData(prevFormData => ({
            ...prevFormData,
            grand_total: totals.totalRate + totals.totalGstAmount
        }));

    }, [totals.totalRate, totals.totalGstAmount]);

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

    return (
        <>
            <div className='h-[100vh] max-w-[80vw] pt-2'>

                <div className='bg-white pe-5 pb-10'>
                    <div className='mb-10 flex justify-between items-center'>
                        <h1 className="md:text-3xl text-xl font-semibold">Edit PO</h1>

                        <div className="flex gap-5">
                        <button
                onClick={()=>setCancelPo(true)}
                disabled={totals.totalTaxable == 0 || [
                  "invoice",
                  "dispatch",
                  "in transit",
                  "delivered",
                ].includes(poStatus)}
                className={`py-[5px] px-[25px] rounded-[10px] 
    ${
        totals.totalTaxable == 0 || ["invoice", "dispatch", "in transit", "delivered","cancel"].includes(poStatus)
        ? "bg-gray-300 cursor-not-allowed" // Faded color when disabled
        : "bg-red-500 text-white"
    }`}
              >
                Cancel PO
              </button>
                            <button onClick={handleYesNo} className='bg-darkBlue text-white py-[5px]  px-[25px] rounded-[10px]'>Update PO</button>
                            
                        </div>
                    </div>

                    <div>

                        {/* detail of billing and seller here start  */}

                        <table className="w-full border-[3px] border-blue-400 border-b-0 table-auto ">
                            <thead className='border-[3px] border-blue-400 border-b-0'>
                                <tr className='border-[3px] border-blue-400 border-b-0'>
                                    <th className='border-blue-400 border-r-[3px] w-1/3 font-medium text-2xl py-3'>

                                        <p className='font-semibold text-2xl text-[#0070C0] flex items-center justify-center gap-2'>Buyer Detail
                                            <span className='bg-blue-700 text-lg cursor-pointer text-white px-1 leading-[20px]' onClick={() => setSelectAddress(true)}>+</span>
                                            <span className='text-xs flex items-center'>
                                                <input
                                                    type="checkbox"
                                                    className='me-1'
                                                    checked={isSameAsBillTo}
                                                    onChange={handleCheckboxChange}
                                                />
                                                same as bill to</span>
                                        </p>
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
                                    {/* shipping gst  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pt-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center pb-2">
                                            <p className=''>GSTIN</p>
                                            <p className='flex items-center gap-2 leading-[40px]'>:
                                                <input onChange={handleChange} name='shipped_to_gst_in' type="text" value={formData?.shipped_to_gst_in} className='w-full border border-gray-300 px-2 rounded-md' /></p>
                                        </div>
                                    </td>

                                    {/* seller gst  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4 pt-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center pb-2">
                                            <p className=''>GSTIN</p>
                                            <p className='flex items-center gap-2 leading-[40px]'>:
                                                <input onChange={handleChange} name='seller_to_gst_in' type="text" value={formData?.seller_to_gst_in} className='w-full border border-gray-300 px-2 rounded-md' /></p>
                                        </div>
                                    </td>

                                    {/* po num  */}
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

                                    {/* shipping name  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center pb-2">
                                            <p className=''>Name</p>
                                            <p className='flex items-center gap-2 leading-[40px]'>:
                                                <input onChange={handleChange} name='shipped_to_name' type="text" value={formData?.shipped_to_name} className='w-full border border-gray-300 px-2 rounded-md' /></p>
                                        </div>
                                    </td>

                                    {/* seller name  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Name</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <input onChange={handleChange} name='seller_to_name' value={formData?.seller_to_name} type="text" className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                        </div>
                                    </td>

                                    {/* po date  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[2fr,3fr,] items-center">
                                            <p className=''>PO Date</p>
                                            <p className='flex items-center gap-2'>: <input name='po_date' onChange={handleChange} type='date' value={formData?.po_date} className='w-full border-2 border-gray-300 px-2 py-1 rounded-md' /></p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className=''>

                                    {/* shipping address  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-2'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Address</p>
                                            <p className='flex items-center gap-2 me-3'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <textarea onChange={handleChange} name='shipped_to_address' value={formData?.shipped_to_address} className='border-2 border-gray-300 px-2 py-1 rounded-md w-full'></textarea></p>
                                        </div>
                                    </td>

                                    {/* seller address  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-2'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Address</p>
                                            <p className='flex items-center gap-2 me-3'>:
                                                <textarea onChange={handleChange} name='seller_to_address' value={formData?.seller_to_address} className='border-2 border-gray-300 px-2 py-1 rounded-md w-full'></textarea></p>
                                        </div>
                                    </td>

                                    {/* payment terms  */}
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

                                    {/* shipping pincode  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Pincode</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <input
                                                    type="tel"
                                                    name='shipped_to_pincode'
                                                    onChange={handleChange}
                                                    value={formData?.shipped_to_pincode}
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    maxLength={6}
                                                    className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                                />
                                            </p>
                                        </div>
                                    </td>

                                    {/* seller pincode  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Pincode</p>
                                            <p className='flex items-center gap-2'>:
                                                <input
                                                    name='seller_to_pincode'
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    maxLength={6}
                                                    onChange={handleChange}
                                                    value={formData?.seller_to_pincode}
                                                    type="text"
                                                    className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                                />
                                            </p>
                                        </div>
                                    </td>

                                    {/* inco terms  */}
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

                                    {/* delivery time */}
                                    {/* <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
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
                                    </td> */}
                                </tr>
                                <tr className=''>

                                    {/* shipping country  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Country</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <select name='shipped_to_country' value={formData.shipped_to_country} onChange={handleChange} className='w-full border-2 border-gray-300 w-[70%] px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {countries && countries.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select>
                                            </p>
                                        </div>
                                    </td>

                                    {/* seller country  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Country</p>
                                            <p className='flex items-center gap-2'>:
                                                <select name='seller_to_country' value={formData.seller_to_country} onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {countries && countries.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select>
                                            </p>
                                        </div>
                                    </td>

                                </tr>
                                <tr className=''>

                                    {/* shipping state  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>State</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
                                                <select name='shipped_to_state' value={formData.shipped_to_state} onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {shippedStates && shippedStates.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select></p>
                                        </div>
                                    </td>

                                    {/* seller state  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>State</p>
                                            <p className='flex items-center gap-2'>:
                                                <select value={formData.seller_to_state} name='seller_to_state' onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {states && states.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select></p>
                                        </div>
                                    </td>

                                </tr>
                                <tr className=''>

                                    {/* shipping city  */}
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

                                    {/* seller city  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>City</p>
                                            <p className='flex items-center gap-2'>:
                                                <select name='seller_to_city' value={formData?.seller_to_city} onChange={handleChange} className='border-2 border-gray-300 w-full px-2 py-1 rounded-md'>
                                                    <option value="">select</option>
                                                    {cities && cities.map((e) => (
                                                        <option value={e.name}>{e.name}</option>
                                                    ))}
                                                </select></p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className=''>

                                    {/* shipping phone  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Phone</p>
                                            <p className='flex items-center gap-2'>:
                                                {/* <span className='bg-blue-700 text-white px-1 '>+</span> */}
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

                                    {/* seller phone  */}
                                    <td className='border-blue-400 border-r-[3px] font-medium ps-5 pb-2 pe-4'>
                                        <div className="grid grid-cols-[1fr,3fr,] items-center">
                                            <p className=''>Phone</p>
                                            <p className='flex items-center gap-2'>:
                                                <input
                                                    name='seller_to_phone'
                                                    onChange={handleChange}
                                                    value={formData?.seller_to_phone}
                                                    type="tel"
                                                    onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                    maxLength={10}
                                                    className='w-full border-2 border-gray-300 px-2 py-1 rounded-md'
                                                />
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                        <ToastContainer />

                        {/* detail of billing and seller here end */}

                        {displayAddProductInput && (
                            <div className='border-blue-400 border-[3px] my-8'>
                                <div className='grid grid-cols-[3fr,1fr,1.4fr,1fr,1.2fr,2fr,1fr]'>
                                    <div className='py-3 px-3 border-blue-400 border-r-[3px] '>
                                        <select disabled value={selectedProductId} onChange={handleProductSelect} name="" id="" className='border-2 border-gray-400 py-2 outline-none rounded-md text-gray-500 text-xs  ps-3 w-full '>
                                            <option value="IGST Amount(%)">Select Product</option>
                                            {products && products?.map((e) => (
                                                <option value={e?._id}>{e?.name_of_chemical}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                        <input
                                            type="text"
                                            onChange={(e) => setHsn(e.target.value)}
                                            name='hsn'
                                            value={hsn}
                                            onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                            maxLength={8}
                                            className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs ps-3 w-full'
                                            placeholder='HSN/SAC'
                                            disabled
                                        />
                                    </div>
                                    <div className='py-3 px-3 border-blue-400 border-r-[3px] flex gap-2'>
                                        <input
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                        <input disabled type="text" value={texable} className='border-2 border-gray-400 py-1 outline-none rounded-md placeholder:text-gray-500 placeholder:text-xs  ps-3 w-full ' placeholder='Texable Value' />
                                    </div>
                                    <div className='py-3 px-3 border-blue-400 border-r-[3px]'>
                                        <select value={gst} onChange={handleGst} name="" id="" className='border-2 border-gray-400 py-2 outline-none rounded-md text-gray-500 text-xs  ps-3 w-full '>
                                            <option value="IGST Amount(%)">IGST Amount(%)</option>
                                            <option value="5">5%</option>
                                            <option value="12">12%</option>
                                            <option value="18">18%</option>
                                            <option value="28">28%</option>
                                        </select>
                                    </div>
                                    <div className='py-3 px-3'>
                                        <button className='w-full py-1 outline-none rounded-md text-white bg-blue-600' onClick={handleProductAdd}>Add</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* product table  */}

                        <table className="w-full border-[3px] border-blue-400 table-auto mt-6 mb-8" >
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
                                        <td className='border-blue-400 border-r-[3px] font-medium py-2 text-center'>{e.qty}{e.qty_type}</td>
                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                            <p className='flex items-center justify-center'>
                                                <RupeesIcon /> {(e.rate).toFixed(2)}
                                            </p>
                                        </td>
                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                            <p className='flex items-center justify-center'>
                                                <RupeesIcon /> {(e.taxable_amount).toFixed(2)}
                                            </p>
                                        </td>
                                        {newVariable === "same" ? (
                                            <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                                <div className='grid grid-cols-[1fr,1fr]'>
                                                    <div className='border-blue-400 border-r-[3px] h-full'>{(e.gstAmount / 2).toFixed(2)} ({e.igst / 2}%)</div>
                                                    <div className=' h-full'>{(e.gstAmount / 2).toFixed(2)} ({e.igst / 2}%)</div>
                                                </div>
                                            </td>
                                        ) : (
                                            <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                                <div className='grid grid-cols-[1fr]'>
                                                    <div className=' h-full text-center'>{e.gstAmount} ({e.igst}%)</div>
                                                </div>
                                            </td>
                                        )}
                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                            <p className='flex items-center justify-center'>
                                                <RupeesIcon /> {(e.total).toFixed(2)}
                                            </p>
                                        </td>

                                        <td className='border-blue-400 border-r-[3px] font-medium  py-2 text-center'>
                                            <button onClick={() => handleProductEdit(e)} className='text-black bg-gray-300 rounded-lg px-4 py-2 text-xs cursor-pointer'>EDIT</button>

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
                                            {totals.totalQuantity}Kg
                                        </td>

                                        {/* Total Rate */}
                                        <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>
                                            <p className='flex justify-end items-center'>
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                {totals.totalRate} */}
                                            </p>
                                        </td>

                                        {/* Total Taxable Amount */}
                                        <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>

                                            <p className='flex justify-end items-center'>
                                                <RupeesIcon />
                                                {(totals.totalTaxable).toFixed(2)}
                                            </p>
                                        </td>

                                        {/* Total IGST */}
                                        <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>
                                            <p className='flex justify-end items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                {(totals.totalGstAmount).toFixed(2)}
                                            </p>
                                        </td>

                                        <td className='border-blue-400 border-[3px] text-end font-semibold pe-2'>
                                            <p className='flex justify-end items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                {(totals.totalAmount).toFixed(2)}
                                            </p>
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>

                        <div className='border-blue-400 border-[3px] border-t-0 border-r-0 grid grid-cols-[1fr]'>
                            <div className='grid grid-cols-[1.8fr,1.2fr,]'>
                                <div className='border-blue-400 '>
                                    <div className='font-medium text-center border-blue-400 border-b-[3px] border-t-[3px] py-1'>
                                        Total In Words
                                    </div>
                                    <div className='font-semibold text-center border-blue-400 border-b-[3px] py-1'>
                                        {numberToWords((totals.totalAmount).toFixed(2)).toUpperCase()} RUPEES ONLY
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
                                                {(totals.totalTaxable).toFixed(2)}
                                            </p>
                                        </p>
                                    </div>
                                    {newVariable === "same" ? (
                                        <>
                                            <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                                <p className='font-semibold'>Add: SGST</p>
                                                <p className='font-semibold flex items-center gap-3'>
                                                    {/* {totals.totalGst}% */}
                                                    <span className='flex items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                        {(totals.totalGstAmount / 2).toFixed(2)}
                                                    </span></p>
                                            </div>
                                            <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                                <p className='font-semibold'>Add: CGST</p>
                                                <p className='font-semibold flex items-center gap-3'>
                                                    {/* {totals.totalGst}% */}
                                                    <span className='flex items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                        {(totals.totalGstAmount / 2).toFixed(2)}
                                                    </span></p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='flex justify-between border-blue-400 border-b-[3px] py-1 px-2'>
                                                <p className='font-semibold'>Add: IGST</p>
                                                <p className='font-semibold flex items-center'>
                                                    {/* {totalTaxInPercentage}%  */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                                    {(totals.totalGstAmount).toFixed(2)}</p>
                                            </div>
                                        </>
                                    )}
                                    <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                        <p className='font-semibold'>Total Tax</p>
                                        <p className='font-semibold flex items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10">
                                                </path>
                                            </svg>{(totals.totalGstAmount).toFixed(2)}</p>
                                    </div>
                                    <div className='flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2'>
                                        <p className='font-semibold'>Total Amount After Tax</p>
                                        <p className='font-semibold flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                                            {(totals.totalAmount).toFixed(2)}
                                        </p>
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
                                    <button onClick={editPo} type="button" className="mt-3 mb-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Yes</button>
                                    <button onClick={() => setYesOrNo(false)} type="button" className=" inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                                </div>
                            </div>
                        </div>
                    )}


                    {openCancelPo && (
                            <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-900 bg-opacity-50">
                            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                {/* Header */}
                                <div className="flex flex-col items-center">
                                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                                <h3 className="font-semibold text-xl text-gray-800 text-center">
                                    Are you sure you want to cancel this PO?
                                </h3>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleCancelPo} className="mt-4">
                                {/* Textarea for reason */}
                                <textarea
                                    name="cancelReason"
                                    placeholder="Why do you want to cancel the PO?"
                                    className="w-full border border-red-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    rows="3"
                                    required // Ensures the form cannot be submitted without input
                                ></textarea>

                                {/* Buttons */}
                                <div className="flex justify-between gap-3 mt-6">
                                    <button
                                    type="submit"
                                    className="w-full py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                                    >
                                    Yes, Cancel
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => setCancelPo(false)}
                                    className="w-full py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                                    >
                                    No, Keep
                                    </button>
                                </div>
                                </form>
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
                                {sendData?.design === "" && (
                                    <Invoice1 data={sendData} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditManualPo;
