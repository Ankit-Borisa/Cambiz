// react-routers components
import { Link, useParams } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MenuItem from '@mui/material/MenuItem';
import { Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MDSnackbar from "components/MDSnackbar";
import { BASE_URL } from "BASE_URL";
import axios from "axios";

function ProfilesList({ title, profiles, shadow }) {


  const [errorMessage, setErrorMessage] = useState("");

  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Updated"
      content="Document Status Updated Successfully."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Filled Error"
      content={errorMessage}
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const handleDropdownChange = (event, profile) => {
    if (event !== "pending") {
      setSelectedProfile(profile);
      setSelectedStatuses(event)
      setOpenConfirmationDialog(true);
    } else {
      setErrorMessage("You Can't Change to the Pending!")
      openErrorSB();
    }
  };

  const handleConfirmStatusChange = async () => {
    try {
      if (!selectedProfile) {
        // Handle the case when no profile is selected
        return;
      }
      // Get the selected status from the dropdown

      // Make the PUT request to update the status
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      await axios.put(`${BASE_URL}/api/documents/update/${selectedProfile}`, { status: selectedStatuses }, {
        headers: {
          Authorization: token,
        },
      });

      setOpenConfirmationDialog(false);
      openSuccessSB();
      fetchUserList();
    } catch (error) {
      console.error("Error updating status:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
  };


  const { _id } = useParams();
  const [companyDetails, setCompanyDetails] = useState("")

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(`${BASE_URL}/company/companyDetail/${_id}`, {
        headers: {
          Authorization: token,
        },
      });
      setCompanyDetails(response.data.company)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);


  const renderProfiles = companyDetails.documents && companyDetails.documents.map((e) => (
    <MDBox component="li" display="flex" alignItems="center" py={1} mb={1}>
      {/* <MDBox mr={2}>
        <MDAvatar src={image} alt="something here" shadow="md" />
      </MDBox> */}
      <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
        <MDTypography variant="button" fontWeight="medium">
          {e?.certificate?.[0]?.certificate_name}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {/* "Click Here" */}

          <a href={e.doc_file} target="_blank" rel="noopener noreferrer">
            (Click here)
          </a>

        </MDTypography>
        <MDTypography variant="caption" color="text">
          valid till ({e?.valid_till?.slice(0, 10)})
        </MDTypography>
      </MDBox>
      <MDBox ml="auto">
        <select
          onChange={(event) => handleDropdownChange(event.target.value, e._id)}
          value={e.status}
          style={{
            color: "#7b809a",
            paddingLeft: "10px",
            background: "transparent",
            border: "1px solid #dadbda",
            width: "100%",
            height: "35px",
            borderRadius: "5px",
            fontSize: "14px",
            right: "0px",
          }}>
          {/* <option value="" selected  >State</option> */}
          <option value='' disabled>SELECT</option>
          <option value="active">ACTIVE</option>
          <option value="inactive">INACTIVE</option>
          <option value="pending">PENDING</option>

        </select>
        {renderSuccessSB}
        {renderErrorSB}
      </MDBox>
    </MDBox>
  ));

  return (
    <>
      <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
        <MDBox pt={2} px={2}>
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {title}
          </MDTypography>
        </MDBox>
        <MDBox p={2}>
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {renderProfiles}
          </MDBox>
        </MDBox>
      </Card>
      <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status of {selectedProfile?.name}'s document?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseConfirmationDialog} color="dark">
            Cancel
          </MDButton>
          <MDButton onClick={handleConfirmStatusChange} color="info" autoFocus>
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Setting default props for the ProfilesList
ProfilesList.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfilesList
ProfilesList.propTypes = {
  title: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  shadow: PropTypes.bool,
};

export default ProfilesList;
