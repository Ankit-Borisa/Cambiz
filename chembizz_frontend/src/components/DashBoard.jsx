import React, { useEffect, useState } from 'react';
import { faL, faPencil, faPlus, faSearch, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardCard from '../examples/cards';
import SecondDashboardCard from '../examples/cards/SecondDashboardCard';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Customized } from 'recharts';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { Legend } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';
import rupees from "../images/rupees.png";
import earth from "../images/pruthvi.png"
import bund from "../images/tipu.png"
import box from "../images/weight.png"
import { BASE_URL } from '../BASE_URL';

function getInitials(companyName) {
  if (!companyName) return '';
  const firstCharacter = companyName.charAt(0) || '';
  const secondCharacter = companyName.charAt(1) || '';
  return `${firstCharacter}${secondCharacter}`.toUpperCase();
}

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, pad to ensure 2 digits
  const day = String(date.getDate()).padStart(2, '0'); // Pad to ensure 2 digits
  return `${year}-${month}-${day}`;
};

const DashBoard = () => {

  const navigate = useNavigate();
  const data05 = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 3400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [sellingInquiry, setSellingInquiry] = useState([])
  const [buyingInquiry, setBuyingInquiry] = useState([])
  const [invoice, setInvoice] = useState([])
  const [dashboardCounts, setDashboardCounts] = useState("")
  const [catalogMonth, setCatalogMonth] = useState([])
  const [catalogMonthSelling, setCatalogMonthSelling] = useState([])

  const fetchDashboardData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}company/deshBoard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,  // Pass the token here
      },
    });
    const data = await res.json();
    // console.log(data?.data);
    setDashboardCounts(data?.data)
    setProducts(data?.data?.products);
    setSuppliers(data?.data?.companies);
    setInvoice(data?.data?.slalesData);


    const mappedInquiryData = data?.data?.inquiryData.map(item => ({
      month: item.month,
      commercial: item.commercial_inquiries,
      sample: item.sample_inquiries
    }));

    const mappedBuyingInquiryData = data?.data?.buyingInquiryData.map(item => ({
      month: item.month,
      commercial: item.commercial_inquiries,
      sample: item.sample_inquiries
    }));

    setSellingInquiry(mappedInquiryData)
    setBuyingInquiry(mappedBuyingInquiryData)
    setCatalogMonth(data?.data?.catalogArray)
    setCatalogMonthSelling(data?.data?.catalogSellingInquiryCountArray)

  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const CustomizedRectangle = (props) => {
    const { formattedGraphicalItems } = props;
    // get first and second series in chart
    const firstSeries = formattedGraphicalItems[0];
    const secondSeries = formattedGraphicalItems[1];

    // render custom content using points from the graph
    return firstSeries?.props?.points.map((firstSeriesPoint, index) => {
      const secondSeriesPoint = secondSeries?.props?.points[index];
      const yDifference = firstSeriesPoint.y - secondSeriesPoint.y;

      return (
        <Rectangle
          key={firstSeriesPoint.payload.name}
          width={10}
          height={yDifference}
          x={secondSeriesPoint.x - 5}
          y={secondSeriesPoint.y}
          fill={yDifference > 0 ? 'red' : yDifference < 0 ? 'green' : 'none'}
        />
      );
    });
  };


  const handleNavigate1 = (e) => {
    const token = localStorage.getItem("chemicalToken")
    if (token) {
      navigate(`/company/product-detail-and-suppliers/${e?._id}`);
    } else {
      navigate("/login");
    }
  }


  return (
    <div className="w-full overflow-x-hidden pb-10">
      <div className="flex flex-col p-2">
        <h1 className="md:text-3xl text-xl font-semibold ">Dashboard</h1>
      </div>
      <hr />
      <div className='mt-5'>
        <div className='grid grid-cols-[1fr] mx-4 sm:mx-0 sm:grid-cols-[2fr,1fr] gap-5'>
          <div>
            <div className='grid grid-cols-[1fr] sm:grid-cols-[1fr,1fr,1fr] gap-5'>
              <div>
                <div className='border rounded-xl pt-3 pb-4 px-5 shadow-custom'>
                  <div className=' mb-5'>
                    <div>
                      <p className='text-sm opacity-[0.6] font-semibold'>Total Recieved Inquiries</p>
                      <p className='text-sm opacity-[0.6] font-semibold'>(commercial)</p>
                      <h4 className='font-semibold text-xl mt-3'>{dashboardCounts?.totalReceivedCommercialInquiriesThisMonth} <span className='text-sm'>this month</span></h4>
                    </div>
                  </div>
                  <p className='text-xs opacity-[0.8] font-medium'><span className='text-green-500 font-medium'>
                    &nbsp;&nbsp;{dashboardCounts?.totalReceivedCommercialInquiriesToday}</span> Inquiries Today</p>
                </div>
              </div>
              <div>
                <div className='border rounded-xl pt-3 pb-4 px-5 shadow-custom'>
                  <div className=' mb-5'>
                    <div>
                      <p className='text-sm opacity-[0.6] font-semibold'>Total Made Inquiries</p>
                      <p className='text-sm opacity-[0.6] font-semibold'>(commercial)</p>
                      <h4 className='font-semibold text-xl mt-3'>{dashboardCounts?.totalSentCommercialInquiriesThisMonth} <span className='text-sm'>this month</span></h4>
                    </div>
                  </div>
                  <p className='text-xs opacity-[0.8] font-medium'><span className='text-green-500 font-medium'>
                    {/* <FontAwesomeIcon icon={faArrowTrendUp} /> */}
                    &nbsp;&nbsp;{dashboardCounts?.totalSentCommercialInquiriesToday}</span> Inquiries Today</p>
                </div>
              </div>
              <div>
                <div className='border rounded-xl pt-3 pb-4 px-5 shadow-custom'>
                  <div className=' mb-5'>
                    <div>
                      <p className='text-sm opacity-[0.6] font-semibold'>Total Recieved Inquiries</p>
                      <p className='text-sm opacity-[0.6] font-semibold'>(sample)</p>
                      <h4 className='font-semibold text-xl mt-3'>{dashboardCounts?.totalReceivedSampleInquiriesThisMonth} <span className='text-sm'>this month</span></h4>
                    </div>
                  </div>
                  <p className='text-xs opacity-[0.8] font-medium'><span className='text-green-500 font-medium'>
                    {/* <FontAwesomeIcon icon={faArrowTrendUp} /> */}
                    &nbsp;&nbsp;{dashboardCounts?.totalReceivedSampleInquiriesToday}</span> Inquiries Today</p>
                </div>
              </div>
              <div>
                <div className='border rounded-xl pt-3 pb-4 px-5 shadow-custom'>
                  <div className=' mb-5'>
                    <div>
                      <p className='text-sm opacity-[0.6] font-semibold'>Total Recieved Inquiries</p>
                      <p className='text-sm opacity-[0.6] font-semibold'>(sample)</p>
                      <h4 className='font-semibold text-xl mt-3'>{dashboardCounts?.totalReceivedSampleInquiriesToday} <span className='text-sm'>this month</span></h4>
                    </div>
                  </div>
                  <p className='text-xs opacity-[0.8] font-medium'><span className='text-green-500 font-medium'>
                    {/* <FontAwesomeIcon icon={faArrowTrendUp} /> */}
                    &nbsp;&nbsp;{dashboardCounts?.totalReceivedSampleInquiriesToday}</span> Inquiries Today</p>
                </div>
              </div>
              <div className=''>
                <div className='border rounded-xl pt-3 pb-4 px-5 shadow-custom'>
                  <div className=' mb-5'>
                    <div>
                      <p className='text-sm opacity-[0.6] font-semibold'>Total generated PO</p>
                      <h4 className='font-semibold text-xl mt-3'>{dashboardCounts?.totalGenratedPoThisMonth} <span className='text-sm'>this month</span></h4>
                    </div>
                  </div>
                  <p className='text-xs opacity-[0.8] font-medium'><span className='text-green-500 font-medium'>
                    {/* <FontAwesomeIcon icon={faArrowTrendUp} /> */}
                    &nbsp;&nbsp;{dashboardCounts?.totalGenratedPoToday}</span> PO Today</p>
                </div>
              </div>
              <div className=''>
                <div className='border rounded-xl pt-3 pb-4 px-5 shadow-custom '>
                  <div className=' mb-5'>
                    <div>
                      <p className='text-sm opacity-[0.6] font-semibold'>Total Genrated Invoice</p>
                      <h4 className='font-semibold text-xl mt-3'>{dashboardCounts?.totalGenratedInvoiceThisMonth} <span className='text-sm'>this month</span></h4>
                    </div>
                  </div>
                  <p className='text-xs opacity-[0.8] font-medium'><span className='text-green-500 font-medium'>
                    {/* <FontAwesomeIcon icon={faArrowTrendUp} /> */}
                    &nbsp;&nbsp;{dashboardCounts?.totalGenratedInvoiceToday}</span> Inquiries Today</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-10">
              <div className="px-3 py-3 border rounded-lg mt-5 shadow-custom">
                <div className="flex items-center justify-between">
                  <div className="mb-10">
                    <h5 className="text-[18px] font-semibold">Sales Details</h5>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={sellingInquiry}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="commercial" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="sample" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="px-3 py-3 border rounded-lg mt-5 shadow-custom">
                <div className="flex items-center justify-between">
                  <div className="mb-10">
                    <h5 className="text-[18px] font-semibold">Purchase Details</h5>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={buyingInquiry}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="commercial" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="sample" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="px-3 py-3 border rounded-lg mt-5 shadow-custom">
                <div className="flex items-center justify-between">
                  <div className="mb-10">
                    <h5 className="text-[18px] font-semibold">Monthly Revenue</h5>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={catalogMonth}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="currentMonthAmount" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                    <Bar dataKey="pastMonthAmount" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div>
            <div className='shadow-custom mb-5'>
              <div className='px-3 py-3 border rounded-lg shadow-custom'>
                <div className='flex items-center justify-between items-center'>
                  <div className='mb-8'>
                    <h5 className='text-[21px] font-semibold'>Title 1</h5>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dashboardCounts?.topInquiryDetails}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="label" />  {/* Using 'label' for axis */}
                    <PolarRadiusAxis />
                    <Radar name="Inquiry Count" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='shadow-custom mb-5'>
              <div className="px-3 py-3 border rounded-lg mt-5 shadow-custom">
                <div className="flex items-center justify-between">
                  <div className="mb-10">
                    <h5 className="text-[18px] font-semibold">Generated Invoice Graph</h5>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={invoice}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line connectNulls type="monotone" dataKey="invoice_data" stroke="#8884d8" fill="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='shadow-custom mb-5'>
              <div className="px-3 py-3 border rounded-lg mt-5 shadow-custom">
                <div className="flex items-center justify-between">
                  <div className="mb-10">
                    <h5 className="text-[18px] font-semibold">Generated PO Graph</h5>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={invoice}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line connectNulls type="monotone" dataKey="po_date" stroke="#8884d8" fill="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className='shadow-custom'>
              <div className='px-3 py-3 border rounded-lg shadow-custom'>
                <div className='flex items-center justify-between items-center'>
                  <div className='mb-8'>
                    <h5 className='text-[21px] font-semibold'>Monthly Selling Inquiries</h5>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    width={500}
                    height={300}
                    data={catalogMonthSelling}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="currentMonthSellingInquiry" stroke="#8884d8" />
                    <Line type="monotone" dataKey="pastMonthSellingInquiry" stroke="#82ca9d" />
                    <Customized component={CustomizedRectangle} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-3 border rounded-lg mt-5 shadow-custom hidden sm:block">
          <div className="flex items-center justify-between mb-5">
            <h5 className="text-[18px] font-semibold">Top 6 Deals</h5>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[300px] sm:min-w-full">
              <table className="w-full bg-white border border-gray-200 border-spacing-y-5">
                <thead>
                  <tr className="bg-[#b2b2b2]/[0.2] rounded">
                    <th className="py-4 px-2 text-left text-gray-600 font-bold text-xs sm:text-sm">Product Name</th>
                    <th className="py-4 px-2 text-left text-gray-600 font-bold text-xs sm:text-sm">Buyer Company</th>
                    <th className="py-4 px-2 text-left text-gray-600 font-bold text-xs sm:text-sm">Inquiry Type</th>
                    <th className="py-4 px-2 text-left text-gray-600 font-bold text-xs sm:text-sm">Date</th>
                    <th className="py-4 px-2 text-left text-gray-600 font-bold text-xs sm:text-sm">Quantity</th>
                    <th className="py-4 px-2 text-left text-gray-600 font-bold text-xs sm:text-sm">Status</th>
                    <th className="py-4 px-2 text-left text-gray-600 font-bold text-xs sm:text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardCounts && dashboardCounts?.totalDealDoneInquiry.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-2 sm:px-1 text-xs sm:text-sm font-medium">{row.productDetails?.[0]?.name_of_chemical}</td>
                      <td className="py-2 px-2 sm:px-1 text-xs sm:text-sm font-medium">{row.buyer_company?.[0]?.company_name}</td>
                      <td className="py-2 px-2 sm:px-1 text-xs sm:text-sm font-medium">{row.inq_type}</td>
                      <td className="py-2 px-2 sm:px-1 text-xs sm:text-sm font-medium">{getFormattedDate(row.productDetails?.[0]?.createdAt)}</td>
                      <td className="py-2 px-2 sm:px-1 text-xs sm:text-sm font-medium">{row?.inquiry_qty}{row?.qty_type}</td>
                      <td className="py-2 px-2 sm:px-1 text-xs sm:text-sm font-medium">
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 text-white text-xs font-semibold rounded-full cursor-pointer
                          ${row.status === 'pending' ? 'bg-yellow-500' :
                              row.status === 'approved' ? 'bg-blue-500' :
                                row.status === 'rejected' ? 'bg-red-500' :
                                  row.status === 'cancel' ? 'bg-red-500' :
                                    row.status === 'negotiation' ? 'bg-orange-500' :
                                      row.status === 'po' ? 'bg-purple-500' :
                                        row.status === 'invoice' ? 'bg-teal-500' :
                                          row.status === 'dispatch' ? 'bg-indigo-500' :
                                            row.status === 'in transit' ? 'bg-pink-500' :
                                              row.status === 'delivered' ? 'bg-green-500' :
                                                row.status === 'deal done' ? 'bg-orange-300' :
                                                  'bg-red-500'
                            } 
                          `}
                        >
                          {row?.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-1 text-xs sm:text-sm font-medium">
                        <span
                          onClick={() => navigate(`/company/buying-inquiry-detail/${row?._id}`)}
                          className={`inline-block px-2 sm:px-3 py-1 text-white text-xs font-semibold rounded-full bg-gray-500 cursor-pointer`}
                        >
                          view
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <div className='mt-10 mx-3'>
          <div className='flex items-center justify-between items-center'>
            <div className='mb-5'>
              <h3 className='text-[28px] font-semibold'>Products</h3>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {products && products?.map((e) => (
              <div className='rounded-lg bg-white px-4 py-3 shadow h-full'>
                <div className='flex flex-col h-full'>
                  <img src={e?.structure} alt="" />
                  <h3 className='font-medium text-xl'>{e?.name_of_chemical?.slice(0, 15)}</h3>
                  <div className='md:flex block justify-between mt-2 mb-4'>
                    <div>
                      <p className='text-slate-400'>CAS No:</p>
                      <p className='font-medium'>{e?.CAS_number}</p>
                    </div>
                    <div>
                      <p className='text-slate-400'>Price </p>
                      <p className='font-medium flex items-center'><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg> {e?.catalog?.[0]?.min_price} - <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3m0 0c6.667 0 6.667-10 0-10"></path></svg> {e?.catalog?.[0]?.max_price}</p>
                    </div>
                  </div>
                  <button className='bg-darkBlue text-white text-sm mt-auto px-4 py-2 rounded-lg w-full' onClick={() => handleNavigate1(e?._id)}>Inquiry Now</button>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  )
}

export default DashBoard