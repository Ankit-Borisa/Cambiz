/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
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
import authorsTableData from "layouts/poData/data/authorsTableData";
import axios from "axios";
import { BASE_URL } from "BASE_URL";
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

//countries , state and city
import countries from "../../CountryStateCity.json";


import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import poImage from "../../assets/images/invoice1.jpg";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

function PoData() {
  const [categoryList, setCategoryList] = useState([]);
  const [productNameFilter, setProductNameFilter] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");

  const navigate = useNavigate();

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(
        `${BASE_URL}/api/salesInvoice/polist`,
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

  const ModalContent = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
  });


  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNavigate = (e) => {
    console.log(e)
    navigate(`/po-detail/${e}`)
  }

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
    return productNameMatch && buyerMatch && sellerMatch ;
  });



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ border: "none", outline: "none", boxShadow: "none" }}
      >
        <ModalContent>
          <div className="d-flex justify-content-center gap-3 me-5 mb-3">
            <Button color="primary" variant="contained" >
              <DownloadIcon className="me-1" /> Download
            </Button>
            <Button color="primary" variant="contained" >
              <PrintIcon className="me-1" /> Print
            </Button>
          </div>
          <img src={poImage} alt="PO" style={{ height: "80vh", border: "none", outline: "none" }} />
        </ModalContent>
      </Modal>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
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
          <Grid item xs={12}>
            <Grid container spacing={6}>
              {filteredCategoryList && filteredCategoryList?.map((e) => (
                <Grid item xs={3}>
                  <Card>
                    <MDBox pt={3}>
                      <div className="px-4 py-2">
                        <div className="">
                          <h5 style={{ fontSize: "14px" }}>PO No. : <span style={{ color: "black" }}>{e?.po_num}</span></h5>
                          <h5 style={{ fontSize: "14px" }}>PO Date : <span style={{ color: "black" }}>{e?.po_date}</span></h5>
                        </div>
                        <div className="mt-3">
                          <div>
                            <div>
                              <h5 style={{ fontSize: "14px", fontWeight: "700" }} className="mb-0">BUYER COMPANY</h5>
                              <hr className="my-1" />
                              <div>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.bill_to_name}</span></h5>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.bill_to_gst_in}</span></h5>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.bill_to_address},{e?.bill_to_city},{e?.bill_to_state}</span></h5>
                              </div>
                            </div>
                            <div className="mt-2">
                              <h5 style={{ fontSize: "14px", fontWeight: "700" }} className="mb-0">SELLER COMPANY</h5>
                              <hr className="my-1" />
                              <div>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.seller_to_name}</span></h5>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.seller_to_gst_in}</span></h5>
                                <h5 className="mb-1" style={{ fontSize: "14px" }}><span style={{ color: "black" }}>{e?.seller_to_address},{e?.seller_to_city},{e?.seller_to_state}</span></h5>
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
                              <button onClick={() => handleNavigate(e?._id)} style={{ border: "1px solid black", color: "black", backgroundColor: "transparent", fontSize: "12px", fontWeight: "500", padding: "4px 10px", borderRadius: "8px" }}>VIEW</button>
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

export default PoData;
