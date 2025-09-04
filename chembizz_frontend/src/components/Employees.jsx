import React, { useEffect, useState } from 'react';
import { faPlus, faSearch, faPencil, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import loader from "../images/loading.png"
import { BASE_URL } from '../BASE_URL';

const Employees = () => {

  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])

  const fetchEmployeeData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/employeess`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()
    setEmployees(data.employees)
  }

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const [activeLink, setActiveLink] = useState('all');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const [modalTitle, setModalTitle] = useState('');
  const [buttonChange, setButtonChange] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setModalTitle("Add New Employee")
    setButtonChange("Submit")
  };

  const [employee_id, setEmployee_id] = useState("")


  const handleEdit = (item) => {
    setIsOpen(true);
    setEmployee_id(item._id)
    setEmployeeName(item.employee_name)
    setDesignation(item.designation)
    setEmail(item.emailid)
    setMobileNo(item.mobile_no)
    setPassword(item.password)
    setModalTitle("Edit Employee")
    setButtonChange("Save Changes")
  };

  const closeModal = () => {
    setIsOpen(false);
  };



  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDeactivate = async () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!employeeName.trim() && !designation.trim() && !email.trim() && !mobileNo && !password.trim()) {
      toast.error('Please Fill All Fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!employeeName.trim()) {
      toast.error('Please Enter Employee Name!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!designation.trim()) {
      toast.error('Please Enter Designation!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!email.trim()) {
      toast.error('Please Enter Email Address!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!emailRegex.test(email.trim())) {
      toast.error('Please Enter Valid Email Address!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!mobileNo) {
      toast.error('Please Enter Mobile Nubmer!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (mobileNo.length < 10) {
      toast.error('Please Enter Valid Mobile Nubmer!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }
    if (!password.trim()) {
      toast.error('Please Enter Password!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    setLoading(true)

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

    if (modalTitle === "Edit Employee") {
      try {
        const response = await axios.put(
          `${BASE_URL}api/employeess/${employee_id}`,
          {
            employee_name: employeeName,
            designation: designation,
            emailid: email,
            mobile_no: mobileNo,
            password: password,
            status: "active",
          },
          {
            headers: {
              'Authorization': token,
            },
          }
        );

        if (response.status === 200) {
          setLoading(false)
          fetchEmployeeData()
          setTimeout(() => {
            closeModal();
            toast.success('Employee Updated Successfully!', {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 1000,
            });
          }, 1000);
          setEmployeeName('')
          setDesignation('')
          setEmail('')
          setMobileNo('')
          setPassword('')

        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error adding category:", error.message);
        setLoading(false)
      }
    } else {
      try {
        const response = await axios.post(
          `${BASE_URL}api/employeess`,
          {
            employee_name: employeeName,
            designation: designation,
            emailid: email,
            mobile_no: mobileNo,
            password: password,
            status: "active",
          },
          {
            headers: {
              'Authorization': token, // Include the token in the request headers
            },
          }
        );

        if (response.status === 201) {
          setLoading(false)
          fetchEmployeeData()
          setTimeout(() => {
            closeModal();
            toast.success('Employee Added Successfully!', {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 1000,
            });
          }, 1000);
          setEmployeeName('')
          setDesignation('')
          setEmail('')
          setMobileNo('')
          setPassword('')

        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        console.error("Error adding category:", error.message);
      }
    }

  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const [dropdownStates, setDropdownStates] = useState(new Array(employees.length).fill(false));


  const toggleDropdown = (index, item) => {
    setEmployee_id(item._id)
    setSelectedStatus(item.status)
    const newDropdownStates = [...dropdownStates];
    newDropdownStates[index] = !newDropdownStates[index];
    setDropdownStates(newDropdownStates);
  };

  const validateInput = (input) => {
    return /^[A-Za-z\s.'-]*$/.test(input); // Modify the regex pattern as per your requirement
  };

  const [selectedStatus, setSelectedStatus] = useState('');

  const handleStatusSelection = (status) => {
    setSelectedStatus(status);
  };

  const handleApply = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      const response = await axios.put(
        `${BASE_URL}api/employeess/${employee_id}`,
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
        fetchEmployeeData();
        setDropdownStates(new Array(employees.length).fill(false));
        toast.success("Status updated successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      } else {
        toast.error("Error To Update Status", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      }
    } catch (error) {
      // Handle error
      setDropdownStates(new Array(employees.length).fill(false));
      toast.error(error.response.data.error, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      console.error("Error updating status:", error.message);
    }
  };

  const handleCancelDropdown = () => {
    setDropdownStates(new Array(employees.length).fill(false));
  };

  const filteredCatalogList = employees && employees.filter((item) => {
    if (activeLink === 'all') return true;
    if (activeLink === 'active') return item.status === 'active';
    if (activeLink === 'inactive') return item.status === 'inactive';
    return false;
  });

  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="w-full   overflow-x-hidden">
      <div className="flex flex-col p-2">
        <h1 className="md:text-3xl text-xl font-semibold ">Employee Management</h1>

        <div className="flex gap-7 mt-7">
          <span
            className={`cursor-pointer pb-2 ${activeLink === 'all' && 'border-b-2 border-black'}`}
            onClick={() => handleLinkClick('all')}
          >
            All
            <span className=' px-1 bg-slate-200 rounded-full text-xs ms-1'>{employees.length}</span>
          </span>
          <span
            className={`cursor-pointer pb-2 ${activeLink === 'active' && 'border-b-2 border-black'}`}
            onClick={() => handleLinkClick('active')}
          >
            Active
            <span className=' px-1 bg-slate-200 rounded-full text-xs ms-1'>{employees?.filter(item => item.status === 'active').length}</span>
          </span>

          <span
            className={`cursor-pointer pb-2 ${activeLink === 'inactive' && 'border-b-2 border-black'}`}
            onClick={() => handleLinkClick('inactive')}
          >
            Inactive
            <span className=' px-1 bg-slate-200 rounded-full text-xs ms-1'>{employees?.filter(item => item.status === 'inactive').length}</span>
          </span>
        </div>
        <hr className="my-4 border-t-2 border-gray-200" />

        <div className="flex gap-3 items-center relative">
          <FontAwesomeIcon icon={faSearch} className="absolute top-3 left-4" />
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search..."
            className="bg-gray-100 md:w-[85%] w-[80%] text-gray-800 pl-10 py-2 outline-none rounded-md"
          />
          <button onClick={openModal} className="bg-darkBlue md:flex hidden items-center justify-center w-[15%] py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Employee
          </button>

          <button onClick={openModal} className="md:hidden bg-darkBlue flex items-center justify-center px-4 py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <ToastContainer />
        {isOpen && (
          <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 flex items-center justify-center w-screen overflow-y-auto">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <div className="bg-white py-3 px-8">
                  <div className="sm:flex sm:items-start">
                    <h3 className="font-medium text-xl">{modalTitle}</h3>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 py-5 sm:px-8">
                  <div>
                    <div className="mb-4">
                      <p className="mb-2 text-sm text-gray-500">Employee Name</p>
                      <input
                        type="text"
                        value={employeeName}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (validateInput(inputValue) || inputValue === '') {
                            setEmployeeName(inputValue);
                          }
                        }}
                        className="border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-2"
                      />
                    </div>
                    <div className="mb-4">
                      <p className="mb-2 text-sm text-gray-500">Team</p>
                      <select
                        name=""
                        id=""
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-2"
                      >
                        <option value="">Select</option>
                        <option value="Sales Team">Sales Team</option>
                        <option value="Sourcing Team">Sourcing Team</option>
                        <option value="Accounting Team">Accounting Team</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <p className="mb-2 text-sm text-gray-500">Email</p>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-2"
                      />
                    </div>
                    <div className="mb-4">
                      <p className="mb-2 text-sm text-gray-500">Mobile No.</p>
                      <input
                        type="tel"
                        onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                        maxLength={10}
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        className="border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-2"
                      />
                    </div>
                    <div className="mb-4 relative">
                      <p className="mb-2 text-sm text-gray-500">Password</p>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value.trim())}
                        className="border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-2"
                      />
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                        className="absolute bottom-[19%] right-[3%] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white flex justify-end gap-3 mx-8 py-3">
                  <button onClick={closeModal} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                  <button onClick={handleDeactivate} type="button" className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-[#0A122A] sm:mt-0 sm:w-auto">
                    {loading ? (
                      <img src={loader} alt="" className="h-[20px] px-4 animate-spin" />
                    ) : (
                      <>
                        {buttonChange}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto max-h-screen pb-[200px]">
          <table style={{ border: "none" }} className="table-auto w-full border-0 mt-6">
            <tbody>
              {filteredCatalogList?.filter((e) => e?.employee_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())).map((item, index) => (
                <React.Fragment key={index}>
                  <tr className={`flex py-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                    <td className=" px-4 py-2 flex flex-col sm:justify-center justify-start  font-semibold">
                      {index + 1}
                    </td>
                    <td className=" ps-6 pe-20 py-2 flex flex-col w-[250px]">
                      <p className=' font-semibold text-[18px]'>{item.employee_name}</p>
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">{item?.designation}</h2>
                    </td>
                    <td className=" pe-20 py-2 flex flex-col w-[320px]">
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Email</h2>
                      <p className='font-semibold text-[18px]'>{item.emailid}</p>
                    </td>
                    <td className="pe-20 py-2 flex flex-col w-[180px]">
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Mobile No.</h2>
                      <p className='font-semibold text-[18px]'>{item.mobile_no}</p>
                    </td>

                    <td className=" pe-12 py-2 flex flex-col w-[120px]">
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%] mb-1">Status</h2>
                      {/* <p className="font-semibold text-[14px] bg-[#E1FCEF] text-[#14804A] px-1 py-1">{item.status}</p> */}

                      <div className="relative">
                        <button
                          id="multiLevelDropdownButton"
                          onClick={() => toggleDropdown(index, item)}
                          className="flex items-center"
                          type="button"
                        >
                          {item.status === "active" ? (
                            <>
                              <ul className='bg-green-100 rounded-lg'>
                                <li className='text-xs py-1 px-2 '>Active</li>
                              </ul>
                            </>
                          ) : (
                            <>
                              <ul className='bg-red-100 rounded-lg'>
                                <li className='text-xs py-1 px-2 '>Inactive</li>
                              </ul>
                            </>
                          )}
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
                        </button>

                        {dropdownStates[index] && (
                          <div
                            id="multi-dropdown"
                            className="z-10 absolute top-7 left-[-75%] mt-1 bg-white rounded-lg shadow-lg w-64">
                            <ul className="text-sm" aria-labelledby="multiLevelDropdownButton">
                              <li>

                              </li>
                            </ul>
                            <div className="py-3">
                              <h1 className="text-sm font-semibold px-3 mb-2">Change status</h1>
                              <div className="bg-blue-50 px-3 py-4">
                                <p
                                  className={`text-sm font-medium mb-4 py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'active' ? 'bg-darkBlue text-white' : ''
                                    }`}
                                  onClick={() => handleStatusSelection('active')}
                                >
                                  ACTIVE
                                </p>
                                <p
                                  className={`text-sm font-medium py-1 ps-2 cursor-pointer rounded ${selectedStatus === 'inactive' ? 'bg-darkBlue text-white' : ''
                                    }`}
                                  onClick={() => handleStatusSelection('inactive')}
                                >
                                  INACTIVE
                                </p>
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

                    </td>
                    <td className="text-sm cursor-pointer px-4 py-2 w-[100px] flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3" onClick={() => handleEdit(item)}>Edit <FontAwesomeIcon icon={faPencil} /> </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
