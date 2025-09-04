import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/messages/data/authorsTableData";
import axios from "axios";
import { BASE_URL } from "BASE_URL";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterContactFor, setFilterContactFor] = useState(""); // State for dropdown filter

    const fetchUserList = async () => {
        try {
            const token = `Bearer ${localStorage.getItem("chemToken")}`;
            const response = await axios.get(
                `${BASE_URL}/api/contactMessage/display`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            setMessages(response?.data?.messages || []); // Set messages data
            setFilteredData(response?.data?.messages || []); // Initially set filtered data to all messages
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, []);

    // Function to handle filter change
    const handleFilterChange = (event) => {
        const value = event.target.value;
        setFilterContactFor(value); // Update filter state

        if (value === "") {
            // If "All" is selected, display all messages
            setFilteredData(messages);
        } else {
            // Filter messages based on the "contact_for" key
            const filtered = messages.filter(
                (message) => message.contact_for === value
            );
            setFilteredData(filtered);
        }
    };

    const { columns, rows } = authorsTableData(filteredData);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={2}>
                        {/* <FormControl fullWidth>
                            <InputLabel id="contact-for-select-label">Contact For</InputLabel>
                            <Select
                                labelId="contact-for-select-label"
                                id="contact-for-select"
                                value={filterContactFor}
                                onChange={handleFilterChange}
                                label="Contact For"
                                sx={{
                                    '& .MuiSelect-root': {
                                        padding: '30px 10px', // Adjust padding to match design expectations
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#000', // Ensure consistent border color
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1976d2', // Hover effect
                                    },
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Register Now">Register Now</MenuItem>
                                <MenuItem value="Request a Demo">Request a Demo</MenuItem>
                                <MenuItem value="Home">Home</MenuItem>
                            </Select>
                        </FormControl> */}
                        <FormControl fullWidth>
                            <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">Contact For</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filterContactFor}
                                onChange={handleFilterChange}
                                label="Age"
                                style={{ padding: "10px 0px" }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Register Now">Register Now</MenuItem>
                                <MenuItem value="Request a Demo">Request a Demo</MenuItem>
                                <MenuItem value="Home">Home</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>
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
                            >
                                <MDTypography variant="h6" color="white">
                                    Messages
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Messages;
