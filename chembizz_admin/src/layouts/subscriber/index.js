import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/subscriber/data/authorsTableData";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { BASE_URL } from "BASE_URL";
import axios from "axios";

function Subscriber() {
  const [messages, setMessages] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEmails, setFilterEmails] = useState(""); // fixed typo
  const token = localStorage.getItem("chemToken");

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(
        `${BASE_URL}/api/subscriber/display`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessages(response?.data?.subscriber);
      setFilteredData(response?.data?.subscriber);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleFilter = (e) => {
    const data = e.target.value;
    setFilterEmails(data)

    if (data !== "") {
      const filtered = messages?.filter(item =>
        item.email?.toLowerCase().includes(data?.toLowerCase()) // Added optional chaining for safety
      );
      setFilteredData(filtered)
    } else {
      setFilteredData(messages)
    }


  }


  const { columns, rows } = authorsTableData(filteredData);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <TextField
                id="outlined-basic"
                name="Email"
                value={filterEmails}
                onChange={handleFilter} // fixed typo
                label="Email"
                variant="outlined"
              />
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
                  Subscriber ({rows.length})
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

export default Subscriber;
