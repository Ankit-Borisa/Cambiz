import React, { useEffect, useState } from 'react';
import chem1 from "../images/chemical-main.png"
import L from "../images/L.png"
import earth from "../images/pruthvi.png"
import bund from "../images/tipu.png"
import box from "../images/weight.png"
import rupees from "../images/rupees.png"
import { useNavigate, useParams } from 'react-router-dom';
import countries from "../pages/CountryStateCity.json";
import { BASE_URL } from '../BASE_URL';

function getInitials(companyName) {
    if (!companyName) return '';
    const firstCharacter = companyName.charAt(0) || '';
    const secondCharacter = companyName.charAt(1) || '';
    return `${firstCharacter}${secondCharacter}`.toUpperCase();
}

const ProductDetails = () => {

    const { _id } = useParams();

    const token = localStorage.getItem("chemicalToken")
    const myCompanyId = localStorage.getItem("myCompanyId")

    const selectedCountry = countries.find((e) => e.name === "India")

    const [productDetail, setProductDetail] = useState([])
    const [productSuppliers, setProductSuppliers] = useState([])
    // console.log(productSuppliers)

    const fetchPrducts = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`
        const res = await fetch(`${BASE_URL}api/product/productDetails?productId=${_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        })
        const data = await res.json()
        setProductDetail(data?.data?.[0])
        setProductSuppliers(data?.data)
    }

    useEffect(() => {
        fetchPrducts();
    }, []);

    const navigate = useNavigate();

    const abc = "3883";

    const handleNavigate1 = (e) => {
        const token = localStorage.getItem("chemicalToken")
        if (token) {
            navigate(`/company/buy-inquiry/${e.catalog?.company_id}`, { state: { abc: abc, data: e, id: e._id } });
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

    const [focused, setFocused] = useState(false);
    const [focusedS, setFocusedS] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [focused3, setFocused3] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [selectedState, setSelectedState] = useState("");
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");

    const handleStateChange = (e) => {
        const selectedStateName = e.target.value;
        setSelectedState(selectedStateName);
        setSelectedCity('')
        // Find the selected state object
        const stateObject = selectedCountry.states.find(state => state.name === selectedStateName);
        setCities(stateObject ? stateObject.cities : []); // Update cities if stateObject is found
    };

    const [amountQuery, setAmountQuery] = useState('');
    const [documentQuery, setDocumentQuery] = useState('');

    const handleAmountChange = (event) => setAmountQuery(event.target.value);
    const handleDocumentChange = (event) => setDocumentQuery(event.target.value);

    const handleClear = () => {
        // setShowModal(false)
        setAmountQuery('');
        setDocumentQuery('');
        setSelectedState('');
        setSelectedCity('');
        setCities([]);
        setFocused(false);
        setFocusedS(false);
        setFocused2(false);
        setFocused3(false);
    };

    const filteredData = productSuppliers?.filter(item => {
        const minPrice = Number(item?.catalog?.min_price);
        const maxPrice = Number(item?.catalog?.max_price);
        const amount = parseFloat(amountQuery);

        const matchesAmount = amountQuery === '' || (amount >= maxPrice);

        const matchesDocument = documentQuery === '' || item?.document_details?.some(doc =>
            doc?.certificate_name?.toLowerCase().includes(documentQuery.toLowerCase()) &&
            doc?.status?.toLowerCase() === 'active'
        );

        const matchesState = item?.company_info?.state?.toLowerCase().includes(selectedState.toLowerCase());
        const matchesCity = item?.company_info?.city?.toLowerCase().includes(selectedCity.toLowerCase());

        return (
            matchesAmount &&
            matchesDocument &&
            matchesState &&
            matchesCity
        );
    });

    return (
        <>
            <div className=''>
                <div className='profile-container'>
                    <div className="w-full overflow-x-hidden">
                        <div className="flex flex-col p-2">
                            <div className=''>
                                <div className='sm:flex block bg-white gap-6 border py-8 sm:px-10 px-4 rounded-lg shadow-md'>
                                    <div className='sm:h-[100%] h-[100px] rounded-md'>
                                        <img src={productDetail?.product?.structure} alt="" className='w-[50%]  ml-[20%]' />
                                    </div>
                                    <div className='w-full'>
                                        <h2 className='sm:text-2xl text-md font-semibold w-full pb-3'>{productDetail?.product?.name_of_chemical}</h2>
                                        <hr />
                                        <div className='py-3'>
                                            <ul className='sm:flex flex-wrap block justify-between me-3'>
                                                <li className='flex gap-3'>
                                                    <p className='sm:text-sm text-xs text-gray-500'>CAS Number :</p>
                                                    <p className='sm:text-sm text-xs'>{productDetail?.product?.CAS_number}</p>
                                                </li>
                                                <li className='flex gap-3'>
                                                    <p className='text-gray-500 sm:text-sm text-xs'>Molecular Formula :</p>
                                                    <p className='sm:text-sm text-xs'>{productDetail?.product?.molecularFormula}</p>
                                                </li>
                                                <li className='flex gap-3'>
                                                    <p className='text-gray-500 sm:text-sm text-xs'>Mol Weight :</p>
                                                    <p className='sm:text-sm text-xs'>{productDetail?.product?.mol_weight}</p>
                                                </li>
                                            </ul>
                                        </div>

                                        <hr />
                                        <div className='mt-3'>
                                            <ul className='flex flex-col gap-2' >
                                                <li className='sm:flex block'>
                                                    <div>
                                                        <p className='text-gray-500 w-[250px] sm:text-sm text-xs'>Synonyms </p>
                                                    </div>
                                                    <p className='sm:text-sm text-xs'>{productDetail?.product?.synonums}</p>
                                                </li>
                                                <li className='sm:flex block '>
                                                    <div>
                                                        <p className='text-gray-500 w-[250px] sm:text-sm text-xs'>IUPAC Name </p>
                                                    </div>
                                                    <p className='sm:text-sm text-xs'>{productDetail?.product?.IUPAC_name}</p>
                                                </li>
                                                <li className='sm:flex block '>
                                                    <div>
                                                        <p className='text-gray-500 w-[250px] sm:text-sm text-xs'>Storage </p>
                                                    </div>
                                                    <p className='sm:text-sm text-xs'>{productDetail?.product?.storage}</p>
                                                </li>
                                                <li className='sm:flex block'>
                                                    <div>
                                                        <p className='text-gray-500 w-[250px] sm:text-sm text-xs'>Appearance </p>
                                                    </div>
                                                    <p className='sm:text-sm text-xs'>{productDetail?.product?.Appearance}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* in mobile view button for filter  */}

                    <div className="grid grid-cols-[2fr,1fr] sm:hidden my-3 mx-7">
                        <h1 className='text-lg font-semibold py-1'>Suppliers</h1>
                        <button
                            className="bg-darkBlue text-white py-2 rounded-lg sm:text-md text-xs font-semibold"
                            onClick={() => setShowModal(true)}
                        >
                            Show Filters
                        </button>
                    </div>

                    <div className='hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-center gap-4 md:gap-6 lg:gap-10 my-3 mx-7'>
                        <h1 className='text-2xl font-semibold py-1'>Suppliers</h1>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Price
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                value={amountQuery}
                                onChange={handleAmountChange}
                                onFocus={() => setFocused(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                            />
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="selectField"
                                className={`transition-all ${focusedS ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focusedS ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Facility Accreditation
                            </label>
                            <select
                                id="selectField"
                                value={documentQuery}
                                onChange={handleDocumentChange}
                                onFocus={() => setFocusedS(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocusedS(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                            >
                                <option value="" disabled selected></option>
                                <option value="">All</option>
                                <option value="GMP">GMP</option>
                                <option value="cGMP">cGMP</option>
                                <option value="FDA">FDA</option>
                                <option value="USFDA">USFDA</option>
                                <option value="ISO 9001:2015">ISO 9001:2015</option>
                                <option value="ISO 14001:2015">ISO 14001:2015</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="selectField"
                                className={`transition-all ${focused2 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused2 ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                State
                            </label>
                            <select
                                id="selectField"
                                onFocus={() => setFocused2(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused2(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                                onChange={handleStateChange}
                                value={selectedState}
                            >
                                <option value="" disabled selected></option>
                                {selectedCountry.states && selectedCountry.states.map((e) => (
                                    <option key={e.name} value={e.name}>{e.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="selectField"
                                className={`transition-all ${focused3 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused3 ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                City
                            </label>
                            <select
                                id="selectField"
                                onFocus={() => setFocused3(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused3(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="" disabled selected></option>
                                {cities && cities.map((city) => (
                                    <option key={city.name} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* filter end here  */}

                    {/* Modal for filters on small screens */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-5 w-11/12 max-w-md">
                                <div className='flex justify-between items-center'>
                                    <h2 className="text-xl font-semibold mb-4">Filters</h2>
                                    <h2 className="text-red-500 text-sm underline cursor-pointer font-semibold mb-4" onClick={handleClear} >Clear</h2>
                                </div>
                                <div className="grid gap-4">
                                    {/* Filter inputs */}
                                    <div className="flex flex-col justify-center items-center relative">
                                        <label
                                            htmlFor="inputField"
                                            className={`transition-all ${focused ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                                        >
                                            Price
                                        </label>
                                        <input
                                            id="inputField"
                                            type="text"
                                            value={amountQuery}
                                            onChange={handleAmountChange}
                                            onFocus={() => setFocused(true)}
                                            onBlur={(e) => e.target.value.trim() === '' && setFocused(false)}
                                            className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label
                                            htmlFor="selectField"
                                            className={`transition-all ${focusedS ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focusedS ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                                        >
                                            Facility Accreditation
                                        </label>
                                        <select
                                            id="selectField"
                                            value={documentQuery}
                                            onChange={handleDocumentChange}
                                            onFocus={() => setFocusedS(true)}
                                            onBlur={(e) => e.target.value.trim() === '' && setFocusedS(false)}
                                            className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                                        >
                                            <option value="" disabled selected></option>
                                            <option value="">All</option>
                                            <option value="GMP">GMP</option>
                                            <option value="cGMP">cGMP</option>
                                            <option value="FDA">FDA</option>
                                            <option value="USFDA">USFDA</option>
                                            <option value="ISO 9001:2015">ISO 9001:2015</option>
                                            <option value="ISO 14001:2015">ISO 14001:2015</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col justify-center items-center relative">
                                        <label
                                            htmlFor="selectField"
                                            className={`transition-all ${focused2 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused2 ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                                        >
                                            State
                                        </label>
                                        <select
                                            id="selectField"
                                            onFocus={() => setFocused2(true)}
                                            onBlur={(e) => e.target.value.trim() === '' && setFocused2(false)}
                                            className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                                            onChange={handleStateChange}
                                            value={selectedState}
                                        >
                                            <option value="" disabled selected></option>
                                            {selectedCountry.states && selectedCountry.states.map((e) => (
                                                <option key={e.name} value={e.name}>{e.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col justify-center items-center relative">
                                        <label
                                            htmlFor="selectField"
                                            className={`transition-all ${focused3 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused3 ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                                        >
                                            City
                                        </label>
                                        <select
                                            id="selectField"
                                            onFocus={() => setFocused3(true)}
                                            onBlur={(e) => e.target.value.trim() === '' && setFocused3(false)}
                                            className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                        >
                                            <option value="" disabled selected></option>
                                            {cities && cities.map((city) => (
                                                <option key={city.name} value={city.name}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 gap-2">
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-darkBlue text-white px-4 py-2 rounded"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    <div className=''>
                        {!productSuppliers || !productSuppliers.some(e => e.catalog && e.catalog.company_id !== myCompanyId) ? (
                            <div className="text-center text-gray-500 mt-20">No suppliers available for this chemical.</div>
                        ) : (
                            <>
                                <div className="mb-10 grid 2xl:grid-cols-[1fr,1fr,1fr,1fr] xl:grid-cols-[1fr,1fr,1fr] lg:grid-cols-[1fr,1fr] sm:grid-cols-[1fr] gap-4 bg-white border border-[#0A122A1A]/0.3 sm:px-5 px-6 py-5 rounded-3xl">
                                    {filteredData && filteredData
                                        .filter(e => e?.catalog && e?.catalog.company_id !== myCompanyId) // Filter out objects with null or undefined catalog and where company_id doesn't match
                                        .map((e) => (
                                            <div key={e.id} className='border border-[#0A122A1A]/0.3 rounded-xl sm:py-5 py-3 sm:px-4 px-2'>
                                                <div className='flex sm:gap-4 gap-2 border-b-2 border-gray pb-4 mb-4'>
                                                    <div>
                                                        {e?.company_otherInfo?.length !== 0 && e?.company_otherInfo?.logo != "" ? (
                                                            <img src={e?.company_otherInfo?.logo} alt="" className='sm:h-[70px] h-[50px] sm:w-[70px] w-[50px]' />
                                                        ) : (
                                                            <div className='h-[70px] w-[70px] bg-gray-200 flex items-center justify-center rounded-md'>
                                                                <p className='text-lg font-bold'>{getInitials(e?.company_info?.company_name)}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className='text-slate-500 sm:text-sm text-xs'>{e?.company_info?.mode_of_business.join(',')}</p>
                                                        <p className='sm:text-sm text-xs font-medium' title={e?.company_info?.company_name}>
                                                            {e?.company_info?.company_name?.length < 14 ? e?.company_info?.company_name : e?.company_info?.company_name?.slice(0, 18)}
                                                        </p>
                                                        <div className='flex justify-between gap-3'>
                                                            <a href={e?.catalog?.COA} target='_blank' className='underline text-blue-500 font-medium sm:text-sm text-xs'>COA</a>
                                                            <a href={`/company-profile/${e?.catalog?.company_id}`} className='underline text-blue-500 font-medium sm:text-sm text-xs cursor-pointer'>More Details</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='grid grid-cols-[1fr,0.5fr]'>
                                                        <div className=''>
                                                            <p className='text-slate-600 flex items-center sm:text-sm text-xs gap-4 text-sm mb-2' title='price range'>
                                                                <img src={rupees} alt="" className='h-[15px]' />
                                                                {e?.catalog?.min_price} - {e?.catalog?.max_price}
                                                            </p>
                                                            <p className='text-slate-600 flex items-center sm:text-sm text-xs gap-3 text-sm' title='supply capacity per month'>
                                                                <img src={box} alt="" className='h-[15px]' />
                                                                {e?.catalog?.supply_capacity} kg/m
                                                            </p>
                                                        </div>
                                                        <div className=''>
                                                            <p className='text-slate-600 flex items-center sm:text-sm text-xs gap-4 text-sm mb-2' title='purity'>
                                                                <img src={bund} alt="" className='h-[15px]' />
                                                                {e?.catalog?.purity}%
                                                            </p>
                                                            <p className='text-slate-600 flex items-center sm:text-sm text-xs gap-3 text-sm' title='country origin'>
                                                                <img src={earth} alt="" className='h-[15px]' />
                                                                {e?.catalog?.country_origin}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='mt-5 flex sm:flex-row flex-col gap-2'>
                                                        <button className='bg-darkBlue text-white py-2 rounded-lg w-full sm:text-md text-xs font-semibold' onClick={() => handleNavigate1(e)}>
                                                            Buying Inquiry
                                                        </button>
                                                        <button className=' border border-darkBlue sm:font-semibold font-medium py-2 rounded-lg w-full sm:text-md text-xs' onClick={() => handleNavigate2(e)}>
                                                            Sample Inquiry
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetails
