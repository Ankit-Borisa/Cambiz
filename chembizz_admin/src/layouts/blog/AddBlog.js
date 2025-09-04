import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useNavigate, useLocation } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDSnackbar from "components/MDSnackbar";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { BASE_URL } from "BASE_URL";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const InsertBlog = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        photo: null,
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    useEffect(() => {
        if (location.state && location.state.blog) {
            const { title, Description, photo } = location.state.blog;
            setFormData({
                title: title || "",
                description: Description || "",
                photo: photo || null,
            });
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async () => {
        const { title, description, photo } = formData;

        if (!title) {
            setErrorMessage("Please Enter Title!");
            openErrorSB();
            return;
        }

        if (!description) {
            setErrorMessage("Please Enter Description!");
            openErrorSB();
            return;
        }

        const token = `Bearer ${localStorage.getItem("chemToken")}`;

        // Create FormData object to send the data
        const formDataToSend = new FormData();
        formDataToSend.append("title", title);
        formDataToSend.append("Description", description);
        if (photo instanceof File) {
            formDataToSend.append("photo", photo);
        }

        try {
            // Determine the API endpoint and method based on whether we're updating or inserting
            const isUpdating = location.state && location.state.blog;
            const url = isUpdating
                ? `${BASE_URL}/api/blog/update/${location.state.blog._id}`
                : `${BASE_URL}/api/blog/insert`;

            const method = isUpdating ? "PUT" : "POST";

            await axios({
                method: method,
                url: url,
                data: formDataToSend,
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            });

            openSuccessSB();
            setTimeout(() => {
                navigate(-1); // Go back to the previous page
            }, 2000);
        } catch (error) {
            setErrorMessage("Failed to submit. Please try again.");
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
                                    {location.state && location.state.blog
                                        ? "Edit Blog"
                                        : "Insert Blog"}
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={3}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <MDInput
                                            fullWidth
                                            label="Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MDInput
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            multiline
                                            rows={4}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <MDInput
                                            fullWidth
                                            type="file"
                                            name="photo"
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <MDBox mt={4} mb={1} textAlign="right">
                                    <MDButton
                                        variant="gradient"
                                        color="info"
                                        onClick={handleSubmit}
                                    >
                                        {location.state && location.state.blog
                                            ? "Update"
                                            : "Insert"}
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <MDSnackbar
                color="success"
                icon="check"
                title="Successful"
                content={
                    location.state && location.state.blog
                        ? "Blog updated successfully."
                        : "Blog inserted successfully."
                }
                open={successSB}
                onClose={closeSuccessSB}
                close={closeSuccessSB}
                bgWhite
            />
            <MDSnackbar
                color="error"
                icon="warning"
                title="Error"
                content={errorMessage}
                open={errorSB}
                onClose={closeErrorSB}
                close={closeErrorSB}
                bgWhite
            />
        </DashboardLayout>
    );
};

export default InsertBlog;
