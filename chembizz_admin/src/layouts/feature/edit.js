import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
// import { useParams } from 'react-router-dom';
import "./index.css";
import { BASE_URL } from "BASE_URL";
// import
const EditMembershipPackage = () => {
  const [membershipFeature, setMembershipFeature] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const { _id } = useParams();
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const navigate = useNavigate();
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Added"
      content="Membership Feature is successfully added."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Filled Error"
      content="Please fill all fileds"
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const handleChange = (e) => {
    setMembershipFeature(e.target.value);
  };

  const getCategory = async (e) => {

    try {
      console.log(_id);
      const result = await axios.get(`${BASE_URL}/api/membership_feature/findById/${_id}`)
      console.log(result.data);
      setMembershipFeature(result?.data?.data?.feature_name);

    } catch (error) {

    }
  }
  useEffect(() => {
    getCategory();


  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!membershipFeature) {
      openErrorSB();
      return;
    }
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.put(
        `${BASE_URL}/api/membership_feature/update/${_id}`,
        {
          feature_name: membershipFeature,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        openSuccessSB();
        setTimeout(() => {
          navigate("/package-features");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
    setMembershipFeature("");
  };
  const style1 = {
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Edit Membership Feature
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form
            style={style1}
            role="form"
            className="form_container demo"
          >
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="membershipFeature"
                name="membershipFeature"
                value={membershipFeature}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </MDButton>
              {renderSuccessSB}
              {renderErrorSB}
            </MDBox>
          </form>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
};

export default EditMembershipPackage;
