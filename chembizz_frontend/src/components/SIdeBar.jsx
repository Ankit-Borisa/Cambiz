import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faRightFromBracket,
  faAngleRight,
  faAngleLeft,
  faCircleArrowRight,
  faCircleArrowLeft,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Dashboard from "../components/DashBoard";
import Employees from "../components/Employees";
import MyDocuments from "../components/MyDocuments";
import MyCataLog from "../components/MyCataLog";
import SellingInquiry from "../components/SellingInquiry";
import BuyingInquiry from "../components/BuyingInquiry";
import ChangePassword from "./Changepassword";
import Addchemical from "./Addchemical";
import profile from "../images/profile.png";
import Inquiry from "../images/Inquiry.png";
import notification from "../images/notificatoin.png";
import right from "../images/Lock.png";
import troli from "../images/troli.png";
import paisa from "../images/paisa.png";
import home from "../images/home.png";
import file from "../images/file.png";
import book from "../images/book.png";
import wallete from "../images/wallete-menu.png";
import truck2 from "../images/truck-2.png";
import truckreturn from "../images/truck-return.png";
import Myprofile from "./Myprofile";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import DashBoard from "../components/DashBoard";
import Message from "./Message";
import Buying_inquiry_detail from "./Buying-inquiry-detail";
import PoDesigns from "./Po";
import { useActiveContext } from "../context/ActiveLink";
import Home from "./Home";
import Purchasedata from "./Purchasedata";
import SalseData from "./Salsedata";
import ProductDetails from "./ProductDetails";
import MyBuyingInquiry from "./MyBuyingInquiries";
import Checkout from "./Checkout";
import POgenarate from "./POSelect";
import Editinvoice from "./Editinvoice";
import Terms from "./Terms";
import Packages from "./Packages";
import PackagePayment from "./PAckagePayment";
import EditPo from "./EcitPo";
import Salesreturn from "./SalesReturn";
import Purchasereturn from "./PurchaseReturn";
import PaymentDetail from "./PaymentDetail";
import GeneratePo from "./GeneratePo";
import { useNotiContext } from "../context/NotificationContext";
import { useSocketContext } from "../context/SocketContext";
import notiSound from "../assets/notification-sound/notification.mp3";
import axios from "axios";
import GenerateManualPo from "./GenerateManualPo";
import GenerateAutomaticPo from "./GenerateAutomaticPo";
import EditManualPo from "./EditManualPo";
import GenerateAutomaticInvoice from "./GenerateAutomaticInvoice";
import GenerateManualInvoice from "./GenrateManualInvoice";
import poIcon from "../images/po-icon.svg";
import invoiceIcon from "../images/invoice-icon.png";
import dashboardIcon from "../images/dashboard-icon.svg";
import dash from "../images/dash.png";
import { BASE_URL } from "../BASE_URL";
import Logo from "../images/chemibizz-name-image.png";
import PaymentStatus from "./PaymentStatus";

function getInitials(companyName) {
  if (!companyName) return "";
  const firstCharacter = companyName?.charAt(0) || "";
  const secondCharacter = companyName?.charAt(1) || "";
  return `${firstCharacter?.toUpperCase()}${secondCharacter?.toUpperCase()}`;
}

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

const SideBar = () => {
  const { socket } = useSocketContext();
  const { notifications, setNotifications } = useNotiContext();

  const navigate = useNavigate();

  const { notificationsArray } = useNotiContext();

  const [myProfile, setMyProfile] = useState("");

  const { activeTab, setActiveTab } = useActiveContext();

  const fetchUserData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}company/cominfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    setMyProfile(data.companyDetails?.[0]);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("chemicalToken");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [open, setOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = (component, title) => {
    setSelectedMenu(title);
    localStorage.setItem("selectedMenu", title);
  };

  const Menus = [
    { title: "Dashboard", link: "", icon: dash },
    { title: "Home", link: "/home", icon: home },
    { title: "My Catalog", link: "/catalog", icon: book },
    {
      title: "Inquiries",
      icon: Inquiry,
      isCollapsible: true,
      subItems: [
        { title: "Selling Inquiry", link: "/selling-inquiry" },
        { title: "Buying Inquiry", link: "/buying-inquiry" },
      ],
    },
    // { title: "Selling Inquiry", link: "/selling-inquiry", icon: paisa },
    // { title: "Buying Inquiry", link: "/buying-inquiry", icon: troli },
    {
      title: "Order Details",
      icon: poIcon,
      isCollapsible: true,
      subItems: [
        { title: "PO Details", link: "/purchase-data" },
        { title: "Sales Details", link: "/sales-data" },
      ],
    },
    // { title: "PO Data", link: "/purchase-data", icon: poIcon },
    // { title: "Sales Data", link: "/sales-data", icon: invoiceIcon },
    {
      title: "Returns",
      icon: truck2,
      isCollapsible: true,
      subItems: [
        { title: "Sales Return", link: "/sales-return" },
        { title: "Purchase Return", link: "/purchase-return" },
      ],
    },
    // { title: "Sales Return", link: "/sales-return", icon: truck2 },
    // { title: "Purchase Return", link: "/purchase-return", icon: truckreturn },
    { title: "Payment Detail", link: "/payment-detail", icon: wallete },
  ];

  const [collapsedItems, setCollapsedItems] = useState({});

  const toggleCollapse = (title) => {
    setCollapsedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
    // console.log("collapsedItems....", collapsedItems);
  };

  useEffect(() => {
    if (activeTab) {
      setSelectedMenu(activeTab);
    } else {
      setSelectedMenu(<Dashboard />);
    }
  }, [activeTab, setActiveTab]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
    setIsSettingsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  const handleChangePassword = () => {
    handleClose();
    navigate("/company/change-password");
  };

  const handlePoDesgin = () => {
    handleClose();
    navigate("/company/po-templets");
  };

  const handleDocuments = () => {
    handleClose();
    navigate("/company/documents");
  };

  const handleEmployee = () => {
    handleClose();
    navigate("/company/employees");
  };

  const handleTerms = () => {
    handleClose();
    navigate("/company/terms-conditions");
  };

  const [isOpen1, setIsOpen1] = useState(false);

  const openModal = () => {
    setIsOpen1(true);
    setModalTitle("Catalog Updated Successfully!");
    setButtonChange("Submit");
  };

  const closeModal = () => {
    setIsOpen1(false);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/company/profile");
  };

  const handleNavigate = () => {
    handleClose();
    navigate("/login");
    localStorage.removeItem("chemicalToken");
    localStorage.removeItem("myCompanyId");
    localStorage.removeItem("catalogLimit");
    localStorage.removeItem("myEmailId");
    localStorage.removeItem("membershipStatus");
    localStorage.setItem("selectedMenu", "Home");
    setSelectedMenu(null);
  };

  const [openDropdownIndex, setOpenDropdownIndex] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdownIndex(!openDropdownIndex);
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenDropdownIndex(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHome = () => {
    navigate("/company/home");
    setSelectedMenu("Home");
  };

  const [not, setNot] = useState([]);

  const audioRef = useRef(null);

  const playNotificationSound = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Failed to play audio:", error);
        });
      }
    }
  };

  const fetchNotifications = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}api/notification/display`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    const filteredNotifications = data.data.filter(
      (notification) => notification.title !== "Welcome"
    );
    setNot(filteredNotifications);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    socket?.on("newNotification", (newMessage) => {
      setNot((prev) => [...prev, newMessage]);
      setNotifications(newMessage);
      playNotificationSound();
    });

    return () => socket?.off("newNotification");
  }, [socket, notifications, setNotifications]);

  const readNotification = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      const response = await axios.put(
        `${BASE_URL}api/notification/update`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error adding category:", error.response.data.message);
    }
  };

  const navigateInquiryDetail = (e) => {
    setOpenDropdownIndex(false);
    navigate(`/company/buying-inquiry-detail/${e}`);
  };

  const profileRef = useRef(null);

  // Click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20"
        } bg-darkBlue  z-2 p-5  pt-8 relative duration-300 h-screen flex flex-col`}
      >
        <div className="flex gap-x-4 items-center relative ">
          <FontAwesomeIcon
            className="text-white cursor-pointer w-6 h-6 absolute top-0 right-0"
            onClick={() => setOpen(!open)}
            icon={open ? faCircleArrowLeft : faCircleArrowRight}
          />
          <h1
            className={`text-white origin-left font-semibold text-4xl duration-200 cursor-pointer ${
              !open && "scale-0"
            }`}
            onClick={handleHome}
          >
            <img src={Logo} alt="" className="w-[200px]" />
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-container">
          <ul className="pt-6 h-full flex flex-col gap-4">
            {Menus.map((Menu, index) => (
              <li key={index}>
                {Menu.isCollapsible ? (
                  <div>
                    <div
                      className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-7 
              ${Menu.gap ? "mt-9" : "mt-[2px]"} ${
                        selectedMenu === Menu.title ? "bg-white/[0.2]" : ""
                      }`}
                      onClick={() => toggleCollapse(Menu.title)}
                    >
                      <div className="w-25px">
                        <img
                          src={Menu.icon}
                          alt=""
                          className={`w-6 ${
                            Menu.title === "Inquiries" ? `h-[23px]` : `h-[18px]`
                          }`}
                        />
                      </div>
                      {open && (
                        <>
                          <span className="origin-left text-[16px] text-slate-300 duration-200 flex-1">
                            {Menu.title}
                          </span>
                          <FontAwesomeIcon
                            icon={
                              collapsedItems[Menu.title]
                                ? faChevronDown
                                : faChevronRight
                            }
                            className="text-slate-300 text-sm"
                          />
                        </>
                      )}
                    </div>

                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        collapsedItems[Menu.title]
                          ? "max-h-[500px] opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      {Menu.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={`/company${subItem.link}`}
                          onClick={() =>
                            handleMenuClick(subItem.component, subItem.title)
                          }
                          className={`flex rounded-md p-2 pl-[73px] cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center
                  ${selectedMenu === subItem.title ? "bg-white/[0.2]" : ""}`}
                        >
                          <span
                            className={`${
                              !open && "hidden"
                            } origin-left text-[16px] text-slate-300 duration-200`}
                          >
                            {subItem.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-7 
            ${Menu.gap ? "mt-9" : "mt-[2px]"} ${
                      selectedMenu === Menu.title ? "bg-white/[0.2]" : ""
                    }`}
                    to={`/company${Menu.link}`}
                    onClick={() => handleMenuClick(Menu.component, Menu.title)}
                  >
                    <img src={Menu.icon} alt="" className="w-5 h-[18px]" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left text-[16px] text-slate-300 duration-200`}
                    >
                      {Menu.title}
                    </span>
                  </Link>
                )}
              </li>
            ))}

            {/* Logout button remains the same */}
            <li className="flex rounded-md p-2 pb-0 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-7">
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="text-slate-300 text-lg w-6"
              />
              {open && (
                <button
                  onClick={openModal}
                  className="origin-left text-lg text-slate-300 duration-200"
                >
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>

      <audio ref={audioRef} src={notiSound} />

      {isOpen1 && (
        <div
          class="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div class="fixed inset-0 z-10 w-screen flex items-center justify-center">
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-md p-6">
              <div class="bg-white py-3">
                <div class="flex flex-col items-center">
                  <img src={right} alt="" className="h-[80px]" />
                  <h3 className="font-semibold text-2xl mt-4 text-center">
                    Are you sure you want to logout?
                  </h3>
                </div>
              </div>
              <div class="bg-white mx-8 py-3">
                <button
                  onClick={handleNavigate}
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-3 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%] mb-3"
                >
                  Yes
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen overflow-x-hidden w-full flex-1 md:p-4">
        <style>
          {`
            /* Hide the scrollbar */
            /* For WebKit (Chrome, Safari, etc.) */
            ::-webkit-scrollbar {
                 width: 8px;
                height: 8px;
            }
            /* For Firefox */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* Internet Explorer 10+ */
        `}
        </style>
        <div className="flex justify-end items-center gap-2 ">
          <div
            onClick={() => toggleDropdown()}
            className="cursor-pointer relative me-4 w-[30px]"
            ref={notificationRef}
          >
            <img
              src={notification}
              onClick={readNotification}
              alt=""
              className="h-[25px] cursor-pointer"
            />
            <span className="absolute bg-red-500 text-white rounded-full text-xs px-1  top-[-8px] right-[-8px]">
              {not.filter((item) => item.status === "unread").length}
            </span>
          </div>
          {openDropdownIndex && (
            <div
              ref={dropdownRef}
              className="max-h-[300px] overflow-scroll pt-5 pe-4 ps-2 absolute z-10 sm:right-[7.5%] sm:top-[11.75%] top-[7%] right-[20%] mt-2 sm: w-96 w-[300px] origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-xl outline-none"
            >
              <div className="py-2 px-3">
                {not &&
                  [...not].reverse().map((e) => (
                    <div>
                      <p className="font-semibold text-sm">{e.title}</p>
                      <p className="text-xs mt-1">{e.message}</p>
                      {e.inquiry_id && e.inquiry_id !== "" && (
                        <p
                          className="text-xs cursor-pointer underline text-blue-400 hover:text-blue-600"
                          onClick={() => navigateInquiryDetail(e?.inquiry_id)}
                        >
                          view
                        </p>
                      )}
                      <p className="text-xs text-gray-400 text-end border-b-2 border-gray-300 mb-2 pb-2">
                        {e.createdAt.slice(11, 16)}{" "}
                        <span>({formatDate(e.createdAt)})</span>
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 "
                onClick={toggleMenu}
              >
                {myProfile?.other_info?.[0]?.logo ? (
                  <img
                    src={myProfile?.other_info?.[0]?.logo}
                    alt=""
                    className="mb-2 h-[50px] w-[50px] rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <p className="text-xl font-semibold text-gray-600">
                      {getInitials(myProfile?.company_name)}
                    </p>
                  </div>
                )}
              </button>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
              <div
                ref={profileRef}
                className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
                id="dropdown-menu"
              >
                <div className="py-1" role="none">
                  <a
                    className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-end"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                    onClick={handleProfile}
                  >
                    Profile
                  </a>
                  {/* <a
                    className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-end"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                    onClick={handleEmployee}
                  >
                    Employees
                  </a> */}
                  {myProfile?.mode_of_business?.includes("manufacture") && (
                    <a
                      className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-end"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-0"
                      onClick={handleDocuments}
                    >
                      Facility Documents
                    </a>
                  )}
                  <div className="relative">
                    <a
                      className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer flex justify-between"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-2"
                      onClick={toggleSettingsMenu}
                    >
                      <p>
                        <FontAwesomeIcon
                          icon={isSettingsOpen ? faAngleRight : faAngleLeft}
                        />
                      </p>
                      <p>Settings</p>
                    </a>

                    {isSettingsOpen && (
                      <div className="absolute right-[10%] top-[100%] sm:right-[100%] sm:top-[10%] me-2 mt-0.5 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-2">
                        <a
                          className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer"
                          role="menuitem"
                          tabIndex="-1"
                          id="sub-menu-item-1"
                          onClick={handleChangePassword}
                        >
                          Change Password
                        </a>
                        <a
                          className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer"
                          role="menuitem"
                          tabIndex="-1"
                          id="sub-menu-item-2"
                          onClick={handlePoDesgin}
                        >
                          PO/Invoice Design
                        </a>
                        <a
                          className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer"
                          role="menuitem"
                          tabIndex="-1"
                          id="sub-menu-item-2"
                          onClick={handleTerms}
                        >
                          Terms & Condition
                        </a>
                        {/* Add more sub-menu items as needed */}
                      </div>
                    )}
                  </div>

                  <a
                    className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-end"
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-3"
                    onClick={openModal}
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <Routes>
          <Route path="" element={<DashBoard />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/product-detail-and-suppliers/:_id"
            element={<ProductDetails />}
          />
          <Route path="/buy-inquiry/:_id" element={<MyBuyingInquiry />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="employees" element={<Employees />} />
          <Route path="purchase-data" element={<Purchasedata />} />
          <Route path="delete-inquiries" element={<POgenarate />} />
          <Route path="sales-data" element={<SalseData />} />
          <Route path="documents" element={<MyDocuments />} />
          <Route path="po-templets" element={<PoDesigns />} />
          <Route path="catalog" element={<MyCataLog />} />
          <Route path="selling-inquiry" element={<SellingInquiry />} />
          <Route path="buying-inquiry" element={<BuyingInquiry />} />
          <Route path="profile" element={<Myprofile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="insert-chemical" element={<Addchemical />} />
          <Route path="/selling-inquiry-detail/:_id" element={<Message />} />
          <Route
            path="/buying-inquiry-detail/:_id"
            element={<Buying_inquiry_detail />}
          />

          <Route path="/edit-invoice/:_id?" element={<Editinvoice />} />
          <Route
            path="/genarate-manual-invoice"
            element={<GenerateManualInvoice />}
          />
          <Route
            path="/generate-inquiry-invoice/:_id?"
            element={<GenerateAutomaticInvoice />}
          />

          <Route path="/edit-po/:_id?" element={<EditPo />} />
          <Route path="/generate-po/:_id?" element={<GeneratePo />} />
          <Route
            path="/generate-new-manual-po/"
            element={<GenerateManualPo />}
          />
          <Route path="/edit-manual-po/:_id?" element={<EditManualPo />} />
          <Route
            path="/generate-new-inquiry-po/:_id?"
            element={<GenerateAutomaticPo />}
          />

          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/packages" element={<Packages />} />
          <Route
            path="/PackagePayment/:_id/:merchentId?"
            element={<PackagePayment />}
          />
          <Route
            path="/payment-status/:merchantTransactionId?"
            element={<PaymentStatus/>}
          />
          <Route path="/sales-return" element={<Salesreturn />} />
          <Route path="/purchase-return" element={<Purchasereturn />} />
          <Route path="/payment-detail" element={<PaymentDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default SideBar;
