import React, { useEffect, useState } from 'react';
import { faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// toaster 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import loader from "../images/loading.png"
import { BASE_URL } from '../BASE_URL';

const MyDocuments = () => {

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchDocumentData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/documents/getallDetails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()
    setDocuments(data?.documentDetails)
  }

  useEffect(() => {
    fetchDocumentData();
  }, []);

  const [activeLink, setActiveLink] = useState('all');

  const filteredCatalogList = documents?.filter((item) => {
    if (activeLink === 'all') return true;
    if (activeLink === 'approved') return item.status === 'active';
    if (activeLink === 'rejected') return item.status === 'inactive';
    if (activeLink === 'pending') return item.status === 'pending';
    if (activeLink === 'expired') return item.status === 'expired';
    return false;
  });

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const [modalTitle, setModalTitle] = useState('');
  const [buttonChange, setButtonChange] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setModalTitle("Upload Document")
    setButtonChange("Submit")
  };

  const [certificate_id, setCertificate_id] = useState("")

  const handleEdit = (item) => {
    setIsOpen(true);
    setCertificate(item.certificate_name)
    setCertificateNo(item.certificate_no)
    if (item.issue_date) {
      const dateObj = new Date(item.issue_date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      setStartDate(formattedDate);
    }
    if (item.valid_till) {
      const dateObj = new Date(item.valid_till);
      const formattedDate = dateObj.toISOString().split('T')[0];
      setEndDate(formattedDate);
    }
    setFile(item.doc_file)
    setCertificate_id(item._id)
    setModalTitle("Edit Document")
    setButtonChange("Save Changes")
  };

  const closeModal = () => {
    setCertificate('')
    setCertificateNo('')
    setStartDate('')
    setEndDate('')
    setFile('')
    setIsVerified(false)
    setSelectedFile(null);
    setIsOpen(false);
  };

  const [certificate, setCertificate] = useState('');
  const [certificateNo, setCertificateNo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleCertificateChange = (e) => {
    setCertificate(e.target.value);
  };

  const handleCertificateNoChange = (e) => {
    setCertificateNo(e.target.value);
  };

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]; // Calculate tomorrow's date

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (e.target.value >= endDate) {
      setEndDate(''); // Clear endDate if startDate is later or equal to endDate
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileURL, setFileURL] = useState('');


  const handleFileChange = (e) => {
    const { name, value, type, files } = e.target;
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 2 * 1024 * 1024) { // Check for PDF and max size of 2 MB
      setFile(files[0])
      setSelectedFile(file);
      setFileURL(URL.createObjectURL(file)); // Create a URL for the selected file
    } else {
      setFile('')
      setSelectedFile(null);
      setFileURL('');
      alert('Please upload a PDF file with a size of max 2 MB.');
    }
  };

  const handleCheckboxChange = (e) => {
    setIsVerified(e.target.checked);
  };

  const handleDeactivate = async () => {

    if (!certificate && !certificateNo && !startDate && !endDate && !file) {
      toast.error('Please Fill All Fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!certificate) {
      toast.error('Please Select Certificate!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!certificateNo) {
      toast.error('Please Enter Certificate Number!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!startDate) {
      toast.error('Please Select Start Date!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!endDate) {
      toast.error('Please Select End Date!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!file) {
      toast.error('Please Select Document!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!isVerified) {
      toast.error('Please Check Our Privacy Policy!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    setLoading(true)

    const formData = new FormData();
    formData.append('certificate_name', certificate);
    formData.append('certificate_no', certificateNo);
    formData.append('issue_date', startDate);
    formData.append('valid_till', endDate);
    formData.append('doc_file', file);
    formData.append('status', 'active');

    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

    if (modalTitle === "Edit Document") {
      try {
        const response = await axios.put(
          `${BASE_URL}api/documents/updates/${certificate_id}`,
          formData,
          {
            headers: {
              'Authorization': token,
            },
          }
        );

        setLoading(false)

        if (response.status === 200) {
          fetchDocumentData()
          setTimeout(() => {
            closeModal();
            toast.success('Document Updated Successfully!', {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 1000,
            });
          }, 1000);
          setCertificate('')
          setCertificateNo('')
          setStartDate('')
          setEndDate('')
          setFile('')
          setIsVerified(false)
          setSelectedFile(null);

        } else {
          toast.error(response.error, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
        }
      } catch (error) {
        setLoading(false)
        console.error("Error adding category:", error.response.data.error);
        toast.error(error.response.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      }
    } else {
      try {
        const response = await axios.post(
          `${BASE_URL}api/documents/creates`,
          formData,
          {
            headers: {
              'Authorization': token,
            },
          }
        );

        setLoading(false)

        if (response.status === 201) {
          fetchDocumentData();
          closeModal();
          toast.success('Document Added Successfully!', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
          setCertificate('')
          setCertificateNo('')
          setStartDate('')
          setEndDate('')
          setFile('')
          setIsVerified(false)
          setSelectedFile(null);

        } else {
          toast.error('Error In Submitting Data!', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
        }
      } catch (error) {
        setLoading(false)
        console.error("Error adding category:", error.response.data.error);
        toast.error(error.response.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      }
    }
  };

  const certificateArray = [
    { name: "GMP" },
    { name: "cGMP" },
    { name: "FDA" },
    { name: "USFDA" },
    { name: "ISO 9001:2015" },
    { name: "ISO 14001:2015" },
    { name: "Other" },
  ]

  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="w-full    overflow-x-hidden">
      <div className="flex flex-col p-2">
        <h1 className="md:text-3xl text-xl font-semibold">Facility Documents Management</h1>

        <div className="flex gap-7 mt-7">
          <span
            className={`cursor-pointer pb-2 ${activeLink === 'all' && 'border-b-2 border-black'}`}
            onClick={() => handleLinkClick('all')}
          >
            All
            <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
              {documents?.length || 0}
            </span>
          </span>
          <span
            className={`cursor-pointer pb-2 ${activeLink === 'approved' && 'border-b-2 border-black'}`}
            onClick={() => handleLinkClick('approved')}
          >
            Approved
            <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
              {documents?.filter(item => item?.status === 'active')?.length || 0}
            </span>
          </span>
          <span
            className={`cursor-pointer pb-2 ${activeLink === 'rejected' && 'border-b-2 border-black'}`}
            onClick={() => handleLinkClick('rejected')}
          >
            Rejected
            <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
              {documents?.filter(item => item?.status === 'inactive')?.length || 0}
            </span>
          </span>
          <span
            className={`cursor-pointer pb-2 ${activeLink === 'pending' && 'border-b-2 border-black'}`}
            onClick={() => handleLinkClick('pending')}
          >
            Pending
            <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
              {documents?.filter(item => item?.status === 'pending')?.length || 0}
            </span>
          </span>
          <span
            className={`cursor-pointer pb-2 ${activeLink === 'expired' && 'border-b-2 border-black'}`}
            onClick={() => handleLinkClick('expired')}
          >
            Expired
            <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
              {documents?.filter(item => item?.status === 'expired')?.length || 0}
            </span>
          </span>
        </div>


        <ToastContainer />

        {/*------------------------- modal  --------------------------------*/}

        {isOpen && (
          <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 flex items-center justify-center w-screen overflow-y-auto">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white py-3 px-5">
                  <div className="sm:flex sm:items-start">
                    <h3 className="font-medium text-xl">{modalTitle}</h3>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 py-5 sm:px-6">
                  <div>
                    <div className="flex gap-4 mb-5">
                      <div className="w-full">
                        <p className="mb-1 text-xs">Select Certificate</p>
                        <select
                          value={certificate}
                          onChange={handleCertificateChange}
                          className="w-full bg-transparent border-2 text-slate-500 rounded text-sm py-1 px-3"
                        >
                          <option value="" disabled selected>Select Certificate</option>
                          {certificateArray.map((e) => (
                            <option key={e.name} value={e.name}>{e.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full">
                        <p className="mb-1 text-xs">Enter Certificate No.</p>
                        <input
                          type="text"
                          value={certificateNo}
                          // onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
                          onChange={handleCertificateNoChange}
                          className="bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 px-3 py-1"
                          placeholder="Certificate No."
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mb-5">
                      <div className="w-full">
                        <p className="mb-1 text-xs">Issue Date</p>
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                          max={today}
                          className="py-1 px-3 bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500"
                        />
                      </div>
                      <div className="w-full">
                        <p className="mb-1 text-xs">Valid Till</p>
                        <input
                          type="date"
                          value={endDate}
                          onChange={handleEndDateChange}
                          min={startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toISOString().split('T')[0] : tomorrow}
                          className="px-3 bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500 py-1"
                        />
                      </div>
                    </div>
                    <div className="mb-5">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="py-1 px-3 bg-transparent border-2 w-full rounded text-sm placeholder:text-slate-500"
                      />
                      <p className="text-xs text-gray-400">Note: Upload Only PDF File with Size of Max 2 MB</p>
                      {selectedFile ? (
                        <a href={fileURL} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : file ? (
                        <a href={file} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : null}
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isVerified}
                        onChange={handleCheckboxChange}
                        className="mt-1"
                      />
                      <p className="text-xs">I Verify that the uploaded document is real. If it was fake, then strict action will be taken against me according to the privacy policy. I have read all the <span className="text-blue-600 font-semibold underline cursor-pointer">terms and conditions</span>.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white flex justify-end gap-3 mx-8 py-3">
                  <button onClick={closeModal} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                  {loading ? (
                    <div className="bg-darkBlue w-[80px] ml-4 flex items-center justify-center rounded-lg">
                      <img src={loader} alt="" className="animate-spin h-[30px]" />
                    </div>
                  ) : (
                    <button onClick={handleDeactivate} type="button" className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm bg-[#0A122A] sm:mt-0 sm:w-auto">{buttonChange}</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


        <hr className="my-4 border-t-2 border-gray-200" />

        <div className="flex gap-3 items-center relative">
          <FontAwesomeIcon icon={faSearch} className="absolute top-3 left-4" />
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search..."
            className="bg-gray-100 md:w-[82%] w-[80%] text-gray-800 pl-10 py-2 outline-none rounded-md"
          />
          <button onClick={openModal} className="bg-darkBlue md:flex hidden items-center justify-center w-[18%] py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
            <FontAwesomeIcon icon={faPlus} /> Add New Document
          </button>

          <button onClick={openModal} className="md:hidden bg-darkBlue flex items-center justify-center px-4 py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-screen">
          <table style={{ border: "none" }} className="table-auto w-full border-0 mt-6">
            <tbody>
              {filteredCatalogList && filteredCatalogList?.filter((e) => e?.certificate_no?.toLowerCase()?.includes(searchQuery?.toLowerCase()))?.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className={`flex py-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                    <td className="px-2 py-2 flex flex-col sm:justify-center justify-start font-semibold">
                      {index + 1}
                    </td>
                    <td className="ps-6 pe-12 py-2 flex flex-col w-[200px]">
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Certificate Name</h2>
                      <p className='font-semibold text-[18px] sm:w-auto w-[150px]'>{item.certificate_name}</p>
                    </td>
                    <td className=" pe-12 py-2 flex flex-col w-[180px]">
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Certificate No.</h2>
                      <p className='font-semibold text-[18px] sm:w-auto w-[120px]'>{item.certificate_no}</p>
                    </td>
                    <td className="pe-20 py-2 flex flex-col w-[350px]">
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Issue Date - Valid Till</h2>
                      <p className='font-semibold text-[18px] sm:w-auto w-[100px]'>{item?.issue_date?.slice(0, 10)} - {item?.valid_till?.slice(0, 10)}</p>
                    </td>
                    <td className=" pe-12 py-2 flex flex-col w-[130px]">
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Status</h2>
                      <p className='font-semibold text-[14px] bg-yellow-200 text-black px-2 py-1 rounded-md'>{item.status}</p>
                    </td>
                    <td className="pe-12 py-2 flex flex-col w-[80px]">
                      <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Link</h2>
                      <a href={item.doc_file} target='_blank' className='underline'>view</a>
                    </td>
                    <td className="cursor-pointer w-[150px] px-4 py-2 flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3" onClick={() => handleEdit(item)}>Edit <FontAwesomeIcon icon={faPencil} /> </td>
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

export default MyDocuments;
