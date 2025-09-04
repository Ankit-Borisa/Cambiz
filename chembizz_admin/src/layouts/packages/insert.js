import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDSnackbar from "components/MDSnackbar";
import Switch from '@mui/material/Switch';
// import "./index.css";
import { BASE_URL } from "BASE_URL";

// import
const InsertPackage = () => {
  const [membershipFeatures, setMembershipFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [errorSB, setErrorSB] = useState(false);
  const [errorSB1, setErrorSB1] = useState(false);
  const [errorSB2, setErrorSB2] = useState(false);
  const [formData, setFormData] = useState({
    plan_name: "",
    plan_original_price: "",
    plan_selling_price: "",
    plan_days: "",
    catalog_limit: "",
    sequence: "",
    membership_feature_id: [], // Empty array for storing checked feature _ids
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const updatedFeatures = prevFormData.membership_feature_id.map((feature) => {
          if (feature.membership_id === name) {
            return { ...feature, membership_feature_status: checked };
          }
          return feature;
        });

        // Include items with membership_feature_status as false
        const allFeatureIds = membershipFeatures.map((feature) => feature._id);
        const includedFeatureIds = updatedFeatures.map((item) => item.membership_id);

        allFeatureIds.forEach((featureId) => {
          if (!includedFeatureIds.includes(featureId)) {
            updatedFeatures.push({
              membership_id: featureId,
              membership_feature_status: false,
            });
          }
        });

        return {
          ...prevFormData,
          membership_feature_id: updatedFeatures,
        };
      });
    } else if (type === "number") {
      // Limit input to 4 digits
      if (value.length > 6) {
        return;
      } {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    } else if (type === "text") { // Add this condition for text input changes
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const openErrorSB1 = () => setErrorSB1(true);
  const closeErrorSB1 = () => setErrorSB1(false);

  const openErrorSB2 = () => setErrorSB2(true);
  const closeErrorSB2 = () => setErrorSB2(false);


  const navigate = useNavigate();
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Added"
      content="Membership Plan is successfully added."
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

  const renderErrorSB1 = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Filled Error"
      content="Enter Selling Price Below Original Price"
      dateTime="1 sec ago"
      open={errorSB1}
      onClose={closeErrorSB1}
      close={closeErrorSB1}
      bgWhite
    />
  );

  const renderErrorSB2 = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Filled Error"
      content="Not Enter Zero Value"
      dateTime="1 sec ago"
      open={errorSB2}
      onClose={closeErrorSB2}
      close={closeErrorSB2}
      bgWhite
    />
  );


  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/membership_feature/findAll`
        );
        const membershipFeaturesWithStatus = response.data.data.map((feature) => ({
          membership_id: feature._id,
          membership_feature_status: false,
        }));

        setFormData((prevFormData) => ({
          ...prevFormData,
          membership_feature_id: membershipFeaturesWithStatus,
        }));

        setMembershipFeatures(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.plan_original_price == 0 || formData.plan_selling_price == 0 || formData.plan_days == 0) {
      openErrorSB2();
      return;
    }

    if (
      !formData.plan_selling_price ||
      !formData.plan_name.trim() ||
      !formData.plan_original_price ||
      !formData.catalog_limit ||
      !formData.sequence 
    ) {
      openErrorSB();
      return;
    }

    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.post(
        `${BASE_URL}/api/membership_plan/insert`,
        {
          ...formData,
          membership_feature_id: formData.membership_feature_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data)
      if (response.data.success) {
        openSuccessSB();
        setTimeout(() => {
          navigate("/packages");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      // Handle error or show an error message
    }
    setFormData({
      plan_name: "",
      plan_original_price: "",
      plan_selling_price: "",
      contact_limit: "",
      plan_days: "",
      membership_feature_id: [], // Empty array for storing checked feature _ids
    });
  };

  const style1 = {
    //   // Adding media query..
    //   width: "40%",
    //   margin: "auto",
    //   padding: "2rem",
    //   borderRadius: "5%",
    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
    //   "@media (max-width: 700px)": {
    //     width: "100%",
    //   },
  };

  function handleKeyPress(event) {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isNumeric = /^[0-9]+$/.test(keyValue);

    if (!isNumeric) {
      event.preventDefault();
    }
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox textAlign="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Insert Membership Plan
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form
            // component="form"

            style={style1}
            role="form"
            className="form_container demo2"
          >

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Sequence"
                name="sequence"
                value={formData.sequence}
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="plan name"
                name="plan_name"
                value={formData.plan_name.trim()}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
              />
            </MDBox>
            <MDBox mb={2}>

              <MDInput
                type="number"  // Use "number" type to allow only numeric input
                label="Original Price Of Plan"
                name="plan_original_price"
                value={formData.plan_original_price}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
                maxLength="6"
                onKeyDown={(e) => {
                  const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
                  if (!validKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Selling Price Of Plan"
                name="plan_selling_price"
                value={formData.plan_selling_price}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
                maxLength="6"
                onKeyDown={(e) => {
                  // Allow only numeric input, backspace, and delete
                  const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
                  if (!validKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />


            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="Number"
                label="Plan Days"
                name="plan_days"
                value={formData.plan_days}
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
                onKeyDown={(e) => {
                  // Allow only numeric input, backspace, and delete
                  const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
                  if (!validKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="Number"
                label="Catalog Limit"
                name="catalog_limit"
                value={formData.catalog_limit}
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                fullWidth
                style={{ marginBottom: "20px" }}
                onKeyDown={(e) => {
                  // Allow only numeric input, backspace, and delete
                  const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
                  if (!validKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </MDBox>

            <MDBox mb={2}>
              <InputLabel style={{ marginBottom: "1rem" }}>Select Membership Features</InputLabel>
              {membershipFeatures.map((feature) => (
                <MDBox key={feature._id} display="flex" alignItems="center">
                  <Switch
                    id={feature._id}
                    name={feature._id} // Use feature._id as the name
                    checked={
                      formData.membership_feature_id.find(
                        (item) => item.membership_id === feature._id
                      )?.membership_feature_status || false
                    } // Check if feature._id is present in the membership_feature_id array and get its status; default to false if not found
                    onChange={handleChange}

                  />
                  <label style={{ color: darkMode ? "#ffffffcc" : "", fontSize: "15px", fontWeight: "500" }} htmlFor={feature._id}>
                    {feature.feature_name}
                  </label>
                </MDBox>
              ))}
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                // component={Link}
                // to="/dashboard"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </MDButton>
              {renderSuccessSB}
              {renderErrorSB}
              {renderErrorSB1}
              {renderErrorSB2}
            </MDBox>
          </form>
        </MDBox>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default InsertPackage;

