import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFileImage, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css';

// photos 
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import chemical from "../images/chemical.png";
import companyLogo from "../images/companyLogo.jpg";
import telephone from "../images/telephone.png";
import phone from "../images/phone.png";
import mail from "../images/mail.png";
import cross from "../images/cross.png";
import companyProfile from "../images/companyProfile.png";
import right from "../images/right.png"
import invoice1 from "../images/invoice1.jpg"
import proccess1 from "../images/progress-1.png"
import proccess2 from "../images/progress-2.png"
import proccess3 from "../images/progress-3.png"
import proccess4 from "../images/progress-4.png"
import proccess5 from "../images/progress-5.png"
import proccess6 from "../images/progress-6.png"
import proccess7 from "../images/progress-7.png"
import proccess8 from "../images/progress-8.png"
import proccess9 from "../images/progress-9.png"
import proccess10 from "../images/progress-10.png"
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../BASE_URL';


const Message = () => {

  const [alreadyData, setAlreadyData] = useState("")
  const { _id } = useParams();


  const fetchSellingInquiryList = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/inquiryRoutes/inquiryDetailsForCompany/${_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()
    setAlreadyData(data.data[0]);
  }

  const [messageDisplay, setMessageDisplay] = useState([])

  const fetchMessage = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/chat/display/${_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()
    setMessageDisplay(data.data)
  }

  const [finalPaymentDetails, setFinalPaymentDetails] = useState("")

  const fetchFinalDetails = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/chat/displayNegotation/${_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()
    setFinalPaymentDetails(data.data);
  }

  useEffect(() => {
    fetchFinalDetails();
    fetchSellingInquiryList();
    fetchMessage();
  }, []);

  const [photos, setPhotos] = useState([])
  useEffect(() => {
    if (proccess1) {
      const array = [
        proccess1,
        proccess2,
        proccess3,
        proccess4,
        proccess5,
        proccess6,
        proccess7,
        proccess8,
        proccess9,
        proccess10,
      ]
      setPhotos(array)
    }

  }, [proccess1]);

  const [orderStatus, setOrderStatus] = useState("")

  const location = useLocation();

  useEffect(() => {
    if (location?.state?.orderStatus) {
      setOrderStatus(location.state?.orderStatus)
    }
  }, [location]);

  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false);

  const handlePopUp = () => {
    setIsOpen(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }


  const handleSubmit = () => {
    if (!updatedQuantity || !updatedQuantityType || !updatedFinalPrice || !updatedIncoTerms || !updatedPaymentTerm || !updatedDeliveryTime) {
      toast.error("Please Fill All FIelds", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    handleSendMessage()
    messageSend()
    setIsOpen(false)
  }

  const [dropdownStates, setDropdownStates] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(alreadyData?.status);

  useEffect(() => {
    setSelectedStatus(alreadyData?.status)
  }, [alreadyData]);

  const handleStatusSelection = (status) => {
    setSelectedStatus(status);
  };

  const handleCancelDropdown = () => {
    setDropdownStates(false)
  };

  const toggleDropdown = () => {
    setDropdownStates(true)
  };

  const handleApply = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      const response = await axios.put(
        `${BASE_URL}api/inquiryRoutes/updateStatus/${_id}`,

        {
          status: selectedStatus,
        },
        {
          headers: {
            'Authorization': token,
          },
        }
      );

      setDropdownStates(false)

      if (response.status === 200) {
        fetchSellingInquiryList();
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      } else {
        toast.error(response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      console.error("Error updating status:", error.message);
    }
  };

  const [sendRequest, setSendRequest] = useState(false)

  const messageSend = () => {
    setSendRequest(true)
  }

  const [isOpen1, setIsOpen1] = useState(false);

  const handleRequestCancle = () => {
    setIsOpen1(true)
    handleCancelRequest("denied")
  }

  const [requestDeny, setRequestDeny] = useState(false)
  const [reason, setReason] = useState(false)

  const reasonSubmit = () => {
    setRequestDeny(true)
    setReason(false)
    successOpen()
  }

  const reasonNotSubmit = () => {
    setReason(false)
  }

  const cancelYes = () => {
    setIsOpen1(false)
    setReason(true)
    // setRequestDeny(true)
  }

  const cancelNo = () => {
    setIsOpen1(false)
  }

  const myDats = location?.state;

  useEffect(() => {
    if (myDats) {
      setRequestApproved(true)
    }
  }, [myDats]);


  const [isOpen2, setIsOpen2] = useState(false);
  const [requestApproved, setRequestApproved] = useState(false);


  const handleRequestApprove = () => {
    setIsOpen2(true)
  }

  const approveYes = () => {
    setIsOpen2(false)
    setRequestApproved(true)
    handleCancelRequest("approved")
  }

  const approveNo = () => {
    setIsOpen2(false)
  }

  const [success, setSuccess] = useState(false)

  const successClose = () => {
    setSuccess(false)
    setDenied(true)
  }

  const successOpen = () => {
    setSuccess(true)
  }

  const [genrateInvoice, setGenrateInvoice] = useState(false)
  const [successGenrateInvoice, setSuccessGenrateInvoice] = useState(false)

  const handleNavigate = () => {
    setSuccessGenrateInvoice(false)
    setGenrateInvoice(false)
    navigate("/company/sales-data")
  }

  const [messageBoxOpen, setMessageBoxOpne] = useState(false)

  const [openApprove, setOpenApprove] = useState(false)
  const [denied, setDenied] = useState(false)



  const [currentStatusIndex, setCurrentStatusIndex] = useState(-1);

  const statuses = [
    'Inquiry',
    'Under Review',
    'Quotation',
    'Negotiation',
    'Deal',
    'PO',
    'Invoice',
    'Dispatch',
    'In Transit',
    'Delivered'
  ];

  useEffect(() => {
    if (orderStatus) {
      const index = statuses?.indexOf(orderStatus);
      setCurrentStatusIndex(index);
    }
  }, [orderStatus, statuses]);

  const percentComplete = currentStatusIndex >= 0 ? ((currentStatusIndex + 0.5) / statuses?.length) * 100 : 0;

  const [orderDispatch, setOrderDispatch] = useState(false)
  const [orderTransit, setOrderTransit] = useState(false)


  const [updatedQuantity, setUpdatedQuantity] = useState(0)
  const [updatedQuantityType, setUpdatedQuantityType] = useState("")
  const [updatedFinalPrice, setUpdatedFinalPrice] = useState("")
  const [updatedPaymentTerm, setUpdatedPaymentTerm] = useState("")
  const [updatedDeliveryTime, setUpdatedDeliveryTime] = useState("")
  const [updatedIncoTerms, setUpdatedIncoTerms] = useState("")

  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`

    let quantity;
    let quantitytype;
    let finalprice;
    let paymentterms;
    let deliverytime;
    let incoterms;

    if (updatedQuantity === 0) {
      quantity = 0;
      quantitytype = "";
      finalprice = null;
      paymentterms = "";
      deliverytime = "";
      incoterms = "";
    } else {
      quantity = updatedQuantity
      quantitytype = updatedQuantityType
      finalprice = updatedFinalPrice
      paymentterms = updatedPaymentTerm
      incoterms = updatedIncoTerms
    }

    if (updatedQuantity === 0) {
      try {
        const response = await axios.post(
          `${BASE_URL}api/chat/insert-chat`,
          {
            message: message,
            inquiryId: _id,
            receiverId: alreadyData?.seller_company?._id,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        fetchMessage();
        setMessage('');
        if (response.status === 200) {
        } else {

        }
      } catch (error) {
        // console.error("Error adding category:", error.response.data.message);
        // toast.error(error.response.data.message, {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        //   autoClose: 1000,
        // });
      }
    } else {
      try {
        const response = await axios.post(
          `${BASE_URL}api/chat/insert-chat`,
          {
            message: message,
            inquiryId: _id,
            receiverId: alreadyData?.seller_company?._id,
            quantity: quantity,
            quantity_type: quantitytype,
            final_price: finalprice,
            payment_terms: paymentterms,
            delivery_time: deliverytime,
            inco_terms: incoterms,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        fetchMessage();
        setMessage('');
        if (response.status === 200) {
        } else {

        }
      } catch (error) {
        // console.error("Error adding category:", error.response.data.message);
        // toast.error(error.response.data.message, {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        //   autoClose: 1000,
        // });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const [chatId, setChatId] = useState("")

  const handleCancelRequest = async (e) => {
    if (!chatId) {
      alert("chatId Not Found")
      return;
    }

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`

    try {
      const response = await axios.put(
        `${BASE_URL}api/chat/update-status/${finalPaymentDetails?._id}`,
        {
          inquiryId: finalPaymentDetails.inquiryId,
          receiverId: finalPaymentDetails.receiverId,
          senderId: finalPaymentDetails.senderId,
          request_status: e,
          chatId: chatId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
      } else {

      }
    } catch (error) {
      // console.error("Error adding category:", error.response.data.message);
      // toast.error(error.response.data.message, {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      //   autoClose: 1000,
      // });
    }

  }

  return (
    <div className="w-full   overflow-x-hidden">
      <div className="flex flex-col p-2">
        <h1 className="md:text-3xl text-xl font-semibold">Selling Inquiry</h1>
        <p className='text-sm text-gray-400 mt-2 mb-3'>Inquiry Id : {alreadyData?._id}</p>

        <div className="border-b-[2px] border-gray-300">
        </div>

        <ToastContainer />

        <div className=' mt-10 mb-10 flex flex-col items-center justify-center rounded-2xl w-full '>
          <div className='w-full h-full'>
            <div className='grid grid-cols-[3fr,1fr] gap-4 h-full'>
              <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-5'>
                <div className='w-full'>
                  <div className='rounded mb-8'>
                    <div className='grid grid-cols-[1fr,5fr,2fr]'>
                      <div className=''>
                        <img src={chemical} alt="" className='mb-2' />
                      </div>
                      <div className=''>
                        <h1 className='text-xl font-semibold mb-5'>{alreadyData?.product?.name_of_chemical}</h1>

                        <div className='flex mb-2'>
                          <p className='text-slate-500 text-sm w-[260px]' >CAS No: {alreadyData?.product?.CAS_number}</p>
                          <p className='text-slate-500 text-sm' >Category: {alreadyData?.category}</p>
                        </div>
                        <div className='flex mb-2'>
                          <p className='text-slate-500 text-sm w-[260px]' >Country Origin / Make: {alreadyData?.country_origin}</p>
                          <p className='text-slate-500 text-sm' >Sub-Category: {alreadyData?.subcategory}</p>
                        </div>
                        <div className='flex mb-2'>
                          <p className='text-slate-500 text-sm w-[260px]' >Purity: {alreadyData?.purity}</p>
                          {alreadyData?.grade !== "undefined" && (
                            <p className='text-slate-500 text-sm'>Grade: {alreadyData?.grade}</p>
                          )}
                        </div>
                        <div className='mb-2 flex'>
                          <p className='text-slate-500 text-sm w-[260px]' >Quantity: {alreadyData?.inquiry_qty}{alreadyData?.qty_type}</p>
                          <a href={alreadyData?.COA} target='_blank' className='text-sm text-blue-500 font-semibold underline'>COA</a>
                        </div>
                      </div>
                      <div className='flex flex-col justify-evenly items-end'>
                        <p className='font-medium text-sm'>Date : {alreadyData?.createdAt?.slice(0, 10)}</p>
                        <p className='font-medium text-sm'>Inquiry type : {alreadyData?.inq_type}</p>
                        {alreadyData?.status === "deal done" && (
                          <p className='font-medium text-sm'>Payment Status : <span className='bg-red-500 text-white rounded-xl px-2 py-1'>pending</span></p>
                        )}
                      </div>

                    </div>
                  </div>
                  <div className='border border-gray mb-5'></div>
                  <div className='rounded mb-5'>
                    <div className='grid grid-cols-[0.8fr,5fr]'>
                      <div className=''>
                        {/* <img src={companyLogo} alt="" className='mb-2' /> */}
                        {alreadyData?.other_info ? (
                          <img src={alreadyData?.other_info} alt="" className='mb-2' />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                            <p className="text-xl font-semibold text-gray-600">
                              {alreadyData?.buyer_company?.company_name.slice(0, 2).toUpperCase()}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className=''>
                        <div className='flex items-center justify-between mb-5'>
                          <h1 className='text-xl font-semibold'>Buyer Information</h1>
                          <p className='text-xl font-semibold' >{alreadyData?.buyer_company?.mode_of_business?.join("/")} </p>
                        </div>
                        <div className='flex gap-20 mb-2'>
                          <p className='text-slate-500 text-sm'>{alreadyData?.buyer_company?.company_name}</p>
                        </div>
                        <div className='flex gap-[73px] mb-2'>
                          <p className='text-slate-500 text-sm' >GST No: {alreadyData?.buyer_company?.gst}</p>
                        </div>
                        <div className='mt-3'>
                          <p className='border-2 border-[#0A122A]/[.3] flex gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={location} alt="" className='h-[20px]' /> {alreadyData?.buyer_company?.address} {alreadyData?.buyer_company?.city}, {alreadyData?.buyer_company?.state} {alreadyData?.buyer_company?.pincode}</p>
                          <div className='flex gap-5 mt-4'>
                            <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={telephone} alt="" className='h-[17px]' /> {alreadyData?.buyer_company?.landline_num}</p>
                            <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={phone} alt="" className='h-[17px]' /> {alreadyData?.buyer_company?.mobile_num}</p>
                            <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={mail} alt="" className='h-[14px]' /> {alreadyData?.buyer_company?.emailid} </p>
                            <p className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold text-sm'><img src={location} alt="" className='h-[20px]' /> {alreadyData?.buyer_company?.state}, {alreadyData?.buyer_company?.country}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {alreadyData?.status === ("approved" || "rejected") && (
                    <div className='flex justify-between relative mb-8 mx-5'>
                      {statuses.map((status, index) => {
                        const statusWidth = ((index) / statuses.length) * 100; // Width of the status bar
                        const isCompleted = percentComplete >= statusWidth; // Check if status is completed
                        return (
                          <div key={index} className={`text-center relative`}>
                            <img src={photos[index]} alt="" className={`py-2 px-2 bg-${isCompleted ? '[#09BB44]' : 'gray-400'} text-white rounded-[50%] h-[40px]`} />
                            <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] text-center'>{status}</p>
                            <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>10-{index + 12}-2024</p>
                          </div>
                        );
                      })}

                      {/* Gray line with changing color */}
                      <hr
                        className='absolute left-0 right-0 top-[42%] z-[-1]'
                        style={{
                          width: '100%',
                          height: '10px',
                          backgroundColor: `rgba(169, 169, 169, 0.5)`,
                          background: `linear-gradient(to right, #09BB44 ${percentComplete}%, rgba(169, 169, 169, 0.5) ${percentComplete}%)`
                        }} />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-5 pb-7  px-5 mb-5'>
                  <div className='flex justify-between mb-2'>
                    <div>
                      <p className='text-[#0A122A] text-sm'>Quantity :</p>
                    </div>
                    <p className='text-sm font-medium'>{alreadyData?.inquiry_qty}{alreadyData?.qty_type}</p>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <p className='text-[#0A122A] text-sm'>Payment Term :</p>
                    <p className='text-sm text-[#0A122A] font-medium'>{alreadyData?.payment_terms}</p>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <p className='text-[#0A122A] text-sm'>Delivery Time :</p>
                    <p className='text-sm text-[#0A122A] font-medium'>{alreadyData?.delivery_time}</p>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <p className='text-[#0A122A] text-sm'>Inco Terms :</p>
                    <p className='text-sm text-[#0A122A] font-medium'>{alreadyData?.inco_terms}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-[#0A122A] text-sm'></p>
                    <div className="relative">
                      <button
                        id="multiLevelDropdownButton"
                        onClick={() => toggleDropdown()}
                        className="flex items-center"
                        type="button"
                      >
                        <ul className={`rounded-lg ${alreadyData.status === 'pending' ? 'bg-yellow-300' :
                          alreadyData.status === 'approved' ? 'bg-green-300' :
                            alreadyData.status === 'rejected' ? 'bg-red-500' :
                            alreadyData.status === 'deal done' ? 'bg-green-500' :
                              alreadyData.status === 'Expired' ? 'bg-orange-300' :
                                'bg-red-500'
                          }`}>
                          <li
                            className={`text-sm font-medium py-1 px-2 `}
                          >
                            {alreadyData.status}
                          </li>
                        </ul>
                        {alreadyData.status !== "cancel" || alreadyData.status !== 'deal done'  && (
                          <svg
                            className="w-2.5 h-2.5 ms-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 4 4 4-4"
                            />
                          </svg>
                        )}
                      </button>

                      {dropdownStates && alreadyData.status !== "cancel" && (
                        <div
                          id="multi-dropdown"
                          className="z-10 absolute top-7 left-[-240%] mt-1 bg-white rounded-lg shadow-lg w-64">
                          <div className="py-3">
                            <h1 className="text-sm font-semibold px-3 mb-2">Change status</h1>
                            <div className="bg-blue-50 px-3 py-4">
                              {/* <p
                                className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'pending' ? 'bg-darkBlue text-white font-semibold' : ''
                                  }`}
                                onClick={() => handleStatusSelection('pending')}
                              >
                                PENDING
                              </p> */}
                              {alreadyData.status === "pending" && (
                                <p
                                  className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'approved' ? 'bg-darkBlue text-white font-semibold' : ''
                                    }`}
                                  onClick={() => handleStatusSelection('approved')}
                                >
                                  APPROVED
                                </p>
                              )}
                              {alreadyData.status === "pending" && (
                                <p
                                  className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'rejected' ? 'bg-darkBlue text-white font-semibold' : ''
                                    }`}
                                  onClick={() => handleStatusSelection('rejected')}
                                >
                                  REJECT
                                </p>
                              )}
                              {(alreadyData.status === "pending" || alreadyData.status === "approved" || alreadyData.status === "cancel") && (
                                <p
                                  className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'cancel' ? 'bg-darkBlue text-white font-semibold' : ''
                                    }`}
                                  onClick={() => handleStatusSelection('cancel')}
                                >
                                  CANCEL
                                </p>
                              )}
                            </div>
                            <div>
                              <div className="flex justify-end gap-4 pt-2 me-3">
                                <button className="text-sm font-medium" onClick={handleCancelDropdown}>Cancel</button>
                                <button
                                  className="text-sm font-medium text-green-300"
                                  onClick={handleApply}
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {orderStatus === "PO" ? (
                    <button onClick={() => setGenrateInvoice(true)} className='w-full mt-4 bg-darkBlue rounded-[15px] text-white text-sm py-2'>Generate Invoice</button>
                  ) : orderStatus === "Invoice" ? (
                    <>
                      <button className='w-full mt-4 bg-darkBlue rounded-[15px] text-white text-sm py-2' onClick={() => setOrderDispatch(true)}>Order Dispatch</button>
                    </>
                  ) : orderStatus === "In Transit Confirm" ? (
                    <>
                      <button className='w-full mt-4 bg-darkBlue rounded-[15px] text-white text-sm py-2' onClick={() => setOrderTransit(true)}>Order In Transit</button>
                    </>
                  ) : orderStatus === "In Transit" ? (
                    <>
                      <button className='w-full mt-4 bg-gray-400 rounded-[15px] font-semibold text-sm py-2'>Order In Transit</button>
                    </>
                  ) : orderStatus === "Delivered" ? (
                    <>
                      <button className='w-full mt-4 bg-gray-400 rounded-[15px] font-semibold text-sm py-2'>Order Delivered</button>
                    </>
                  ) : (
                    <>
                      {alreadyData.status === 'approved' && (
                        <p className='ms-auto mt-auto underline text-blue-600 text-sm cursor-pointer' onClick={handlePopUp} >Negotiation</p>
                      )}
                    </>
                  )}
                  <div>
                    {genrateInvoice && (
                      <>
                        <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                              <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                <div class="bg-white pt-2">
                                  <p className='text-gray-600 font-semibold mb-2 px-5'>Generate Your Invoice</p>
                                  <div className='bg-gray-100 px-5 py-5'>
                                    <div>
                                      <p className='text-sm font-medium text-gray-500'>Enter Your Prefix</p>
                                      <input type="text" name="" id="" className='w-full py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none ps-5' />
                                    </div>
                                    <div className='mt-3'>
                                      <p className='text-sm font-medium text-gray-500'>Add Your Remark</p>
                                      <textarea name="" id="" className='w-full py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none ps-5' rows="4"></textarea>
                                    </div>
                                    <div className='mt-3'>
                                      <p className='text-sm font-medium text-gray-500 mb-2'>Enter Your Final COA</p>
                                      <input name="cancel_check" type="file" className='file:bg-black file:text-white file:rounded border-2 border-gray-200 rounded-md shadow-sm py-1 px-3 w-full outline-none' />
                                    </div>
                                    <div className='mt-1'>
                                      <p className='text-sm text-blue-700 underline cursor-pointer'>Preview Invoice</p>
                                    </div>
                                  </div>
                                  <div class="bg-white pt-3 flex justify-end gap-3 px-5">
                                    <button onClick={() => setGenrateInvoice(false)} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                                    <button onClick={() => navigate("/company/edit-invoice")} type="button" class="inline-flex w-[70px] justify-center rounded-md bg-darkBlue py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Submit</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {successGenrateInvoice && (
                      <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75" onClick={() => setSuccessGenrateInvoice(false)}>
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
                          <div className="bg-white py-3 w-[400px]">
                            <div className="flex flex-col items-center">
                              <img src={right} alt="" className='h-[80px]' />
                              <h3 className='font-semibold text-xl mt-4 text-center'>Invoice Generated Successfully</h3>
                            </div>
                          </div>
                          <div className="bg-white mx-8 pb-3">
                            <button onClick={handleNavigate} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7  px-5'>
                  <h1 className='text-xl font-medium mb-2'>Inquiry Payment Details</h1>
                  <hr className='mb-3' />
                  <div className='flex justify-between mb-2'>
                    <div>
                      <p className='text-[#0A122A] text-sm'>Approx Price</p>
                    </div>
                    {requestApproved ? (
                      <>
                        <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>2000</p>
                      </>
                    ) : (
                      <>
                        <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{alreadyData?.min_price} - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{alreadyData?.max_price}</p>
                      </>
                    )}
                  </div>
                  <div className='flex justify-between mb-2'>
                    <p className='text-[#0A122A] text-sm'>Discount</p>
                    <p className='text-sm text-[#FA3434] flex items-center'>- <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>60.00</p>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <p className='text-[#0A122A] text-sm'>Tax</p>
                    <p className='text-sm text-[#00B517] flex items-center'>+ <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>14.00</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-[#0A122A] text-sm'>Delivery Charge</p>
                    <p className='text-sm text-[#00B517] flex items-center'>+ <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>14.00</p>
                  </div>
                  <div className='border my-3'></div>
                  <div className='flex justify-between'>
                    <p className='text-md font-semibold'>Total</p>
                    {requestApproved ? (
                      <>
                        <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>2000</p>
                      </>
                    ) : (
                      <>
                        <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{alreadyData?.min_price * alreadyData.inquiry_qty} - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{alreadyData?.max_price * alreadyData.inquiry_qty}</p>
                      </>
                    )}
                  </div>
                  {/* <div className='mt-3'>
                    <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg'>Submit Inquiry</button>
                  </div> */}
                </div>

                {finalPaymentDetails?.status === 'approved' || finalPaymentDetails?.status === 'cancel' && finalPaymentDetails?.status === 'denied' && (
                  <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7 mt-5 px-5'>
                    <h1 className='text-xl font-medium mb-2'>Final Payment Details</h1>
                    <hr className='mb-3' />
                    <div className='flex justify-between mb-2'>
                      <div>
                        <p className='text-[#0A122A] text-sm'>Price</p>
                      </div>
                      <p className='text-sm flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{finalPaymentDetails?.final_price}</p>

                    </div>
                    <div className='flex justify-between mb-2'>
                      <p className='text-[#0A122A] text-sm'>Discount</p>
                      <p className='text-sm text-[#FA3434] flex items-center'>-<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>60.00</p>
                    </div>
                    <div className='flex justify-between mb-2'>
                      <p className='text-[#0A122A] text-sm'>Tax</p>
                      <p className='text-sm text-[#00B517] flex items-center'>+<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>14.00</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='text-[#0A122A] text-sm'>Delivery Charge</p>
                      <p className='text-sm text-[#00B517] flex items-center'>+<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>14.00</p>
                    </div>
                    <div className='border my-3'></div>
                    <div className='flex justify-between'>
                      <p className='text-md font-semibold'>Total</p>
                      <p className='text-md font-semibold flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{finalPaymentDetails?.final_price}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <div class="bg-white py-3 ps-5">
                    <div class="sm:flex sm:items-start">
                      <h3 className='font-medium text-xl'>Upload Pricing Details</h3>
                    </div>
                  </div>
                  <div class="bg-gray-100 px-4 py-5 sm:px-6">
                    <div>
                      <div className='grid grid grid-cols-[1fr,1fr,1fr] gap-4 mb-5'>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Quantity</p>
                          <input
                            type="text"
                            className='bg-transparent outline-none border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1 w-full'
                            placeholder='Quantity'
                            onChange={(e) => setUpdatedQuantity(e.target.value)}
                            onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                            maxLength={5}
                          />
                        </div>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Type</p>
                          <select
                            className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3 w-full'
                            onChange={(e) => setUpdatedQuantityType(e.target.value)}
                          >
                            <option value="" disabled selected>Type</option>
                            <option value="kg" >Kg</option>
                            <option value="gm" >Gm</option>
                          </select>
                        </div>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Final Price</p>
                          <input
                            type="text"
                            className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1 w-full'
                            placeholder='Final Price'
                            onChange={(e) => setUpdatedFinalPrice(e.target.value)}
                            onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                            maxLength={5}
                          />
                        </div>
                      </div>
                      <div className='grid grid grid-cols-[1fr,1fr,1fr] gap-4 mb-5'>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Payment Term</p>
                          <select
                            className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3 w-full'
                            onChange={(e) => setUpdatedPaymentTerm(e.target.value)}
                          >
                            <option value="" selected disabled>Select Payment Term</option>
                            <option value="Advance">Advance</option>
                            <option value="Immediate">Immediate</option>
                            <option value="Credit (15 Days)">Credit (15 Days)</option>
                            <option value="Credit (30 Days)">Credit (30 Days)</option>
                            <option value="Credit (45 Days)">Credit (45 Days)</option>
                          </select>
                        </div>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Delivery Time</p>
                          <select
                            className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3 w-full'
                            onChange={(e) => setUpdatedDeliveryTime(e.target.value)}
                          >
                            <option value="" disabled selected>Select Delivery Time</option>
                            <option value="gm">Immediate</option>
                            <option value="gm">Delivery in 15 Days</option>
                            <option value="gm">Delivery in 30 Days</option>
                          </select>
                        </div>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Inco Terms</p>
                          <select
                            className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3 w-full'
                            onChange={(e) => setUpdatedIncoTerms(e.target.value)}
                          >
                            <option value="" disabled selected>Inco Terms</option>
                            <option value="EXW - Ex Works" >EXW - Ex Works</option>
                            <option value="FOB - Free on Board" >FOB - Free on Board</option>
                            <option value="CIF - Cost, insurance & Fright" >CIF - Cost, insurance & Fright</option>
                            <option value="DDP - Delivered Duty Paid" >DDP - Delivered Duty Paid</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white flex justify-end mx-8 py-3">
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={handleCancel}>Cancel</button>
                    <button type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4" onClick={handleSubmit}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* request deny  */}

        {isOpen1 && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={cross} alt="" className='h-[50px] bg-gray-200 px-3 py-3 rounded-full' />
                      <h3 className='font-semibold text-xl mt-4'>Are you sure you want to deny?</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-10 py-3">
                    <button onClick={cancelYes} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                    <button onClick={cancelNo} type="button" class="mt-2 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {orderDispatch && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={right} alt="" className='h-[80px] px-3 py-3 rounded-full' />
                      <h3 className='font-semibold text-xl'>Are you sure you want to Dispatch Order?</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-10 py-3">
                    <button onClick={() => { setOrderStatus("In Transit Confirm"), setOrderDispatch(false) }} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                    <button onClick={() => setOrderDispatch(false)} type="button" class="mt-2 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {orderTransit && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={right} alt="" className='h-[80px] px-3 py-3 rounded-full' />
                      <h3 className='font-semibold text-xl'>Are you sure you want to In Transit Order?</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-10 py-3">
                    <button onClick={() => { setOrderStatus("In Transit"), setOrderTransit(false) }} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                    <button onClick={() => setOrderTransit(false)} type="button" class="mt-2 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {reason && (
          <>
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white pt-2">
                      <p className='text-gray-600 font-semibold mb-2 px-5'>Give reason of denying?</p>
                      <div className='bg-gray-100 px-5 pt-3 pb-2'>
                        <textarea name="" id="" rows="3" className='bg-transparent w-full outline-none border-2 border-gray-200 rounded-md ps-3 pt-1 placeholder:text-sm' placeholder='Give reason of denying'></textarea>
                      </div>
                      <div class="bg-white pt-3 flex justify-end gap-3 mt-3 px-5">
                        <button onClick={reasonNotSubmit} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                        <button onClick={reasonSubmit} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* request deny end  */}

        {/*  success message end  */}

        {success && (
          <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75" onClick={successClose}>
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
              <div className="bg-white py-3 w-[400px]">
                <div className="flex flex-col items-center">
                  <img src={right} alt="" className='h-[80px]' />
                  <h3 className='font-semibold text-xl mt-4 text-center'>Submitted Successfully</h3>
                  <p className='mt-3 text-sm'>Your Deny Reason wan Submitted Successfully</p>
                </div>
              </div>
              <div className="bg-white mx-8 pb-3">
                <button onClick={successClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
              </div>
            </div>
          </div>
        )}
        {/* success message end  */}

        {/* request approved  */}

        {isOpen2 && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={cross} alt="" className='h-[50px] bg-gray-200 px-3 py-3 rounded-full' />
                      <h3 className='font-semibold text-xl mt-4'>Are you sure you want to approve?</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-10 py-3">
                    <button onClick={approveYes} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                    <button onClick={approveNo} type="button" class="mt-2 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* request approved end  */}

        {messageBoxOpen && (
          <div className='fixed bottom-[3%] right-[3%] z-[1] w-[40%]'>
            <div className='mt-10 flex flex-col items-center justify-center rounded-2xl'>
              <div className='w-full h-[90vh] bg-white'>
                <div className='h-full'>
                  <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-5'>
                    <div className='w-full h-full'>
                      <div className='h-full'>
                        <div className='h-full overflow-hidden'>
                          <div className='flex gap-3 items-center pb-4'>
                            {alreadyData?.other_info ? (
                              <img src={alreadyData?.other_info} alt="" className='mb-2' />
                            ) : (
                              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                <p className="text-xl font-semibold text-gray-600">
                                  {alreadyData?.buyer_company?.company_name.slice(0, 2).toUpperCase()}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className='text-lg font-semibold'>{alreadyData?.buyer_company?.company_name}</p>
                              <p className='text-sm'>Inquiry Id: {_id}</p>
                            </div>
                            {requestApproved ? (
                              <>
                                <p className='ms-auto underline text-white text-sm'>Negotiation</p>
                              </>
                            ) : (
                              <>
                                <p className='ms-auto underline text-blue-600 text-sm cursor-pointer' onClick={() => setIsOpen(true)}>Negotiation</p>
                              </>
                            )}
                            <FontAwesomeIcon icon={faAngleDown} className='text-xl cursor-pointer' onClick={() => setMessageBoxOpne(false)} />
                          </div>
                          <hr />
                          <div className='h-full relative'>
                            <div className='mt-5 flex flex-col overflow-scroll h-full pb-[30%]'>
                              {messageDisplay && messageDisplay.map((e) => (
                                <div key={e._id} className='mb-4'>
                                  {e.final_price > 0 ? (
                                    <div className='flex pb-[140px]'>
                                      <div className='bg-gray-200 rounded-2xl px-5 py-4'>
                                        <p className='text-[10px] text-gray-400 font-medium'>id: {e._id}</p>
                                        <p className='text-sm font-medium mb-1'>Request from {alreadyData?.buyer_company?.company_name}</p>
                                        <div className='border border-t-black'></div>
                                        <p className='font-medium text-[10px] text-gray-500 mt-1 mb-3'>Today, 8:33pm</p>
                                        <p className='text-sm font-medium mb-2'>Quantity : {e.quantity}{e.quantity_type}</p>
                                        <p className='text-sm font-medium mb-2 flex items-center'>Price : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>{e.final_price}</p>
                                        <p className='text-sm font-medium mb-2'>Payment Term : {e.payment_terms}</p>
                                        <p className='text-sm font-medium mb-2'>Delivery time : Intermediate</p>
                                        <p className='text-sm font-medium mb-2'>Inco Terms : {e.inco_terms}</p>
                                        {finalPaymentDetails?.request_status === "denied" ? (
                                          <button className='w-full bg-gray-400 rounded-[30px] py-[6px] text-sm mt-4'>Denied</button>
                                        ) : finalPaymentDetails?.request_status === "approved" ? (
                                          <button className='w-full border border-black bg-darkBlue text-white rounded-[30px] py-[6px] text-sm mt-4'>Approved</button>
                                        ) : finalPaymentDetails?.request_status === "cancel" ? (
                                          <>
                                            <button className='w-full rounded-[30px] py-[6px] text-sm mt-4 bg-gray-400'>Canceled</button>
                                          </>
                                        ) : (
                                          <div className='flex justify-between gap-3'>
                                            <button className='w-full border border-black rounded-[30px] py-[6px] text-sm mt-4' onClick={handleRequestCancle}>Deny</button>
                                            <button className='w-full border border-black bg-darkBlue text-white rounded-[30px] py-[6px] text-sm mt-4' onClick={() => { setIsOpen2(true); setChatId(e._id) }}>Approve</button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      {e.senderId === alreadyData.buyer_company._id ? (
                                        <div>
                                          <p className='text-sm bg-gray-100 inline px-5 py-2 rounded-xl'>{e.message}</p>
                                          <p className='text-xs mt-3 text-gray-400'>Today, 8:33pm</p>
                                        </div>
                                      ) : (
                                        <div className='text-end'>
                                          <p className='text-sm bg-sky-950 text-white inline px-5 py-2 rounded-xl'>{e.message}</p>
                                          <p className='text-xs mt-3 text-gray-400'>Today, 8:33pm</p>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                              {requestApproved && (
                                <div>
                                  <div className='flex justify-end'>
                                    <div className='bg-gray-200 rounded-2xl px-5 py-4'>
                                      <p className='text-[10px] text-gray-400 font-medium'>id:123</p>
                                      <p className='text-end text-sm font-medium mb-1'>Request from you</p>
                                      <div className='border border-t-black'></div>
                                      <p className='text-end font-medium text-[10px] text-gray-500 mt-1 mb-3'>Today, 8:33pm</p>
                                      <p className='text-end text-sm font-medium mb-2'>Quantity : 20kg</p>
                                      <p className='text-end text-sm font-medium mb-2 flex items-center'>Price : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>1500</p>
                                      <p className='text-end text-sm font-medium mb-2'>Payment Term : Advance</p>
                                      <p className='text-end text-sm font-medium mb-2'>Delivery time : Intermediate</p>
                                      <button className='w-full rounded-[30px] py-[6px] text-sm mt-4 bg-gray-400'>Canceled</button>
                                    </div>
                                  </div>
                                  <div className='flex justify-end'>
                                    <p className='text-sm bg-darkBlue text-white inline px-5 py-2 rounded-xl mt-3'>Request(id) was canceled by you.</p>
                                  </div>
                                  <div className='flex justify-end'>
                                    <p className='text-xs mt-3 text-gray-400'>Today, 8:33pm</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='absolute bottom-0 w-[94%] bg-white py-5 flex gap-2'>
                            <input
                              type="text"
                              value={message}
                              onChange={handleInputChange}
                              onKeyPress={handleKeyPress}
                              className='bg-gray-200 w-[97%] rounded-md ps-14 outline-none py-2'
                              placeholder='Type your message here'
                            />
                            <button
                              className='w-[10%] bg-sky-950 text-white py-1 rounded-md'
                              onClick={handleSendMessage}
                            >
                              <FontAwesomeIcon icon={faPaperPlane} className='text-white' />
                            </button>
                            <FontAwesomeIcon icon={faFileImage} className='absolute top-[38%] ms-5 text-lg' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {selectedStatus === ("approved" || "rejected") && (
          <div className='fixed bottom-[3%] right-[3%] w-[30%]'>
            <div className=' flex flex-col items-center justify-center rounded-2xl bg-white '>
              <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-3 px-4'>
                <div className='flex gap-3  items-center'>
                  {/* <img src={companyProfile} alt="" /> */}
                  {alreadyData?.other_info ? (
                    <img src={alreadyData?.other_info} alt="" className='mb-2' />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      <p className="text-xl font-semibold text-gray-600">
                        {alreadyData?.buyer_company?.company_name.slice(0, 2).toUpperCase()}
                      </p>
                    </div>
                  )}
                  <div className=''>
                    <p className='text-lg font-semibold'>{alreadyData?.buyer_company?.company_name}</p>
                    <p className='text-sm'>Inquiry Id: {_id}</p>
                  </div>
                  {requestApproved ? (
                    <></>
                  ) : (
                    <>
                      <p className='ms-auto underline text-blue-600 text-sm cursor-pointer' onClick={handlePopUp} >Negotiation</p>
                      <FontAwesomeIcon icon={faAngleUp} className='text-xl cursor-pointer' onClick={() => setMessageBoxOpne(true)} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Message;
