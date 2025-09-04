import React, { useEffect, useState } from 'react';
import { faL, faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import loader from "../images/loading.png"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import right from "../images/exclamation.png"
import { BASE_URL } from '../BASE_URL';
import RupeesIcon from '../assets/Rupees';

const MyCataLog = () => {

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const [packageExpire, setPackageExpire] = useState(false);
  const [notPremium, setNotPremium] = useState(false);
  const [filteredCatelog, setFilteredCatelog] = useState([])

  const handleButtonClick = (e) => {
    // const membershipStatus = localStorage.getItem("membershipStatus")

    // if (membershipStatus === "free") {
    //   setNotPremium(true)
    // } else {
    //   const catalogLimit = parseInt(localStorage.getItem("catalogLimit"), 10);
    //   if (catalogLimit === filteredCatelog?.length - 1) {
    //     setPackageExpire(true);
    //   } else {
    navigate("/company/insert-chemical");
    //   }
    // }
  };

  const abc = "3928";

  const handleEdit = (e) => {
    navigate(`/company/insert-chemical`, { state: { abc: abc, id: e } });
  };

  const [activeLink, setActiveLink] = useState('all');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleAddActive = () => {
    setIsOpen(true)
  }

  const handleActiveClose = () => {
    setFilteredCatelog(catelogs)
    fetchCatelogData();
    setIsOpen(false)
  }

  const [catelogs, setCatelogs] = useState([])
  const [activeChemicalList, setActiveChemicalList] = useState([])
  const [searchInput, setSearchInput] = useState("")

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase(); // Convert input value to lowercase
    setSearchInput(value); // Update the search input state
  };


  const fetchCatelogData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`
    const res = await fetch(`${BASE_URL}api/catalog`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    const data = await res.json()
    setCatelogs(data?.catalogs)
    setActiveChemicalList(data?.catalogs)
    setFilteredCatelog(data?.catalogs)
  }

  useEffect(() => {
    fetchCatelogData();
  }, []);

  const filteredCatalogList = catelogs?.filter((item) => {
    if (activeLink === 'all') return true;
    if (activeLink === 'active') return item.active_chemicals === 'active';
    if (activeLink === 'inactive') return item.active_chemicals === 'inactive';
    if (activeLink === 'API') return item.category === 'API';
    return false;
  });

  useEffect(() => {
    setFilteredCatelog(filteredCatalogList)
  }, [activeLink]);

  const handleCheckboxChange = (index) => {
    const updatedList = [...activeChemicalList];
    updatedList[index].active_chemicals = updatedList[index].active_chemicals === "active" ? "inactive" : "active";
    setActiveChemicalList(updatedList);
  };

  const handleActiveSubmit = async () => {

    const membershipStatus = localStorage.getItem("membershipStatus")

    if (membershipStatus === "free") {
      setNotPremium(true)
    } else {
      const catalogLimit = parseInt(localStorage.getItem("catalogLimit"), 10);
      if (catalogLimit === filteredCatelog?.length - 1) {
        setPackageExpire(true);
      } else {
        setLoading(true)
        try {
          const token = `Bearer ${localStorage.getItem("chemicalToken")}`
          const promises = activeChemicalList.map((chemical) => {
            return axios.put(
              `${BASE_URL}api/status/`,
              { active_chemicals: chemical.active_chemicals, catalogId: chemical._id },
              {
                headers: {
                  "Content-Type": "application/json", // Set content type to application/json
                  Authorization: token,
                },
              }
            );
          });
          await Promise.all(promises);
          handleActiveClose();
          fetchCatelogData();
          setLoading(false)
          toast.success('Active chemicals updated successfully!', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
        } catch (error) {
          setLoading(false)
          console.error("Error updating active chemicals:", error.message);
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
        }
      }
    }
  };

  const handleNavigate = () => {
    navigate("/company/packages")
  }

  // console.log(filteredCatelog)

  return (
    <>

      <div className="w-full overflow-x-hidden">
        <ToastContainer />
        <div className="flex flex-col p-2">
          <h1 className="md:text-3xl text-xl font-semibold">Catalog Management</h1>

          <div className="sm:flex hidden gap-7 mt-7">
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === 'all' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('all')}
            >
              All
              <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
                {catelogs?.filter((item) =>
                  item?.productDetails?.[0]?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length || 0}
              </span>
            </span>
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === 'API' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('API')}
            >
              API
              <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
                {catelogs?.filter(item =>
                  item.category === 'API' &&
                  item?.productDetails?.[0]?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length || 0}
              </span>
            </span>
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === 'active' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('active')}
            >
              Active Chemicals
              <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
                {catelogs?.filter(item =>
                  item.active_chemicals === 'active').length || 0}
              </span>
            </span>
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === 'inactive' && 'border-b-2 border-black'}`}
              onClick={() => handleLinkClick('inactive')}
            >
              Inactive Chemicals
              <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
                {catelogs?.filter(item =>
                  item.active_chemicals === 'inactive' &&
                  item?.productDetails?.[0]?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
                ).length || 0}
              </span>
            </span>
          </div>

          <div className='sm:hidden flex justify-between items-center mt-2'>
            <p className='text-sm font-semibold'>
              {activeLink && activeLink?.charAt(0)?.toUpperCase() + activeLink?.slice(1)}
            </p>

            <select onChange={(e) => handleLinkClick(e.target.value)} name="" className='border border-gray-300 rounded-md px-1'>
              <option value="all">All</option>
              <option value="api">API</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>


          <hr className="my-4 border-t-2 border-gray-200" />

          <div className="flex gap-3 items-center relative">
            <FontAwesomeIcon icon={faSearch} className="absolute sm:top-3 top-2 left-4" />
            <input
              value={searchInput}
              onChange={handleFilter}
              type="text"
              placeholder="Search By Chemical Name"
              className="bg-gray-100 md:w-[82%] w-[80%] text-gray-800 pl-10 sm:py-2 py-1 outline-none rounded-md sm:placeholder:text-sm placeholder:text-xs"
            />
            <button onClick={handleAddActive} className="bg-darkBlue md:flex hidden items-center justify-center w-[18%] py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
              Active Chemical
            </button>
            <button onClick={handleButtonClick} className="bg-darkBlue md:flex hidden items-center justify-center w-[18%] py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
              <FontAwesomeIcon icon={faPlus} /> Add Chemical
            </button>

            <button onClick={handleButtonClick} className="md:hidden bg-darkBlue flex items-center justify-center px-4 py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          {/* active cheemical add form  */}

          {isOpen && (
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                    <div class="bg-white py-3 ps-3">
                      <div class="">
                        <h3 className='font-semibold text-gray-600 text-md'>Active Chemical ({activeChemicalList?.filter(e => e?.active_chemicals === 'active')?.length}/{activeChemicalList?.length})</h3>
                        <p className='text-[10px] mt-[2px]'>(Total chemical : {activeChemicalList?.length})</p>
                      </div>
                    </div>
                    <div class="bg-gray-50">
                      {activeChemicalList && activeChemicalList.map((e, index) => {
                        const isEven = index % 2 === 0;
                        const bgColorClass = isEven ? 'bg-gray-200' : '';
                        return (
                          <div key={e._id} className={`flex gap-3 ps-3 py-2 ${bgColorClass}`}>
                            <input
                              type="checkbox"
                              checked={e.active_chemicals === "active"}
                              onChange={() => handleCheckboxChange(index)}
                            />
                            <p className='font-medium'>{e.productDetails?.[0]?.name_of_chemical}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-white flex justify-end mx-8 py-3">
                      <button onClick={handleActiveClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                      <button onClick={handleActiveSubmit} type="button" className="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4">
                        {loading ? (
                          <img src={loader} alt="" className='h-[20px] px-5 animate-spin' />
                        ) : (
                          <>
                            Submit
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {packageExpire && (
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white py-3">
                      <div class="flex flex-col items-center">
                        <img src={right} alt="" className='h-[120px] border border-black rounded-full p-3' />
                        <h3 className='font-semibold text-xl text-center px-5 mt-4'>With Your Current Membership Plan You Can Active Only {localStorage.getItem("catalogLimit")} Chemicals Into Your Catalog</h3>
                      </div>
                    </div>
                    <div class="bg-white mx-8 py-3">
                      <button onClick={handleNavigate} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Browse</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {notPremium && (
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white py-3">
                      <div class="flex flex-col items-center">
                        <img src={right} alt="" className='h-[120px] border border-black rounded-full p-3' />
                        <h3 className='font-semibold text-xl text-center px-5 mt-4'>You Are Not Premium Member</h3>
                      </div>
                    </div>
                    <div class="bg-white mx-8 py-3">
                      <button onClick={handleNavigate} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Browse</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* active cheemical add form end */}

          {/* Table */}
          <div className="relative" style={{ height: "calc(80vh - 180px)" }}>
          <div className="overflow-y-auto h-full">
            <table style={{ border: "none" }} className="table-auto w-full border-0 mt-6">
              <tbody>
                {filteredCatelog && [...filteredCatelog]?.filter((e) => e?.productDetails?.[0]?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase()))?.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className={`flex py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                      <td className="px-2 py-2 sm:text-sm text-xs flex sm:justify-center justify-start items-center font-semibold gap-2">
                        {index + 1}
                        {item.active_chemicals === "active" ? (
                          <span className='border-[5px] border-green-500 rounded-full'></span>
                        ) : (
                          <span className='border-[5px] border-red-500 rounded-full'></span>
                        )}
                      </td>
                      <td className="ps-2 pe-6 py-2 sm:flex flex-col justify-center w-[200px] hidden sm:block">
                        <img src={item.productDetails?.[0]?.structure} alt="" className={item.productDetails?.[0]?.structure === "https://chembizzstorage.blob.core.windows.net/chembizz-files/chembizzchem.png" ? 'w-[60%]':'h-[100px]' } />
                      </td>

                      <td className=" pe-6 py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="font-semibold sm:text-sm text-xs">{item.productDetails?.[0]?.name_of_chemical}</h2>
                          <p className='text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%] sm:w-[200px] w-[120px]'>{item.productDetails?.[0]?.molecularFormula}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">CAS No.</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.productDetails?.[0]?.CAS_number}</p>
                        </div>
                      </td>
                      <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Category</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[120px] w-[120px]'>{item.category}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Appearance</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.productDetails?.[0]?.Appearance}</p>
                        </div>
                      </td>
                      <td className="py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Sub Category</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[220px] w-[120px]'>{item.subcategory === "undefined" ? "-" : item.subcategory}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Storage</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.productDetails?.[0]?.storage}</p>
                        </div>
                      </td>
                      <td className=" py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Grade</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>
                            {(!item.grade || item.grade === "undefined") ? "-" : Array.isArray(item.grade) ? item.grade.join(", ") : item.grade}
                          </p>

                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Sample Lot</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center'>{item?.one_lot_qty}{item?.one_lot_qty_type} / <span className='flex items-center'><RupeesIcon />{item.one_lot_qty_price}</span></p>
                        </div>
                      </td>
                      {/* <td className=" py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Price Per Lot</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center'><RupeesIcon />{item.one_lot_qty_price}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Max Lot</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item?.max_lot_qty}</p>
                        </div>
                      </td> */}
                      <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Price</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center'><RupeesIcon />{item.max_price}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Country Origin / Make</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[170px] w-[120px]'>{item.country_origin}</p>
                        </div>
                      </td>
                      <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Quantity</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.qty} {item.qty_type}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Supply Capacity </h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[170px] w-[120px]'>{item.supply_capacity} Kg/Month</p>
                        </div>
                      </td>
                      <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Purity</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.purity}%</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]"></h2>
                          <a href={item.COA} target='_blamk' className="text-blue-600 font-semibold underline cursor-pointer sm:text-sm text-xs">COA</a>
                        </div>
                      </td>
                      {/* <td className=" py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Purity</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[100px] w-[50px]'>{item.purity}%</p>
                        </div>
                        <div className='text-blue-500 h-full'>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]"></h2>
                          <a href={item.COA} target='_blamk' className="font-semibold underline cursor-pointer sm:text-sm text-xs">COA</a>
                        </div>
                      </td> */}
                      <td className="px-4 py-2 flex sjustify-center items-center font-semibold gap-3 cursor-pointer sm:text-sm text-xs" onClick={() => handleEdit(item)}>Edit <FontAwesomeIcon icon={faPencil} /> </td>
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

export default MyCataLog