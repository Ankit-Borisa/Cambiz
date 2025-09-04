import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import search from "../images/search-icon.png";
import handshake from "../images/handshake.png";
import sidescreen from "../images/meeting.png";
import Buycard from '../components/Buycard';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../BASE_URL';

const BuyList = () => {
    const location = useLocation();
    // console.log(location?.state);

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const fetchProducts = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
        const res = await fetch(`${BASE_URL}api/product/displayAllProductByPage`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        // console.log(data);
        setProducts(data.products);
        setFilteredProducts(data.products);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.name_of_chemical.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.CAS_number.includes(searchTerm)
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    useEffect(() => {
        if (location?.state) {
            setSearchTerm(location.state);
        }
    }, [location.state]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='bg-black/[.02]'>
            <div className="ms-0 sm:ms-20 pt-10 me-0 sm:me-10">
                <div className='block sm:grid grid-cols-[4fr,1fr] gap-10'>
                    <div>
                        <div className='flex justify-center mb-10'>
                            <div className='relative w-[100%] sm:w-[60%] mx-8 sm:mx-0'>
                                <input
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    type="text"
                                    className='bg-transparent border border-black rounded-lg w-full py-2 ps-6 focus-visible:outline-none'
                                    placeholder='Search by Chemical Name / API No. / CAS No...'
                                />
                                <img src={search} alt="search" className='absolute right-0 top-[14%] mr-2 h-[30px]' />
                            </div>
                        </div>
                        <div className='mx-8 sm:mx-0'>
                            <Buycard dataArray={filteredProducts} />
                        </div>
                    </div>
                    <div className='hidden sm:block'>
                        <img src={handshake} alt="handshake" className='mb-7' />
                        <img src={sidescreen} alt="meeting" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyList;
