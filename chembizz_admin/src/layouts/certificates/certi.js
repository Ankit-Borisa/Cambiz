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
import MDButton from "components/MDButton";
import { Link, useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Data
import authorsTableData from "layouts/certificates/data/authorsTableData";
import { useEffect, useState } from "react";
import { BASE_URL } from "BASE_URL";
import axios from "axios";
import MDSnackbar from "components/MDSnackbar";

const Certificate = () => {

  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);  

  const renderSuccessSB = (
    <MDSnackbar
        color="success"
        icon="check"
        title="Successfull Deleted"
        content="Certificate Is Successfully Deleted."
        dateTime="1 sec"
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite
    />
);

  const token = localStorage.getItem("chemToken");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/authentication/sign-in");
    }
  }, []);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleDelete = (categoryId) => {
    setSelectedCategoryId(categoryId); // Set the selected category ID
    setOpenConfirmationDialog(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      console.log(selectedCategoryId);
      await axios.delete(`${BASE_URL}/api/certificate/delete/${selectedCategoryId}`, {
        headers: {
          Authorization: token,
        },
      });
      fetchUserList();
      setOpenConfirmationDialog(false);
      openSuccessSB();
    } catch (error) {
      console.log("Error deleting category:", error);
    }
  };



  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const [ceritificateList, setCertificateList] = useState([])

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(

        `${BASE_URL}/api/certificate/certificates`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setCertificateList(response.data.certificates);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const { columns, rows } = authorsTableData({handleDelete, ceritificateList});

  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 850;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Certificate List
                </MDTypography>
                <Link to="/add-certificate" style={{ textDecoration: "none" }}>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    style={{ position: "absolute", top: "-9px", right: "2%" }}
                  >
                    {shouldShowAddButton() ? "" : "+ Add Certificate"}
                  </MDButton>
                </Link>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Are You Sure Want To Delete?</DialogTitle>
        <DialogActions style={{display: "flex", justifyContent: "center"}}>
          <MDButton onClick={handleCloseConfirmationDialog} color="dark">
            No
          </MDButton>
          <MDButton onClick={handleConfirmStatusChange} color="info" autoFocus>
            Yes
          </MDButton>
        </DialogActions>
      </Dialog>
      {renderSuccessSB}
    </DashboardLayout>
  );
};

export default Certificate;
