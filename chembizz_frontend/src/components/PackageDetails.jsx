import React, { useEffect, useState } from 'react'
import Pricingcards from './Pricingcards'
import { BASE_URL } from '../BASE_URL';

const calculateLeftDays = (startDate, planDays) => {

  const start = new Date(startDate);

  const today = new Date();

  const timeDiff = today - start;

  const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const leftDays = planDays - daysPassed;

  return leftDays > 0 ? leftDays : 0;
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


const PackageDetails = ({ membershipPlan }) => {

  const membershipStaus = localStorage.getItem("membershipStatus")

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (membershipStaus === "paid") {
      setStatus("paid")
    } else {
      setStatus("free")
    }
  }, [membershipStaus]);

  const [bookingData, setBookingData] = useState("")
  const [inquiryData, setInquiryData] = useState("")

  const fetchBokkingData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/package_booking/display`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()

    // console.log(data)
    setBookingData(data?.data?.[0])
    setInquiryData(data)
  }

  useEffect(() => {
    fetchBokkingData();
  }, []);

  return (
    <div>
      <div className="w-full overflow-x-hidden">
        <div>
          <div className='mt-10'>
            {status === "free" ? (
              <div className='flex justify-center'>
                <div className='grid lg:grid-cols-[1fr,1fr,1fr,1fr] md:grid-cols-[1fr,1fr,1fr,1fr] gap-6'>
                  {membershipPlan && membershipPlan.map((e) => (
                    <Pricingcards onNavigate={e} />
                  ))}
                </div>
              </div>
            ) : (
              <div className=''>
                <div className=''>
                  <div className='bg-white border rounded-xl pb-10 shadow-lg'>
                    <div className='h-full'>
                      <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr] md:grid-cols-[1fr,1fr,1fr] lg:grid-cols-[1fr,1fr] xl:grid-cols-[1fr,1fr] 2xl:grid-cols-[1fr,1fr,1fr]'>
                        <div className='mt-6 ms-5'>
                          <div className='mb-4'>
                            <h1 className='font-semibold text-2xl'>Package Detail</h1>
                            {/* <p className='text-sm font-medium'>({calculateLeftDays(bookingData?.booking_date, bookingData?.plan_details?.[0]?.plan_days) - 1} Days Remaining)</p> */}
                          </div>
                          <h1 className='font-semibold text-lg'>{bookingData?.plan_details?.[0]?.plan_name}</h1>
                          <ul className='ms-8'>
                            {bookingData?.plan_details?.[0]?.membership_feature_details.map((e) => (
                              <li className='list-disc mb-3 text-sm'>{e.feature_name}</li>
                            ))}
                          </ul>
                        </div>
                        <div className='mt-6 ms-5'>
                          <div className='grid grid-cols-[0.9fr,1fr] mb-4'>
                            <h1 className='font-semibold text-2xl'>Perks</h1>
                          </div>
                          <div className='grid grid-cols-[0.9fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Booking Date</h4>
                            <p>{formatDate(bookingData?.booking_date)}</p>
                          </div>
                          <div className='grid grid-cols-[0.9fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Total Days</h4>
                            <p>{bookingData?.plan_details?.[0]?.plan_days}</p>
                          </div>
                          <div className='grid grid-cols-[0.9fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Package Price</h4>
                            <p>{bookingData?.plan_details?.[0]?.plan_selling_price}</p>
                          </div>
                          <div className='grid grid-cols-[0.9fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Recieved Inquiries</h4>
                            <p>{inquiryData?.receivedInquiries}</p>
                          </div>
                          <div className='grid grid-cols-[0.9fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Approved Inquiries</h4>
                            <p>{inquiryData?.approvedInquiries}</p>
                          </div>
                          <div className='grid grid-cols-[0.9fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Sent Inquiries</h4>
                            <p>{inquiryData?.sentInquiries}</p>
                          </div>
                          <div className='grid grid-cols-[0.9fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Catalog Limit</h4>
                            <p>{bookingData?.plan_details?.[0]?.catalog_limit}</p>
                          </div>
                        </div>
                        <div className='mt-6 ms-5'>
                          <div className='flex items-center mb-4'>
                            <h1 className='font-semibold text-2xl'>Payment Details</h1>
                            {/* <p className='ms-4 text-sm font-medium'>({calculateLeftDays(bookingData?.booking_date, bookingData?.plan_details?.[0]?.plan_days) - 1} Days Remaining)</p> */}
                          </div>
                          <div className='grid grid-cols-[0.7fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Payment Mode</h4>
                            <p>{bookingData?.payment_mode}</p>
                          </div>
                          <div className='grid grid-cols-[0.7fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Transaction Id</h4>
                            <p>{bookingData?.transaction_id}</p>
                          </div>
                          <div className='grid grid-cols-[0.7fr,1fr] gap-4'>
                            <h4 className='font-semibold'>Payment Status</h4>
                            <p>{bookingData?.payment_status}</p>
                          </div>
                          <div className='mt-5'>
                            <h4 className='font-semibold'>Remaining Days {calculateLeftDays(bookingData?.booking_date, bookingData?.plan_details?.[0]?.plan_days) - 1}</h4>
                            <h4 className='font-semibold'>Remaining Sent Inquiries {calculateLeftDays(bookingData?.booking_date, bookingData?.plan_details?.[0]?.plan_days) - 1}</h4>
                            <h4 className='font-semibold'>Remaining Approve Inquiries {calculateLeftDays(bookingData?.booking_date, bookingData?.plan_details?.[0]?.plan_days) - 1}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageDetails
