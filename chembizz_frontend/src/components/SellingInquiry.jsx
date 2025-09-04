import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPlus, faSearch, faCloudArrowDown, faPrint, faShareNodes, faComment, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css';

// photos 
import inquiryLogo from "../images/progress-1.png"
import underReviewLogo from "../images/progress-2.png"
import proccess3 from "../images/progress-3.png"
import negotiationLogo from "../images/progress-4.png"
import dealLogo from "../images/progress-5.png"
import poLogo from "../images/progress-6.png"
import invoiceLogo from "../images/progress-7.png"
import dispatchLogo from "../images/progress-8.png"
import intransitLogo from "../images/progress-9.png"
import deleveredLogo from "../images/progress-10.png";
import rejectedLogo from "../images/cross-png.png";
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { useNotiContext } from '../context/NotificationContext';
import { BASE_URL } from '../BASE_URL';

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
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


const SellingInquiry = () => {

  const { socket } = useSocketContext();
  const { notifications, setNotifications } = useNotiContext();

  const [sellingInquiryList, setSellingInquiryList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    socket?.on("newNotification", (newMessage) => {
      fetchSellingInquiryList();
    });

    return () => socket?.off("newNotification");
  }, [socket, notifications, setNotifications]);

  useEffect(() => {
    socket?.on("newInquiry", (newInquiry) => {
      fetchSellingInquiryList()
      // setFilteredList((prev) => [...prev, newInquiry])
    });

    return () => socket?.off("newInquiry");
  }, [socket]);

  const fetchSellingInquiryList = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}api/inquiryRoutes/buyerCompanyAndSallerCompany/seller`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    setSellingInquiryList(data.data);
    setFilteredList(data.data);
  };

  useEffect(() => {
    fetchSellingInquiryList();
  }, []);

  const [activeLink, setActiveLink] = useState('all');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const datePickerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();

  const handleNavigate = (item) => {
    navigate(`/company/buying-inquiry-detail/${item._id}`);
  };

  // Filter the sellingInquiryList based on the activeLink
  const filteredInquiryList = sellingInquiryList.filter((item) => {
    if (activeLink === 'all') return true;
    if (activeLink === 'pending') return item.status === 'pending';
    if (activeLink === 'accepted') return item.status === 'approved';
    if (activeLink === 'rejected') return item.status === 'rejected';
    if (activeLink === 'sample inquiry') return item.inq_type === 'sample inquiry';
    if (activeLink === 'selling commercial inquiry') return item.inq_type === 'commercial';
    if (activeLink === 'expired') return item.status === 'Expired';
    return false;
  });

  const statusMap = {
    'Inquiry': ['Inquiry', 'Under Review', 'Negotiation'],
    'Under Review': ['Inquiry', 'Under Review', 'Negotiation'],
    'Negotiation': ['Under Review', 'Negotiation', 'Deal'],
    'Deal': ['Negotiation', 'Deal', 'Po'],
    'Po': ['Deal', 'Po', 'Invoice'],
    'Invoice': ['Po', 'Invoice', 'Dispatch'],
    'Dispatch': ['Invoice', 'Dispatch', 'In Transit'],
    'In Transit': ['Dispatch', 'In Transit', 'Delivered'],
    'Delivered': ['Dispatch', 'In Transit', 'Delivered']
  };

  const getStatusesToDisplay = (lastStatus, item) => {

    // Check if item status is 'cancel' or 'rejected'
    if (item?.status === 'cancel' || item?.status === 'rejected') {
      const inquiryStatuses = item?.inquiry_status?.[0]?.inquiry_status_value || [];

      // Return the names of the last three statuses from inquiryStatuses
      const lastThreeStatuses = inquiryStatuses.slice(-3).map(status => status.status);

      return lastThreeStatuses;
    }

    // Default case: return statuses based on statusMap
    const statuses = statusMap[lastStatus] || [];

    return statuses;
  };

  const sampleStatusMap = {
    'Inquiry': ['Inquiry', 'Under Review', 'Deal'],
    'Under Review': ['Inquiry', 'Under Review', 'Deal'],
    'Deal': ['Under Review', 'Deal', 'Po'],
    'Po': ['Deal', 'Po', 'Invoice'],
    'Invoice': ['Po', 'Invoice', 'Dispatch'],
    'Dispatch': ['Invoice', 'Dispatch', 'In Transit'],
    'In Transit': ['Dispatch', 'In Transit', 'Delivered'],
    'Delivered': ['Dispatch', 'In Transit', 'Delivered']
  };

  const getStatusesToDisplayForSample = (lastStatus, item) => {

    if (item?.status === 'cancel' || item?.status === 'rejected') {
      const inquiryStatuses = item?.inquiry_status?.[0]?.inquiry_status_value || [];

      const lastThreeStatuses = inquiryStatuses.slice(-3).map(status => status.status);

      return lastThreeStatuses;
    }

    // Default case: return statuses based on statusMap
    const statuses = sampleStatusMap[lastStatus] || [];

    return statuses;
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [datePickerRef]);

  useEffect(() => {
    setFilteredList(filteredInquiryList)
  }, [activeLink]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (new Date(e.target.value) > new Date(endDate)) {
      setEndDate('');
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleClear = () => {
    setFilteredList(filteredInquiryList)
    setStartDate('');
    setEndDate('');
  };

  const handleSearch = () => {
    const filtered = filteredInquiryList.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
    setFilteredList(filtered);
  };

  const [searchInput, setSearchInput] = useState("")

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase(); // Convert input value to lowercase
    setSearchInput(value); // Update the search input state
  };

  const imageFunction = (type) => {
    if (type === "Inquiry") {
      return inquiryLogo;
    } else if (type === "Under Review") {
      return underReviewLogo;
    } else if (type === "Deal") {
      return dealLogo;
    } else if (type === "Negotiation") {
      return negotiationLogo;
    } else if (type === "Po") {
      return poLogo;
    } else if (type === "Invoice") {
      return invoiceLogo;
    } else if (type === "Dispatch") {
      return dispatchLogo;
    } else if (type === "In Transit") {
      return intransitLogo;
    } else if (type === "Delivered") {
      return deleveredLogo;
    } else if (type === "Rejected" || type === "Cancel") {
      return rejectedLogo;
    }
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* <div className='w-full flex justify-center'>
      <img src={proccess4} alt="" />
    </div> */}
      <div className="flex flex-col p-2">
        <h1 className="md:text-3xl text-xl font-semibold">Sales Inquiry</h1>

        <div className="flex flex-wrap gap-4 mt-7 items-center">
          <div className="hidden sm:flex flex-wrap gap-7">
            <span
              className={`cursor-pointer pb-2 ${activeLink === 'all' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('all')}
            >
              All
              <span className="px-1 bg-slate-200 rounded-full text-xs ml-1">
                {sellingInquiryList?.filter((item) =>
                  item?.product?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length}
              </span>
            </span>
            <span
              className={`cursor-pointer pb-2 ${activeLink === 'pending' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('pending')}
            >
              Pending
              <span className="px-1 bg-slate-200 rounded-full text-xs ml-1">
                {sellingInquiryList?.filter(item =>
                  item.status === 'pending' &&
                  item?.product?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length}
              </span>
            </span>
            <span
              className={`cursor-pointer pb-2 ${activeLink === 'closed' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('closed')}
            >
              Closed
              <span className="px-1 bg-slate-200 rounded-full text-xs ml-1">
                {sellingInquiryList?.filter(item =>
                  item.status === 'delivered' &&
                  item?.product?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length}
              </span>
            </span>
            <span
              className={`cursor-pointer pb-2 ${activeLink === 'rejected' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('rejected')}
            >
              Rejected
              <span className="px-1 bg-slate-200 rounded-full text-xs ml-1">
                {sellingInquiryList?.filter(item =>
                  item.status === 'rejected' &&
                  item?.product?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length}
              </span>
            </span>
            <span
              className={`cursor-pointer pb-2 ${activeLink === 'sample inquiry' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('sample inquiry')}
            >
              Sample Inquiry
              <span className="px-1 bg-slate-200 rounded-full text-xs ml-1">
                {sellingInquiryList?.filter(item =>
                  item.inq_type === 'sample inquiry' &&
                  item?.product?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length}
              </span>
            </span>
            <span
              className={`cursor-pointer pb-2 ${activeLink === 'selling commercial inquiry' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('selling commercial inquiry')}
            >
              Commercial Inquiry
              <span className="px-1 bg-slate-200 rounded-full text-xs ml-1">
                {sellingInquiryList?.filter(item =>
                  item.inq_type === 'commercial' &&
                  item?.product?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length}
              </span>
            </span>
            <span
              className={`cursor-pointer pb-2 ${activeLink === 'expired' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('expired')}
            >
              Expired
              <span className="px-1 bg-slate-200 rounded-full text-xs ml-1">
                {sellingInquiryList?.filter(item =>
                  item.inq_type === 'expired' &&
                  item?.product?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length}
              </span>
            </span>
          </div>

          <div className="ml-auto flex justify-end">
            <div className="relative">
              <p
                className="sm:hidden block font-semibold text-sm rounded px-4 py-1 cursor-pointer"
              >
                Inquiry Type
              </p>
              <p
                className="hidden sm:block border border-black font-medium text-sm rounded px-4 py-1 cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                Select Date
              </p>
              {showDatePicker && (
                <div className="absolute shadow-lg rounded px-5 py-5 z-[11111111] bg-white left-[-100%] top-[100%]">
                  <div className="mb-2">
                    <p className="text-xs mb-1 font-semibold">Start Date</p>
                    <input
                      type="date"
                      className="text-sm border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-0"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div className="mb-2">
                    <p className="text-xs mb-1 font-semibold">End Date</p>
                    <input
                      type="date"
                      className="text-sm border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-0"
                      value={endDate}
                      onChange={handleEndDateChange}
                      min={startDate}
                    />
                  </div>
                  <div className="flex gap-2 justify-center mt-4">
                    <button
                      className="bg-gray-500 text-white rounded px-3 py-1 text-xs"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                    <button
                      className="bg-blue-500 text-white rounded px-3 py-1 text-xs"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className='sm:hidden flex justify-between items-center mt-2'>
          <p className='text-sm font-semibold'>
            {activeLink && activeLink?.charAt(0)?.toUpperCase() + activeLink?.slice(1)}
          </p>

          <select onChange={(e) => handleLinkClick(e.target.value)} name="" className='w-[150px] border border-gray-300 rounded-md px-1'>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
            <option value="sample inquiry">Sample Inquiry</option>
            <option value="commercial">Commercial Inquiry</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <hr className="my-4 border-t-2 border-gray-200" />

        <div className="flex gap-3 items-center relative">
          <FontAwesomeIcon icon={faSearch} className="absolute top-3 left-4" />
          <input
            value={searchInput}
            onChange={handleFilter}
            type="text"
            placeholder="Search..."
            className="bg-gray-100 w-[100%] text-gray-800 pl-10 py-2 outline-none rounded-md"
          />
        </div>

        <div className="grid 2xl:grid-cols-[1fr,1fr,1fr,1fr] xl:grid-cols-[1fr,1fr,1fr] lg:grid-cols-[1fr,1fr,1fr] md:grid-cols-[1fr,1fr] grid-cols-[1fr] gap-y-8 gap-x-5 mt-6 min-h-[100px]">
          {filteredList && [...filteredList].reverse()?.filter((e) => e?.product?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase()))?.map((item, index) => {
            const correctImageUrl = item?.product?.structure?.replace(`${BASE_URL}upload/${BASE_URL}upload/`, `${BASE_URL}upload/`);
            const lastStatus = item?.inquiry_status?.[0]?.inquiry_status_value.slice(-1)[0]?.status;
            const statusesToDisplay = getStatusesToDisplay(lastStatus, item);
            const statusesToDisplaySample = getStatusesToDisplayForSample(lastStatus);

            return (
              <div key={index} className="border-[3px] border-gray-200 rounded-[25px] py-4 cursor-pointer" onClick={() => handleNavigate(item)}>
                <div className='grid grid-cols-[1fr,1fr] sm:mb-0 mb-2 px-5'>
                  <div className="mr-4">
                    <img src={correctImageUrl} alt="" className="w-[100px] h-[100px]" />
                  </div>
                  <div className='mb-3'>
                    <h2 className='text-lg font-semibold mb-1'>{item?.product?.name_of_chemical?.slice(0, 10)}...</h2>
                    <p className='text-gray-500 text-xs mb-1'>CAS : {item?.product?.CAS_number}</p>
                    <p className='text-gray-500 text-xs mb-1'>{item?.buyer_company?.company_name.slice(0, 15)}</p>
                    {item?.inq_type === "sample inquiry" ? (
                      <p className='text-gray-500 text-xs'>Total Lot : {item.total_lot}</p>
                    ) : (
                      <p className='text-gray-500 text-xs'>Inq Qty : {item.inquiry_qty}{item.qty_type}</p>
                    )}
                    <div className='flex flex-col justify-end items-end '>
                      <div
                        className={`rounded-lg text-white text-xs px-3 py-1 mt-2 font-medium
                         ${item.status === 'pending' ? 'bg-yellow-500' :
                            item.status === 'approved' ? 'bg-blue-500' :
                              item.status === 'rejected' ? 'bg-red-500' :
                                item.status === 'cancel' ? 'bg-red-500' :
                                  item.status === 'negotiation' ? 'bg-orange-500' :
                                    item.status === 'po' ? 'bg-purple-500' :
                                      item.status === 'invoice' ? 'bg-teal-500' :
                                        item.status === 'dispatch' ? 'bg-indigo-500' :
                                          item.status === 'in transit' ? 'bg-pink-500' :
                                            item.status === 'delivered' ? 'bg-green-500' :
                                              item.status === 'deal done' ? 'bg-orange-300' :
                                                'bg-red-500'
                          } 
                          `}
                      >
                        {capitalizeFirstLetter(item.status)}</div>
                    </div>
                  </div>
                </div>

                <hr />

                <p className='text-xs text-end flex items-center ms-3 mt-2'><span className='font-medium'>Inquiry Date : &nbsp;</span> <span>{formatDate(item?.createdAt)}</span></p>
                <div className='mt-3 mx-10'>
                  {item?.inq_type === "sample inquiry" ? (
                    <div className='flex justify-between relative mb-2'>
                      {statusesToDisplaySample.map((status, statusIndex) => (
                        <div key={statusIndex} className='text-center relative'>
                          <img src={imageFunction(status)} alt="" className='py-1 px-1 bg-[#09BB44] text-white rounded-[50%] h-[30px]' />
                          <p className='text-[10px] font-medium absolute w-[90px] left-[-100%] text-center'>{status}</p>
                        </div>
                      ))}
                      <hr
                        className='absolute left-0 right-0 top-[42%] z-[-1]'
                        style={{
                          width: '100%',
                          height: '10px',
                          backgroundColor: `rgba(169, 169, 169, 0.5)`,
                          background: item?.inquiry_status?.[0]?.inquiry_status_value.length < 2
                            ? `linear-gradient(to right, #09BB44 0%, rgba(169, 169, 169, 0.5) 10%)`
                            : item?.inquiry_status?.[0]?.inquiry_status_value?.some((status) => status?.status === "Delivered" || status?.status === "Rejected" || status?.status === "Cancel")
                              ? `linear-gradient(to right, #09BB44 100%, rgba(169, 169, 169, 0.5) 100%)`
                              : `linear-gradient(to right, #09BB44 50%, rgba(169, 169, 169, 0.5) 50%)`
                        }}
                      />
                    </div>
                  ) : (
                    <div className='flex justify-between relative mb-2'>
                      {statusesToDisplay.map((status, statusIndex) => (
                        <div key={statusIndex} className='text-center relative'>
                          <img src={imageFunction(status)} alt="" className='py-1 px-1 bg-[#09BB44] text-white rounded-[50%] h-[30px]' />
                          <p className='text-[10px] font-medium absolute w-[90px] left-[-100%] text-center'>{status}</p>
                        </div>
                      ))}
                      <hr
                        className='absolute left-0 right-0 top-[42%] z-[-1]'
                        style={{
                          width: '100%',
                          height: '10px',
                          backgroundColor: `rgba(169, 169, 169, 0.5)`,
                          background: item?.inquiry_status?.[0]?.inquiry_status_value.length < 2
                            ? `linear-gradient(to right, #09BB44 0%, rgba(169, 169, 169, 0.5) 10%)`
                            : item?.inquiry_status?.[0]?.inquiry_status_value?.some((status) => status?.status === "Delivered" || status?.status === "Rejected" || status?.status === "Cancel")
                              ? `linear-gradient(to right, #09BB44 100%, rgba(169, 169, 169, 0.5) 100%)`
                              : `linear-gradient(to right, #09BB44 50%, rgba(169, 169, 169, 0.5) 50%)`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isOpen && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div class="bg-white py-3 ps-5">
                    <div class="sm:flex sm:items-start">
                      <h3 className='font-medium text-xl'>hyyyyy</h3>
                    </div>
                  </div>
                  <div class="bg-white flex justify-end mx-8 py-3">
                    <button onClick={closeModal} type="button" class="mt-3 inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Decline</button>
                    <button onClick={closeModal} type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4">Accept</button>
                    <button onClick={closeModal} type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4">Negotiate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SellingInquiry;
