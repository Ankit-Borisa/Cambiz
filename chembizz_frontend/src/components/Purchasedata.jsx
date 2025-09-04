import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  faPrint,
  faDownload,
  faArrowUp,
  faEllipsisVertical,
  faArrowDown,
  faFilter,
  faCross,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
import invoice1 from "../images/invoice1.jpg";
import right from "../images/right.png";
import { useNavigate } from "react-router-dom";
import Invoice1 from "./Invoice1";
import { useSharedState } from "../context/ManageOpenContext";
import Invoice2 from "./Invoice2";
import Invoice3 from "./Invoice3";
import { DisplayPoContext } from "../context/PoViewContext";
import { BASE_URL } from "../BASE_URL";

import {exportToExcel} from "../utils/exportToExcel"
import { MdOutlineFileDownload } from "react-icons/md";
import generateRandomPrefix from "../utils/randomPrefix";


const formatDate = (dateString) => {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  // Extract the day, month, and year in UTC from the date
  const day = String(date.getUTCDate()).padStart(2, "0"); // Ensure two digits
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getUTCFullYear();

  // Return the formatted date as "DD-MM-YYYY"
  return `${day}-${month}-${year}`;
};

const Purchasedata = () => {
  const { sharedState, setSharedState } = useSharedState();
  const { displayPo, setDisplayPo } = useContext(DisplayPoContext);

  const [data, setData] = useState([]);

  const [focused, setFocused] = useState(false);
  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);
  const [focused3, setFocused3] = useState(false);
  const [focusedD, setFocusedD] = useState(true);
  const [focused4, setFocused4] = useState(true);
  const [focused5, setFocused5] = useState(true);
  const [focusedS, setFocusedS] = useState(true);
  const [focusedPoType, setFocusedPoType] = useState(true);

  const photoView = () => {};

  const [reason, setReason] = useState(false);

  const handleGenrate = () => {
    setReason(true);
  };

  const [prefix, setPrefix] = useState("");

  const cancelSubmit = () => {
    let prefixValue= prefix
    if (!prefix) {
      prefixValue= generateRandomPrefix();
      setPrefix(prefixValue)
    }

    const finalPrefix = prefixValue + "_";
    
    navigate("/company/generate-new-manual-po", {
      state: { abc: "PO", prefix: finalPrefix, manual: "manual" },
    });
  };

  const handleOfReason = () => {
    setReason(false);
  };

  const [isOpen1, setIsOpen1] = useState(false);

  const handleSuccess = () => {
    setIsOpen1(true);
  };

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const [ascending, setAscending] = useState(true);

  const toggleOrder = () => {
    setAscending(!ascending);
  };

  const fetchPoData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(
      `${BASE_URL}api/salesInvoice/po_and_invoice_details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ invoice_type: "po" }),
      }
    );
    const data = await res.json();
    // console.log("hello data",data.data);
    setData(data.data);
  };

  useEffect(() => {
    fetchPoData();
  }, []);

  const [photoData, setPhotoData] = useState(null);

  const handleViewInvoice = (e) => {
    setPhotoData(e);
    setDisplayPo(true);
    // setSharedState(true);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [buyerQuery, setBuyerQuery] = useState("");
  const [amountQuery, setAmountQuery] = useState("");
  const [ponumberQuery, setPonumberQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [paymentQuery, setPaymentQuery] = useState("");
  const [fromDateQuery, setFromDateQuery] = useState("");
  const [toDateQuery, setToDateQuery] = useState("");
  const [poTypeQuery, setPoTypeQuery] = useState("");
  const [inquiryTypeQuery, setInquiryTypeQuery] = useState("");

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleBuyerChange = (event) => setBuyerQuery(event.target.value);
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmountQuery(numericValue);
  };

  const handlePoNumberChange = (event) => setPonumberQuery(event.target.value);
  const handleDateChange = (event) => setDateQuery(event.target.value);
  const handlePaymentChange = (event) => setPaymentQuery(event.target.value);
  const handleFromDateChange = (event) => setFromDateQuery(event.target.value);
  const handleToDateChange = (event) => setToDateQuery(event.target.value);
  const handlePoTypeChange = (event) => setPoTypeQuery(event.target.value);
  const handleInquiryTypeChange = (event) =>
    setInquiryTypeQuery(event.target.value);

  const filteredData = data?.filter((item) => {
    const matchesChemicalName = item?.product_details?.[0]?.chem_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBuyerName = item?.bill_to_name
      .toLowerCase()
      .includes(buyerQuery.toLowerCase());
    const matchesAmount =
      amountQuery === "" || item?.grand_total >= parseFloat(amountQuery);
    const matchesPoNumber = item?.po_num
      .toLowerCase()
      .includes(ponumberQuery.toLowerCase());
    const matchesPayment = item?.payment_terms
      .toLowerCase()
      .includes(paymentQuery.toLowerCase());

    // Convert item.dateAndtime to a date object
    const itemDateAndTime = new Date(item.dateAndtime);

    // Convert fromDateQuery and toDateQuery to date objects
    const fromDate = fromDateQuery ? new Date(fromDateQuery) : null;
    const toDate = toDateQuery ? new Date(toDateQuery) : null;

    let matchesFromDate = true;
    let matchesToDate = true;

    // Check date range
    if (fromDate && toDate && fromDate.getTime() === toDate.getTime()) {
      matchesFromDate =
        itemDateAndTime.toDateString() === fromDate.toDateString();
      matchesToDate = itemDateAndTime.toDateString() === toDate.toDateString();
    } else {
      matchesFromDate = !fromDate || itemDateAndTime >= fromDate;
      matchesToDate = !toDate || itemDateAndTime <= toDate;
    }

    const myCompanyId = localStorage.getItem("myCompanyId");

    let matchesPoType = true; // Default to true to include items if no PO Type is selected
    if (poTypeQuery === "Recieved PO") {
      matchesPoType = item.buyer_company_id !== myCompanyId;
    } else if (poTypeQuery === "Inquiry PO") {
      matchesPoType = item.buyer_company_id === myCompanyId;
    } else if (poTypeQuery === "Manual PO") {
      matchesPoType = item.invoice_mode === "manual";
    }

    // Handle the optional inq_type key
    const matchesInquiryType =
      inquiryTypeQuery === "all" ||
      !inquiryTypeQuery ||
      (item?.inq_type &&
        item.inq_type.toLowerCase().includes(inquiryTypeQuery.toLowerCase()));

    return (
      matchesChemicalName &&
      matchesBuyerName &&
      matchesAmount &&
      matchesPoNumber &&
      matchesPayment &&
      matchesFromDate &&
      matchesToDate &&
      matchesPoType &&
      matchesInquiryType
    );
  });



  const displayedData = useMemo(() => {
    return ascending ? filteredData : [...filteredData].reverse();
  }, [filteredData, ascending]);
  

  const clearFilters = () => {
    setSearchQuery("");
    setBuyerQuery("");
    setAmountQuery("");
    setPonumberQuery("");
    setPaymentQuery("");
    setFromDateQuery("");
    setToDateQuery("");
    setPoTypeQuery("");
    setInquiryTypeQuery("");
  };

  const getPoTypeByIdAndType = (id, type) => {
    if (type === "manual") {
      return "Manual Po";
    }

    const myCompanyId = localStorage.getItem("myCompanyId");

    if (id === myCompanyId) {
      return "Generated Po";
    } else {
      return "Received Po";
    }
  };

  const handleReturnOrder = (e) => {
    navigate(`/company/buying-inquiry-detail/${e}`, { state: "returnOrder" });
  };

  const handleEdit = (item) => {
    navigate(`/company/edit-manual-po/${item._id}`);
  };

  const displayIndex = (index, length) => {
    return ascending ? index + 1 : length - index;
  };

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilterPanel = () => {
    setShowFilters(!showFilters);
  };

  const downloadPo = useMemo(() => {
 
    return [...displayedData].reverse().map((item) => {
      let PO_type = getPoTypeByIdAndType(item.buyer_company_id, item.invoice_mode);
  
      console.log("item", item);

      return {
        chem_name: item?.product_details[0]?.chem_name,
        Buyer: item?.bill_to_name,
        Seller: item?.seller_to_name,
        Amount: Math.floor(item?.grand_total),
        PO_type,
        PO_num: item.po_num,
        PO_Date: formatDate(item.po_date),
        Inquiry_Type: item?.inq_type ?? "-",
        Status: item?.inquiry_details?.[0]?.status ?? "PO"
      };
    });
  }, [displayedData]);
  

  
// here we will write function for download po data ;

const handleDownload = () => {
  exportToExcel(downloadPo, 'PO_Data');
};


 

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-col p-2 ">
        <div className="flex justify-between mb-2">
          <h1 className="md:text-3xl text-lg font-semibold ">
            Purchase Order Data
          </h1>
          <div className="flex items-center gap-5">
          <button
            className="bg-darkBlue h-[100%] text-white text-xs sm:px-20 px-5 rounded-[10px] sm:block hidden"
            onClick={handleGenrate}
          >
            Generate PO
          </button>
          <button onClick={handleDownload}  className="bg-darkBlue h-[100%] text-[25px] text-white text-xs sm: px-3 rounded-[10px] sm:block hidden"> <img className="h-[15px]" src="https://chembizzstorage.blob.core.windows.net/chembizz-files/download_img.png" alt="" /> </button>
          </div>
          <button
            className="bg-darkBlue text-white text-lg sm:px-20 px-5 rounded-[5px] sm:hidden block"
            onClick={handleGenrate}
          >
            +
          </button>
        </div>

        {isOpen && (
          <div
            className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-40"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative transform overflow-hidden rounded-lg text-left transition-all max-w-md py-4">
              <div className="py-3">
                <div className="flex justify-center gap-2 mb-2">
                  <button
                    onClick={() => navigate("/company/buying-inquiry-detail")}
                    className="bg-darkBlue text-sm text-white px-4 py-1 rounded-[20px]"
                  >
                    Edit PO
                  </button>
                  <button
                    onClick={() => handleSuccess()}
                    className="bg-darkBlue text-white px-5 py-1 rounded-[20px] text-sm"
                  >
                    Generate PO
                  </button>
                </div>
                <div className="">
                  <img src={invoice1} alt="" className="h-[550px]" />
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />

        {/* <div className='mt-3'>
                    <div className='grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] gap-4 overflow-scroll'>

                        <div className='flex w-[100px] justify-center items-center' onClick={toggleOrder}>
                            <div className='flex border px-4 py-2 mt-1 rounded-lg items-center cursor-pointer'>
                                <FontAwesomeIcon icon={ascending ? faArrowDown : faArrowUp} className='text-gray-500' />
                                <p className='ms-2 text-sm'>{ascending ? "1 to 9" : "9 to 1"}</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Chemical Name
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setFocused(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused1 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Seller Company Name
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                value={buyerQuery}
                                onChange={handleBuyerChange}
                                onFocus={() => setFocused1(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused1(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused2 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused2 ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Amount
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                value={amountQuery}
                                onChange={handleAmountChange}
                                onFocus={() => setFocused2(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused2(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="selectField"
                                className={`transition-all ${focusedPoType ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focusedPoType ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                PO Type
                            </label>
                            <select
                                id="poType"
                                value={poTypeQuery}
                                onChange={handlePoTypeChange}
                                onFocus={() => setFocusedPoType(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocusedPoType(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            >
                                <option value="" disabled selected></option>
                                <option value="all">All</option>
                                <option value="Recieved PO">Received PO</option>
                                <option value="Inquiry PO">Generated PO</option>
                                <option value="Manual PO">Manual PO</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="selectField"
                                className={`transition-all ${focusedS ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focusedS ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                Inquiry Type
                            </label>
                            <select
                                id="selectField"
                                value={inquiryTypeQuery}
                                onChange={handleInquiryTypeChange}
                                onFocus={() => setFocusedS(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocusedS(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            >
                                <option value="" disabled selected></option>
                                <option value="all">All</option>
                                <option value="sample">Sample Inquiry</option>
                                <option value="commercial">Commercial Inquiry</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <label
                                htmlFor="inputField"
                                className={`transition-all ${focused3 ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${focused ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                            >
                                PO Number
                            </label>
                            <input
                                id="inputField"
                                type="text"
                                value={ponumberQuery}
                                onChange={handlePoNumberChange}
                                onFocus={() => setFocused3(true)}
                                onBlur={(e) => e.target.value.trim() === '' && setFocused3(false)}
                                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <div className="flex flex-col justify-center items-center relative">
                                <label
                                    htmlFor="inputDate"
                                    className={`transition-all ${focusedD ? 'text-xs top-0 left-[2%] bg-white' : 'text-base'} ${focusedD ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                                >
                                    FROM
                                </label>
                                <input
                                    id="inputDate"
                                    type="date"
                                    value={fromDateQuery}
                                    onChange={handleFromDateChange}
                                    className={`border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 ${focusedD ? 'focused' : ''}`}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center relative">
                            <div className="flex flex-col justify-center items-center relative">
                                <label
                                    htmlFor="inputDate"
                                    className={`transition-all ${focusedD ? 'text-xs top-0 left-[2%] bg-white' : 'text-base'} ${focusedD ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
                                >
                                    TO
                                </label>
                                <input
                                    id="inputDate"
                                    type="date"
                                    value={toDateQuery}
                                    min={fromDateQuery}
                                    onChange={handleToDateChange}
                                    className={`border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 ${focusedD ? 'focused' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                </div> */}

        <div className="relative z-20">
          {/* Floating button for filters */}
          <button
            className="fixed bottom-4 right-10 bg-darkBlue text-white py-3 px-4 rounded-full shadow-lg"
            onClick={toggleFilterPanel}
          >
            <FontAwesomeIcon icon={faFilter} />
          </button>

          {/* Sliding filter panel */}
          <div className="bg-black/[0.3]">
            <div
              className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform ${
                showFilters ? "translate-x-0" : "translate-x-full"
              } w-[300px] p-4`}
            >
              <button
                onClick={toggleFilterPanel}
                className="absolute top-4 right-4"
              >
                <FontAwesomeIcon icon={faXmark} className="text-2xl" />
              </button>

              {/* Filters content */}
              <div className="mt-14 w-full">
                <h1 className="font-semibold text-xl">Filters</h1>
              </div>
              <hr className="border border-black" />
              <div className="mt-2 grid grid-cols-1 gap-4">
                <div className="flex w-full items-center" onClick={toggleOrder}>
                  <div className="flex border border-black px-4 py-2 mt-1 rounded-lg items-center cursor-pointer w-full">
                    <FontAwesomeIcon
                      icon={ascending ? faArrowDown : faArrowUp}
                      className="text-gray-500"
                    />
                    <p className="ms-2 text-sm">
                      {ascending ? "1 to 9" : "9 to 1"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center relative w-full mt-2">
                <label
                  htmlFor="inputField"
                  className={`transition-all ${
                    focused
                      ? "text-xs top-0 left-[2%] bg-white"
                      : "text-xs top-[45%] left-[5%]"
                  } ${
                    focused ? "text-gray-500" : "text-gray-700"
                  } absolute pointer-events-none px-1`}
                >
                  Chemical Name
                </label>
                <input
                  id="inputField"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setFocused(true)}
                  onBlur={(e) =>
                    e.target.value.trim() === "" && setFocused(false)
                  }
                  className="border border-black rounded-lg px-3 w-full py-2 mt-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col justify-center items-center relative mt-2">
                <label
                  htmlFor="inputField"
                  className={`transition-all ${
                    focused1
                      ? "text-xs top-0 left-[2%] bg-white"
                      : "text-xs top-[45%] left-[5%]"
                  } ${
                    focused ? "text-gray-500" : "text-gray-700"
                  } absolute pointer-events-none px-1`}
                >
                  Seller Company Name
                </label>
                <input
                  id="inputField"
                  type="text"
                  value={buyerQuery}
                  onChange={handleBuyerChange}
                  onFocus={() => setFocused1(true)}
                  onBlur={(e) =>
                    e.target.value.trim() === "" && setFocused1(false)
                  }
                  className="border border-black w-full rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col justify-center items-center relative mt-2">
                <label
                  htmlFor="inputField"
                  className={`transition-all ${
                    focused2
                      ? "text-xs top-0 left-[2%] bg-white"
                      : "text-xs top-[45%] left-[5%]"
                  } ${
                    focused2 ? "text-gray-500" : "text-gray-700"
                  } absolute pointer-events-none px-1`}
                >
                  Amount
                </label>
                <input
                  id="inputField"
                  type="text"
                  value={amountQuery}
                  onChange={handleAmountChange}
                  onFocus={() => setFocused2(true)}
                  onBlur={(e) =>
                    e.target.value.trim() === "" && setFocused2(false)
                  }
                  className="border border-black w-full rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col justify-center items-center relative mt-2">
                <label
                  htmlFor="selectField"
                  className={`transition-all ${
                    focusedPoType
                      ? "text-xs top-0 left-[2%] bg-white"
                      : "text-xs top-[45%] left-[5%]"
                  } ${
                    focusedPoType ? "text-gray-500" : "text-gray-700"
                  } absolute pointer-events-none px-1`}
                >
                  PO Type
                </label>
                <select
                  id="poType"
                  value={poTypeQuery}
                  onChange={handlePoTypeChange}
                  onFocus={() => setFocusedPoType(true)}
                  onBlur={(e) =>
                    e.target.value.trim() === "" && setFocusedPoType(false)
                  }
                  className="border border-black w-full rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="" disabled selected></option>
                  <option value="all">All</option>
                  <option value="Recieved PO">Received PO</option>
                  <option value="Inquiry PO">Generated PO</option>
                  <option value="Manual PO">Manual PO</option>
                </select>
              </div>

              <div className="flex flex-col justify-center items-center relative mt-2 w-full">
                <label
                  htmlFor="selectField"
                  className={`transition-all ${
                    focusedS
                      ? "text-xs top-0 left-[2%] bg-white"
                      : "text-xs top-[45%] left-[5%]"
                  } ${
                    focusedS ? "text-gray-500" : "text-gray-700"
                  } absolute pointer-events-none px-1`}
                >
                  Inquiry Type
                </label>
                <select
                  id="selectField"
                  value={inquiryTypeQuery}
                  onChange={handleInquiryTypeChange}
                  onFocus={() => setFocusedS(true)}
                  onBlur={(e) =>
                    e.target.value.trim() === "" && setFocusedS(false)
                  }
                  className="border border-black w-full mt-2 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="" disabled selected></option>
                  <option value="all">All</option>
                  <option value="sample">Sample Inquiry</option>
                  <option value="commercial">Commercial Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col justify-center items-center relative mt-2">
                <label
                  htmlFor="inputField"
                  className={`transition-all ${
                    focused3
                      ? "text-xs top-0 left-[2%] bg-white"
                      : "text-xs top-[45%] left-[5%]"
                  } ${
                    focused ? "text-gray-500" : "text-gray-700"
                  } absolute pointer-events-none px-1`}
                >
                  PO Number
                </label>
                <input
                  id="inputField"
                  type="text"
                  value={ponumberQuery}
                  onChange={handlePoNumberChange}
                  onFocus={() => setFocused3(true)}
                  onBlur={(e) =>
                    e.target.value.trim() === "" && setFocused3(false)
                  }
                  className="border border-black w-full rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col justify-center items-center relative mt-2 w-full">
                <div className="flex flex-col justify-center items-center relative w-full">
                  <label
                    htmlFor="inputDate"
                    className={`transition-all ${
                      focusedD
                        ? "text-xs top-0 left-[2%] bg-white"
                        : "text-base"
                    } ${
                      focusedD ? "text-gray-500" : "text-gray-700"
                    } absolute pointer-events-none px-1`}
                  >
                    FROM
                  </label>
                  <input
                    id="inputDate"
                    type="date"
                    value={fromDateQuery}
                    onChange={handleFromDateChange}
                    className={`border border-black w-full rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 ${
                      focusedD ? "focused" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center items-center relative mt-2 w-full">
                <div className="flex flex-col justify-center items-center relative w-full">
                  <label
                    htmlFor="inputDate"
                    className={`transition-all ${
                      focusedD
                        ? "text-xs top-0 left-[2%] bg-white"
                        : "text-base"
                    } ${
                      focusedD ? "text-gray-500" : "text-gray-700"
                    } absolute pointer-events-none px-1`}
                  >
                    TO
                  </label>
                  <input
                    id="inputDate"
                    type="date"
                    value={toDateQuery}
                    min={fromDateQuery}
                    onChange={handleToDateChange}
                    className={`border border-black w-full rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 ${
                      focusedD ? "focused" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="mt-4 w-full">
                <button
                  onClick={clearFilters}
                  className="font-semibold text-md rounded-md py-1 w-full text-white bg-darkBlue"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-2 border-t-2 border-gray-200" />

        {/* Table */}
        <div className="relative" style={{ height: "calc(100vh - 180px)" }}>
          <div className="overflow-y-auto h-full">
            <table
              style={{ border: "none" }}
              className="table-auto w-full border-0 mt-2"
            >
              <tbody>
                {displayedData &&
                  [...displayedData].reverse().map((item, index) => (
                    <React.Fragment key={index}>
                      <tr
                        className={`flex py-2 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        }`}
                      >
                        <td className=" ps-2 text-center py-2 flex flex-col sm:justify-center justify-start font-semibold">
                          <span className={`px-2`}>
                            {displayIndex(index, displayedData.length)}
                          </span>
                        </td>

                        <td className="ps-4 py-2 flex flex-col w-[180px]">
                          <p className=" font-semibold text-[14px]">
                            {item.product_details?.[0]?.chem_name}
                          </p>
                          <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">
                            {item.product_details?.[0]?.cas_no}
                          </h2>
                        </td>

                        <td className="  py-2 flex flex-col w-[180px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">
                            Buyer
                          </h2>
                          <p className="font-semibold text-[14px]">
                            {item.buyer_company_details?.[0]?.company_name}
                          </p>
                        </td>

                        <td className="  py-2 flex flex-col w-[180px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">
                            Seller
                          </h2>
                          <p className="font-semibold text-[14px]">
                            {item.seller_to_name}
                          </p>
                        </td>

                        <td className=" py-2 flex flex-col w-[85px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">
                            Amount
                          </h2>
                          <p className="font-semibold text-[14px] flex items-center">
                            {item.grand_total?.toFixed()}
                          </p>
                        </td>

                        <td className=" py-2 flex flex-col w-[120px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">
                            PO Type
                          </h2>
                          <p className="font-semibold text-[14px]">
                            {getPoTypeByIdAndType(
                              item.buyer_company_id,
                              item.invoice_mode
                            )}
                          </p>
                        </td>

                        <td className="  py-2 flex flex-col w-[120px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">
                            PO Number
                          </h2>
                          <p className="font-semibold text-[14px]">
                            {item.po_num}
                          </p>
                        </td>

                        <td className="  py-2 flex flex-col w-[140px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">
                            PO Date
                          </h2>
                          <p className="font-semibold text-[14px]">
                            {formatDate(item.po_date)}
                          </p>
                        </td>

                        <td className="  py-2 flex flex-col w-[90px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs text-center font-medium tracking-[2%]">
                            Inquiry Type
                          </h2>
                          {item.invoice_mode === "manual" ? (
                            <p className="font-semibold text-[14px] text-center">
                              -
                            </p>
                          ) : (
                            <p className="font-semibold text-[14px] text-center">
                              {item?.inq_type}
                            </p>
                          )}
                        </td>

                        <td className="  py-2 flex flex-col w-[90px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs text-center font-medium tracking-[2%]">
                            Status
                          </h2>
                          {item.invoice_mode === "manual" ? (
                            <p className="font-semibold text-[14px] text-center">
                              PO
                            </p>
                          ) : (
                            <p className="font-semibold text-[14px] text-center">
                              {item?.inquiry_details?.[0]?.status}
                            </p>
                          )}
                        </td>

                        <td className="  py-2 flex flex-col w-[70px]">
                          <h2 className="text-[#0A122A]/[.6] text-xs text-center font-medium tracking-[2%]">
                            Action
                          </h2>
                          {item.invoice_mode === "manual" ? (
                            <p className="text-center">-</p>
                          ) : (
                            <p
                              onClick={() =>
                                navigate(
                                  `/company/buying-inquiry-detail/${item?.inquiry_id}`
                                )
                              }
                              className="text-blue-600 underline font-semibold text-sm cursor-pointer"
                            >
                              Details
                            </p>
                          )}
                        </td>

                        <td className="py-2 flex flex-col items-center justify-center w-[40px] relative">
                          <div
                            onClick={() => toggleDropdown(index)}
                            className="cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </div>
                          {openDropdownIndex === index && (
                            <div
                              ref={dropdownRef}
                              className="absolute z-10 right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                            >
                              <div className="py-1">
                                {item?.buyer_company_id ===
                                  localStorage.getItem("myCompanyId") && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 focus:outline-none"
                                    onClick={() => handleEdit(item)}
                                  >
                                    Edit PO
                                  </button>
                                )}
                                {item?.invoice_mode !== "manual" && (
                                  <button className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 focus:outline-none">
                                    Repeat Inquiry
                                  </button>
                                )}
                                <button
                                  className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 focus:outline-none"
                                  onClick={() => handleViewInvoice(item)}
                                >
                                  View/Print PO
                                </button>
                                {item?.inquiry_details?.[0]?.status ===
                                  "delivered" && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 focus:outline-none"
                                    onClick={() =>
                                      handleReturnOrder(item.inquiry_id)
                                    }
                                  >
                                    Return Order
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>

          {/* <div className="mt-10">
                        <DatePicker />
                    </div> */}

          {reason && (
            <>
              <div
                class="relative z-10"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
              >
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                      <div class="bg-white pt-2">
                        <p className="text-gray-600 font-semibold mb-2 px-5">
                          Generate Your PO
                        </p>
                        <div className="bg-gray-100 px-5 py-5">
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Enter Your Prefix
                            </p>
                            <input
                              onChange={(e) => setPrefix(e.target.value)}
                              type="text"
                              name=""
                              id=""
                              className="w-full py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none ps-5"
                            />
                          </div>
                        </div>
                        <div class="bg-white pt-3 flex justify-end gap-3 px-5">
                          <button
                            onClick={handleOfReason}
                            type="button"
                            class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-xs font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={cancelSubmit}
                            type="button"
                            class="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0"
                          >
                            Ok
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {isOpen1 && (
            <div
              class="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white py-3">
                      <div class="flex flex-col items-center">
                        <img src={right} alt="" className="h-[80px]" />
                        <h3 className="font-semibold text-2xl mt-4">
                          PO Generated Successfully!
                        </h3>
                      </div>
                    </div>
                    <div class="bg-white mx-8 py-3">
                      <button
                        onClick={() => navigate("/company/select-po")}
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]"
                      >
                        Okay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {displayPo && (
        <div className="absolute left-0 top-0 z-10 w-full bg-black bg-opacity-30 h-[100vh] overflow-y-scroll">
          <div className="relative py-4">
            <div className="py-3">
              <div className="">
                {photoData?.design === "design1" && (
                  <Invoice1 data={photoData} />
                )}
                {photoData?.design === "design2" && (
                  <Invoice2 data={photoData} />
                )}
                {photoData?.design === "design3" && (
                  <Invoice3 data={photoData} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchasedata;
