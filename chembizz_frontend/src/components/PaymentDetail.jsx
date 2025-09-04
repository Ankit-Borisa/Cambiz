import React, { useEffect, useState } from 'react';
import { faPencil, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../BASE_URL';

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


const PaymentDetail = () => {

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const myCompanyId = localStorage.getItem('myCompanyId')

  const handleEdit = (e) => {
    navigate(`/company/buying-inquiry-detail/${e?.inquiry_id}`)
  };

  const [companySearch, setCompanySearch] = useState('');
  const [inquiryDateQuery, setInquiryDateQuery] = useState('');
  const [paymentDateQuery, setPaymentDateQuery] = useState('');
  const [paymentQuery, setPaymentQuery] = useState('');

  const [payments, setPayments] = useState([])
  // console.log(payments)

  const fetchCatelogData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/payment/paymentList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()
    setPayments(data.data)
  }

  useEffect(() => {
    fetchCatelogData();
  }, []);

  const [focused, setFocused] = useState(false);
  const [focusedS, setFocusedS] = useState(true);
  const [focusedI, setFocusedI] = useState(true);
  const [focusedY, setFocusedY] = useState(true);
  const [focusedD, setFocusedD] = useState(true);

  const [ascending, setAscending] = useState(true);

  const toggleOrder = () => {
    setAscending(prevState => !prevState);
  };

  const handleCompanySearch = (event) => setCompanySearch(event.target.value);
  const handleInquiryDateChange = (event) => setInquiryDateQuery(event.target.value);
  const handlePaymentDateChange = (event) => setPaymentDateQuery(event.target.value);
  const handlePaymentChange = (event) => setPaymentQuery(event.target.value);

  const filteredData = payments.filter(item => {
    const matchesCompany = item?.Inquiry_details?.[0]?.seller_details?.[0]?.company_name?.toLowerCase()?.includes(companySearch?.toLowerCase());
    const matchesInquiryDate = inquiryDateQuery === '' || item.Inquiry_details?.[0]?.createdAt?.slice(0, 10) === inquiryDateQuery;
    const matchesPaymentDate = paymentDateQuery === '' || item.date_time?.slice(0, 10) === paymentDateQuery;

    // Filter by payment type
    const matchesPaymentType =
      (paymentQuery === '' ||
        (paymentQuery === 'sent' && item.user_id === myCompanyId) ||
        (paymentQuery === 'received' && item.user_id !== myCompanyId));

    return matchesCompany && matchesInquiryDate && matchesPaymentDate && matchesPaymentType;
  });

  return (
    <>

      <div className="w-full overflow-x-hidden">
        <ToastContainer />
        <div className="flex flex-col p-2">
          <h1 className="md:text-3xl text-xl font-semibold mb-3">Payment Details</h1>

          <div className='grid grid-cols-[0.5fr,1fr,1fr,1fr,1fr,1fr] gap-3'>

            <div className="flex flex-col justify-center items-center relative">
              <label
                htmlFor="inputField"
                className={`transition-all ${companySearch ? 'text-xs top-0 left-[2%] bg-white' : 'text-xs top-[45%] left-[5%]'} ${companySearch ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
              >
                Company Name
              </label>
              <input
                id="inputField"
                type="text"
                value={companySearch}
                onChange={handleCompanySearch}
                onFocus={() => setFocused(true)}
                onBlur={(e) => e.target.value.trim() === '' && setFocused(false)}
                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col justify-center items-center relative">
              <label
                htmlFor="inputInquiryDate"
                className={`transition-all ${focusedD ? 'text-xs top-0 left-[2%] bg-white' : 'text-base'} ${focusedD ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
              >
                Inquiry Date
              </label>
              <input
                id="inputInquiryDate"
                type="date"
                value={inquiryDateQuery}
                onChange={handleInquiryDateChange}
                onFocus={() => setFocusedI(true)}
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    setFocusedI(false);
                  }
                }}
                className={`border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 ${focusedD ? 'focused' : ''}`}
              />
            </div>

            <div className="flex flex-col justify-center items-center relative">
              <label
                htmlFor="inputPaymentDate"
                className={`transition-all ${focusedD ? 'text-xs top-0 left-[2%] bg-white' : 'text-base'} ${focusedD ? 'text-gray-500' : 'text-gray-700'} absolute pointer-events-none px-1`}
              >
                Payment Date
              </label>
              <input
                id="inputPaymentDate"
                type="date"
                value={paymentDateQuery}
                onChange={handlePaymentDateChange}
                onFocus={() => setFocusedS(true)}
                onBlur={(e) => {
                  if (!e.target.value.trim()) {
                    setFocusedS(false);
                  }
                }}
                className={`border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 ${focusedD ? 'focused' : ''}`}
              />
            </div>

            <div className="flex flex-col justify-center items-center relative">
              <label
                htmlFor="inputPaymentDate"
                className="text-xs top-0 left-[2%] bg-white absolute pointer-events-none px-1"
              >
                Payment Type
              </label>
              <select name=""
                className="border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-500 w-full"
                value={paymentQuery}
                onChange={handlePaymentChange}

              >
                <option value="">All</option>
                <option value="received">Received</option>
                <option value="sent">Sent</option>
              </select>
            </div>
          </div>

          <hr className="my-4 border-t-2 border-gray-200" />

          {/* active cheemical add form end */}

          {/* Table */}
          <div className="relative" style={{ height: "calc(90vh - 200px)" }}>
          <div className="overflow-y-auto h-full">
            <table style={{ border: "none" }} className="table-auto w-full border-0">
              <tbody>
                {filteredData?.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className={`flex py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>

                      <td className="px-2 py-2 flex flex-col sm:justify-center justify-start font-semibold w-[40px]">
                        {index + 1}
                      </td>
                      <td className="ps-2 pe-6 py-2 flex flex-col justify-center gap-3">
                        <div>
                          <img src={item?.Inquiry_details?.[0]?.product_details?.[0]?.structure} alt="" className='h-[70px]' />
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">CAS No.</h2>
                          <p className='text-[15px] font-semibold sm:w-[110px] w-[120px]'>{item.Inquiry_details?.[0]?.product_details?.[0]?.CAS_number}</p>
                        </div>
                      </td>
                      <td className=" pe-6 py-2 flex flex-col justify-center gap-3">
                        <div className='h-[70px]'>
                          <p className='text-[#0A122A]/[.6] text-sm font-medium tracking-[2%] sm:w-[200px] w-[120px]'>Company Name</p>
                          <h2 className="font-semibold">{item.Inquiry_details?.[0]?.seller_details?.[0]?.company_name}</h2>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Inquiry Date</h2>
                          <p className='text-[15px] font-semibold sm:w-[220px] w-[120px]'>{formatDate(item.Inquiry_details?.[0]?.createdAt)}</p>
                        </div>
                      </td>
                      <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                        <div className='h-[70px]'>
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Total Quantity</h2>
                          <p className='text-[15px] font-semibold sm:w-[120px] w-[120px]'>{item.Inquiry_details?.[0]?.negotations_details?.[0]?.quantity}{item.Inquiry_details?.[0]?.negotations_details?.[0]?.quantity_type}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Paid Amount</h2>
                          <p className='text-[15px] flex items-center font-semibold sm:w-[150px] w-[120px]'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg>
                            {item.paid_amount}</p>
                        </div>
                      </td>
                      <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                        <div className='h-[70px]'>
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Total Amount</h2>

                          <p className='text-[15px] flex items-center font-semibold sm:w-[150px] w-[120px]'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path>
                            </svg>
                            {item?.Inquiry_details?.[0]?.negotations_details?.length > 0 &&
                              item?.Inquiry_details?.[0]?.negotations_details[item?.Inquiry_details?.[0]?.negotations_details.length - 1]?.final_price
                            }
                          </p>
                        </div>

                        <div>
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Payment Date</h2>
                          <p className='text-[15px] font-semibold sm:w-[150px] w-[120px]'>{formatDate(item.date_time)}</p>
                        </div>
                      </td>
                      <td className="py-2 flex flex-col justify-center gap-3">
                        <div className='h-[70px]'>
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Order Confirm Date</h2>
                          <p className='text-[15px] font-semibold sm:w-[170px] w-[120px]'>{formatDate(item.Inquiry_details?.[0]?.negotations_details?.[0]?.updatedAt)}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Payment Mode</h2>
                          <p className='text-[15px] font-semibold sm:w-[150px] w-[120px]'>{item.payment_mode}</p>
                        </div>
                      </td>
                      <td className=" py-2 flex flex-col justify-between gap-3">
                        <div >
                          <h2 className="text-[#0A122A]/[.6] text-sm font-medium tracking-[2%]">Inquiry Status</h2>
                          <p className='text-[15px] flex items-center font-semibold sm:w-[150px] w-[120px]'>
                            {item.Inquiry_details?.[0]?.status}</p>
                        </div>
                        <div >

                        </div>
                      </td>
                      <td className="px-4 py-2 flex sm:justify-center justify-start sm:items-center items-start font-semibold gap-3 cursor-pointer" onClick={() => handleEdit(item)}>View </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default PaymentDetail