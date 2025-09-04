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
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import InputLabel from "@mui/material/InputLabel";
import MDSnackbar from "components/MDSnackbar";
import Switch from '@mui/material/Switch';
import "./index.css";
import { BASE_URL } from "BASE_URL";
// import
const EditPackage = () => {
  const [membershipFeatures, setMembershipFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [errorSB1, setErrorSB1] = useState(false);
  const [errorSB2, setErrorSB2] = useState(false);
  const { _id } = useParams();
  const [data, setData] = useState();
  const [formData, setFormData] = useState({
    plan_name: "",
    plan_original_price: "",
    plan_selling_price: "",
    plan_days: "",
    catalog_limit: "",
    sequence: "",
    membership_feature_id: [], // Empty array for storing checked feature _ids
  });

  useEffect(() => {
    if (data) {
      const selectedFeatures = data[0].membership_feature_id.map((feature) => ({
        membership_id: feature.membership_id,
        membership_feature_status: feature.membership_feature_status,
      }));
      setFormData({
        sequence: data[0].sequence || "",
        plan_name: data[0].plan_name || "",
        plan_original_price: data[0].plan_original_price || "",
        plan_selling_price: data[0].plan_selling_price || "",
        plan_days: data[0].plan_days || "",
        catalog_limit: data[0].catalog_limit || "",
        membership_feature_id: selectedFeatures,
      });
    }
  }, [data]);

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
      if (value.length > 6) {
        return;
      }
      {
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

  const handleCheckboxChange = (event) => {
    const itemName = event.target.name;
    const isChecked = event.target.checked;

    const itemToUpdate = {
      membership_id: itemName,
      membership_feature_status: isChecked,
    };

    const existingItemIndex = formData.membership_feature_id.findIndex(
      (item) => item.membership_id === itemName
    );

    if (existingItemIndex !== -1) {
      // Update the status of the existing item
      formData.membership_feature_id[existingItemIndex] = itemToUpdate;
    } else {
      // Add the new item to the array
      formData.membership_feature_id.push(itemToUpdate);
    }

    // Include items with membership_feature_status as false
    const allFeatureIds = membershipFeatures.map((feature) => feature._id);
    const includedFeatureIds = formData.membership_feature_id.map((item) => item.membership_id);

    allFeatureIds.forEach((featureId) => {
      if (!includedFeatureIds.includes(featureId)) {
        formData.membership_feature_id.push({
          membership_id: featureId,
          membership_feature_status: false,
        });
      }
    });

    setFormData({ ...formData });
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
      title="Successfull Update"
      content="Membership Plan is successfully Update."
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
    const fetchData = async () => {
      try {

        const categoryListPromise = axios.get(`${BASE_URL}/api/membership_feature/findAll`);
        const dataPromise = axios.get(`${BASE_URL}/api/membership_plan/displayById/${_id}`);

        const [categoryListResponse, dataResponse] = await Promise.all([
          categoryListPromise,
          dataPromise,
        ]);

        setMembershipFeatures(categoryListResponse.data.data);
        setData(dataResponse.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log(formData);
  console.log(formData.plan_selling_price);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;


  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (formData.plan_original_price < formData.plan_selling_price) {
    //   openErrorSB1();
    //   return;
    // }

    // if (formData.plan_original_price == 0 || formData.plan_selling_price == 0 || formData.contact_limit == 0 || formData.plan_days == 0) {
    //   openErrorSB2();
    //   return;
    // }

    if (
      !formData.plan_selling_price ||
      !formData.plan_name ||
      !formData.plan_original_price ||
      !formData.plan_days ||
      !formData.catalog_limit ||
      !formData.sequence 
    ) {
      openErrorSB();
      return;
    }
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.put(
        `${BASE_URL}/api/membership_plan/update/${_id}`,
        {
          ...formData,
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
            Update Membership Plan
          </MDTypography>
        </MDBox>
        {isLoading ? (
          <Audio
            height="80"
            width="80"
            radius="9"
            color="green"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        ) : (
          <MDBox pt={4} pb={3} px={3}>
            <form style={style1} role="form" className="form_container demo2">
              <MDBox mb={2}>
                <MDInput
                  type="Number"
                  label="Sequence"
                  name="sequence"
                  value={formData.sequence}
                  onKeyPress={handleKeyPress}
                  onChange={handleChange}
                  fullWidth
                  style={{ marginBottom: "20px" }}
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
                  type="text"
                  label="plan name"
                  name="plan_name"
                  value={formData.plan_name}
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
                  type="number"  // Use "number" type to allow only numeric input
                  label="Selling Price Of Plan"
                  name="plan_selling_price"
                  value={formData.plan_selling_price}
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
                  type="Number"
                  label="Plan Days"
                  name="plan_days"
                  value={formData.plan_days}
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
                      type="checkbox"
                      id={feature._id}
                      name={feature._id}
                      checked={formData.membership_feature_id.some(
                        (item) => item.membership_id === feature._id && item.membership_feature_status
                      )}
                      onChange={handleCheckboxChange}
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
        )}
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
};

export default EditPackage;