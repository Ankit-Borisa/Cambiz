import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import MessageIcon from '@mui/icons-material/Message';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Card from "@mui/material/Card";
import { NavLink } from "react-router-dom";
import MDAvatar from "components/MDAvatar";
import { CardContent, Typography } from '@mui/material';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/Inquiry-detail";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

import backgroundImage from "assets/images/bg-profile.jpeg";


import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { BASE_URL } from "BASE_URL";
import { TextInput } from "components/Textinput/TextInput.js";
import { MessageLeft, MessageRight } from "./Messages";
import { IconButton } from "@mui/material";
import StatusProgress from "examples/Progressstatus/ProgressStatus";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "80vw",
    height: "80vh",
    maxWidth: "500px",
    maxHeight: "700px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    position: "relative"
  },
  paper2: {
    width: "80vw",
    maxWidth: "500px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    position: "relative"
  },
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  messagesBody: {
    width: "calc( 100% - 20px )",
    margin: 10,
    overflowY: "scroll",
    height: "calc( 100% - 80px )",
    // Hide scrollbar
    scrollbarWidth: "none", /* Firefox */
    "-ms-overflow-style": "none" /* IE and Edge */
  },
  // Hide scrollbar for Chrome, Safari, and Opera
  "&::-webkit-scrollbar": {
    display: "none"
  },
  header: {
    width: "100%",
    borderBottom: "1px solid black",
    padding: "4px 20px",
    marginBottom: "20px"
  },
  userPhoto: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    borderRadius: "50%",
    marginRight: theme.spacing(1) // Adjust the margin as needed
  },
  userName: {
    fontWeight: "bold",
    marginRight: theme.spacing(1),
    fontSize: "14px"
  },
  lastOnline: {
    fontStyle: "italic"
  },
  messageIcon: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    zIndex: "2"
  }
}));

function Inquiry_detail() {

  const { _id } = useParams();

  const [companyDetails, setCompanyDetails] = useState("")
  const [product, setProduct] = useState("")
  const [buyer, setBuyer] = useState("")
  const [seller, setSeller] = useState("")
  const [messages, setMessages] = useState([])

  console.log(companyDetails)

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(`${BASE_URL}/api/inquiryRoutes/inquiryDisplayById/${_id}`, {
        headers: {
          Authorization: token,
        },
      });

      setCompanyDetails(response?.data?.data?.[0])
      setProduct(response?.data?.data?.[0]?.product)
      setSeller(response?.data?.data?.[0]?.seller_company)
      setBuyer(response?.data?.data?.[0]?.buyer_company)
    } catch (error) {

    }
  };
  const fetchMessageList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/chat/display/${_id}`, {
        headers: {
          // Authorization: token,
        },
      });
      setMessages(response.data.data);
    } catch (error) {

    }
  };

  useEffect(() => {
    fetchUserList();
    fetchMessageList();
  }, []);

  const classes = useStyles();

  const [isMessageBoxOpen, setMessageBoxOpen] = useState(false);

  const toggleMessageBox = () => {
    setMessageBoxOpen(!isMessageBoxOpen);
  };



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className={classes.messageIcon} style={{ position: "fixed", bottom: "4.1%", right: "7%", zIndex: "2", backgroundColor: "white", boxShadow: " rgba(0, 0, 0, 0.14) 0px 3px 8px", borderRadius: "50%", padding: "7px 6px", }}>
        <IconButton onClick={toggleMessageBox}>
          <MessageIcon style={{ color: "darkBlue", height: "20px" }} />
        </IconButton>
      </div>

      {isMessageBoxOpen && (
        <div>
          <div
            className={classes.messageIcon}
            style={{
              position: "fixed",
              bottom: "4.1%",
              right: "7%",
              zIndex: "2",
              backgroundColor: "white",
              boxShadow: "rgba(0, 0, 0, 0.14) 0px 3px 8px",
              borderRadius: "50%",
              padding: "7px 6px",
            }}
          >
            <Paper className={classes.paper} zDepth={2}>
              <div className={classes.header}>
                <div className={classes.userName}>ID : 29038HDJSK91U</div>
                <div className={classes.userName}>
                  <span className={classes.userName}>Inquiry Date :</span>10-12-2024
                </div>
              </div>
              <Paper id="style-1" className={classes.messagesBody}>
                {messages.map((message) => {
                  const isCurrentUser = message.senderId === message?.inquiryDetails?.[0]?.seller_company_id;
                  const isMessageEmpty = message.message.trim() === "";

                  // Render card if message is empty
                  if (isMessageEmpty) {
                    return (
                      <div
                        key={message._id}
                        style={{
                          display: 'flex',
                          justifyContent: isCurrentUser ? 'flex-start' : 'flex-end'
                        }}
                      >
                        <Card
                          className={classes.detailCard}
                          style={{
                            margin: "10px 0",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                            maxWidth: '60%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignSelf: isCurrentUser ? 'flex-start' : 'flex-end',
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" component="div" style={{ marginBottom: "8px" }}>
                              Request Details
                            </Typography>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                  Quantity:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {message.quantity}
                                </Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                  Quantity Type:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {message.quantity_type}
                                </Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                  Final Price:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {message.final_price}
                                </Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                  Date & Time:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {message.Datetime?.slice(0, 10)}
                                </Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                  Delivery Time:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {message.delivery_time}
                                </Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                  Payment Terms:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {message.payment_terms}
                                </Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                  Inco Terms:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {message.inco_terms}
                                </Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
                                  Request Status:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {message.request_status}
                                </Typography>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  }

                  // Render messages if not empty
                  return isCurrentUser ? (
                    <MessageLeft
                      key={message._id}
                      message={message.message}
                      timestamp={message.Datetime?.slice(0, 10)}
                      photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                      displayName={companyDetails?.seller_company?.company_name}
                      avatarDisp={true}
                    />
                  ) : (
                    <MessageRight
                      key={message._id}
                      message={message.message}
                      timestamp={message.Datetime?.slice(0, 10)}
                      photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                      displayName={companyDetails?.buyer_company?.company_name}
                      avatarDisp={true}
                    />
                  );
                })}
              </Paper>
            </Paper>
          </div>
        </div>
      )}




      <MDBox mb={2}
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        onClick={() => setMessageBoxOpen(false)}
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
        onClick={() => setMessageBoxOpen(false)}
      >
        <Grid container spacing={3}>

          <Grid item xs={12} md={6} xl={6} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Product information"
              info={{
                product: product?.name_of_chemical,
                CAS_number: product?.CAS_number,
                IUPAC_name: product?.IUPAC_name,
                Molecular_formula: product?.molecularFormula,
                mol_weight: product?.mol_weight,
                storage: product?.storage,
                synonums: product?.synonums,
                appearance: product?.Appearance,
                purity: companyDetails.purity,
                supply_capacity: companyDetails.supply_capacity,
                country_origin: companyDetails.country_origin,
              }}

              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
              coaLink={companyDetails?.COA}
              lrcopyLink={companyDetails?.po_details?.[1]?.lr_copy}
              loricopyLink={companyDetails?.po_details?.[1]?.lori_copy}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            {companyDetails.inq_type == "commercial" ? (
              <>
                <ProfileInfoCard
                  title="Inquiry Details"
                  info={{
                    inquiry_type: companyDetails?.inq_type,
                    inquiry_date: `${companyDetails?.createdAt?.slice(0, 10)}`,
                    inquiry_quantity: `${companyDetails?.inquiry_qty} ${companyDetails?.qty_type}`,
                    price_range: `${companyDetails?.min_price}₹ - ${companyDetails?.max_price} ₹`,
                    // one_lot_quantity: `${companyDetails.one_lot_qty} ${companyDetails.one_lot_qty_type}`,
                    // one_lot_qty_price: companyDetails.one_lot_qty_price,
                    // payment_type: companyDetails.payment_type,
                    payment_terms: companyDetails.payment_terms,
                    inco_terms: companyDetails?.inco_terms,
                    delivery_time: companyDetails.delivery_time,
                    inquiry_date: companyDetails.createdAt?.slice(0, 10),
                    hsn_code: companyDetails?.hsn_code,
                    category: companyDetails?.category,
                    grade: companyDetails?.grade,

                  }}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                  status={companyDetails?.status}
                  pstatus={companyDetails?.payment_status}

                />
              </>
            ) : (
              <ProfileInfoCard
                title="Inquiry Details"
                info={{
                  inquiry_type: companyDetails?.inq_type,
                  inquiry_date: `${companyDetails?.createdAt?.slice(0, 10)}`,
                  inquiry_quantity: `${companyDetails.inquiry_qty} ${companyDetails.qty_type}`,
                  price: `₹${companyDetails.min_price} - ₹${companyDetails.max_price}`,
                  one_lot_quantity: `${companyDetails.one_lot_qty} ${companyDetails.one_lot_qty_type}`,
                  one_lot_qty_price: companyDetails.one_lot_qty_price,
                  total_lot: companyDetails.total_lot,
                  payment_type: companyDetails.payment_type,
                  payment_terms: companyDetails.payment_terms,
                  delivery_time: companyDetails.delivery_time,
                }}

                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
                status={companyDetails?.status}
                pstatus={companyDetails?.payment_status}

              />
            )}
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Buyer Company Details"
              info={{
                company_name: buyer?.company_name,
                contact_person_name: buyer?.contact_person_name,
                emailid: buyer?.emailid,
                mobile_num: buyer?.mobile_num,
                gst_number: buyer?.gst,
                mode_of_business: buyer?.mode_of_business?.join(", "),
                address: buyer?.address,
                country: buyer?.country,
                state: buyer?.state,
                city: buyer?.city,
                pincode: buyer?.pincode,
              }}

              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
              bstatus={buyer?.status}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={6} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Seller Company Details"
              info={{
                company_name: seller?.company_name,
                contact_person_name: seller?.contact_person_name,
                emailid: seller?.emailid,
                mobile_number: seller?.mobile_num,
                gst: seller?.gst,
                mode_of_business: seller?.mode_of_business?.join(", "),
                address: seller?.address,
                country: seller?.country,
                state: seller?.state,
                city: seller?.city,
                pincode: seller?.pincode,
              }}

              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
              sstatus={seller?.status}
            />
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <StatusProgress statuses={companyDetails?.inquiry_status_details?.[0]?.inquiry_status_value} />
          </Grid>
        </Grid>
      </Card>
      <Footer />
    </DashboardLayout>

  );
}

export default Inquiry_detail;
