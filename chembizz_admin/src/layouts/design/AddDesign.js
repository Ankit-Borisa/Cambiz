
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AddDesign = () => {
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

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
            content="Certificate Is Successfully Added."
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
            content="Please Select Image"
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );


    const [formData, setFormData] = useState({
        image: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            image: file,
        }));
    };

    const [title, setTitle] = useState("")

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const [forWhat, setFor] = useState("")


    const handleSubmit = async () => {
        if (!formData.image) {
            openErrorSB();
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("design_photo", formData.image);
        formDataToSend.append("design_title", title);
        // formDataToSend.append("design_for", forWhat);

        const token = `Bearer ${localStorage.getItem("chemToken")}`;

        const response = await axios.post(
            `${BASE_URL}/api/design/create`,
            formDataToSend,
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        openSuccessSB();
        setTimeout(() => {
            navigate(-1)
        }, 2000);
    }


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
                                    Add Design
                                </MDTypography>
                            </MDBox>
                            <MDBox py={3} px={2}>
                                <Grid container pt={4} pb={3} px={3}>
                                    <Grid item xs={12} md={6} xl={6} px={2}>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="file"
                                                name="design_photo"
                                                onChange={handleImageChange} // Handle file selection
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        {/* <MDBox mb={2}>
                                            <FormControl fullWidth>
                                                <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">status</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    onChange={(e) => setFor(e.target.value)}
                                                    value={forWhat}
                                                    label="Age"
                                                    style={{ padding: "10px 0px" }}
                                                >
                                                    <MenuItem value="">select</MenuItem>
                                                    <MenuItem value="po">po</MenuItem>
                                                    <MenuItem value="invoice">invoice</MenuItem>
                                                    <MenuItem value="credit note">credit note</MenuItem>
                                                    <MenuItem value="debit note">debit note</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </MDBox> */}
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Title"
                                                name="category"
                                                value={title}
                                                onChange={handleTitleChange}
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

export default AddDesign;