import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/salesData/data/authorsTableData";
import axios from "axios";
import { BASE_URL } from "BASE_URL";
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import countries from "../../CountryStateCity.json";


import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from "react-router-dom";

function SalesData() {
  const [categoryList, setCategoryList] = useState([]);
  const [productNameFilter, setProductNameFilter] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");

  const navigate = useNavigate();

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(
        `${BASE_URL}/api/salesInvoice/invoicelist`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data)
      setCategoryList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const filteredCategoryList = categoryList.filter((item) => {
    const productNameMatch = productNameFilter
      ? item.product_details?.[0]?.chem_name?.toLowerCase()?.includes(productNameFilter?.toLowerCase())
      : true;

    const buyerMatch = buyerFilter
      ? item.bill_to_name?.toLowerCase()?.includes(buyerFilter?.toLowerCase())
      : true;

    const sellerMatch = sellerFilter
      ? item?.seller_to_name?.toLowerCase()?.includes(sellerFilter?.toLowerCase())
      : true;

    // Include the item only if all matches are true
    return productNameMatch && buyerMatch && sellerMatch;
  });

  const handleNavigate = (e) => {
    console.log(e)
    if (e?.invoice_type === "tax_invoice") {
      navigate(`/salse-detail/${e?._id}`)
    } else {
      navigate(`/performa-invoice-detail/${e?._id}`)

    }
  }




  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid item xs={12}>
              {/* Filter Inputs */}
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {/* Product Name Filter */}
                  <Grid item xs={1.8} className="mt-2">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Product Name"
                        variant="outlined"
                        value={productNameFilter}
                        onChange={(e) => setProductNameFilter(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  {/* Buyer Name Filter */}
                  <Grid item xs={1.8} className="mt-2">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Buyer Name"
                        variant="outlined"
                        value={buyerFilter}
                        onChange={(e) => setBuyerFilter(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  {/* Seller Name Filter */}
                  <Grid item xs={1.8} className="mt-2">
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Seller Name"
                        variant="outlined"
                        value={sellerFilter}
                        onChange={(e) => setSellerFilter(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              {filteredCategoryList && filteredCategoryList?.map((e) => (
                <Grid item xs={3}>
                  <Card>
                    <MDBox pt={3}>
                      <div className="px-4 py-2">
                        <div className="">
                          <h5 style={{ fontSize: "14px" }}>Invoice No. : <span style={{ color: "black" }}>{e?.po_num}</span></h5>
                          <h5 style={{ fontSize: "14px" }}>Invoice Date : <span style={{ color: "black" }}>{e?.invoice_date}</span></h5>
                          <h5 style={{ fontSize: "14px" }}>Invoice Type : <span style={{ color: "black" }}>{e?.invoice_type}</span></h5>
                        </div>
                        <div className="mt-3">
                          <div>
                            <div>
                              <h5 style={{ fontSize: "14px", fontWeight: "700" }} className="mb-0">BUYER COMPANY</h5>
                              <hr className="my-1" />
                              <div>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.shipped_to_name}</span></h5>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.shipped_to_gst_in}</span></h5>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.shipped_to_address},{e?.shipped_to_city},{e?.shipped_to_state}</span></h5>
                              </div>
                            </div>
                            <div className="mt-2">
                              <h5 style={{ fontSize: "14px", fontWeight: "700" }} className="mb-0">SELLER COMPANY</h5>
                              <hr className="my-1" />
                              <div>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.seller_company_details?.[0]?.company_name}</span></h5>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.seller_company_details?.[0]?.gst}</span></h5>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.seller_company_details?.[0]?.address},{e?.seller_company_details?.[0]?.city},{e?.seller_company_details?.[0]?.state}</span></h5>
                              </div>
                            </div>
                            <div className="mt-2">
                              <h5 style={{ fontSize: "14px", fontWeight: "700" }} className="mb-0">INQUIRY DETAIL</h5>
                              <hr className="my-1" />
                              <div>
                                <h5 style={{ fontSize: "14px" }}>Product Name : <span style={{ color: "black" }}>{e?.product_details?.[0]?.chem_name}</span></h5>
                                <h5 style={{ fontSize: "14px" }}>Quantity : <span style={{ color: "black" }}>{e?.product_details?.[0]?.qty}{e?.product_details?.[0]?.qty_type}</span></h5>
                                <h5 style={{ fontSize: "14px" }}>Amount : <span style={{ color: "black" }}>{e?.product_details?.[0]?.total}</span></h5>
                              </div>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                              <button onClick={() => handleNavigate(e)} style={{ border: "1px solid black", color: "black", backgroundColor: "transparent", fontSize: "12px", fontWeight: "500", padding: "4px 10px", borderRadius: "8px" }}>VIEW</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </MDBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SalesData;
