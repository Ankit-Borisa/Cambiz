
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
// import
const Editadmin = () => {
    const [errorMessage, setErrorMessage] = useState("")

    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const navigate = useNavigate();
    const { _id } = useParams();

    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Added"
            content="Admin Is Successfully Updated."
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


    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setStatus(e.target.value)
    };


    const handleSubmit = async () => {
        if (!status) {
            setErrorMessage("Please Select Status!")
            openErrorSB();
            return;
        }

        try {
            const token = `Bearer ${localStorage.getItem("chemToken")}`;
            const res = await fetch(`${BASE_URL}/api/superadmin/changeadminstatus/${_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    status
                }),
            });
            if (res.status === 200) {
                const data = await res.json();
                openSuccessSB();
                setTimeout(() => {
                    navigate(-1)
                }, 2000);
            } else {
                // openErrorSB();
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            openErrorSB();
        }
    };


    const [name, setName] = useState("")
    const [fullname, setFullname] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const token = `Bearer ${localStorage.getItem("chemToken")}`;
                const response = await axios.get(
                    `${BASE_URL}/api/superadmin/adminbyid/${_id}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                setPassword(response?.data?.admin?.password)
                setName(response?.data?.admin?.username)
                setFullname(response?.data?.admin?.fullname)
                setStatus(response?.data?.admin?.status)
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserList();
    }, []);


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
                                    Change Status Of Admin
                                </MDTypography>
                            </MDBox>
                            <MDBox py={3} px={2}>
                                <Grid container pt={4} pb={3} px={3}>
                                    <Grid item xs={12} md={6} xl={6} px={2}>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Username"
                                                name="category"
                                                value={name}
                                                fullWidth
                                                disabled
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Password"
                                                name="category"
                                                value={password}
                                                fullWidth
                                                disabled
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Full Name"
                                                name="category"
                                                value={fullname}
                                                fullWidth
                                                disabled
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2} style={{ position: 'relative' }}>
                                            <select
                                                value={status}
                                                onChange={handleChange}
                                                name="status"
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
                                                <option value="" disabled>SELECT</option>
                                                <option value="active">ACTIVE</option>
                                                <option value="inactive">INACTIVE</option>

                                            </select>
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

export default Editadmin;