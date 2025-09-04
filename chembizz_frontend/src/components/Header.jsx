import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../images/chembizz-navbar.png"
import { BASE_URL } from '../BASE_URL';

const Header = () => {
    let Links = [
        { name: "Who we serve", link: "/" },
        { name: "Solutions", link: "/" },

    ];

    let Links2 = [
        { name: "Tradepass", link: "" },
        { name: "Pricing", link: "/pricing" },
        { name: "Buy", link: "/buying" },
        { name: "Blog", link: "/blogs" },
        { name: "Contact Us", link: "/contact" },
    ]

    let Links3 = [
        { name: "Dashbord", link: "/company" },
        { name: "Home", link: "/company/home" },
        { name: "Tradepass", link: "" },
        { name: "Pricing", link: "/pricing" },
        { name: "Buy", link: "/buying" },
        { name: "Blog", link: "/blogs" },
        { name: "Contact Us", link: "/contact" },
    ]
    let [open, setOpen] = useState(false);

    const [myProfile, setMyProfile] = useState("")

    const token = localStorage.getItem("chemicalToken")

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
        setMyProfile(data.companyDetails?.[0]);

    }

    useEffect(() => {
        fetchUserData()
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(!isOpen);
    }

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login")
        localStorage.removeItem("chemicalToken")
        localStorage.removeItem("myCompanyId")
        localStorage.setItem('selectedMenu', "Home");
    }

    const handleDashboard = () => {
        handleClose()
        navigate("/company/home")
    }

    const handleDocuments = () => {
        handleClose()
        navigate("/company/documents")
    }

    const handleEmployee = () => {
        handleClose()
        navigate("/company/employees")
    }

    const handleProfile = () => {
        handleClose()
        navigate("/company/profile")
    }

    const handleLoginTo = () => {
        setOpen(false)
        navigate("/login")
    }

    return (

        <div className="my-container">
            <div className='bg-white shadow-md '>
                <div className='navbar-container'>
                    <div className='lg:relative w-full py-2 bottom-2  top-0 left-0'>
                        <div className='lg:flex items-center justify-between md:px-0 px-1 z-50'>
                            {/* logo section */}
                            <div className='font-medium  cursor-pointer flex items-center gap-1'>
                                <Link className='flex gap-2 md:pr-10' to="/">
                                    <img src={Logo} alt="" className='w-[200px]' />
                                    {/* <h1 className='text-darkBlue text-2xl ps-2 font-semibold'>ChemBizZ</h1> */}
                                </Link>
                                <ul className={`hidden lg:flex lg:items-center lg:pb-0 sm:pb-12 pb-4 absolute lg:static bg-white lg:z-auto z-50  left-0 w-full lg:w-auto lg:px-4 pl-9 transition-all duration-500 ease-in ${open ? 'top-16 shadow-lg ' : 'top-[-490px]'}`}>
                                    <li className='flex items-center gap-2 px-2 font-semibold' style={{ whiteSpace: 'nowrap' }}>
                                        <Link to="/about" onClick={() => setOpen(false)} className='text-[#0A122A] md:p-0 p-4 text-center flex items-center justify-center gap-2 hover:text-blue-400 duration-500'>
                                            About
                                        </Link>
                                    </li>

                                    {Links2.map((link) => (
                                        <li key={link.name} className='flex items-center gap-2 px-2 font-semibold' style={{ whiteSpace: 'nowrap' }}>
                                            <Link to={link.link} onClick={() => setOpen(false)} className='text-[#0A122A] md:p-0 p-4 text-center hover:text-blue-400 duration-500'>
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}

                                    <div className='lg:hidden flex flex-col gap-4 pl-2 '>
                                        <div onClick={handleLoginTo}>
                                            <button className='btn bg-darkBlue text-white font-semibold px-3 py-2 rounded duration-500 '>Login</button>
                                        </div>
                                    </div>

                                </ul>
                                <ul className={`flex flex-col lg:hidden lg:items-center lg:pb-0 sm:pb-12 pb-4 absolute lg:static bg-white lg:z-auto z-50  left-0 w-full lg:w-auto lg:px-4 pl-9 transition-all duration-500 ease-in ${open ? 'top-16 shadow-lg ' : 'top-[-490px]'}`}>

                                    {Links3.map((link) => (
                                        <li key={link.name} className='flex items-center gap-2 px-2 font-semibold' style={{ whiteSpace: 'nowrap' }}>
                                            <Link to={link.link} onClick={() => setOpen(false)} className='text-[#0A122A] md:p-0 p-4 text-center hover:text-blue-400 duration-500'>
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}

                                    <li className='flex items-center gap-2 px-2 font-semibold' style={{ whiteSpace: 'nowrap' }}>
                                        <Link onClick={() => setOpen(false)} to="/about" className='text-[#0A122A] md:p-0 p-4 text-center flex items-center justify-center gap-2 hover:text-blue-400 duration-500'>
                                            About
                                        </Link>
                                    </li>

                                    <div className='lg:hidden flex flex-col gap-4 pl-2 '>
                                    {!token ? (
                                        <Link to="/login" onClick={() => setOpen(false)}>
                                            <button className='btn bg-darkBlue text-white font-semibold px-3 py-2 rounded duration-500 '>Login</button>
                                        </Link>
                                    ) : (
                                        <Link to="/company" onClick={() => setOpen(false)}>
                                            <button className='btn bg-darkBlue text-white font-semibold px-3 py-2 rounded duration-500 '>{myProfile?.company_name}</button>
                                        </Link>
                                    )}
                                    </div>

                                </ul>
                            </div>
                            {/* Menu icon */}
                            <div onClick={() => setOpen(!open)} className='absolute right-4 top-6 cursor-pointer lg:hidden w-7 h-7'>
                                {
                                    open ? <XMarkIcon /> : <Bars3BottomRightIcon />
                                }
                            </div>


                            {/* buttons */}
                            {token ? (
                                <>
                                    <div className='relative hidden sm:block'>
                                        <button className='btn bg-darkBlue text-white font-semibold px-3 py-1 rounded duration-500 ml-4'
                                            id="menu-button"
                                            aria-expanded={isOpen}
                                            aria-haspopup="true"
                                            onClick={toggleMenu}
                                        >{myProfile?.company_name}</button>
                                        {isOpen && (
                                            <div className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1" id="dropdown-menu">
                                                <div className="py-1" role="none">
                                                    <a className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-center" role="menuitem" tabIndex="-1" id="menu-item-0" onClick={handleDashboard}>Dashboard</a>
                                                    <a className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-center" role="menuitem" tabIndex="-1" id="menu-item-0" onClick={handleProfile}>Profile</a>
                                                    <a className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-center" role="menuitem" tabIndex="-1" id="menu-item-0" onClick={handleEmployee}>Employees</a>
                                                    <a className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-center" role="menuitem" tabIndex="-1" id="menu-item-0" onClick={handleDocuments}>Facility Documents</a>
                                                    <a className="text-gray-700 block px-4 py-2 text-sm font-semibold hover:bg-gray-200 cursor-pointer text-center" role="menuitem" tabIndex="-1" id="menu-item-3" onClick={handleLogin}>Logout</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className='lg:flex lg:mr-2 hidden items-center'>
                                    <Link to="/login">
                                        <button className='btn font-semibold px-3 py-1 rounded duration-500'>Login</button>
                                    </Link>

                                    <Link to="/signup">
                                        <button className='btn bg-darkBlue text-white font-semibold px-3 py-1 rounded duration-500 ml-4'>Signup</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;




