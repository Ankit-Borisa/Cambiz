
import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
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
import MDSnackbar from "components/MDSnackbar";
import { useParams } from 'react-router-dom';
import { BASE_URL } from "BASE_URL";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import { Margin } from "@mui/icons-material";
// import
const Addadmin = () => {

    const [errorMessage, setErrorMessage] = useState("")

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullname: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "username") {
            // Replace spaces with an empty string
            const filteredValue = value.replace(/\s/g, '');

            setFormData((prevData) => ({
                ...prevData,
                [name]: filteredValue
            }));
        } else if (name === "fullname") {
            // Regular expression to allow only letters, spaces, and hyphens
            const filteredValue = value.replace(/[^a-zA-Z\s-]/g, '');

            setFormData((prevData) => ({
                ...prevData,
                [name]: filteredValue
            }));
        } else if (name === "password") {
            // Trim spaces from the password value
            const trimmedValue = value.trim();

            setFormData((prevData) => ({
                ...prevData,
                [name]: trimmedValue
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };




    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const navigate = useNavigate();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Added"
            content="Admin is Successfully Added."
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
            content={errorMessage}
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );


    const handleSubmit = async () => {
        const { username, password, fullname } = formData;

        console.log(password);

        if (!username && !password && !fullname) {
            setErrorMessage("Please Fill All Fields!")
            openErrorSB();
            return;
        }

        if (!username) {
            setErrorMessage("Please Enter Username!")
            openErrorSB();
            return;
        }

        if (!password) {
            setErrorMessage("Please Enter Password!")
            openErrorSB();
            return;
        }
        if (password.length < 4) {
            setErrorMessage("Your password must contain at least 4 characters!")
            openErrorSB();
            return;
        }

        if (!fullname.trim()) {
            setErrorMessage("Please Enter Fullname!")
            openErrorSB();
            return;
        }


        try {
            const token = `Bearer ${localStorage.getItem("chemToken")}`;

            const response = await fetch(`${BASE_URL}/api/superadmin/addadmin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    password,
                    username,
                    fullname
                }),
            });

            if (response.ok) {
                const data = await response.json();
                openSuccessSB();
                setTimeout(() => {
                    navigate("/admin");
                }, 1000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            setErrorMessage(error.message || "An error occurred");
            openErrorSB();
        }
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
                                style={{
                                    position: "relative",
                                }}
                            >
                                <MDTypography variant="h6" color="white">
                                    Add Admin
                                </MDTypography>
                            </MDBox>
                            <MDBox py={3}  >
                                <Grid container pt={4} pb={3} px={3}>
                                    <Grid item xs={12} md={6} xl={6} px={2}>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDInput
                                            type={showNewPassword ? "text" : "password"}
                                            label="Password"
                                            name="password"
                                            fullWidth
                                            value={formData.password} // Update this line
                                            onChange={handleChange} // Update this line
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleShowNewPassword}>
                                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            style={{ marginBottom: "20px" }}
                                        />
                                        <MDBox mb={2} mt={2} >
                                            <MDInput
                                                type="text"
                                                label="Full Name"
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                name="fullname"
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
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            {/* <Footer /> */}
        </DashboardLayout>
    );
};

export default Addadmin;