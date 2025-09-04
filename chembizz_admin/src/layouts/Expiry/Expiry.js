import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Card from "@mui/material/Card";
import { NavLink, useNavigate } from "react-router-dom";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDButton from "components/MDButton";

import backgroundImage from "assets/images/bg-profile.jpeg";


import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { BASE_URL } from "BASE_URL";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MDSnackbar from "components/MDSnackbar";

function Expiry() {

    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Updated"
            content="Days Updated Successfully."
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
            content="Please Enter Valid Days"
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    const navigate = useNavigate();

    const [message, setMessage] = useState("")
    const [displayMessage, setDisplayMessage] = useState("")
    const [id, setID] = useState("")

    const fetchUserList = async () => {
        try {
            const token = `Bearer ${localStorage.getItem("chemToken")}`;
            const response = await axios.get(`${BASE_URL}/api/expire/display`, {
                headers: {
                    Authorization: token,
                },
            });
            setDisplayMessage(response?.data?.data?.[0]?.days)
            setID(response?.data?.data?.[0]?._id)

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    const handleChange = (e) => {
        let input = e.target.value;
        // Replace non-numeric characters with an empty string
        input = input.replace(/\D/g, '');
        // Limit the input to 10 characters
        if (input.length > 3) {
            input = input.trim().slice(0, 3);
        }
        setMessage(input);
    };


    const handleSubmit = async () => {

        
        if (!message) {
            openErrorSB();
            return;
        }

        if (message.length > 3) {
            openErrorSB();
            return;
        }

        const token = `Bearer ${localStorage.getItem("chemToken")}`;
        const response = await fetch(`${BASE_URL}/api/expire/edit/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                days: message,
            }),
        });


        if (response.status) {
            fetchUserList();
            setMessage("")
            openSuccessSB()
        } else {
            openErrorSB()
        }


    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2}
                display="flex"
                alignItems="center"
                position="relative"
                minHeight="18.75rem"
                borderRadius="xl"
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
            >
                <Grid container spacing={3}>

                    <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }} className="d-flex justify-content-center py-5">
                        <MDBox>
                            <MDBox fullWidth className="d-flex gap-2">
                                <TextField id="outlined-basic" value={message} label="Search" className="w-75" variant="outlined" onChange={handleChange} />
                                <MDButton
                                    variant="gradient"
                                    color="dark"
                                    className=""
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </MDButton>
                            </MDBox>
                            <p className="mt-3 fs-3">
                                You Set {displayMessage} As A Expiry Days
                            </p>
                        </MDBox>
                    </Grid>
                </Grid>
            </Card>
            {renderSuccessSB}
            {renderErrorSB}
            <Footer />
        </DashboardLayout>

    );
}

export default Expiry;
