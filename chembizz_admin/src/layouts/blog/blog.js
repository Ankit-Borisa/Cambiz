import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { BASE_URL } from "BASE_URL";
import MDSnackbar from "components/MDSnackbar";
import { format } from 'date-fns';
import { Link, useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";
import MDTypography from "components/MDTypography";

function Terms() {
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [message, setMessage] = useState("");
    const [blogs, setBlogs] = useState([]);

    const navigate = useNavigate();

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successful"
            content={message}
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
            title="Error"
            content={message}
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    const fetchTerms = async () => {
        const token = `Bearer ${localStorage.getItem("chemToken")}`;
        try {
            const res = await fetch(`${BASE_URL}/api/blog/display`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
            const data = await res.json();
            if (data && data.data) {
                setBlogs(data.data || []);
            } else {
                setMessage("Failed to fetch terms and conditions.");
                openErrorSB();
            }
        } catch (error) {
            setMessage("Error fetching terms and conditions.");
            openErrorSB();
            console.error("Error fetching terms:", error.message);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={12}>
                        <MDBox textAlign="center" mb={4} style={{ position: "relative" }}>
                            <MDTypography variant="h4" fontWeight="bold">
                                Manage Blogs
                            </MDTypography>
                            <Link to="/insert-blog" style={{ textDecoration: "none" }}>
                                <MDButton
                                    variant="gradient"
                                    color="dark"
                                    style={{ position: "absolute", top: "-15%", right: "1%" }}
                                >
                                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                                    &nbsp;Add Blog
                                </MDButton>
                            </Link>
                        </MDBox>
                    </Grid>
                    {blogs.map((blog, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={blog.photo || 'default-image.jpg'} // Replace with your default image path
                                    alt={blog.title || 'Blog Image'}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {blog.Description}
                                    </Typography>
                                    <MDBox textAlign="right">
                                        <Icon
                                            sx={{ cursor: "pointer", color: "blue" }}
                                            onClick={() => navigate('/insert-blog', { state: { blog } })}
                                        >
                                            edit
                                        </Icon>
                                    </MDBox>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </MDBox>
            {renderSuccessSB}
            {renderErrorSB}
            <Footer />
        </DashboardLayout>
    );
}

export default Terms;
