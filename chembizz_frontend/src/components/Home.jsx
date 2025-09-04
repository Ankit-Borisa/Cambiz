import React, { useCallback, useEffect, useRef, useState } from 'react';
import search from "../images/search-icon.png";
import Buycard from './Buycard';
import loading from "../images/loading.png"
import { debounce } from 'lodash';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, Bar, Tooltip } from 'recharts';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { BASE_URL } from '../BASE_URL';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loader, setLoader] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [isFirstPageLoaded, setIsFirstPageLoaded] = useState(false)
  const [totalCount, setTotalCount] = useState(1)
  const [totalPages, setTotalPages] = useState(2)

  const fetchProducts = async (value) => {
    if (currentPage <= totalPages) {
      try {
        setLoader(true)
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}api/product/displayAllProductsByCompany?page=${currentPage}&limit=${limit}&filter=${value}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const data = await res.json();

        if (data?.success) {
          if (currentPage === 1) {
            setProducts(data?.data?.product);
            setIsFirstPageLoaded(true)
          } else {
            setProducts((previous) => [
              ...previous,
              ...data?.data?.product
            ]);
          }
          setTotalPages(data?.data?.totalPages)
          setTotalCount(data?.data?.totalCount)
          setLoader(false)
        } else {
          setLoader(false)
        }
      } catch (error) {
        setLoader(false)
      }
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm);
  }, [currentPage]);

  const debouncedFetchResults = useCallback(
    debounce((value) => {
      fetchProducts(value);
    }, 1000), // Adjust the delay as needed (e.g., 300ms)
    []
  );

  const handleSearchChange = (e) => {
    setCurrentPage(1)
    setProducts([])
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name_of_chemical.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    debouncedFetchResults(value)
  };


  const bottomRef = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setCurrentPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "-10px",
      threshold: 1.0,
    });
    if (
      bottomRef.current &&
      isFirstPageLoaded &&
      products.length < totalCount
    ) {
      observer.observe(bottomRef.current);
    }
    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [handleObserver, isFirstPageLoaded]);

  const [openForm, setOpenForm] = useState(false);
  const [catalogs, setCatalogs] = useState([]);
  
  const membershipStatus = localStorage.getItem("membershipStatus")

  useEffect(() => {
    const lastLoginDate = localStorage.getItem("lastLoginDate");
    const today = new Date().toISOString().split('T')[0];

    if (lastLoginDate !== today && membershipStatus === "paid" && catalogs?.length > 0) {
      localStorage.setItem("lastLoginDate", today);
      setOpenForm(true);
    }
  }, []);

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const fetchCatalogData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    try {
      const res = await fetch(`${BASE_URL}api/catalog`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await res.json();
      setCatalogs(data?.catalogs || []);
    } catch (error) {
      console.error("Error fetching catalog data:", error);
    }
  };

  const updatePrice = (productId, field, value) => {
    setCatalogs((prevCatalogs) =>
      prevCatalogs.map((product) =>
        product._id === productId ? { ...product, [field]: value } : product
      )
    );
  };

  const handleUpdateCatalog = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    setLoader(true);

    try {
      const updatePromises = catalogs.map(async (product) => {
        const formData = new FormData();
        formData.append('min_price', product.min_price);
        formData.append('max_price', product.max_price);

        // Add other necessary fields here if needed

        return axios.put(
          `${BASE_URL}api/catalog/${product._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
          }
        );
      });

      await Promise.all(updatePromises);

      setLoader(false);
      setOpenForm(false);
    } catch (error) {
      setLoader(false);
      toast.error(error?.response?.data?.error || "Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const handleSkip = () => {
    setOpenForm(false);
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-col p-2">
        <h1 className="md:text-3xl text-xl font-semibold">Home({products.length})</h1>
      </div>
      <div>
        <div className="pt-2 md:me-10 mx-4">
          <div>
            <div>
              <div className="flex mb-6">
                <div className="relative w-[100%]">
                  <input
                    type="text"
                    className="bg-transparent border border-black rounded-lg w-full placeholder:text-xs sm:placeholder:text-[16px] sm:top-[14%] sm:py-2 py-1 px-6 focus-visible:outline-none"
                    placeholder="Search by Chemical Name / API No. / CAS No..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <img src={search} alt="" className="absolute right-0 top-[8%] sm:top-[14%] mr-2 h-[30px]" />
                </div>
              </div>
              <div className='min-h-[800px]'>
                <Buycard dataArray={products} />
                {loader && (
                  <div className='flex justify-center mt-10  animate-spin h-[50px]'>
                    <img src={loading} alt="" className='bg-darkBlue rounded-full' />
                  </div>
                )}
                <div ref={bottomRef} className="h-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      {openForm && (
        <div className="relative z-[111]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-111 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                <div className="bg-white py-3 px-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-xl">Update Catalog</h3>
                    <p className='text-sm text-blue-500 underline cursor-pointer' onClick={handleSkip}>skip</p>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 py-5 sm:px-6">
                  <div>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CAS Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Min Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Max Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {catalogs.length > 0 ? (
                          catalogs.map((product) => (
                            <tr key={product._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product?.productDetails?.[0]?.name_of_chemical}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product?.productDetails?.[0]?.CAS_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                  className="border border-gray-300 rounded-md px-2 py-1 w-full placeholder:text-xs"
                                  placeholder="Min Price"
                                  value={product.min_price || ""}
                                  onChange={(e) => updatePrice(product._id, 'min_price', e.target.value)}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                                  className="border border-gray-300 rounded-md px-2 py-1 w-full placeholder:text-xs"
                                  placeholder="Max Price"
                                  value={product.max_price || ""}
                                  onChange={(e) => updatePrice(product._id, 'max_price', e.target.value)}
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                              No products available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white flex justify-end mx-8 py-3">
                  {loader ? (
                    <button className="bg-darkBlue text-white h-[40px] w-[150px] rounded-md">
                      <img src={loading} alt="" className='h-[80%] animate-spin' />
                    </button>
                  ) : (
                    <>
                      <button className="bg-darkBlue text-white h-[40px] w-[150px] rounded-md" onClick={handleUpdateCatalog}>
                        Update Catalog
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
