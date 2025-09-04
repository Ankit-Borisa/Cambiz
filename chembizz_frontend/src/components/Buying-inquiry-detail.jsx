import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFileImage, faAngleUp, faAngleDown, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import 'react-datepicker/dist/react-datepicker.css';

// photos 
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import chemical from "../images/chemical.png";
import telephone from "../images/telephone.png";
import phone from "../images/phone.png";
import mail from "../images/mail.png";
import cross from "../images/cross.png";
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
import proccess10 from "../images/progress-10.png";
import loaderImage from "../images/loading.png"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useSocketContext } from '../context/SocketContext';
import Invoice1 from './Invoice1';
import { AiOutlineUpload, AiOutlineClose } from 'react-icons/ai';
import InvoicePdf from './InvoicePdf';
import RupeesIcon from '../assets/Rupees';

// images 
import inquiryLogo from "../images/progress-1.png"
import underReviewLogo from "../images/progress-2.png"
import negotiationLogo from "../images/progress-4.png"
import dealLogo from "../images/progress-5.png"
import poLogo from "../images/progress-6.png"
import invoiceLogo from "../images/progress-7.png"
import dispatchLogo from "../images/progress-8.png"
import intransitLogo from "../images/progress-9.png"
import deleveredLogo from "../images/progress-10.png";
import rejectedLogo from "../images/cross-png.png";
import { DisplayContext } from '../context/PdfViewContext';
import { DisplayPoContext } from '../context/PoViewContext';
import Invoice2 from './Invoice2';
import Invoice3 from './Invoice3';
import InvoicePdf2 from './InvoicePdf2';
import InvoicePdf3 from './InvoicePdf3';
import exclamation from "../images/exclamation.png"
import { BASE_URL } from '../BASE_URL';
import generateRandomPrefix from '../utils/randomPrefix';

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    //   style: 'currency', 
    currency: 'INR',
    minimumFractionDigits: 2, // At least two decimal places
    maximumFractionDigits: 2 // No more than two decimal places
  }).format(price);
};

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


const Buying_inquiry_detail = () => {

  const { socket } = useSocketContext();

  const { _id } = useParams();

  const [userPost, setUserPost] = useState("");

  const [alreadyData, setAlreadyData] = useState({});

  const [shouldListen, setShouldListen] = useState(true);
  const [shouldListen2, setShouldListen2] = useState(true);
  const [inquiryStatus, setInquiryStatus] = useState('');

  const [negotiationStatus, setNegotiationStatus] = useState('')
  const [progresStatusSeller, setProgresStatusSeller] = useState('')
  const [visitDate, setVisitDate] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(inquiryStatus);

  const [packageExpire, setPackageExpire] = useState(false);
  const [notPremium, setNotPremium] = useState(false);

  const [statuses, setStatusArray] = useState([])

  useEffect(() => {
    socket?.on("statusChange", (newMessage) => {
      SellingInquiryList();
      setVisitDate(newMessage?.inquiry_status_value)
      setStatusArray(newMessage?.inquiry_status_value.map(item => item.status))
    });

    return () => socket?.off("statusChange");
  }, [socket, inquiryStatus]);

  useEffect(() => {
    socket?.on("newNotification", (newMessage) => {
      SellingInquiryList();
      fetchInquiryProgresStatus();
    });

    return () => socket?.off("newNotification");
  }, [socket]);

  useEffect(() => {
    socket?.on("poStatus", (status) => {
    });

    return () => socket?.off("poStatus");
  }, [socket]);

  useEffect(() => {
    socket?.on("invoiceStatus", (status) => {
    });

    return () => socket?.off("invoiceStatus");
  }, [socket]);

  const totalWidth = statuses.length * 10;

  const handleProgressInsert = async (e) => {

    if (statuses.some(status => status === "Cancel")) {
      return;
    }

    try {
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      const response = await axios.post(
        `${BASE_URL}api/inquiry_status/inquiry_status`,

        {
          status: e,
          inquiry_id: _id,
        },
        {
          headers: {
            'Authorization': token,
          },
        }
      );

      if (response.status === 200) {
        fetchInquiryProgresStatus()
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const fetchInquiryProgresStatus = async () => {

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`

    const res = await fetch(`${BASE_URL}api/inquiry_status/inquiry_status_display/${_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()

    const value = data?.data?.[0]?.inquiry_status_value

    setStatusArray(value.map(item => item.status))

    setVisitDate(value)

    const hasUnderReview = value?.some(visit => visit.status === 'Under Review');

    if (!hasUnderReview && userPost === "seller") {
      handleProgressInsert('Under Review')
    }

    // If none of the objects have a status of 'Under Review', set the progress status to 'Under Review'
    if (hasUnderReview && value.length < 3) {

    } else {
      const lastStatus = value[value.length - 1]?.status;
    }
  }

  useEffect(() => {
    fetchInquiryProgresStatus();
  }, []);

  useEffect(() => {
    fetchInquiryProgresStatus();
  }, [userPost]);

  const [prefixOpen, setPrefixOpen] = useState(false)
  const [prefix, setPrefix] = useState('')

  const useListenMessages = ({ messageDisplay, setMessageDisplay, setMessage }) => {
    const { socket } = useSocketContext();
    useEffect(() => {
      socket?.on("newMessage", (newMessage) => {
        SellingInquiryList();
        if (newMessage.inquiryId == _id) {
          fetchFinalDetails();
          setMessageDisplay([...messageDisplay, newMessage]);
        }
      });

      return () => socket?.off("newMessage");
    }, [socket, setMessageDisplay, messageDisplay, setMessage]);
  };

  const useListenStatus = ({ shouldListen, selectedStatus }) => {
    const { socket } = useSocketContext();
    useEffect(() => {
      socket?.on("statusChanged", (statusChanged) => {
        SellingInquiryList();
        if (statusChanged.inquiryId === _id) {
          setInquiryStatus(statusChanged?.status)
          fetchFinalDetails();
        }
      });

      return () => {
        socket?.off("statusChanged");
      };
    }, [socket, shouldListen, selectedStatus]);
  }

  const useListenApprove = ({ shouldListen, selectedStatus }) => {
    const { socket } = useSocketContext();

    useEffect(() => {
      socket?.on("negotiationStatus", (negotiationStatus) => {
        if (negotiationStatus.inquiryId === _id) {
          fetchMessage();
          SellingInquiryList();
          setNegotiationStatus(negotiationStatus?.request_status)
          fetchFinalDetails();
        }
      });

      return () => {
        socket?.off("negotiationStatus");
      };
    }, [socket, shouldListen, selectedStatus]);
  }

  const useListenOnlineUsers = () => {
    const { socket, setOnlineUsers, onlineUsers } = useSocketContext();

    useEffect(() => {
      socket?.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket?.off("getOnlineUsers");
    }, [socket, setOnlineUsers, onlineUsers]);
  };

  const [loader, setLoader] = useState(false)

  const { onlineUsers } = useSocketContext();

  const [CompanyId, setCompanyId] = useState("");
  const [receiverCompanyId, setRecieverCompanyId] = useState("");

  useEffect(() => {
    setCompanyId(localStorage.getItem('myCompanyId'));
  }, []);

  useEffect(() => {
    if (CompanyId === alreadyData?.buyer_company?._id) {
      setUserPost("buyer");
      setRecieverCompanyId(alreadyData?.seller_company?._id)
    }
    if (CompanyId === alreadyData?.seller_company?._id) {
      setRecieverCompanyId(alreadyData?.buyer_company?._id)
      setUserPost("seller");
    }
  }, [CompanyId, alreadyData]);

  const SellingInquiryList = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/inquiryRoutes/inquiryDetailsForCompany/${_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()

    setAlreadyData(data.data[0])
    setInquiryStatus(data?.data?.[0]?.status)
  }

  const [messageDisplay, setMessageDisplay] = useState([])
  const [message, setMessage] = useState('');
  useListenMessages({ messageDisplay, setMessageDisplay, setMessage })

  useListenOnlineUsers();

  const fetchMessage = async () => {
    let id;

    if (CompanyId === alreadyData?.buyer_company?._id) {
      id = alreadyData?.seller_company?._id;
    }
    if (CompanyId === alreadyData?.seller_company?._id) {
      id = alreadyData?.buyer_company?._id;
    }

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`

    if (_id) {
      const res = await fetch(`${BASE_URL}api/chat/display/${_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      const data = await res.json()
      setMessageDisplay(data.data)
    } else {

    }

  }

  useEffect(() => {
    fetchMessage();
  }, [alreadyData?.buyer_company?._id, alreadyData?.seller_company?._id]);

  const [finalPaymentDetails, setFinalPaymentDetails] = useState("")
  const [paymentHistory, setPaymentHistory] = useState([])
  const [finalPrice, setFinalPrice] = useState(0)

  const sumPrices = (arr) => {
    return arr.reduce((total, item) => {
      const price = parseFloat(item.paid_amount);
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  };

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
    setNegotiationStatus(data?.data?.request_status)

    const totalSum = sumPrices(paymentHistory);
    // console.log(totalSum)
    setFinalPrice(data.data?.final_price)
    if (paymentHistory.length > 0) {
      setTotalAmount(data.data?.final_price - totalSum)
    } else {
      setTotalAmount(data.data?.final_price)
    }

  }

  useEffect(() => {
    if (paymentHistory.length > 0) {
      const totalSum = sumPrices(paymentHistory);
      setTotalAmount(finalPrice - totalSum)
    } else {
      setTotalAmount(finalPrice)
    }
  }, [finalPrice, paymentHistory]);

  useEffect(() => {
    SellingInquiryList();
    fetchFinalDetails();
    fetchMessage();
  }, [_id]);

  useEffect(() => {
    fetchFinalDetails();
  }, [paymentHistory]);

  useEffect(() => {
    fetchFinalDetails();
  }, [inquiryStatus]);

  useEffect(() => {
    fetchMessage();
  }, [_id, setMessageDisplay]);

  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (proccess1) {
      const array = [
        proccess1,
        proccess2,
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

  const location = useLocation();

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
    setInquiryStatus("negotiation")
    fetchInquiryProgresStatus()
    setLoader(true)
    handleSendMessage()
  }

  const [dropdownStates, setDropdownStates] = useState(false);

  useEffect(() => {
    setSelectedStatus(inquiryStatus)
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

  const [loading, setLoading] = useState(false)

  const handleApply = async () => {

    setLoading(true)

    const membershipStatus = localStorage.getItem("membershipStatus")
    if (membershipStatus === "free") {
      setNotPremium(true)
    } else {

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


        if (response.status === 200) {
          setLoading(false)
          setDropdownStates(false)
          fetchInquiryProgresStatus()

          setShouldListen(true);
          SellingInquiryList();
          toast.success(response.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
        } else {
          setLoading(false)
          toast.error(response.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
        }
      } catch (error) {
        setLoading(false)
        console.error("Error updating status:", error);
        toast.error(error.response, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      }
    }
  };

  useListenStatus({ shouldListen, selectedStatus });
  useListenApprove({ shouldListen2, selectedStatus });

  const [isOpen1, setIsOpen1] = useState(false);
  const [reason, setReason] = useState(false)
  const [sendRequestCancel, setSendRequestCancel] = useState(false)

  const handleYes = () => {
    setIsOpen1(false)
    setReason(true)
  }

  const cancelNo = () => {
    setIsOpen1(false)
  }

  const cancelSubmit = () => {
    setReason(false)
    setSendRequestCancel(true)
    successOpen()
    approveYes()
  }

  const handleOfReason = () => {
    setReason(false)
  }

  const [success, setSuccess] = useState(false)

  const successClose = () => {
    setSuccess(false)
  }

  const successOpen = () => {
    setSuccess(true)
  }

  const [genratePo, setGenratePo] = useState(false)

  const genratePoClose = () => {
    setGenratePo(false)
  }

  const [isOpenPhoto, setIsOpenPhoto] = useState(false);
  const [successGenratePo, setSuccessGenratePo] = useState(false);

  const successGeneratePOclose = () => {
    setSuccessGenratePo(false)
    setGenratePo(false)
    navigate("/company/select-po")
  }

  const [currentStatusIndexForSeller, setCurrentStatusIndexForSeller] = useState(-1);
  const [currentStatusIndexForBuyer, setCurrentStatusIndexForBuyer] = useState(-1);

  useEffect(() => {
    if (visitDate && visitDate.length > 0) {
      setCurrentStatusIndexForSeller(visitDate.length - 1);
      setCurrentStatusIndexForBuyer(visitDate.length - 1);
    }
  }, [visitDate]);

  const percentCompleteForSeller = currentStatusIndexForSeller >= 0
    ? ((currentStatusIndexForSeller + 0.5) / statuses.length) * 100
    : 0;

  // Calculate the percentage of completion for the seller
  const percentCompleteForBuyer = currentStatusIndexForBuyer >= 0
    ? ((currentStatusIndexForBuyer + 0.5) / statuses.length) * 100
    : 0;

  const [deliveredSuccessfully, setDeliveredSuccessfully] = useState(false)

  const handleDelevered = () => {
    setDeliveredSuccessfully(false)
    // setOrderStatus("Delivered")
  }

  const [messageBoxOpen, setMessageBoxOpne] = useState(false)

  const handleDownload = () => {
    const chatContainer = document.getElementById('chat-container');

    // Store the current height and overflow style
    const originalHeight = chatContainer.style.height;
    const originalOverflow = chatContainer.style.overflow;

    // Temporarily expand chat to full height and remove scroll
    chatContainer.style.height = 'auto';
    chatContainer.style.overflow = 'visible';

    html2canvas(chatContainer)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();

        const margin = 10; // Set your desired margin (in mm)
        const imgWidth = 210 - 2 * margin; // A4 page width (210mm) minus margins
        const pageHeight = 295; // A4 page height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add the first page with margins
        pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin;

        // Add extra pages if content overflows
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
          heightLeft -= pageHeight - margin;
        }

        // Save the PDF
        pdf.save('chat.pdf');
      })
      .finally(() => {
        // Restore the original height and overflow style after the PDF is generated
        chatContainer.style.height = originalHeight;
        chatContainer.style.overflow = originalOverflow;
      });
  };


  const [openPaymentByStatus, setOpenPaymentByStatus] = useState(false)
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState(false)
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const [updatedQuantity, setUpdatedQuantity] = useState(0)
  const [updatedQuantityType, setUpdatedQuantityType] = useState("")
  const [updatedFinalPrice, setUpdatedFinalPrice] = useState("")
  const [updatedPaymentTerm, setUpdatedPaymentTerm] = useState("")
  const [updatedDeliveryTime, setUpdatedDeliveryTime] = useState("")
  const [updatedIncoTerms, setUpdatedIncoTerms] = useState("")

  const handleSendMessage = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`

    let id;

    if (CompanyId === alreadyData?.buyer_company?._id) {
      id = alreadyData?.seller_company?._id;
    }
    if (CompanyId === alreadyData?.seller_company?._id) {
      id = alreadyData?.buyer_company?._id;
    }

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
      deliverytime = updatedDeliveryTime
    }

    if (updatedQuantity === 0) {
      if (!message.trim()) {
        return;
      }
      try {
        const response = await axios.post(
          `${BASE_URL}api/chat/insert-chat`,
          {
            message: message,
            inquiryId: _id,
            receiverId: id,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        fetchFinalDetails()
        fetchMessage();
        setMessage('');
        setLoader(false)
        setUpdatedQuantity(0)
        setUpdatedQuantityType("")
        setUpdatedFinalPrice("")
        setUpdatedPaymentTerm("")
        setUpdatedDeliveryTime("")
        setUpdatedIncoTerms("")

        if (response.status === 200) {
          fetchInquiryProgresStatus()
        } else {

        }
      } catch (error) {

      }
    } else {
      try {
        const response = await axios.post(
          `${BASE_URL}api/chat/insert-chat`,
          {
            message: message,
            inquiryId: _id,
            receiverId: id,
            quantity: Number(quantity),
            quantity_type: quantitytype,
            final_price: Number(finalprice),
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

        setUpdatedQuantity(0)
        setUpdatedQuantityType("")
        setUpdatedFinalPrice("")
        setUpdatedPaymentTerm("")
        setUpdatedDeliveryTime("")
        setUpdatedIncoTerms("")

        fetchFinalDetails()
        fetchMessage();
        setIsOpen(false)
        setMessage('');
        setLoader(false)
        useListenStatus(shouldListen, "negotiation")
        if (response.status === 200) {
          fetchInquiryProgresStatus()
          fetchFinalDetails();
          toast.success("Negotiation Successfully Send", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
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

  const handleCancelRequest = async (e, id) => {

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    setLoader(true)
    try {
      const response = await axios.put(
        `${BASE_URL}api/chat/update-status/${finalPaymentDetails?._id}`,
        {
          inquiryId: _id,
          receiverId: finalPaymentDetails.receiverId,
          senderId: finalPaymentDetails.senderId,
          request_status: e,
          chatId: id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setLoader(false)
        fetchFinalDetails()
        setSelectedStatus("deal done")
        fetchMessage();
        setShouldListen2(true)
      } else {
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.error("Error adding category:", error);
    }

  }

  const [isOpen2, setIsOpen2] = useState(false);
  const [chatId, setChatId] = useState("")


  const approveYes = () => {
    if (isOpen2) {
      setIsOpen2(false)
      fetchInquiryProgresStatus()
      handleCancelRequest("approved", chatId)
    } else {
      handleCancelRequest("denied", chatId)
    }
  }

  const approveNo = () => {
    setIsOpen2(false)
  }

  const prefixSubmit = () => {
    let prefixValue= prefix

    if (!prefix) {
      prefixValue= generateRandomPrefix();
      setPrefix(prefixValue)
    }

    const finalPrefix = prefixValue + "_"

    navigate(`/company/generate-new-inquiry-po/${_id}`, { state: { abc: "PO", prefix: finalPrefix } })
  }

  const [genrateInvoice, setGenrateInvoice] = useState(false)

  const [invoicePrefix, setInvoicePrefix] = useState('')

  const handleInvoicePrefix = () => {

    let invoicePrefixValue= invoicePrefix

    if (!invoicePrefix) {
      invoicePrefixValue= generateRandomPrefix();
      setInvoicePrefix(invoicePrefixValue);
    }

    const finalPrefix = invoicePrefixValue + "_"

    navigate(`/company/generate-inquiry-invoice/${_id}`, { state: { abc: "Invoice", prefix: finalPrefix } })
  }

  const [statusDispatch, setStatusDispatch] = useState(false)
  const [statusTransit, setStatusTransit] = useState(false)
  const [deliveredForm, setDeliveredForm] = useState(false)
  const [randomNumbers, setRandomNumbers] = useState({ num1: 0, num2: 0 });
  const [userInput, setUserInput] = useState('');

  const handleGenerateNumber = () => {
    // Generate two random numbers below 50
    const num1 = Math.floor(Math.random() * 50);
    const num2 = Math.floor(Math.random() * 50);

    setRandomNumbers({ num1, num2 });
    setDeliveredForm(true);
  };

  const handleOkClick = () => {
    const sum = randomNumbers.num1 + randomNumbers.num2;


    if (parseInt(userInput) === sum) {
      setDeliveredForm(false); // Hide the form
      setDeliveredSuccessfully(true); // Or other success state/actions
      handleApply(); // Call handleApply with the status 'delivered'
    } else {
      toast.error('Inccorect Value!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const sumChange = (e) => {
    setUserInput(e.target.value);
    setSelectedStatus('delivered')
  };


  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    // Reset the input value to allow selecting the same file again
    document.getElementById('fileInput').value = '';
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  const handleDispatch = async () => {
    handleApply();
    setStatusDispatch(false)

    const invoice_id = alreadyData?.po_data?.[1]?._id;

    if (alreadyData?.inq_type === "sample inquiry") {
      try {
        const formData = new FormData();
        formData.append('lori_copy', selectedFile);

        const token = `Bearer ${localStorage.getItem('chemicalToken')}`;
        const response = await axios.put(
          `${BASE_URL}api/salesInvoice/update_lori_copy/${invoice_id}`,
          formData,
          {
            headers: {
              'Authorization': token,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status === 200) {

        }

      } catch (error) {
        console.error('Error updating status:', error);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append('lr_copy', selectedFile);

        const token = `Bearer ${localStorage.getItem('chemicalToken')}`;
        const response = await axios.put(
          `${BASE_URL}api/salesInvoice/update_lr_copy/${invoice_id}`,
          formData,
          {
            headers: {
              'Authorization': token,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status === 200) {

        }

      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  const handleTransit = () => {
    setSelectedStatus('in transit');
    handleApply();
    setStatusTransit(false)
  }

  const [totalAmount, setTotalAmount] = useState(null)
  const [paidAmount, setPaidAmount] = useState(null)
  const [paymentTerm, setPaymentTerm] = useState("")

  const handleInsertPayment = async () => {
    if (!paidAmount) {
      toast.error('Please Enter Amount', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!paymentTerm) {
      toast.error('Please Select Payment Terms', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if(paidAmount > totalAmount){
      toast.error("Paid amount can't exceed total", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    try {
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      const response = await axios.post(
        `${BASE_URL}api/payment/insertPayment`,

        {
          paid_amount: paidAmount,
          payment_mode: paymentTerm,
          inquiry_id: _id
        },
        {
          headers: {
            'Authorization': token,
          },
        }
      );


      if (response.status === 200) {
        setOpenPaymentByStatus(false)
        setPaymentSuccessMessage(true)
        fetchPaymentHistory()
        setPaidAmount(null)
        setPaymentTerm('')
        toast.success('Payment Details Added Successfully', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const fetchPaymentHistory = async () => {

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`

    const res = await fetch(`${BASE_URL}api/payment/displayList?inquiry_id=${_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json();

    setPaymentHistory(data.data)
    fetchFinalDetails()
  }

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const [returnQuantity, setReturnQuantity] = useState('')
  const [returnQuantityType, setReturnQuantityType] = useState('')


  const handleReturnOrder = async () => {

    if (!returnQuantity) {
      toast.error("Please Enter Quantity", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!returnQuantityType) {
      toast.error("Please Select Quantity Type", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    const inquiryQty = parseFloat(alreadyData?.inquiry_qty);
    const returnQty = parseFloat(returnQuantity);

    if (isNaN(inquiryQty) || isNaN(returnQty)) {
      toast.error("Invalid quantity values", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (returnQty > inquiryQty && alreadyData?.qty_type === returnQuantityType) {
      toast.error(`Quantity cannot exceed ${inquiryQty} ${alreadyData?.qty_type}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (returnQty > inquiryQty && alreadyData?.qty_type !== returnQuantityType) {
      toast.error(`Quantity Type Should Be ${alreadyData?.qty_type}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    try {
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      const response = await axios.post(
        `${BASE_URL}api/return_order/create_return_order`,

        {
          seller_id: alreadyData?.seller_company?._id,
          total_return_qty: returnQuantity,
          qty_type: returnQuantityType,
          total_return_amount: finalPaymentDetails?.final_price,
          inquiry_id: _id
        },
        {
          headers: {
            'Authorization': token,
          },
        }
      );


      if (response.status === 200) {
        navigate(-1)
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const [poDisplay, setPoDisplay] = useState(false)
  const [invoiceDisplay, setInvoiceDisplay] = useState(false)
  const [sendData, setSendData] = useState("")

  const { display, setDisplay } = useContext(DisplayContext);
  const { displayPo, setDisplayPo } = useContext(DisplayPoContext);

  const handleSeePo = () => {
    setSendData(alreadyData?.po_data?.[0])
    setDisplayPo(true)
    // setPoDisplay(true)
  }

  const handleSeeInvoice = () => {
    setSendData(alreadyData?.po_data?.[1])
    setDisplay(true)
  }

  const handleOpenCoa = () => {
    const url = alreadyData?.po_data?.[1]?.upload_COA;

    let fullUrl = url;

    // Ensure the URL is absolute
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'http://' + url; // or use 'https://' as needed
    }

    if (fullUrl) {
      window.open(fullUrl, '_blank');
    } else {

    }
  }

  const handleCheckLr = () => {
    let url;
    if (alreadyData?.inq_type === "commercial") {
      url = alreadyData?.po_data?.[1]?.lr_copy;
    } else {
      url = alreadyData?.po_data?.[1]?.lori_copy;
    }

    let fullUrl = url;

    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'http://' + url; // or use 'https://' as needed
    }

    if (fullUrl) {
      window.open(url, '_blank');
    } else {

    }
  }

  const handlePaymentOfSampleInquiry = () => {
    navigate("/company/checkout")
  }

  const [onePrice, setOnePrice] = useState(null)

  const handlePriceChange = (e) => {
    if (!updatedQuantity) {
      return;
    }
    const data = e.target.value;
    setOnePrice(data)
    setUpdatedFinalPrice(e.target.value * updatedQuantity)
  }

  const handleQuantityChange = (e) => {
    setUpdatedQuantity(e.target.value)
    setUpdatedFinalPrice(e.target.value * onePrice)
  }


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

  const handleNavigatePackage = () => {
    navigate("/company/packages")
  }

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleCancelDropdown(); // Call your function to close the dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full   overflow-x-hidden">
      <div className="flex flex-col p-2 pb-14">
        {userPost === "buyer" && (
          <h1 className="md:text-3xl text-xl font-semibold">Buying Inquiry</h1>
        )}
        {userPost === "seller" && (
          <h1 className="md:text-3xl text-xl font-semibold">Sales Inquiry</h1>
        )}
        <p className='text-sm text-gray-400 mt-2 mb-3'>Inquiry ID : {_id}</p>

        <div className="border-b-[2px] border-gray-300">
        </div>

        <ToastContainer />

        <div className=' mt-10 mb-10 flex flex-col items-center justify-center rounded-2xl w-full '>
          <div className='w-full h-full'>
            <div className='grid 2xl:grid-cols-[3fr,1fr] xl:grid-cols-[2.7fr,1fr] lg:grid-cols-[2.3fr,1.3fr] gap-4 h-full'>
              <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-5'>
                <div className='w-full'>
                  <div className='rounded mb-8'>
                    <div className='grid sm:grid-cols-[2fr,5fr,3.5fr] grid-cols-[1fr]'>
                      <div className='sm:block hidden'>
                        <img src={chemical} alt="" className='mb-2' />
                      </div>
                      <div className=''>
                        <h1 className='text-md font-semibold mb-2'>{alreadyData?.product?.name_of_chemical[0].toUpperCase() + alreadyData?.product?.name_of_chemical.slice(1)}</h1>

                        <div className='xl:flex block xl:mb-2'>
                          <p className='text-slate-500 w-[220px] sm:text-sm text-xs' >CAS No: {alreadyData?.product?.CAS_number}</p>
                          <p className='text-slate-500 sm:text-sm text-xs  ' >Category: {alreadyData?.category}</p>
                        </div>
                        <div className='xl:flex block xl:mb-2'>
                          {alreadyData.inq_type === "commercial" ? (
                            <p className='text-slate-500 sm:text-sm text-xs w-[220px]'>Quantity: {alreadyData?.inquiry_qty}{alreadyData?.qty_type}</p>
                          ) : (
                            <p className='text-slate-500 sm:text-sm text-xs w-[220px]'>One Lot Quantity: {alreadyData?.one_lot_qty}{alreadyData?.one_lot_qty_type}</p>
                          )}
                          <p className='text-slate-500 sm:text-sm text-xs'>Sub-Category: {alreadyData?.subcategory ? alreadyData.subcategory : "-"}</p>
                        </div>
                        <div className='xl:flex block xl:mb-2'>
                          <p className='text-slate-500 sm:text-sm text-xs w-[220px]'>Purity: {alreadyData?.purity}</p>
                          <p className='text-slate-500 sm:text-sm text-xs'>Grade: {alreadyData?.grade === 'undefined' ? "-" : alreadyData?.grade}</p>
                        </div>

                        <div className='xl:flex block xl:mb-2'>
                          <p className='text-slate-500 sm:text-sm text-xs  w-[220px]' >Country of Origin: {alreadyData?.country_origin}</p>
                          <a href={alreadyData?.COA} target='_blank' className='sm:text-sm text-xs text-blue-500 font-semibold underline'>COA</a>
                        </div>
                        {alreadyData && alreadyData?.po_data?.length > 0 && (
                          <div className='flex flex-wrap gap-3 items-center'>
                            <p className='text-slate-500 sm:text-sm text-xs font-semibold w-auto md:w-auto'>Generated Documents :</p>
                            <p
                              className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs cursor-pointer hover:bg-darkBlue hover:text-white w-auto md:w-auto'
                              onClick={handleSeePo}
                            >
                              PO
                            </p>
                            {alreadyData && alreadyData?.po_data?.length > 1 && (
                              <p
                                className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs cursor-pointer hover:bg-darkBlue hover:text-white w-auto md:w-auto'
                                onClick={handleSeeInvoice}
                              >
                                Invoice
                              </p>
                            )}
                            {alreadyData && alreadyData?.po_data?.[1]?.upload_COA && (
                              <p
                                className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs cursor-pointer hover:bg-darkBlue hover:text-white w-auto md:w-auto'
                                onClick={handleOpenCoa}
                              >
                                COA
                              </p>
                            )}
                            {alreadyData?.po_data?.[1]?.lr_copy && (
                              <p
                                className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs cursor-pointer hover:bg-darkBlue hover:text-white w-auto md:w-auto'
                                onClick={handleCheckLr}
                              >
                                LR
                              </p>
                            )}
                            {alreadyData?.po_data?.[1]?.lori_copy && (
                              <p
                                className='border-2 border-[#0A122A]/[.3] flex items-center gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs cursor-pointer hover:bg-darkBlue hover:text-white w-auto md:w-auto'
                                onClick={handleCheckLr}
                              >
                                Lori Reciept
                              </p>
                            )}
                          </div>
                        )}

                      </div>
                      <div className='flex flex-col justify-evenly'>
                        <p className='font-medium sm:text-sm text-xs sm:text-right text-left'>Date : {formatDate(alreadyData?.createdAt)}</p>
                        <p className='font-medium sm:text-sm text-xs sm:text-right text-left'>Inquiry Type : {capitalizeFirstLetter(alreadyData?.inq_type)}</p>
                        {alreadyData?.inq_type === "commercial" && (<>
                          {inquiryStatus !== "pending" && inquiryStatus !== "rejected" && inquiryStatus !== "cancel" && inquiryStatus !== "approved" && (
                            <>
                              {userPost === "buyer" && (
                                <p className='font-medium text-blue-500 text-right underline cursor-pointer text-[14px]' onClick={() => navigate("/company/delete-inquiries", { state: { productId: alreadyData?.product?._id, data: alreadyData?.inquiry_id } })}>Delete Other Inquiries Of Same Chemical</p>
                              )}
                              {Number(finalPrice) === Number(sumPrices(paymentHistory)) ? (
                                <p className='font-medium sm:text-sm text-xs text-right'>Payment Status :
                                  <span className='bg-green-500 text-white rounded-xl px-2 py-1 ms-2'>Paid</span>
                                </p>
                              ) : (
                                <p className='font-medium sm:text-sm text-xs text-right'>Payment Status :
                                  {userPost !== "seller" && (
                                    <span className='text-white bg-blue-600 px-1 cursor-pointer ' onClick={() => setOpenPaymentByStatus(true)}>+</span>
                                  )}
                                  <span className='bg-red-500 text-white rounded-xl px-2 py-1'>Pending</span>
                                </p>
                              )}
                            </>
                          )}
                        </>)}

                      </div>
                    </div>
                  </div>
                  <div className='border border-gray mb-5'></div>

                  <div className='rounded mb-10'>
                    <div className='grid grid-cols-[0.8fr,5fr]'>
                      {userPost === "buyer" && (
                        <div className='sm:block hidden'>
                          {alreadyData?.seller_company?.seller_other_info?.length !== 0 && alreadyData?.seller_company?.seller_other_info?.[0]?.logo !== "" ? (
                            <a href={`/company-profile/${alreadyData?.seller_company?._id}`} target='_blank' className='cursor-pointer'>
                              <img src={alreadyData?.seller_company?.seller_other_info?.[0]?.logo} alt="" className='mb-2 h-[80px] w-[80px] object-cover rounded-full' />
                            </a>
                          ) : (
                            <a href={`/company-profile/${alreadyData?.seller_company?._id}`} target='_blank' className='cursor-pointer'>
                              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                <p className="text-xl font-semibold text-gray-600">
                                  {alreadyData?.seller_company?.company_name.slice(0, 2).toUpperCase()}
                                </p>
                              </div>
                            </a>
                          )}
                        </div>
                      )}

                      {userPost === "seller" && (
                        <div className='sm:block hidden'>
                          {alreadyData?.buyer_company?.buyer_other_info?.length !== 0 && alreadyData?.buyer_company?.buyer_other_info?.[0]?.logo !== "" ? (
                            <a href={`/company-profile/${alreadyData?.buyer_company?._id}`} target='_blank' className='cursor-pointer'>
                              <img src={alreadyData?.buyer_company?.buyer_other_info?.[0]?.logo} alt="" className='mb-2 h-[80px] w-[80px] object-cover rounded-full' />
                            </a>

                          ) : (
                            <a href={`/company-profile/${alreadyData?.buyer_company?._id}`} target='_blank' className='cursor-pointer'>
                              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                <p className="text-xl font-semibold text-gray-600">
                                  {alreadyData?.buyer_company?.company_name.slice(0, 2).toUpperCase()}
                                </p>
                              </div>
                            </a>
                          )}
                        </div>
                      )}
                      <div className=''>
                        <div className='flex items-center justify-between mb-1'>
                          <h1 className='sm:text-md text-sm font-semibold'>{userPost === "buyer" ? "Seller Information" : "Buyer Information"}</h1>
                          <p className='sm:text-xl text-xs sm:block hidden font-semibold'>
                            {
                              (userPost === "seller"
                                ? alreadyData?.buyer_company?.mode_of_business
                                : alreadyData?.seller_company?.mode_of_business)?.map(value=> value=="manufacture"?"Manufacturer":capitalizeFirstLetter(value)).join('/')
                            }
                          </p>
                        </div>
                        <div className='sm:flex block items-center mb-2'>
                          {userPost === "buyer" && (
                            <a href={`/company-profile/${alreadyData?.seller_company?._id}`} className='cursor-pointer' target='_blank'>
                              <p className='text-sm font-medium border-none sm:border-r-[3px] sm:pe-3 pe-0 sm:border-gray-400' >{alreadyData?.seller_company?.company_name}</p>
                            </a>
                          )}
                          {userPost === "seller" && (
                            <a href={`/company-profile/${alreadyData?.buyer_company?._id}`} className='cursor-pointer' target='_blank'>
                              <p className='text-sm font-medium border-none sm:border-r-[3px] sm:pe-3 pe-0 sm:border-gray-400'>
                                {alreadyData?.buyer_company?.company_name}
                              </p>
                            </a>
                          )}
                          <p className='text-slate-500 sm:text-sm text-xs sm:ps-3' >GST No: {userPost === "seller" ? alreadyData?.buyer_company?.gst : alreadyData?.seller_company?.gst}</p>
                        </div>
                        <div className='mt-3'>
                          <p className='border-2 border-[#0A122A]/[.3] flex gap-2 rounded-md py-1 px-2 text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs'><img src={location} alt="" className='h-[20px]' /> {userPost === "seller" ? alreadyData?.buyer_company?.address : alreadyData?.seller_company?.address} {userPost === "seller" ? alreadyData?.buyer_company?.city : alreadyData?.seller_company?.city}, {userPost === "seller" ? alreadyData?.buyer_company?.state : alreadyData?.seller_company?.state} {userPost === "seller" ? alreadyData?.buyer_company?.pincode : alreadyData?.seller_company?.pincode}</p>
                          <div className='flex flex-wrap gap-5 mt-4'>
                            <p className='flex items-center gap-2 rounded-md py-1 px-2 border-2 border-[#0A122A]/[.3] text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs'>
                              <img src={telephone} alt="" className='sm:h-[17px] h-[14px]' />
                              {userPost === "seller" ? alreadyData?.buyer_company?.landline_num : alreadyData?.seller_company?.landline_num}
                            </p>
                            <p className='flex items-center gap-2 rounded-md py-1 px-2 border-2 border-[#0A122A]/[.3] text-[#0A122A99]/[.6] font-semibold text-sm'>
                              <img src={phone} alt="" className='sm:h-[17px] h-[14px]' />
                              {userPost === "seller" ? alreadyData?.buyer_company?.mobile_num : alreadyData?.seller_company?.mobile_num}
                            </p>
                            <p className='flex items-center gap-2 rounded-md py-1 ps-2 sm:pe-2 pe-5 border-2 border-[#0A122A]/[.3] text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs w-auto truncate max-w-[280px]'>
                              <img src={mail} alt="" className='sm:h-[14px] h-[11px]' />
                              {userPost === "seller" ? alreadyData?.buyer_company?.emailid : alreadyData?.seller_company?.emailid}
                            </p>
                            <p className='flex items-center gap-2 rounded-md py-1 px-2 border-2 border-[#0A122A]/[.3] text-[#0A122A99]/[.6] font-semibold sm:text-sm text-xs'>
                              <img src={location} alt="" className='h-[20px]' />
                              {userPost === "seller" ? alreadyData?.buyer_company?.state : alreadyData?.seller_company?.state}, {userPost === "seller" ? alreadyData?.buyer_company?.country : alreadyData?.seller_company?.country}
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  {inquiryStatus !== "pending" && inquiryStatus !== 'rejected' && inquiryStatus !== "approved" && (
                    <>
                      {alreadyData?.inq_type === "commercial" && (
                        <div className='flex justify-end mb-5'>
                          <span
                            className='text-gray-500 border border-black rounded-md px-3 py-2 text-xs font-semibold cursor-pointer'
                            onClick={toggleVisibility}
                          >
                            <FontAwesomeIcon icon={isVisible ? faChevronUp : faChevronDown} /> View Transaction History
                          </span>
                        </div>
                      )}
                      {isVisible && (
                        <div className="mb-10 border-2 border-gray-200 rounded-3xl px-5 py-5">
                          <h3 className='text-xl font-semibold'>Transaction History</h3>
                          <table style={{ border: "none" }} className="table-auto w-full border-0">
                            <tbody>
                              {paymentHistory && paymentHistory.map((item, index) => (
                                <React.Fragment key={index}>
                                  <tr className={`flex py-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                    <td className="text-center py-2 flex flex-col sm:justify-center justify-start font-semibold w-[7%]">
                                      {index + 1}
                                    </td>
                                    <td className="py-2 flex flex-col w-[20%]">
                                      <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Paid Amount</h2>
                                      <p className='font-semibold text-[14px]'>{item?.paid_amount}</p>
                                    </td>
                                    <td className=" py-2 flex flex-col w-[20%]">
                                      <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Payment Mode</h2>
                                      <p className='font-semibold text-[14px] flex items-center'>{item?.payment_mode}</p>
                                    </td>
                                    <td className=" py-2 flex flex-col w-[20%]">
                                      <h2 className="text-[#0A122A]/[.6] text-xs font-medium tracking-[2%]">Payment Date</h2>
                                      <p className='font-semibold text-[14px]'>{formatDate(item?.createdAt)}</p>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}

                  {userPost === 'seller' ? (
                    <div className='overflow-x-auto sm:overflow-x-visible'>
                      <div className={`flex justify-between relative mb-8 mx-5 w-[${totalWidth}%]`}>
                        {statuses.map((status, index) => {
                          const statusWidth = ((index) / statuses.length) * 100;
                          const isCompleted = percentCompleteForSeller >= statusWidth;
                          return (
                            <div key={index} className={`text-center relative`}>
                              <img
                                src={imageFunction(status)}
                                alt=""
                                className={`py-2 px-2 bg-${isCompleted ? '[#09BB44]' : 'gray-400'} text-white rounded-[50%] h-[40px]`}
                              />
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] text-center'>
                                {status}
                              </p>
                              {visitDate && visitDate.map((visit) => (
                                visit.status === status && (
                                  <p key={visit.status} className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                    {formatDate(visit.dateAndTime) || ''}
                                  </p>
                                )
                              ))}
                            </div>
                          );
                        })}

                        <hr
                          className='absolute left-0 right-0 top-[42%] z-[-1]'
                          style={{
                            width: '100%',
                            height: '10px',
                            backgroundColor: `rgba(169, 169, 169, 0.5)`,
                            background: `linear-gradient(to right, #09BB44 ${percentCompleteForSeller + 20}%, rgba(169, 169, 169, 0.5) ${percentCompleteForSeller}%)`
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={`flex justify-between relative mb-8 mx-5 w-[${totalWidth}%]`}>
                      {statuses.map((status, index) => {
                        const statusWidth = ((index) / statuses.length) * 100;
                        const isCompleted = percentCompleteForBuyer >= statusWidth;
                        return (
                          <div key={index} className={`text-center relative`}>
                            <img src={imageFunction(status)} alt="" className={`py-2 px-2 bg-${isCompleted ? '[#09BB44]' : 'gray-400'} text-white rounded-[50%] h-[40px]`} />
                            <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] text-center'>{status}</p>
                            {status === "Inquiry" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Inquiry')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Under Review" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Under Review')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Negotiation" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Negotiation')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Deal" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Deal')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Po" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Po')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Invoice" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Invoice')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Dispatch" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Dispatch')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "In Transit" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'In Transit')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Cancel" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Cancel')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Delivered" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Delivered')?.dateAndTime) || ''}
                              </p>
                            )}
                            {status === "Rejected" && (
                              <p className='text-[10px] font-medium absolute w-[90px] left-[-50%] bottom-[-30px] text-center'>
                                {visitDate && formatDate(visitDate?.find(visit => visit.status === 'Rejected')?.dateAndTime) || ''}
                              </p>
                            )}
                          </div>
                        );
                      })}

                      <hr
                        className='absolute left-0 right-0 top-[42%] z-[-1]'
                        style={{
                          width: '100%',
                          height: '10px',
                          backgroundColor: `rgba(169, 169, 169, 0.5)`,
                          background: `linear-gradient(to right, #09BB44 ${percentCompleteForBuyer + 20}%, rgba(169, 169, 169, 0.5) ${percentCompleteForBuyer}%)`
                        }} />
                    </div>
                  )}
                </div>
              </div>
              <div>

                {alreadyData.inq_type === "commercial" ? (
                  <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-5 pb-4  px-5 mb-5'>
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
                    <div className='flex justify-between mb-2 '>
                      <p className='text-[#0A122A] text-sm w-[140px]'>Inco Terms :</p>
                      <p className='text-sm text-[#0A122A] font-medium text-end'>{alreadyData?.inco_terms}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p className='text-[#0A122A] text-sm font-semibold'>Inquiry Status :</p>
                      <div className="relative">
                        <button
                          id="multiLevelDropdownButton"
                          onClick={() => toggleDropdown()}
                          className="flex items-center"
                          type="button"
                        >
                          <ul className={`rounded-lg text-white ${inquiryStatus === 'pending' ? 'bg-yellow-500' :
                            inquiryStatus === 'approved' ? 'bg-blue-500' :
                              inquiryStatus === 'rejected' ? 'bg-red-500' :
                                inquiryStatus === 'cancel' ? 'bg-gray-500' :
                                  inquiryStatus === 'negotiation' ? 'bg-orange-500' :
                                    inquiryStatus === 'po' ? 'bg-purple-500' :
                                      inquiryStatus === 'invoice' ? 'bg-teal-500' :
                                        inquiryStatus === 'dispatch' ? 'bg-indigo-500' :
                                          inquiryStatus === 'in transit' ? 'bg-pink-500' :
                                            inquiryStatus === 'delivered' ? 'bg-green-500' :
                                              inquiryStatus === 'deal done' ? 'bg-orange-300' :
                                                'bg-red-500'
                            }`}>
                            <li
                              className={`text-sm font-medium py-1 px-2 `}
                            >
                              {capitalizeFirstLetter(inquiryStatus)}
                            </li>
                          </ul>
                          {(inquiryStatus === "approved" || inquiryStatus === 'pending' || inquiryStatus === "negotiation") && (
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

                        {dropdownStates && inquiryStatus !== "cancel" && inquiryStatus !== "rejected" && inquiryStatus !== "deal done" && inquiryStatus !== "po" && inquiryStatus !== "invoice" && inquiryStatus !== "delivered" && inquiryStatus !== "dispatch" && inquiryStatus !== "in transit" && (
                          <div
                            id="multi-dropdown"
                            ref={dropdownRef}
                            className="z-10 absolute top-7 left-[-240%] mt-1 bg-white rounded-lg shadow-lg w-64">
                            <div className="py-3">
                              <h1 className="text-sm font-semibold px-3 mb-2">Change status</h1>
                              <div className="bg-blue-50 px-3 py-4">

                                {userPost === "seller" && inquiryStatus === "pending" && (
                                  <p
                                    className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'approved' ? 'bg-darkBlue text-white font-semibold' : ''
                                      }`}
                                    onClick={() => handleStatusSelection('approved')}
                                  >
                                    APPROVED
                                  </p>
                                )}
                                {userPost === "seller" && (inquiryStatus === "pending" || inquiryStatus === "approved" || inquiryStatus === "negotiation") && (
                                  <p
                                    className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'rejected' ? 'bg-darkBlue text-white font-semibold' : ''
                                      }`}
                                    onClick={() => handleStatusSelection('rejected')}
                                  >
                                    REJECT
                                  </p>
                                )}
                                {(inquiryStatus === "pending" || inquiryStatus === "approved" || inquiryStatus === "negotiation") && (
                                  <>
                                    {userPost === "buyer" && (
                                      <p
                                        className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'cancel' ? 'bg-darkBlue text-white font-semibold' : ''
                                          }`}
                                        onClick={() => handleStatusSelection('cancel')}
                                      >
                                        CANCEL
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>
                              <div>
                                {loading ? (
                                  <div className="flex justify-end gap-4 pt-2 me-3">
                                    <button
                                      className="text-sm font-medium text-green-300 bg-darkBlue py-1 px-4 rounded-md"
                                    // onClick={handleApply}
                                    >
                                      <img src={loaderImage} alt="" className='animate-spin h-[25px]' />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end gap-4 pt-2 me-3">
                                    <button className="text-sm font-medium" onClick={handleCancelDropdown}>Cancel</button>
                                    <button
                                      className="text-sm font-medium text-green-300"
                                      onClick={handleApply}
                                    >
                                      Apply
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {inquiryStatus === "invoice" && userPost === "seller" && (
                      <>
                        <div className='mt-3 flex items-center justify-between'>
                          <p className='text-[#0A122A] text-sm font-semibold'>LR Document :</p>
                          <input
                            id="fileInput"
                            name="LR Copy"
                            accept="image/*"
                            type="file"
                            className='hidden'
                            onChange={handleFileChange}
                          />

                          {selectedFile ? (
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className='bg-red-500 text-white p-1 rounded-full'
                            >
                              <AiOutlineClose size={20} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={triggerFileInput}
                              className='bg-blue-500 text-white p-1 rounded-full'
                            >
                              <AiOutlineUpload size={20} />
                            </button>
                          )}
                        </div>
                        {selectedFile && (
                          <div className='mt-2 w-[200px]'>
                            <p className='text-sm text-gray-600 truncate overflow-ellipsis'>{selectedFile.name}</p>
                          </div>
                        )}
                      </>
                    )}

                    {(inquiryStatus === "deal done" || inquiryStatus === "po" || inquiryStatus === "invoice" || inquiryStatus === "dispatch" || inquiryStatus === "in transit") && (
                      <div className='mt-4'>
                        {userPost === "buyer" ? (
                          <>
                            {inquiryStatus === "po" ? (
                              <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                PO GENERATED
                              </button>
                            ) : inquiryStatus === "invoice" ? (
                              <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                INVOICE GENERATED
                              </button>
                            ) : inquiryStatus === "dispatch" ? (
                              <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                ORDER DISPATCHED
                              </button>
                            ) : inquiryStatus === "in transit" ? (
                              <>
                                <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                  ORDER IN TRANSIT
                                </button>
                                {deliveredForm && (
                                  <div>
                                    <div className='flex items-center gap-3 mt-3'>
                                      <p className='w-[70px] font-semibold text-lg'>{randomNumbers.num1} + {randomNumbers.num2} =</p>
                                      <input
                                        type="text"
                                        className='w-[80px] outline-0 rounded-[10px] border border-gray-300 px-7 py-[5px] text-black text-md font-semibold placeholder:text-md placeholder:text-black placeholder:font-semibold'
                                        value={userInput}
                                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                        maxLength={5}
                                        onChange={sumChange}
                                      />
                                      <button onClick={handleOkClick} className='w-[80px] text-white rounded-[10px] bg-darkBlue font-semibold text-sm px-1 py-2'>
                                        OK
                                      </button>
                                    </div>
                                  </div>
                                )}
                                <button className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold mt-4' onClick={handleGenerateNumber}>
                                  Change Status as Order Delivered
                                </button>
                              </>
                            ) : inquiryStatus === "delivered" ? (
                              <></>
                            ) : (
                              <button className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold' onClick={() => setPrefixOpen(true)}>
                                Generate PO
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            {inquiryStatus === "po" ? (
                              <button className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold' onClick={() => setGenrateInvoice(true)}>
                                Generate Invoice
                              </button>
                            ) : inquiryStatus === "invoice" ? (
                              <button onClick={() => { setStatusDispatch(true), setSelectedStatus('dispatch') }} className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold'>
                                Dispatch Order
                              </button>
                            ) : inquiryStatus === "dispatch" ? (
                              <button onClick={() => { setStatusTransit(true), setSelectedStatus('in transit') }} className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold'>
                                Order In Transit
                              </button>
                            ) : inquiryStatus === "in transit" ? (
                              <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                ORDER IN TRANSIT
                              </button>
                            ) : inquiryStatus === "delivered" ? (
                              <></>
                            ) : (
                              <button className='w-full bg-gray-200 text-black rounded-lg py-2 text-xs font-semibold'>
                                WAITING FOR PO GENERATION
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  <>
                    <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-5 pb-4  px-5 mb-5'>
                      <div className='flex justify-between mb-3'>
                        <div>
                          <p className='text-[#0A122A] text-sm'>Date :</p>
                        </div>
                        <p className='text-sm font-medium'>{formatDate(alreadyData?.createdAt)}</p>
                      </div>
                      <div className='flex justify-between mb-3'>
                        <p className='text-[#0A122A] text-sm'>Inquiry Type  :</p>
                        <p className='text-sm text-[#0A122A] font-medium'>{alreadyData?.inq_type}</p>
                      </div>
                      <div className='flex justify-between mb-3'>
                        <p className='text-[#0A122A] text-sm'>Quantity :</p>
                        <p className='text-sm text-[#0A122A] font-medium'>{alreadyData?.total_lot * alreadyData?.one_lot_qty}{alreadyData?.one_lot_qty_type}</p>
                      </div>
                      <div className='flex justify-between mb-3'>
                        <p className='text-[#0A122A] text-sm'>Lot :</p>
                        <p className='text-sm text-[#0A122A] font-medium'>{alreadyData?.total_lot}</p>
                      </div>
                      <div className='flex justify-between items-center'>
                        <p className='text-[#0A122A] text-sm font-semibold'>Inquiry Status :</p>
                        <div className="relative">
                          <button
                            id="multiLevelDropdownButton"
                            onClick={() => toggleDropdown()}
                            className="flex items-center"
                            type="button"
                          >
                            <ul className={`rounded-lg text-white ${inquiryStatus === 'pending' ? 'bg-yellow-500' :
                              inquiryStatus === 'approved' ? 'bg-blue-500' :
                                inquiryStatus === 'rejected' ? 'bg-red-500' :
                                  inquiryStatus === 'cancel' ? 'bg-gray-500' :
                                    inquiryStatus === 'negotiation' ? 'bg-orange-500' :
                                      inquiryStatus === 'po' ? 'bg-purple-500' :
                                        inquiryStatus === 'invoice' ? 'bg-teal-500' :
                                          inquiryStatus === 'dispatch' ? 'bg-indigo-500' :
                                            inquiryStatus === 'in transit' ? 'bg-pink-500' :
                                              inquiryStatus === 'delivered' ? 'bg-green-500' :
                                                inquiryStatus === 'deal done' ? 'bg-orange-300' :
                                                  'bg-red-500'
                              }`}>
                              <li
                                className={`text-sm font-medium py-1 px-2 `}
                              >
                                {capitalizeFirstLetter(inquiryStatus)}
                              </li>
                            </ul>
                            {(inquiryStatus === "approved" || inquiryStatus === 'pending' || inquiryStatus === "negotiation") && (
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

                          {dropdownStates && inquiryStatus !== "cancel" && inquiryStatus !== "rejected" && inquiryStatus !== "deal done" && inquiryStatus !== "po" && inquiryStatus !== "invoice" && (
                            <div
                              id="multi-dropdown"
                              ref={dropdownRef}
                              className="z-10 absolute top-7 left-[-240%] mt-1 bg-white rounded-lg shadow-lg w-64">
                              <div className="py-3">
                                <h1 className="text-sm font-semibold px-3 mb-2">Change status</h1>
                                <div className="bg-blue-50 px-3 py-4">

                                  {userPost === "seller" && inquiryStatus === "pending" && (
                                    <p
                                      className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'approved' ? 'bg-darkBlue text-white font-semibold' : ''
                                        }`}
                                      onClick={() => handleStatusSelection('approved')}
                                    >
                                      APPROVED
                                    </p>
                                  )}
                                  {userPost === "seller" && (inquiryStatus === "pending" || inquiryStatus === "approved" || inquiryStatus === "negotiation") && (
                                    <p
                                      className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'rejected' ? 'bg-darkBlue text-white font-semibold' : ''
                                        }`}
                                      onClick={() => handleStatusSelection('rejected')}
                                    >
                                      REJECT
                                    </p>
                                  )}
                                  {(inquiryStatus === "pending" || inquiryStatus === "approved" || inquiryStatus === "negotiation") && (
                                    <>
                                      {userPost === "buyer" && (
                                        <p
                                          className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'cancel' ? 'bg-darkBlue text-white font-semibold' : ''
                                            }`}
                                          onClick={() => handleStatusSelection('cancel')}
                                        >
                                          CANCEL
                                        </p>
                                      )}
                                    </>
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

                      {inquiryStatus === "invoice" && userPost === "seller" && (
                        <>
                          <div className='mt-3 flex items-center justify-between'>
                            <p className='text-[#0A122A] text-sm font-semibold'>Lori Copy :</p>
                            <input
                              id="fileInput"
                              name="LR Copy"
                              accept="image/*"
                              type="file"
                              className='hidden'
                              onChange={handleFileChange}
                            />

                            {selectedFile ? (
                              <button
                                type="button"
                                onClick={handleRemoveFile}
                                className='bg-red-500 text-white p-1 rounded-full'
                              >
                                <AiOutlineClose size={20} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={triggerFileInput}
                                className='bg-blue-500 text-white p-1 rounded-full'
                              >
                                <AiOutlineUpload size={20} />
                              </button>
                            )}
                          </div>
                          {selectedFile && (
                            <div className='mt-2 w-[200px]'>
                              <p className='text-sm text-gray-600 truncate overflow-ellipsis'>{selectedFile.name}</p>
                            </div>
                          )}
                        </>
                      )}

                      {(inquiryStatus === "deal done" || inquiryStatus === "po" || inquiryStatus === "invoice" || inquiryStatus === "dispatch" || inquiryStatus === "in transit") && (
                        <div className='mt-4'>
                          {userPost === "buyer" ? (
                            <>
                              {inquiryStatus === "po" ? (
                                <>
                                  <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                    PO GENERATED
                                  </button>
                                  <button className='mt-3 w-full bg-black text-white rounded-lg py-2 text-sm font-semibold' onClick={handlePaymentOfSampleInquiry}>
                                    Payment
                                  </button>
                                </>
                              ) : inquiryStatus === "invoice" ? (
                                <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                  INVOICE GENERATED
                                </button>
                              ) : inquiryStatus === "dispatch" ? (
                                <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                  ORDER DISPATCHED
                                </button>
                              ) : inquiryStatus === "in transit" ? (
                                <>
                                  <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                    ORDER IN TRANSIT
                                  </button>
                                  {deliveredForm && (
                                    <div>
                                      <div className='flex items-center gap-3 mt-3'>
                                        <p className='w-[70px] font-semibold text-lg'>{randomNumbers.num1} + {randomNumbers.num2} =</p>
                                        <input
                                          type="text"
                                          className='w-[80px] outline-0 rounded-[10px] border border-gray-300 px-7 py-[5px] text-black text-md font-semibold placeholder:text-md placeholder:text-black placeholder:font-semibold'
                                          value={userInput}
                                          onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                                          maxLength={5}
                                          onChange={sumChange}
                                        />
                                        <button onClick={handleOkClick} className='w-[80px] text-white rounded-[10px] bg-darkBlue font-semibold text-sm px-1 py-2'>
                                          OK
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  <button className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold mt-4' onClick={handleGenerateNumber}>
                                    Change Status as Order Delivered
                                  </button>
                                </>
                              ) : inquiryStatus === "delivered" ? (
                                <></>
                              ) : (
                                <button className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold' onClick={() => setPrefixOpen(true)}>
                                  Generate PO
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {inquiryStatus === "po" ? (
                                <button className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold' onClick={() => setGenrateInvoice(true)}>
                                  Generate Invoice
                                </button>
                              ) : inquiryStatus === "invoice" ? (
                                <button onClick={() => { setStatusDispatch(true), setSelectedStatus('dispatch') }} className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold'>
                                  Order Dispatch
                                </button>
                              ) : inquiryStatus === "dispatch" ? (
                                <button onClick={() => { setStatusTransit(true), setSelectedStatus('in transit') }} className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold'>
                                  Order In Transit
                                </button>
                              ) : inquiryStatus === "in transit" ? (
                                <button className='w-full bg-gray-300 text-black rounded-lg py-2 text-xs font-semibold'>
                                  ORDER IN TRANSIT
                                </button>
                              ) : inquiryStatus === "delivered" ? (
                                <></>
                              ) : (
                                <button className='w-full bg-gray-200 text-black rounded-lg py-2 text-xs font-semibold'>
                                  WAITING FOR PO GENERATION
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {finalPaymentDetails && location.state !== "returnOrder" && (
                  <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7 mt-5 px-5 mb-5'>
                    <h1 className='text-xl font-medium mb-2'>Negotiation Details</h1>
                    <hr className='mb-3' />
                    <div className='grid grid-cols-[1.4fr,2fr] mb-2'>
                      <div>
                        <p className='text-[#0A122A] text-sm'>Quantity</p>
                      </div>
                      <p className='text-sm flex items-center justify-end text-end'>{finalPaymentDetails?.quantity}{finalPaymentDetails?.quantity_type}</p>
                    </div>
                    <div className='grid grid-cols-[1.4fr,2fr] mb-2'>
                      <div>
                        <p className='text-[#0A122A] text-sm'>Final Price</p>
                      </div>
                      <p className='text-sm flex items-center justify-end text-end'><RupeesIcon /> {finalPaymentDetails?.final_price}</p>
                    </div>
                    <div className='grid grid-cols-[1.4fr,2fr] mb-2'>
                      <div>
                        <p className='text-[#0A122A] text-sm'>Payment Term</p>
                      </div>
                      <p className='text-sm flex items-center justify-end text-end'>{finalPaymentDetails?.payment_terms}</p>
                    </div>
                    <div className='grid grid-cols-[1.4fr,2fr] mb-2'>
                      <div>
                        <p className='text-[#0A122A] text-sm'>Delivery Time</p>
                      </div>
                      <p className='text-sm flex items-center justify-end text-end'>{finalPaymentDetails?.delivery_time}</p>
                    </div>
                    <div className='grid grid-cols-[1.4fr,2fr] mb-2'>
                      <div>
                        <p className='text-[#0A122A] text-sm'>Inco Terms</p>
                      </div>
                      <p className='text-sm flex items-center justify-end text-end'>{finalPaymentDetails?.inco_terms}</p>
                    </div>
                    <div className='text-end mt-5'>
                      <span className={`rounded-lg text-md font-semibold py-1 px-2 ${negotiationStatus === 'pending' ? 'bg-yellow-300' :
                        negotiationStatus === 'approved' ? 'bg-green-300' :
                          negotiationStatus === 'deal done' ? 'bg-green-500' :
                            negotiationStatus === 'rejected' ? 'bg-red-500' :
                              negotiationStatus === 'Expired' ? 'bg-orange-300' :
                                'bg-red-500'
                        }`}>{capitalizeFirstLetter(negotiationStatus)}</span>
                    </div>
                  </div>
                )}

                {location?.state === "returnOrder" ? (
                  <>
                    <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-5 pb-4  px-5 mb-5'>
                      <div className='mb-3'>
                        <p className='font-semibold border-b-2 border-gray-300 pb-2'>Refund & Return Details</p>
                      </div>
                      <div className='flex justify-between items-center mb-2'>
                        <p className='text-[#0A122A] text-sm w-full'>Quantity</p>

                        <div className='flex border rounded-lg'>
                          <input type="text"
                            value={returnQuantity}
                            onChange={(e) => setReturnQuantity(e.target.value)}
                            // value={qtyValue}
                            // onInput={handleQtyValueChange}
                            // onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')} maxLength={4} 
                            className='outline-none text-gray-500 py-1 px-2 w-[100px] placeholder:text-gray-300 placeholder:text-xs rounded-s-lg' placeholder='Enter Quantity' />
                          <select
                            name="qty_type"
                            id="qty_type"
                            onChange={(e) => setReturnQuantityType(e.target.value)}
                            className='outline-none bg-gray-100 py-1 px-2 text-gray-400 text-xs rounded-e-lg'
                          // value={qtyType}
                          // onChange={handleQtyTypeChange}
                          >
                            <option value="" selected>select</option>
                            <option value="kg">kg</option>
                            <option value="gm">gm</option>
                          </select>
                        </div>
                      </div>
                      <div className='flex justify-between mb-2'>
                        <div>
                          <p className='text-[#0A122A] text-sm w-full'>Subtotal :</p>
                        </div>
                        <p className='text-sm font-medium flex items-center'><RupeesIcon /> {finalPaymentDetails?.final_price}</p>
                      </div>
                      <div className='flex justify-between mb-2'>
                        <p className='text-[#0A122A] text-sm'>Discount  :</p>
                        <p className='text-sm text-[#0A122A] font-medium text-red-500 flex items-center'>- <RupeesIcon /> 0.0</p>
                      </div>
                      <div className='flex justify-between mb-2'>
                        <p className='text-[#0A122A] text-sm'>Tax :</p>
                        <p className='text-sm text-[#0A122A] font-medium text-green-500 flex items-center'>+ <RupeesIcon /> 0.0</p>
                      </div>
                      <div className='flex justify-between mb-2 '>
                        <p className='text-[#0A122A] text-sm w-[140px]'>Delivery Charge :</p>
                        <p className='text-sm text-[#0A122A] font-medium text-end text-green-500 flex items-center'>+ <RupeesIcon /> 0.0</p>
                      </div>
                      <button className='w-full bg-black text-white rounded-lg py-2 text-sm font-semibold mb-4' onClick={handleReturnOrder}>
                        Confirm Return
                      </button>
                      <hr />
                      <div className='flex justify-between mt-3'>
                        <p className='text-[#0A122A] text-lg w-[160px] font-bold'>Total :</p>
                        <p className='text-lg text-[#0A122A] font-bold text-end flex items-center'><RupeesIcon /> {finalPaymentDetails?.final_price}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {alreadyData?.inq_type === "commercial" ? (
                      <>

                        <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-3 pb-7  px-5'>
                          <h1 className='text-xl font-medium mb-2'>Inquiry Payment Details</h1>
                          <hr className='mb-3' />
                          <div className='flex justify-between mb-2'>
                            <div>
                              <p className='text-[#0A122A] text-sm'>Approx Price</p>
                            </div>
                            {sendRequestCancel ? (
                              <p className='text-sm flex items-center'><RupeesIcon /> 2000</p>
                            ) : (
                              <div>
                                <p className='text-sm flex items-center justify-end'>
                                  <RupeesIcon />
                                  {formatPrice(alreadyData?.min_price)}
                                </p>
                                <p className='text-sm flex items-center justify-center'>-</p>
                                <p className='text-sm flex items-center justify-end'>
                                  <RupeesIcon />{formatPrice(alreadyData?.max_price)}</p>
                              </div>
                            )}
                          </div>
                          <div className='flex justify-between mb-2'>
                            <p className='text-[#0A122A] text-sm'>Discount</p>
                            <p className='text-sm text-[#FA3434] flex items-center'>-<RupeesIcon /> 0.0</p>
                          </div>
                          <div className='flex justify-between mb-2'>
                            <p className='text-[#0A122A] text-sm'>Tax</p>
                            <p className='text-sm text-[#00B517] flex items-center'>+<RupeesIcon /> 0.0</p>
                          </div>
                          <div className='flex justify-between'>
                            <p className='text-[#0A122A] text-sm'>Delivery Charge</p>
                            <p className='text-sm text-[#00B517] flex items-center'>+<RupeesIcon /> 0.0</p>
                          </div>
                          <div className='border my-3'></div>
                          <div className='flex justify-between'>
                            <p className='text-md font-semibold'>Total</p>
                            <div>
                              <p className='text-sm flex items-center font-medium justify-end'>
                                <RupeesIcon />
                                {formatPrice(alreadyData?.min_price)}
                              </p>
                              <p className='text-sm flex items-center font-medium justify-center'>-</p>
                              <p className='text-sm flex items-center font-medium justify-end'>
                                <RupeesIcon />{formatPrice(alreadyData?.max_price)}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className='border border-[#0A122A]/0.1 rounded-2xl shadow pt-5 pb-4  px-5 mb-5'>
                        <div className='flex justify-between mb-2'>
                          <div>
                            <p className='text-[#0A122A] text-sm w-full'>Subtotal :</p>
                          </div>
                          <p className='text-sm font-medium flex items-center'><RupeesIcon /> {alreadyData?.total_lot * alreadyData?.one_lot_qty_price}</p>
                        </div>
                        <div className='flex justify-between mb-2'>
                          <p className='text-[#0A122A] text-sm'>Discount  :</p>
                          <p className='text-sm text-[#0A122A] font-medium text-red-500 flex items-center'>- <RupeesIcon /> 0.0</p>
                        </div>
                        <div className='flex justify-between mb-2'>
                          <p className='text-[#0A122A] text-sm'>Tax :</p>
                          <p className='text-sm text-[#0A122A] font-medium text-green-500 flex items-center'>+ <RupeesIcon /> 0.0</p>
                        </div>
                        <div className='flex justify-between mb-2 '>
                          <p className='text-[#0A122A] text-sm w-[140px]'>Delivery Charge :</p>
                          <p className='text-sm text-[#0A122A] font-medium text-end text-green-500 flex items-center'>+ <RupeesIcon /> 0.0</p>
                        </div>
                        <hr />
                        <div className='flex justify-between mt-3'>
                          <p className='text-[#0A122A] text-lg w-[160px] font-bold'>Total :</p>
                          <div>
                            <p className='text-sm flex items-center justify-end'>
                              <RupeesIcon />
                              {formatPrice(alreadyData?.one_lot_qty_price * alreadyData?.total_lot)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </div>

        {genrateInvoice && (
          <>
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white pt-2">
                      <p className='text-gray-600 font-semibold mb-2 px-5'>Generate Invoice</p>
                      <div className='bg-gray-100 px-5 py-5'>
                        <div>
                          <p className='text-sm font-medium text-gray-500'>Enter Your Prefix</p>
                          <input type="text" name="" onChange={(e) => setInvoicePrefix(e.target.value)} id="" className='w-full py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none ps-5' />
                        </div>
                      </div>
                      <div class="bg-white pt-3 flex justify-end gap-3 px-5">
                        <button onClick={() => setGenrateInvoice(false)} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                        <button
                          onClick={handleInvoicePrefix}
                          // onClick={() => navigate(`/company/edit-invoice/${_id}`)}
                          type="button" class="inline-flex w-[70px] justify-center rounded-md bg-darkBlue py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {openPaymentByStatus && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <div class="bg-white py-3 ps-5">
                    <div class="sm:flex sm:items-start">
                      <h3 className='font-medium text-xl'>Add Payment</h3>
                    </div>
                  </div>
                  <div class="bg-gray-100 px-4 py-5 sm:px-6">
                    <div>
                      <div className='grid grid grid-cols-[1fr,1fr] gap-4 mb-5'>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Total Amount</p>
                          <input
                            type="text"
                            className='bg-transparent outline-none border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1 w-full'
                            placeholder='Enter Paid Amount'
                            value={totalAmount}
                            disabled
                          />
                        </div>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Paid Amount</p>
                          <input
                            type="text"
                            className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1 w-full'
                            placeholder='Enter Paid Amount'
                            value={paidAmount}
                            onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                            onChange={(e) => setPaidAmount(e.target.value)}
                          />
                          { paidAmount > totalAmount && <p className='text-xs text-red-500 mt-1'>Paid amount can't exceed total</p> }
                        </div>
                      </div>
                      <div className='grid grid grid-cols-[1fr,1fr] gap-4 mb-5'>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Payment Mode</p>
                          <select
                            className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3 w-full'
                            onChange={(e) => setPaymentTerm(e.target.value)}
                          >
                            <option value="" selected disabled>Select Payment Term</option>
                            <option value="Cash On Delivery">Cash On Delivery</option>
                            <option value="UPI">UPI</option>
                            <option value="Phone Pay">Phone Pay</option>
                            <option value="Google Pay">Google Pay</option>
                            <option value="Net Banking">Net Banking</option>
                            <option value="NEFT">NEFT</option>
                            <option value="RTGS">RTGS</option>

                          </select>
                        </div>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Remaining Amount</p>
                          <input
                            type="text"
                            className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1 w-full'
                            placeholder='Enter Remaining Amount'
                            value={totalAmount - paidAmount}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white flex justify-end mx-8 py-3">
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => setOpenPaymentByStatus(false)}>Cancel</button>
                    <button type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4" onClick={handleInsertPayment}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                      <div className='grid grid sm:grid-cols-[1fr,1fr,1fr,1fr] grid-cols-[1fr,1fr] gap-4 mb-5'>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Quantity</p>
                          <input
                            type="text"
                            className='bg-transparent outline-none border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1 w-full'
                            placeholder='Quantity'
                            onChange={handleQuantityChange}
                            onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                          // maxLength={5}
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
                          <p className='mb-1 text-xs font-medium'>Final Price Per {updatedQuantityType}</p>
                          <input
                            type="text"
                            // value={updatedFinalPrice}
                            className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1 w-full'
                            placeholder='Final Price'
                            onChange={handlePriceChange}
                            onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                          // maxLength={10}
                          />
                        </div>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Total Amount </p>
                          <input
                            type="text"
                            value={updatedFinalPrice}
                            className='bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1 w-full'
                            placeholder='Total Amount'
                            onChange={handlePriceChange}
                            onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                            // maxLength={10}
                            disabled
                          />
                        </div>
                      </div>
                      <div className='grid grid sm:grid-cols-[1fr,1fr,1fr] grid-cols-[1fr,1fr] gap-4 mb-5'>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Payment Term</p>
                          <select
                            className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3 w-full'
                            onChange={(e) => setUpdatedPaymentTerm(e.target.value)}
                          >
                            <option value="" selected disabled>Select Payment Term</option>
                            <option value="Advance">Advance</option>
                            <option value="Immediate">Immediate</option>
                            <option value="15 Days Credit">Credit (15 Days)</option>
                            <option value="30 Days Credit">Credit (30 Days)</option>
                            <option value="45 Days Credit">Credit (45 Days)</option>
                          </select>
                        </div>
                        <div className='w-full'>
                          <p className='mb-1 text-xs font-medium'>Delivery Time</p>
                          <select
                            className='w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3 w-full'
                            onChange={(e) => setUpdatedDeliveryTime(e.target.value)}
                          >
                            <option value="" disabled selected>Select Delivery Time</option>
                            <option value="Immediate">Immediate</option>
                            <option value="Delivery in 15 Days">Delivery in 15 Days</option>
                            <option value="Delivery in 30 Days">Delivery in 30 Days</option>
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
                    {loader ? (
                      <button type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4" >
                        <img src={loaderImage} alt="" className='h-[20px] animate-spin' />
                      </button>
                    ) : (
                      <button type="button" class="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4" onClick={handleSubmit}>Submit</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* generate po  */}
        {genratePo && (
          <>
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white pt-2">
                      <p className='text-gray-600 font-semibold mb-2 px-5'>Generate PO</p>
                      <div className='bg-gray-100 px-5 py-5'>
                        <div>
                          <p className='text-sm font-medium text-gray-500'>Enter Your Prefix</p>
                          <input type="text" name="" id="" className='w-full py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none ps-5' />
                        </div>
                      </div>
                      <div class="bg-white pt-3 flex justify-end gap-3 px-5">
                        <button onClick={genratePoClose} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                        <button onClick={() => setIsOpenPhoto(true)} type="button" class="inline-flex w-[70px] justify-center rounded-md bg-darkBlue py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Ok</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* end generate po  */}

        {/*  success message end  */}
        {successGenratePo && (
          <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75" onClick={successClose}>
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
              <div className="bg-white py-3 w-[400px]">
                <div className="flex flex-col items-center">
                  <img src={right} alt="" className='h-[80px]' />
                  <h3 className='font-semibold text-xl mt-4 text-center'>PO Generated Successfully</h3>
                </div>
              </div>
              <div className="bg-white mx-8 pb-3">
                <button onClick={successGeneratePOclose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
              </div>
            </div>
          </div>
        )}
        {/* success message end  */}
        {/* end generate po  */}

        {/* po display  */}
        {isOpenPhoto && (
          <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-30" onClick={() => setIsOpenPhoto(false)}>
            <div className="relative transform overflow-hidden rounded-lg text-left transition-all max-w-md py-4">
              <div className="py-3">
                <div className="">
                  <div className='flex justify-center gap-3 mb-2'>
                    <button className='bg-darkBlue text-sm text-white px-5 py-1 rounded-[15px]'>Edit PO</button>
                    <button onClick={() => setSuccessGenratePo(true)} className='bg-darkBlue text-sm text-white px-5 py-1 rounded-[15px]'>Generate PO</button>
                  </div>
                  <img src={invoice1} alt="" />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* end po display  */}

        {/* cancel request  */}

        {isOpen1 && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full sm:items-end items-center justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={cross} alt="" className='h-[50px] bg-gray-200 px-3 py-3 rounded-full' />
                      <h3 className='font-semibold sm:text-2xl text-lg sm:text-left text-center  mt-4'>Are you sure you want to denied?</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-8 py-3">
                    <button onClick={handleYes} type="button" class="sm:mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-3 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                    <button onClick={cancelNo} type="button" class="sm:mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
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
                      <p className='text-gray-600 font-semibold mb-2 px-5'>Give reason of cancelling?</p>
                      <div className='bg-gray-100 px-5 pt-3 pb-2'>
                        <textarea name="" id="" rows="3" className='bg-transparent w-full outline-none border-2 border-gray-200 rounded-md ps-3 pt-1 placeholder:text-sm' placeholder='Give reason of canceling'></textarea>
                      </div>
                      <div class="bg-white pt-3 flex justify-end gap-3 mt-3 px-5">
                        <button onClick={handleOfReason} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                        <button onClick={cancelSubmit} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/*  success message end  */}
        {paymentSuccessMessage && (
          <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75" onClick={successClose}>
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
              <div className="bg-white py-3 w-[400px]">
                <div className="flex flex-col items-center">
                  <img src={right} alt="" className='h-[80px]' />
                  <h3 className='font-bold text-xl mt-4 text-center'>Payment Detail</h3>
                  <h3 className='font-bold text-xl mt-1 text-center'>Updated Successfully</h3>
                  <p className='mt-3 text-sm'>Your payment details was updated successfully</p>
                </div>
              </div>
              <div className="bg-white mx-8 pb-3">
                <button onClick={() => setPaymentSuccessMessage(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="fixed inset-0 z-10 flex justify-center items-center bg-gray-500 bg-opacity-75" onClick={successClose}>
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
              <div className="bg-white py-3 w-[400px]">
                <div className="flex flex-col items-center">
                  <img src={right} alt="" className='h-[80px]' />
                  <h3 className='font-semibold text-xl mt-4 text-center'>Submitted Successfully</h3>
                  <p className='mt-3 text-sm'>Your Cancel Reason wan Submitted Successfully</p>
                </div>
              </div>
              <div className="bg-white mx-8 pb-3">
                <button onClick={successClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
              </div>
            </div>
          </div>
        )}
        {/* success message end  */}

        {/*  success message end  */}
        {deliveredSuccessfully && (
          <div className="fixed inset-0 z-10 flex justify-center items-center bg-darkBlue bg-opacity-35" onClick={successClose}>
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl max-w-md py-4">
              <div className="bg-white py-3 w-[400px]">
                <div className="flex flex-col items-center">
                  <img src={right} alt="" className='h-[80px]' />
                  <h3 className='font-semibold text-xl mt-4 text-center'>Order Delivered Successfully</h3>
                  <p className='mt-3 text-[12px]'>Your Order Was Delivered Successfully</p>
                </div>
              </div>
              <div className="bg-white mx-8 pb-3">
                <button onClick={handleDelevered} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Okay</button>
              </div>
            </div>
          </div>
        )}
        {/* success message end  */}

        {messageBoxOpen && (
          <div className='fixed bottom-[3%] right-[3%] z-[1] xl:w-[40%] sm:w-[70%] w-[80%]'>
            <div className='mt-10 flex flex-col items-center justify-center rounded-2xl'>
              <div className='w-full sm:h-[90vh] h-[60vh] bg-white rounded-2xl'>
                <div className='h-full'>
                  <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-5'>
                    <div className='w-full h-full'>
                      <div className='h-full'>
                        <div className='h-full overflow-hidden'>
                          <div className='sm:flex block gap-3 items-center pb-4'>
                            {userPost === "buyer" && (
                              <>
                                {alreadyData?.seller_company?.seller_other_info?.length !== 0 && alreadyData?.seller_company?.seller_other_info?.[0]?.logo !== "" ? (
                                  <>
                                    <a href={`/company-profile/${alreadyData?.seller_company?._id}`} className='cursor-pointer sm:block hidden'>
                                      <img src={alreadyData?.seller_company?.seller_other_info?.[0]?.logo} alt="" className='sm:h-[60px] sm:w-[60px] h-[40px] w-[40px] object-cover rounded-full' />
                                    </a>
                                  </>
                                ) : (
                                  <div className="sm:h-16 sm:w-16 h-10 w-10 bg-gray-200 rounded-full sm:flex hidden items-center justify-center mb-2">
                                    <a href={`/company-profile/${alreadyData?.seller_company?._id}`}>
                                      <p className="text-xl font-semibold text-gray-600">
                                        {alreadyData?.seller_company?.company_name.slice(0, 2).toUpperCase()}
                                      </p>
                                    </a>
                                  </div>
                                )}
                              </>
                            )}
                            {userPost === "seller" && (
                              <>
                                {alreadyData?.buyer_company?.buyer_other_info?.length !== 0 && alreadyData?.buyer_company?.buyer_other_info?.[0]?.logo !== "" ? (
                                  <>
                                    <a href={`/company-profile/${alreadyData?.buyer_company?._id}`} className='cursor-pointer sm:block hidden'>
                                      <img src={alreadyData?.buyer_company?.buyer_other_info?.[0]?.logo} alt="" className='sm:h-[60px] sm:w-[60px] h-[40px] w-[40px] object-cover rounded-full' />
                                    </a>
                                  </>
                                ) : (
                                  <div className="sm:h-16 sm:w-16 h-10 w-10 bg-gray-200 rounded-full sm:flex hidden items-center justify-center mb-2">
                                    <a href={`/company-profile/${alreadyData?.buyer_company?._id}`}>
                                      <p className="text-xl font-semibold text-gray-600">
                                        {alreadyData?.buyer_company?.company_name.slice(0, 2).toUpperCase()}
                                      </p>
                                    </a>
                                  </div>
                                )}
                              </>
                            )}
                            {onlineUsers && onlineUsers.some(user => user === receiverCompanyId) && (
                              <p className="border border-green-600 d-inline px-1 py-1 bg-green-500 rounded-full"></p>
                            )}

                            <div>
                              <p className='text-lg font-semibold' onClick={() => setMessageBoxOpne(false)}>{userPost === "buyer" ? alreadyData?.seller_company?.company_name : alreadyData?.buyer_company?.company_name}</p>
                              <p className='text-sm'>Inquiry Id: {_id}</p>
                            </div>
                            <div className='h-full'>
                              <div className='sm:flex hidden items-start rounded-lg cursor-pointer' onClick={handleDownload}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V8zm-2 17l-4-4h2.5v-3h3v3H16zm1-10V3.5L18.5 9z" /></svg>
                              </div>
                            </div>
                            {inquiryStatus !== "rejected" && inquiryStatus !== "cancel" && inquiryStatus !== "deal done" && inquiryStatus !== "po" && inquiryStatus !== "invoice" && inquiryStatus !== "dispatch" && inquiryStatus !== "in transit" && inquiryStatus !== "delivered" && finalPaymentDetails?.request_status !== "pending" && (
                              <p className='ms-auto underline text-blue-600 text-md font-semibold cursor-pointer' onClick={handlePopUp}>Negotiation</p>
                            )}
                            {/* {finalPaymentDetails && finalPaymentDetails?.request_status !== "pending" && finalPaymentDetails?.request_status === "denied" && (
                              <p className='ms-auto underline text-blue-600 text-md font-semibold cursor-pointer' onClick={handlePopUp}>Negotiation</p>
                            )} */}
                            <FontAwesomeIcon icon={faAngleDown} className='ms-auto text-xl cursor-pointer sm:block hidden' onClick={() => setMessageBoxOpne(false)} />
                            <FontAwesomeIcon icon={faAngleDown} className='ms-auto text-xl cursor-pointer sm:hidden block  ' onClick={() => setMessageBoxOpne(false)} />
                          </div>
                          <hr />
                          <div id='chat-container' className='h-full relative'>
                            <div className='mt-5 flex flex-col overflow-scroll h-full pb-[40%]'>
                              {messageDisplay && messageDisplay.map((e) => {
                                const isCompanyMessage = e.senderId === CompanyId;
                                const messageClass = isCompanyMessage ? 'text-end' : 'text-start';
                                const bubbleClass = isCompanyMessage ? 'bg-sky-950 text-white' : 'bg-gray-100';
                                const alignClass = isCompanyMessage ? 'justify-end' : 'justify-start';
                                const timeAlignClass = isCompanyMessage ? 'text-end' : 'text-start';

                                return (
                                  <div key={e._id} className={`mb-4 flex ${alignClass}`}>
                                    {e.quantity > 0 ? (
                                      isCompanyMessage ? (
                                        <div className='bg-gray-200 rounded-2xl px-5 py-4 mb-5'>
                                          <p className='text-[10px] text-gray-400 font-medium text-end'>id: {e._id}</p>
                                          <p className='text-end text-sm font-medium mb-1'>Request from you</p>
                                          <div className='border-t border-black'></div>
                                          <p className='text-end font-medium text-[10px] text-gray-500 mt-1 mb-3'>{e?.datetime?.slice(11, 16)}</p>
                                          <p className='text-end text-sm font-medium mb-2'>Quantity : {e.quantity}{e.quantity_type}</p>
                                          <p className='text-end text-sm font-medium mb-2 flex justify-end items-center'>
                                            Price : <RupeesIcon /> {e.final_price}
                                          </p>
                                          <p className='text-end text-sm font-medium mb-2'>Payment Term : {e.payment_terms}</p>
                                          <p className='text-end text-sm font-medium mb-2'>Delivery time : {e.delivery_time}</p>
                                          <p className='text-end text-sm font-medium mb-2'>Inco Terms : {e.inco_terms}</p>
                                          {e?.request_status === "denied" ? (
                                            <button className='w-full bg-gray-400 rounded-[30px] py-[6px] text-sm mt-4'>Denied</button>
                                          ) : e?.request_status === "approved" ? (
                                            <button className='w-full border border-black bg-darkBlue text-white rounded-[30px] py-[6px] text-sm mt-4' onClick={() => { handleCancelRequest("approved", e._id) }}>Approved</button>
                                          ) : e?.request_status === "cancel" ? (
                                            <>
                                              <button className='w-full rounded-[30px] py-[6px] text-sm mt-4 bg-gray-400'>Canceled</button>
                                            </>
                                          ) : (
                                            <>
                                              {loader ? (
                                                <button type="button" class="w-full rounded-[30px] py-[6px] text-sm mt-4 bg-gray-400" >
                                                  <img src={loaderImage} alt="" className='h-[20px] animate-spin' />
                                                </button>
                                              ) : (
                                                <button onClick={() => { handleCancelRequest("cancel", e._id) }} className='w-full border border-black rounded-[30px] py-[6px] text-sm mt-4'>Cancel</button>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      ) : (
                                        <div className='flex pb-[140px]'>
                                          <div className='bg-gray-200 rounded-2xl px-5 py-4'>
                                            <p className='text-[10px] text-gray-400 font-medium'>id: {e._id}</p>
                                            <p className='text-sm font-medium mb-1'>Request from {userPost === "buyer" ? alreadyData?.seller_company?.company_name : alreadyData?.buyer_company?.company_name}</p>
                                            <div className='border border-t-black'></div>
                                            <p className='font-medium text-[10px] text-gray-500 mt-1 mb-3'>{e?.datetime?.slice(11, 16)}</p>
                                            <p className='text-sm font-medium mb-2'>Quantity : {e.quantity}{e.quantity_type}</p>
                                            <p className='text-sm font-medium mb-2 flex items-center'>
                                              Price : <RupeesIcon /> {e.final_price}
                                            </p>
                                            <p className='text-sm font-medium mb-2'>Payment Term : {e.payment_terms}</p>
                                            <p className='text-sm font-medium mb-2'>Delivery time : {e?.delivery_time}</p>
                                            <p className='text-sm font-medium mb-2'>Inco Terms : {e.inco_terms}</p>
                                            {e?.request_status === "denied" ? (
                                              <button className='w-full bg-gray-400 rounded-[30px] py-[6px] text-sm mt-4'>Denied</button>
                                            ) : e?.request_status === "approved" ? (
                                              <button className='w-full border border-black bg-darkBlue text-white rounded-[30px] py-[6px] text-sm mt-4'>Approved</button>
                                            ) : e?.request_status === "cancel" ? (
                                              <>
                                                <button className='w-full rounded-[30px] py-[6px] text-sm mt-4 bg-gray-400'>Canceled</button>
                                              </>
                                            ) : (
                                              <div className='flex justify-between gap-3'>
                                                <button className='w-full border border-black rounded-[30px] py-[6px] text-sm mt-4' onClick={() => { setIsOpen1(true); setChatId(e._id) }}>Deny</button>
                                                <button className='w-full border border-black bg-darkBlue text-white rounded-[30px] py-[6px] text-sm mt-4' onClick={() => { setIsOpen2(true); setChatId(e._id) }}>Approve</button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    ) : (
                                      <div className={`${bubbleClass} px-5 py-2 rounded-xl`}>
                                        <p className={`${messageClass} text-sm`}>{e.message}</p>
                                        <p className={`text-xs mt-3 text-gray-400 ${timeAlignClass}`}>{e?.datetime?.slice(11, 16)}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}

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

        {/* request approved  */}

        {isOpen2 && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={right} alt="" className='h-[50px] rounded-full' />
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

        {/* inquiry status dispatch approval starts  */}

        {statusDispatch && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={right} alt="" className='h-[70px]' />
                      <h3 className='font-semibold text-xl mt-4 mx-8 text-center'>Are You Sure You Want To Dispatch Order?</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-10 py-3">
                    <button onClick={handleDispatch} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                    <button onClick={() => setStatusDispatch(false)} type="button" class="mt-2 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* inquiry status dispatch approval end  */}


        {/* inquiry status dispatch approval starts  */}

        {statusTransit && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={right} alt="" className='h-[70px] ' />
                      <h3 className='font-semibold text-xl mt-4'>Are You Sure You Want To In Trasit Order?</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-10 py-3">
                    <button onClick={handleTransit} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3">Yes</button>
                    <button onClick={() => setStatusTransit(false)} type="button" class="mt-2 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">No</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* inquiry status dispatch approval end  */}


        {inquiryStatus !== "cancel" && inquiryStatus !== "rejected" && inquiryStatus !== "pending" && (
          <>
            {alreadyData?.inq_type === "commercial" && (
              <div className='fixed bottom-[3%] right-[3%] xl:w-[30%] sm:w-[70%] w-[70%] cursor-pointer' onClick={() => setMessageBoxOpne(true)}>
                <div className=' flex flex-col items-center justify-center rounded-2xl bg-white '>
                  <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-3 px-4'>
                    {userPost === "buyer" && (
                      <div className='flex gap-3  items-center'>
                        {alreadyData?.seller_company?.seller_other_info?.length !== 0 && alreadyData?.seller_company?.seller_other_info?.[0]?.logo !== "" ? (
                          <>
                            <img src={alreadyData?.seller_company?.seller_other_info?.[0]?.logo} alt="" className='sm:h-[60px] sm:w-[60px] h-[40px] w-[40px] object-cover rounded-full' />
                          </>
                        ) : (
                          <div className="sm:h-16 sm:w-16 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                            <p className="text-xl font-semibold text-gray-600">
                              {alreadyData?.seller_company?.company_name.slice(0, 2).toUpperCase()}
                            </p>
                          </div>
                        )}

                        <div className=''>
                          <p className='text-lg font-semibold' onClick={() => setMessageBoxOpne(false)}>{alreadyData?.seller_company?.company_name}</p>
                          <p className='text-sm'>Inquiry Id: {_id}</p>
                        </div>
                        <FontAwesomeIcon icon={faAngleUp} className='ms-auto text-xl cursor-pointer' />
                      </div>
                    )}
                    {userPost === "seller" && (
                      <div className='flex gap-3  items-center'>
                        {alreadyData?.buyer_company?.buyer_other_info?.length !== 0 && alreadyData?.buyer_company?.buyer_other_info?.[0]?.logo !== "" ? (
                          <>
                            <img src={alreadyData?.buyer_company?.buyer_other_info?.[0]?.logo} alt="" className='sm:h-[60px] sm:w-[60px] h-[40px] w-[40px] object-cover rounded-full' />
                          </>
                        ) : (
                          <div className="sm:h-16 sm:w-16 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                            <p className="text-xl font-semibold text-gray-600">
                              {alreadyData?.buyer_company?.company_name.slice(0, 2).toUpperCase()}
                            </p>
                          </div>
                        )}

                        <div className=''>
                          <p className='sm:text-lg text-xs font-semibold' onClick={() => setMessageBoxOpne(false)}>{alreadyData?.buyer_company?.company_name}</p>
                          <p className='sm:text-sm text-xs'>Inquiry Id: {_id}</p>
                        </div>
                        <FontAwesomeIcon icon={faAngleUp} className='ms-auto text-xl cursor-pointer' />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* prefix start  */}
        {prefixOpen && (
          <>
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white pt-2">
                      <p className='text-gray-600 font-semibold mb-2 px-5'>Generate Your PO</p>
                      <div className='bg-gray-100 px-5 py-5'>
                        <div>
                          <p className='text-xs font-medium text-gray-500'>Enter Your Prefix</p>
                          <input onChange={(e) => setPrefix(e.target.value)} type="text" name="" id="" className='w-full py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none ps-5' />
                        </div>
                      </div>
                      <div class="bg-white pt-3 flex justify-end gap-3 px-5">
                        <button onClick={() => setPrefixOpen(false)} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-xs font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Cancel</button>
                        <button onClick={prefixSubmit} type="button" class="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0">Ok</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* prefix end  */}

        {/* po display  */}

        {displayPo && (
          <div className="absolute left-0 top-0 z-10 w-full bg-black bg-opacity-30 h-[100vh] overflow-y-scroll">
            <div className="relative py-4">
              <div className="py-3">
                <div className="">
                  {sendData?.design === "design1" && (
                    <Invoice1 data={sendData} />
                  )}
                  {sendData?.design === "design2" && (
                    <Invoice2 data={sendData} />
                  )}
                  {sendData?.design === "design3" && (
                    <Invoice3 data={sendData} />
                  )}
                  {sendData?.design === "" && (
                    <Invoice1 data={sendData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* invoice display  */}

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


        {packageExpire && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={() => { setPackageExpire(false); setLoader(false) }}>
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={exclamation} alt="" className='h-[120px] border border-black rounded-full p-3' />
                      <h3 className='font-semibold text-xl text-center px-5 mt-4'>With Your Current Membership Plan You Can Add Only {localStorage.getItem("catalogLimit")} Chemicals Into Your Catalog</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-8 py-3">
                    <button onClick={handleNavigatePackage} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Browse</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {notPremium && (
          <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={() => { setNotPremium(false); setLoader(false) }}>
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" ></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4" >
                  <div class="bg-white py-3">
                    <div class="flex flex-col items-center">
                      <img src={exclamation} alt="" className='h-[120px] border border-black rounded-full p-3' />
                      <h3 className='font-semibold text-xl text-center px-5 mt-4'>You Are Not Premium Member</h3>
                    </div>
                  </div>
                  <div class="bg-white mx-8 py-3">
                    <button onClick={handleNavigatePackage} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Browse</button>
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

export default Buying_inquiry_detail;
