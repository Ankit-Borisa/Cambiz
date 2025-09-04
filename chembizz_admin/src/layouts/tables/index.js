/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import axios from "axios";
import { BASE_URL } from "BASE_URL";
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
// import columns from "./data/authorsTableData"

//countries , state and city
import countries from "../../CountryStateCity.json"

function Company() {
  const [categoryList, setCategoryList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    companyName: "",
    gstNumber: "",
    mobileNumber: "",
    mode: "",
    state: "",
    city: ""
  });

  console.log(filteredData);

  const india = countries && countries.find((e) => e.name === "India");

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(
        `${BASE_URL}/company/all`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCategoryList(response.data.companies);
      setFilteredData(response.data.companies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...categoryList];

    if (filters.companyName) {
      filtered = filtered.filter(item =>
        item.company_name.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    }
    if (filters.gstNumber) {
      filtered = filtered.filter(item =>
        item.gst.toLowerCase().includes(filters.gstNumber.toLowerCase())
      );
    }
    if (filters.mobileNumber) {
      filtered = filtered.filter(item =>
        item.mobile_num.toLowerCase().includes(filters.mobileNumber.toLowerCase())
      );
    }
    if (filters.mode) {
      filtered = filtered.filter(item =>
        item.mode_of_business.toLowerCase().includes(filters.mode.toLowerCase())
      );
    }
    if (filters.state) {
      filtered = filtered.filter(item =>
        item.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }
    if (filters.city) {
      filtered = filtered.filter(item =>
        item.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    if (selectedState === "") {
      setFilters(prevFilters => ({
        ...prevFilters,
        state: "",
        city: "" 
      }));
    } else {
      // If a specific state is selected, filter based on that state
      const state = india.states.find((state) => state.name === selectedState);
      if (state) {
        // Update the filters state with the selected state
        setStates(state);
        setFilters(prevFilters => ({
          ...prevFilters,
          state: selectedState,
          city: '' // Clear the city when a new state is selected
        }));
        // Update the cities based on the selected state
        setCities(state.cities);
      } else {
        console.log("State not found");
      }
    }
  };


  const handleCityChange = (e) => {
    // Update the filters state with the selected city
    setFilters(prevFilters => ({
      ...prevFilters,
      city: e.target.value
    }));
  };


  const { columns, rows } = authorsTableData(filteredData)


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <TextField id="outlined-basic" name="companyName" value={filters.companyName} onChange={handleFilterChange} label="Company Name" variant="outlined" />
                </FormControl>
              </Grid>
              <Grid item xs={1.8}>
                <FormControl fullWidth>
                  <TextField id="outlined-basic" name="gstNumber" value={filters.gstNumber} onChange={handleFilterChange} label="GST" variant="outlined" />
                </FormControl>
              </Grid>
              <Grid item xs={1.8}>
                <FormControl fullWidth>
                  <TextField id="outlined-basic" name="mobileNumber" value={filters.mobileNumber} onChange={handleFilterChange} label="Mobile Number" variant="outlined" />
                </FormControl>
              </Grid>
              <Grid item xs={1.8}>
                <FormControl fullWidth>
                  <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">Business Mode</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleFilterChange}
                    value={filters.mode}
                    label="Age"
                    style={{ padding: "10px 0px" }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Manufecture">Manufecture</MenuItem>
                    <MenuItem value="Trader">Trader</MenuItem>
                    <MenuItem value="Both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1.4}>
                <FormControl fullWidth>
                  <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">State</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleStateChange}
                    value={filters.state}
                    label="state"
                    style={{ padding: "10px 0px" }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {india && india.states.map((state) => (
                      <MenuItem value={state.name}>{state.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1.4}>
                <FormControl fullWidth>
                  <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleCityChange}
                    value={filters.city}
                    label="city"
                    style={{ padding: "10px 0px" }}
                  >
                    <MenuItem value="why">All</MenuItem>
                    {cities && cities.map((e) => (
                      <MenuItem value={e.name}>{e.name}</MenuItem>
                    ))}


                  </Select>
                </FormControl>
              </Grid>
            </Grid>
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
                  {/* Company List ({filteredRows.length}) */}
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

export default Company;
