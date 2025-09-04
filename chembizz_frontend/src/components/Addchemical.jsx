import React, { useEffect, useState } from 'react';
import { faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import chem1 from "../images/chemical-main.png"
import right from "../images/right.png"
import loader from "../images/loading.png"
import Select from 'react-select';
import countries from "../pages/CountryStateCity.json"

// toaster 

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../BASE_URL';

const Addchemical = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [suggestedChemicalLoading, setSuggestedChemicalLoading] = useState(false)

    const location = useLocation();
    const abc = location.state?.abc;
    const productId = location.state?.id;

    const [modalTitle, setModalTitle] = useState('');
    const [buttonChange, setButtonChange] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const [category, setCategory] = useState("")
    const [subCategory, setSubCategory] = useState("")
    const [grade, setGrade] = useState("")
    const [hsnCode, setHSNCode] = useState("")
    const [document, setDocument] = useState("")
    const [origin, setOrigin] = useState("")
    const [min, setMin] = useState("")
    const [max, setMax] = useState("")
    const [capacity, setCapacity] = useState("")
    const [purity, setPurity] = useState("")
    const [value, setValue] = useState("")
    const [type, setType] = useState("")
    const [qValue, setQvalue] = useState("")
    const [qNumber, setQnumber] = useState("")
    const [qtyType, setQtyType] = useState("")
    const [samplePrice, setSamplePrice] = useState("")
    const [activeChemicalStatus, setActiveChemicalStatus] = useState("active")
    const [selectedGrades, setSelectedGrades] = useState([]);

    const openModal = async () => {

        if (!category && !document && !origin && !min && !max && !capacity && !purity && !value && !purity && !type && !qValue && !qNumber) {
            toast.error('Please Fill All Fields!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!category) {
            toast.error('Please Select Category!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (gradeOptions?.length > 0 && selectedGrades < 1) {
            toast.error('Please Select Grade!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!hsnCode) {
            toast.error('Please Enter HSN Code!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!document) {
            toast.error('Please Select Document!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!min) {
            toast.error('Please Enter Minimum Price!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!max) {
            toast.error('Please Enter Maximum Price!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        // console.log(Number(min))
        // console.log(Number(max))
        if (Number(min) > Number(max)) {
            toast.error('Please Enter Correct Value for Minimum Price!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!origin) {
            toast.error('Please Select Country Origin!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!capacity) {
            toast.error('Please Enter Production Capacity!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!purity) {
            toast.error('Please Enter Purity!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!qValue) {
            toast.error('Please Enter Quantity Value!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!type) {
            toast.error('Please Enter Quantity Type!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        if (!qNumber) {
            toast.error('Please Select Quantity!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        let coa;

        if (productId && pdfFile) {
            coa = document;
        } else if (productId) {
            coa = alreadyCOa;
        } else {
            coa = document;
        }

        setLoading(true)

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        const formData = new FormData();
        formData.append('product_id', selectedCatalog._id);
        formData.append('category', category);
        formData.append('subcategory', subCategory);
        if (selectedGrades?.length !== 0) {
            selectedGrades?.forEach((grade, index) => {
                formData.append(`grade[${index}]`, grade);
            });
        }
        formData.append('min_price', min);
        formData.append('max_price', max);
        formData.append('qty', qValue);
        formData.append('qty_type', qtyType);
        formData.append('active_chemicals', activeChemicalStatus);
        formData.append('status', "active");
        formData.append('country_origin', origin);
        formData.append('hsn_code', hsnCode);
        formData.append('supply_capacity', capacity);
        formData.append('purity', purity);
        formData.append('one_lot_qty', value);
        formData.append('one_lot_qty_type', type);
        formData.append('one_lot_qty_price', samplePrice);
        formData.append('max_lot_qty', qNumber);
        formData.append('sample_price', samplePrice);
        formData.append('COA', coa);
        if (productId) {
            try {
                const response = await axios.put(
                    `${BASE_URL}api/catalog/${productId?._id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    setLoading(false)
                    setTimeout(() => {
                        // navigate("/company/catalog");
                        setModalTitle("Catalog Updated Successfully!")
                        setIsOpen(true);
                        setButtonChange("Submit")
                    }, 2000);

                } else {
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false)
                console.error("Error adding category:", error.message);
                toast.error(error.response.data.error, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } else {
            try {
                const response = await axios.post(
                    `${BASE_URL}api/catalog`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    setLoading(false)
                    setTimeout(() => {
                        setModalTitle("Catalog Added Successfully!")
                        setIsOpen(true);
                        setButtonChange("Submit")
                    }, 2000);

                } else {
                    setLoading(false)

                }
            } catch (error) {
                setLoading(false)
                console.error("Error adding category:", error.response);
                toast.error(error.response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        }
    };

    const handleCategory = (e) => {
        setCategory(e.target.value)
    }

    const handleSubCategory = (e) => {
        setSubCategory(e.target.value)
    }

    const handleGrade = (e) => {
        setGrade(e.target.value)
    }

    const [pdfFile, setPdfFile] = useState(null);
    const [alreadyCOa, setAlreadyCoa] = useState(null);

    const handleImage = (e) => {
        const { files } = e.target;
        setDocument(files[0])
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            setPdfFile(null);
            alert('Only PDF files are allowed');
        }
    }

    const handleOrigin = (e) => {
        setOrigin(e.target.value)
    }

    const [error, setError] = useState(false)

    const handleMin = (e) => {
        setMin(e.target.value)
    }

    const handleMax = (e) => {
        const value = e.target.value;
        if (Number(min) > Number(value)) {
            setError(true)
            setMax(e.target.value)
        } else {
            setError(false)
            setMax(e.target.value)
        }
    }

    const handleCapacity = (e) => {
        setCapacity(e.target.value)
    }

    const handlePurity = (e) => {
        setPurity(e.target.value)
    }

    const handleValue = (e) => {
        setValue(e.target.value)
    }

    const handleType = (e) => {
        setType(e.target.value)
    }

    const handleQtyType = (e) => {
        setQtyType(e.target.value)
    }

    const handleQuantityValue = (e) => {
        setQvalue(e.target.value)
    }

    const handleQuantityNumber = (e) => {
        setQnumber(e.target.value)
    }

    const handleSamplePriceValue = (e) => {
        setSamplePrice(e.target.value.replace(/[^0-9]/g, ''));
    }

    const categoryList = [
        {
            categoryName: "API",
            subCategory: [],
            grade: [
                { name: "IP" },
                { name: "BP" },
                { name: "USP" },
                { name: "EP" },
                { name: "JP" },
                { name: "In House" },
            ]
        },
        {
            categoryName: "Intermediates",
            subCategory: [],
            grade: [{ name: "In House" }]
        },
        {
            categoryName: "Solvents",
            subCategory: [{ name: "Fresh" }, { name: "Recover(Pharma Pass)" }],
            grade: []
        },
        {
            categoryName: "Inorganic Chemicals",
            subCategory: [],
            grade: []
        },
        {
            categoryName: "Other Chemicals",
            subCategory: [],
            grade: []
        },
        {
            categoryName: "Auxilary Chemicals",
            subCategory: [],
            grade: []
        },
    ]

    const [checkBox, setCheckBox] = useState("")
    const [labelValue, setLabelValue] = useState("active")

    const handleCheckBoxChange = (e) => {
        const isChecked = e.target.checked;
        setCheckBox(isChecked);
        if (!isChecked) {
            setActiveChemicalStatus("inactive")
            setLabelValue("inactive");
        } else {
            setActiveChemicalStatus("active")
            setLabelValue("active");
        }
    };

    const [catelogs, setCatelogs] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState(null);
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
        setCatelogs(data?.products)
        setFilteredCatalogs(data?.products)
    };

    useEffect(() => {
        fetchCatelogData();
    }, []);

    const handleInputClick = () => {
        setShowCatalogs(true);
    };

    useEffect(() => {
        const selectedCatalog = catelogs && catelogs.find((item) => item._id === productId?.product_id)
        setSelectedCatalog(selectedCatalog);
        setSearchInputValue(selectedCatalog?.name_of_chemical)
        setCategory(productId?.category)
        setAlreadyCoa(productId?.COA)
        setSubCategory(productId?.subcategory || '')
        setSelectedGrades(productId?.grade)
        setHSNCode(productId?.hsn_code)
        setDocument(productId?.COA)
        setOrigin(productId?.country_origin)
        setMin(productId?.min_price)
        setMax(productId?.max_price)
        setCapacity(productId?.supply_capacity)
        setPurity(productId?.purity)
        setValue(productId?.one_lot_qty)
        setType(productId?.one_lot_qty_type)
        setQvalue(productId?.qty)
        setQnumber(productId?.max_lot_qty)
        setQtyType(productId?.qty_type)
        setSamplePrice(productId?.sample_price)

    }, [productId, catelogs]);

    const handleCatalogSelect = (catalog) => {
        setSelectedCatalog(catalog);
        setShowCatalogs(false);
        setSearchInputValue(catalog.name_of_chemical)
    };

    const [catalogFound, setCatalogFound] = useState(true);
    const [filteredCatalogs, setFilteredCatalogs] = useState([]);

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchInputValue(inputValue);
        setShowCatalogs(true)

        // Check if there are any catalogs that match the search query
        const foundCatalog = catelogs && catelogs.some(catalog =>
            catalog.name_of_chemical && catalog.name_of_chemical.toLowerCase().includes(inputValue.toLowerCase())
        );

        // Update the catalogFound state based on whether any catalog is found
        setCatalogFound(foundCatalog);
    };


    useEffect(() => {
        const filteredCatalogs = catelogs && catelogs?.filter(catalog =>
            catalog?.name_of_chemical && catalog?.name_of_chemical?.toLowerCase()?.includes(searchInputValue?.toLowerCase())
        );
        setFilteredCatalogs(filteredCatalogs);
    }, [searchInputValue, catelogs]);

    const [isAddChemical, setIsAddChemical] = useState(false)

    const [formData, setFormData] = useState({
        name_of_chemical: "",
        molecularFormula: "",
        CAS_number: "",
        IUPAC_name: "",
        structure: "",
        mol_weight: "",
        synonums: "",
        Appearance: "",
        storage: ""
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'structure' && files.length > 0) {
            const selectedFile = files[0];
            setFormData((prevData) => ({
                ...prevData,
                [name]: URL.createObjectURL(selectedFile) // Update the image preview
            }));
            setFormData((prevTemp) => ({ ...prevTemp, structure: selectedFile })); // Update the temp state with the selected file
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const [chemicalAddedSuccess, setChemicalAddedSuccess] = useState(false)

    const handleSubmit = async () => {

        const { name_of_chemical, molecularFormula, CAS_number, IUPAC_name, structure, mol_weight, synonums, Appearance, storage } = formData;

        // if (!name_of_chemical.trim() && !molecularFormula.trim() && !CAS_number.trim() && !IUPAC_name.trim() && !structure && !mol_weight && !synonums.trim() && !Appearance.trim() && !storage.trim()) {
        //     toast.error('Please Fill All Fields!', {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 1000,
        //     });
        //     return;
        // }

        if (!name_of_chemical.trim()) {
            toast.error('Please Enter Chemical Name!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        // if (!molecularFormula.trim()) {
        //     toast.error('Please Enter Molecular Formula!', {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 1000,
        //     });
        //     return;
        // }

        if (!CAS_number.trim()) {
            toast.error('Please Enter CAS Number!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        // if (!IUPAC_name.trim()) {
        //     toast.error('Please Enter IUPAC Name!', {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 1000,
        //     });
        //     return;
        // }

        // if (!structure) {
        //     toast.error('Please Select Structure File!', {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 1000,
        //     });
        //     return;
        // }

        // if (!mol_weight) {
        //     toast.error('Please Enter Molecular Weight!', {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 1000,
        //     });
        //     return;
        // }

        // if (!storage.trim()) {
        //     toast.error('Please Enter Storage!', {
        //         position: toast.POSITION.BOTTOM_RIGHT,
        //         autoClose: 1000,
        //     });
        //     return;
        // }

        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

        const stringFields = {
            name_of_chemical: String(name_of_chemical),
            molecularFormula: String(molecularFormula),
            CAS_number: String(CAS_number),
            IUPAC_name: String(IUPAC_name),
            synonums: String(synonums),
            Appearance: String(Appearance),
            storage: String(storage)
        };

        setSuggestedChemicalLoading(true)

        const formDataToSend = new FormData();
        formDataToSend.append("name_of_chemical", stringFields.name_of_chemical);
        formDataToSend.append("molecularFormula", stringFields.molecularFormula);
        formDataToSend.append("CAS_number", stringFields.CAS_number);
        formDataToSend.append("IUPAC_name", stringFields.IUPAC_name);
        formDataToSend.append("structure", structure);
        formDataToSend.append("mol_weight", mol_weight);
        formDataToSend.append("synonums", stringFields.synonums);
        formDataToSend.append("Appearance", stringFields.Appearance);
        formDataToSend.append("storage", stringFields.storage);

        try {
            await axios.post(`${BASE_URL}api/productByCompany/insert`, formDataToSend, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            }).then((response) => {
                    toast.success('Chemical Added Succefully!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    });
    
                setIsAddChemical(false)
                setChemicalAddedSuccess(true)
            }).catch((error)=>{
                
                toast.error(error?.response?.data?.message||'Failed to add chemical', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                }); 
                // setIsAddChemical(false)
                setSuggestedChemicalLoading(false)
            })
   
        

            
        } catch (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }



    }

    const handleViewClick = () => {
        if (pdfFile) {
            const fileURL = URL.createObjectURL(pdfFile);
            window.open(fileURL, '_blank'); // Open in a new tab
        }
    };

    const [isFree, setIsFree] = useState(false);

    const handleCheckboxChange = () => {
        setIsFree((prev) => !prev);
        if (!isFree) {
            setSamplePrice('0');
        } else {
            setSamplePrice('');
        }
    };

    const handleInput = (e) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/; // Regular expression to allow only numbers and a single dot

        if (regex.test(value)) {
            e.target.value = value;
        } else {
            e.target.value = purity; // Revert to the previous valid state
        }
    };

    const handleGradeChange = (selectedOptions) => {
        // Map through selected options and extract their values
        const gradesArray = selectedOptions.map(option => option.value);

        // Store the grades array in state
        setSelectedGrades(gradesArray);
    };



    const gradeOptions = category
        ? categoryList.find(cat => cat.categoryName === category)?.grade?.map((grade) => ({
            value: grade.name,
            label: grade.name
        }))
        : [];

    return (
        <div className="w-full">
            <div className="flex flex-col p-2">
                {abc ? (
                    <>
                        <h1 className="md:text-3xl text-xl font-semibold mb-5">Edit Chemical</h1>
                    </>
                ) : (
                    <>
                        <h1 className="md:text-3xl text-xl font-semibold mb-5">Add New Chemical</h1>

                    </>
                )}

                <div>
                    <div className="flex gap-3 items-center relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute top-3 left-4" />
                        <input
                            type="text"
                            placeholder="Search Any Chemical To Add In Your Catalog"
                            value={searchInputValue}
                            className="bg-gray-100 w-full text-gray-800 pl-10 py-2 outline-none rounded-md"
                            onClick={handleInputClick} // assuming you have a function to handle input click
                            onChange={handleInputChange} // assuming you have a function to handle input change
                        />
                        {showCatalogs && (
                            <div className="absolute top-[140%] bg-white shadow border-2 border-gray-100 w-full px-4 py-3 rounded-lg">
                                {catelogs?.length > 1 ? filteredCatalogs?.map(catalog => (
                                    <div key={catalog.id} onClick={() => handleCatalogSelect(catalog)} className='py-2 ps-3 hover:bg-gray-200 rounded-lg font-medium'>
                                        {catalog.name_of_chemical}
                                    </div>
                                )) : (
                                    <div className='flex justify-center'>
                                        <img src={loader} alt="" className='animate-spin h-[50px]' />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {!catalogFound && (
                    <div className="flex justify-center items-center mt-60">
                        <p className='text-lg font-medium'>Chemical Not Found ! <span className='underline text-blue-600 cursor-pointer' onClick={() => setIsAddChemical(true)}>Add New Chemical</span></p>
                        {/* <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
                            Add Catalog
                        </button> */}
                    </div>
                )}

                {isAddChemical && (
                    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                                    <div class="bg-white py-3 ps-5">
                                        <div class="sm:flex sm:items-start">
                                            <h3 className='font-medium text-xl'>Add New Chemical</h3>
                                        </div>
                                    </div>
                                    <div class="bg-gray-100 px-4 py-5 sm:px-6">
                                        <div>
                                            <div className='grid grid-cols-[1fr,1fr,1fr] gap-4 mb-6'>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Chemical Name <span className='text-red-600'>*</span></p>
                                                    <input name="name_of_chemical" value={formData.name_of_chemical} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                </div>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Mol. Weight</p>
                                                    <input onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9.]/g, '')}
                                                        maxLength={6} name="mol_weight" value={formData.mol_weight} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                </div>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Mol. Formula</p>
                                                    <input name="molecularFormula" value={formData.molecularFormula} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-[1fr,1fr,1fr] gap-4 mb-6'>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>CAS No. <span className='text-red-600'>*</span></p>
                                                    <input onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9-]/g, '')}
                                                        maxLength={10} name="CAS_number" value={formData.CAS_number} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                </div>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Synonums</p>
                                                    <input name="synonums" value={formData.synonums} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                </div>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Appearance</p>
                                                    <input name="Appearance" value={formData.Appearance} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-[1fr,1fr,1fr] gap-4 mb-6'>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>IUPAC Name</p>
                                                    <input name="IUPAC_name" value={formData.IUPAC_name} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                </div>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Storage</p>
                                                    <input name="storage" value={formData.storage} onChange={handleChange} type="text" className='border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none bg-white/[0.2]' />
                                                </div>
                                                <div>
                                                    <p className='mb-1 text-sm font-medium'>Upload Image</p>
                                                    <input name="structure" onChange={handleChange} type="file" className='file:bg-black file:text-white file:rounded border border-[#0A122A]/[.6] rounded-[4px] py-1 px-3 w-full outline-none' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-white flex justify-end mx-8 py-3">
                                        <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => setIsAddChemical(false)}>Cancel</button>
                                        {suggestedChemicalLoading ? (
                                            <div className='bg-[#0A122A] rounded-md ml-4'>
                                                <img src={loader} alt="" className='h-[40px] px-4 animate-spin py-2' />
                                            </div>
                                        ) : (
                                            <button type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4" onClick={handleSubmit}>Submit</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <ToastContainer />

                {selectedCatalog && (
                    <>
                        <div className='mt-10'>
                            <div className='flex bg-white gap-6 border py-4 px-4 rounded-lg shadow-md'>
                                <div className='border h-100% flex items-center rounded-md'>
                                    <img src={selectedCatalog?.structure} alt="" className='w-[350px]' />
                                </div>
                                <div className='w-full'>
                                    <h2 className='text-3xl font-semibold w-full pb-3'>{selectedCatalog?.name_of_chemical}</h2>
                                    <hr />
                                    <div className='py-3'>
                                        <ul className='flex justify-between me-3' >
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500'>CAS Number :</p>
                                                <p>{selectedCatalog?.CAS_number}</p>
                                            </li>
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500'>Molecular Formula :</p>
                                                <p>{selectedCatalog?.molecularFormula}</p>
                                            </li>
                                            <li className='flex gap-3'>
                                                <p className='text-gray-500'>Mol Weight :</p>
                                                <p>{selectedCatalog?.mol_weight}</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <hr />

                                    <div className='mt-3'>
                                        <ul className='flex flex-col gap-2' >
                                            <li className='grid grid-cols-[1fr,5fr] gap-3'>
                                                <p className='text-gray-500 w-[200px]'>Synonyms </p>
                                                <p>{selectedCatalog?.synonums}</p>
                                            </li>
                                            <li className='grid grid-cols-[1fr,5fr] gap-3'>
                                                <p className='text-gray-500 w-[200px]'>IUPAC Name </p>
                                                <p>{selectedCatalog?.IUPAC_name}</p>
                                            </li>
                                            <li className='grid grid-cols-[1fr,5fr] gap-3'>
                                                <p className='text-gray-500 w-[200px]'>Storage </p>
                                                <p>{selectedCatalog?.storage}</p>
                                            </li>
                                            <li className='grid grid-cols-[1fr,5fr] gap-3'>
                                                <p className='text-gray-500 w-[200px]'>Appearance </p>
                                                <p>{selectedCatalog?.Appearance}</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-10 w-[89%] mx-auto'>
                            <div className='rounded-lg shadow-md bg-white border pt-5 px-3'>
                                <div className='flex justify-between mb-2 px-3'>
                                    <h3 className='text-2xl font-medium '>Add Your Details</h3>
                                    <div className='flex items-center gap-3'>
                                        <div className='flex items-center w-[100px]'>
                                            <input type="checkbox" value="abc" checked={labelValue === "active"} onChange={handleCheckBoxChange} name="" id="" />
                                            <label htmlFor="" className='ms-2 text-sm font-medium'>
                                                {labelValue}
                                            </label>
                                        </div>
                                        <button onClick={openModal} className="bg-darkBlue md:flex hidden items-center justify-center px-4 py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
                                            {loading ? (
                                                <img src={loader} alt="" className='h-[20px] px-4 animate-spin' />
                                            ) : (
                                                <>
                                                    Submit
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <hr />
                                <div className='mt-5 flex flex-col gap-5 '>
                                    <div className='grid grid-cols-[1fr,1fr,1fr,1fr,1fr] gap-4'>
                                        <div>
                                            <p className='mb-1 text-xs font-medium'>Category</p>
                                            <select value={category} onChange={handleCategory} name="" id="" className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3'>
                                                <option value="" disabled selected>Category</option>
                                                {categoryList.map((category, index) => (
                                                    <option key={index} value={category.categoryName}>{category.categoryName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p className='mb-1 text-xs font-medium'>Sub-Category</p>
                                            <select value={subCategory} onChange={handleSubCategory} name="" id="" className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3'>
                                                <option value="" disabled selected>Sub Category</option>
                                                {category && categoryList.find(cat => cat?.categoryName === category)?.subCategory?.map((subcat, index) => (
                                                    <option key={index} value={subcat.name}>{subcat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <p className='mb-1 text-xs font-medium'>Grade</p>
                                            <Select
                                                value={gradeOptions.filter(option => selectedGrades && selectedGrades?.includes(option?.value))} // Sync selected grades
                                                onChange={handleGradeChange} // Handle selection
                                                options={gradeOptions} // Options to display in the dropdown
                                                isMulti // Enable multi-select
                                                placeholder="Select Grades"
                                                classNamePrefix="react-select"
                                                className="text-sm"
                                            />
                                        </div>
                                        <div>
                                            <p className='mb-1 text-xs font-medium'>HSN Code</p>
                                            <input name='hsn_code' value={hsnCode} type="text" className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1' onChange={(e) => setHSNCode(e.target.value)} onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                maxLength={8} placeholder='HSN Code' />
                                        </div>
                                        <div className=''>
                                            <p className='mb-1 text-xs font-medium text-gray-400'>Note: Only PDF File Allowed</p>
                                            <input onChange={handleImage} accept="application/pdf" type="file" name="" id="" className='py-1 px-3 bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500' />
                                            {pdfFile ? (
                                                <button
                                                    onClick={handleViewClick}
                                                    className='mt-2 py-1 px-3 bg-blue-500 text-white rounded text-sm'
                                                >
                                                    View
                                                </button>
                                            ) : alreadyCOa ? (
                                                <button
                                                    // onClick={handleViewClick}
                                                    className='mt-2 py-1 px-3 bg-blue-500 text-white rounded text-sm'
                                                >
                                                    <a href={alreadyCOa} target='_blank'>View</a>
                                                </button>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                    <div className='grid grid grid-cols-[1fr,1fr,1fr,1fr,1fr] gap-4'>
                                        <div>
                                            <p className='mb-1 text-xs font-medium'>Price(INR)</p>
                                            <div className='flex gap-2'>
                                                <input value={min} type="text" onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={7} className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1' onChange={handleMin} placeholder='Min' />
                                                <input value={max} type="text" onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={7} className={`bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1`} onChange={handleMax} placeholder='Max' />
                                            </div>
                                        </div>
                                        <div>
                                            <p className='mb-1 text-xs font-medium'>Quantity</p>
                                            <div className='flex gap-2'>
                                                <input value={qValue} onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={7} onChange={handleQuantityValue} type="text" className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3' placeholder='Value' />
                                                <select value={qtyType} onChange={handleQtyType} name="" id="" className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3'>
                                                    <option value="">Type</option>
                                                    <option value="gm">gm</option>
                                                    <option value="kg">kg</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='mb-1 text-xs font-medium'>Country Origin / Make</p>
                                            <select value={origin} onChange={handleOrigin} name="" id="" className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3'>
                                                <option value="1">Country Origin / Make</option>
                                                {countries && countries.map((e) => (
                                                    <option value={e.name}>{e.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <p className='mb-1 text-xs font-medium'>Supply Capacity (kg) / Month</p>
                                            <input type="text" value={capacity} onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={8} className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1' onChange={handleCapacity} placeholder='Production Capacity' />
                                        </div>
                                        <div>
                                            <p className='mb-1 text-xs font-medium'>Purity(%)</p>
                                            <input type="text" value={purity} onInput={handleInput} maxLength={5} className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1' onChange={handlePurity} placeholder='Purity' />
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                                <div className='flex justify-between mb-2 px-3 mt-4'>
                                    <h3 className='text-2xl font-medium '>Sample Details</h3>
                                </div>
                                <hr />
                                <div className='grid grid grid-cols-[1fr,1fr,1fr,1fr] gap-8 pt-5 pb-8'>
                                    <div>
                                        <p className='text-sm font-medium mb-1'>One Lot Quantity</p>
                                        <div className='flex gap-2'>
                                            <input
                                                value={value}
                                                onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                                maxLength={5}
                                                onChange={handleValue}
                                                type="text"
                                                className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3' placeholder='Value' />
                                            <select value={type} onChange={handleType} name="" id="" className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3'>
                                                <option value="1">Type</option>
                                                <option value="gm">gm</option>
                                                <option value="kg">kg</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium mb-1 flex items-center'>
                                            Price(INR) / Lot
                                            <input
                                                type="checkbox"
                                                className='ms-2 me-1'
                                                checked={isFree}
                                                onChange={handleCheckboxChange}
                                            />
                                            <span className='text-slate-400 text-xs'>Check me if free</span>
                                        </p>
                                        <input
                                            value={samplePrice}
                                            onInput={(e) => {
                                                if (!isFree) {
                                                    handleSamplePriceValue(e);
                                                }
                                            }}
                                            maxLength={7}
                                            onChange={(e) => {
                                                if (!isFree) {
                                                    handleSamplePriceValue(e);
                                                }
                                            }}
                                            type="text"
                                            className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1'
                                            placeholder='Value'
                                            readOnly={isFree}
                                        />
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium mb-1'>Max Lot Quantity</p>
                                        <select value={qNumber} onChange={handleQuantityNumber} name="" id="" className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3'>
                                            <option value="">Select Quantity</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}



                {isOpen && (
                    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                    <div class="bg-white py-3">
                                        <div class="flex flex-col items-center">
                                            <img src={right} alt="" className='h-[80px]' />
                                            <h3 className='font-semibold text-2xl mt-4'>{modalTitle}</h3>
                                            <p className='text-sm'>Your catalog has been updated successfully</p>
                                        </div>
                                    </div>
                                    <div class="bg-white mx-8 py-3">
                                        <button onClick={() => navigate(-1)} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Back to Catalog</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {chemicalAddedSuccess && (
                    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                    <div class="bg-white py-3">
                                        <div class="flex flex-col items-center">
                                            <img src={right} alt="" className='h-[80px]' />
                                            <h3 className='font-semibold text-2xl mt-4'>Chemical Submitted Successfully</h3>
                                            {/* <p className='text-sm'>Admin will review and add in our list</p> */}
                                        </div>
                                    </div>
                                    <div class="bg-white mx-8 py-3">
                                        <button onClick={() => navigate(-1)} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </div>
    )
}

export default Addchemical