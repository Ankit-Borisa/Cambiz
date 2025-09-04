
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// // Material Dashboard 2 React example components
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import DataTable from "examples/Tables/DataTable";
// import MDButton from "components/MDButton";
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import FormControl from '@mui/material/FormControl';

// // Data
// import authorsTableData from "layouts/suggestedchemicals/data/authorsTableData";
// import TextField from '@mui/material/TextField';
// import axios from "axios";
// import { BASE_URL } from "BASE_URL";

// const Suggested = () => {
//   const token = localStorage.getItem("chemToken");
//   const navigate = useNavigate();

//   const [chemicalList, setChemicalList] = useState([])
//   console.log(chemicalList);

//   const fetchUserList = async () => {
//     try {
//       const token = `Bearer ${localStorage.getItem("chemToken")}`;
//       const response = await axios.get(
//         `${BASE_URL}/api/productByCompany/displayList`,
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );
//       setChemicalList(response.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchUserList();
//   }, []);

//   useEffect(() => {
//     if (!token) {
//       navigate("/authentication/sign-in");
//     }
//   }, []);

//   const shouldShowAddButton = () => {
//     const screenWidth =
//       window.innerWidth ||
//       document.documentElement.clientWidth ||
//       document.body.clientWidth;
//     return screenWidth < 850;
//   };

//   const [searchTerm, setSearchTerm] = useState("");

//   const handleCompanyChange = (event) => {
//     setSearchTerm(event.target.value);
//   }

//   const { columns, rows } = authorsTableData(chemicalList, searchTerm);

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//         <Grid item xs={5}>
//           <FormControl fullWidth>
//             <TextField id="outlined-basic" onChange={handleCompanyChange} label="Search chemical or cas number" variant="outlined" />
//           </FormControl>
//         </Grid>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="info"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h6" color="white">
//                   Suggested Chemical List
//                 </MDTypography>
//               </MDBox>
//               <MDBox pt={3}>
//                 <DataTable
//                   table={{ columns, rows }}
//                   isSorted={false}
//                   entriesPerPage={false}
//                   showTotalEntries={false}
//                   noEndBorder
//                 />
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// };

// export default Suggested;










import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/suggestedchemicals/data/authorsTableData";
import { BASE_URL } from "BASE_URL";
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Suggested = () => {
  const token = localStorage.getItem("chemToken");
  const navigate = useNavigate();
  const [chemicalList, setChemicalList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(
        `${BASE_URL}/api/productByCompany/displayList`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setChemicalList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/authentication/sign-in");
    }
  }, [token, navigate]);

  const handleOpen = (chemical) => {
    setSelectedChemical(chemical);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmOpen(false);
  };

  const handleApprove = () => {
    const updatedList = chemicalList.map(chemical =>
      chemical._id === selectedChemical._id ? { ...chemical, status: "approved" } : chemical
    );
    setChemicalList(updatedList);
    setSnackbarMessage("Chemical approved successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    handleClose();
  };

  const handleDecline = () => {
    const updatedList = chemicalList.map(chemical =>
      chemical._id === selectedChemical._id ? { ...chemical, status: "declined" } : chemical
    );
    setChemicalList(updatedList);
    setSnackbarMessage("Chemical declined successfully");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
    handleClose();
  };

  const handleCompanyChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleConfirmOpen = (type) => {
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (actionType === "approve") {
      handleApprove();
    } else if (actionType === "decline") {
      handleDecline();
    }
  };

  const { columns, rows } = authorsTableData(chemicalList, searchTerm, handleOpen);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={5}>
            <FormControl fullWidth>
              <TextField id="outlined-basic" onChange={handleCompanyChange} label="Search chemical or cas number" variant="outlined" />
            </FormControl>
          </Grid>
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
                  Suggested Chemical List
                </MDTypography>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MDTypography id="modal-modal-title" variant="h4" component="h2">
            Chemical Details
          </MDTypography>
          {selectedChemical && (
            <MDBox id="modal-modal-description" sx={{ mt: 2 }}>
              {/* <MDTypography>Photo: {selectedChemical.}</MDTypography> */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <MDTypography>
                    <strong>Chemical Name:</strong> {selectedChemical.name_of_chemical}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography>
                    <strong>CAS Number:</strong> {selectedChemical.CAS_number}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography>
                    <strong>IUPAC Name:</strong> {selectedChemical.IUPAC_name}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography>
                    <strong>Molecular Weight:</strong> {selectedChemical.mol_weight}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography>
                    <strong>Molecular Formula:</strong> {selectedChemical.molecularFormula}
                  </MDTypography>
                </Grid>
                <Grid item xs={12}>
                  <MDTypography>
                    <strong>Synonyms:</strong> {selectedChemical.synonums}
                  </MDTypography>
                </Grid>
              </Grid>
              <MDBox display="flex" justifyContent="flex-end" mt={3}>
                <IconButton color="success" onClick={() => handleConfirmOpen("approve")}>
                  <CheckIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleConfirmOpen("decline")}>
                  <CloseIcon />
                </IconButton>
              </MDBox>
            </MDBox>
          )}
        </Box>
      </Modal>
      <Dialog
        open={confirmOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Action"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {actionType} this chemical?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Suggested;


