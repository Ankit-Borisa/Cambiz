// /**
// =========================================================
// * Material Dashboard 2 React - v2.2.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

// // @mui material components
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// // Material Dashboard 2 React example components
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import DataTable from "examples/Tables/DataTable";
// import MDButton from "components/MDButton";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

// // Data
// import authorsTableData from "layouts/Inquiries/data/authorsTableData";
// import projectsTableData from "layouts/tables/data/projectsTableData";
// import axios from "axios";
// import { BASE_URL } from "BASE_URL";
// import { useEffect, useState } from "react";
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import TextField from '@mui/material/TextField';

// //countries , state and city
// import countries from "../../CountryStateCity.json";


// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// function Inquiries() {
//   const [categoryList, setCategoryList] = useState([]);
//   const [productNameFilter, setProductNameFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [buyerFilter, setBuyerFilter] = useState("");
//   const [sellerFilter, setSellerFilter] = useState("");
//   const [inquiryTypeFilter, setInquiryTypeFilter] = useState("");
//   const [stateFilter, setStateFilter] = useState("");
//   const [cityFilter, setCityFilter] = useState("");
//   const [selectedDate, setSelectedDate] = useState(null);
//   // const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

//   const [cities, setCities] = useState([]);
//   const india = countries && countries.find((e) => e.name === "India")


//   const fetchUserList = async () => {
//     try {
//       const token = `Bearer ${localStorage.getItem("chemToken")}`;
//       const response = await axios.get(
//         `${BASE_URL}/api/inquiryRoutes/all`,
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );
//       setCategoryList(response.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchUserList();
//   }, []);

//   const handleProductNameChange = (event) => {
//     setProductNameFilter(event.target.value);
//   };

//   const handleBuyerChange = (event) => {
//     setBuyerFilter(event.target.value);
//   };

//   const handleSellerChange = (event) => {
//     setSellerFilter(event.target.value);
//   };

//   const handleInquiryTypeChange = (event) => {
//     setInquiryTypeFilter(event.target.value);
//   };

//   const handleStatusChange = (event) => {
//     setStatusFilter(event.target.value);
//   };

//   const { columns, rows } = authorsTableData({
//     categoryList,
//     productNameFilter,
//     // selectedDateRange,
//     selectedDate,
//     statusFilter,
//     buyerFilter,
//     sellerFilter,
//     inquiryTypeFilter,
//     stateFilter,
//     cityFilter
//   });

//   // const handleDateRangeChange = (dateRange) => {
//   //   setSelectedDateRange(dateRange);
//   // };

//   const handleStateChange = (e) => {
//     const selectedState = e.target.value;
//     setStateFilter(e.target.value)
//     setCityFilter("")
//     const state = india.states.find((state) => state.name === selectedState);

//     if (state) {
//       setCities(state.cities);
//     }
//   }

//   const handleCityChange = (e) => {
//     setCityFilter(e.target.value)
//   }

//   const handleDateChange = (date) => {
//     const selectedDateAsDate = date.toDate(); // Convert to JavaScript Date object
//     setSelectedDate(selectedDateAsDate);
//   }

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Grid container spacing={1}>
//             {/* product name  */}
//               <Grid item xs={2} className="mt-2">
//                 <FormControl fullWidth>
//                   <TextField id="outlined-basic" label="Product Name" variant="outlined"
//                     value={productNameFilter}
//                     onChange={handleProductNameChange}
//                   />
//                 </FormControl>
//               </Grid>
//               {/* buyer name  */}
//               <Grid item xs={1.8} className="mt-2">
//                 <FormControl fullWidth>
//                   <TextField id="outlined-basic" label="Buyer Name Search" variant="outlined"
//                     value={buyerFilter}
//                     onChange={handleBuyerChange}
//                   />
//                 </FormControl>
//               </Grid>
//               {/* seller name  */}
//               <Grid item xs={1.8} className="mt-2">
//                 <FormControl fullWidth>
//                   <TextField id="outlined-basic" label="Seller Name Search" variant="outlined"
//                     value={sellerFilter}
//                     onChange={handleSellerChange}
//                   />
//                 </FormControl>
//               </Grid>
//               {/* date  */}
//               <Grid item xs={2.2}>
//                 <FormControl fullWidth>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DemoContainer components={['DatePicker']} style={{paddingTop: "0px"}}>
//                       <DatePicker
//                         label="Inquiry Date"
//                         value={selectedDate}
//                         onChange={handleDateChange} // Pass the handleDateChange function as onChange
                        
//                       />
//                     </DemoContainer>
//                   </LocalizationProvider>
//                 </FormControl>
//               </Grid>
//               {/* <Grid item xs={6}>
//                 <FormControl fullWidth>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DateRangePicker
//                       value={selectedDateRange}
//                       onChange={handleDateRangeChange}
//                       startText="Check"
//                       endText="Check-out"
//                     />
//                   </LocalizationProvider>
//                 </FormControl>
//               </Grid> */}
//               {/* status  */}
//               <Grid item xs={1} className="mt-2">
//                 <FormControl fullWidth>
//                   <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">status</InputLabel>
//                   <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     onChange={handleStatusChange}
//                     value={statusFilter}
//                     label="Age"
//                     style={{ padding: "10px 0px" }}
//                   >
//                     <MenuItem value="">All</MenuItem>
//                     <MenuItem value="pending">pending</MenuItem>
//                     <MenuItem value="active">active</MenuItem>
//                     <MenuItem value="inactive">inactive</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               {/* inquiry type  */}
//               <Grid item xs={1} className="mt-2">
//                 <FormControl fullWidth>
//                   <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">inq type</InputLabel>
//                   <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     onChange={handleInquiryTypeChange}
//                     value={inquiryTypeFilter}
//                     label="Age"
//                     style={{ padding: "10px 0px" }}
//                   >
//                     {/* <MenuItem value="">All</MenuItem> */}
//                     <MenuItem value="inquiry">Commercial inquiry</MenuItem>
//                     <MenuItem value="sample inquiry">sample inquiry</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//               {/* state  */}
//               <Grid item xs={1} className="mt-2">
//                 <FormControl fullWidth>
//                   <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">State</InputLabel>
//                   <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     onChange={handleStateChange}
//                     value={stateFilter}
//                     label="state"
//                     style={{ padding: "10px 0px" }}
//                   >
//                     <MenuItem value="">All</MenuItem>
//                     {india && india.states.map((state) => (
//                       <MenuItem value={state.name}>{state.name}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               {/* city  */}
//               <Grid item xs={1} className="mt-2">
//                 <FormControl fullWidth>
//                   <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">City</InputLabel>
//                   <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     onChange={handleCityChange}
//                     value={cityFilter}
//                     label="city"
//                     style={{ padding: "10px 0px" }}
//                   >
//                     <MenuItem value="why">All</MenuItem>
//                     {cities && cities.map((e) => (
//                       <MenuItem value={e.name}>{e.name}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox
//                 mx={2}
//                 mt={-3}
//                 py={3}
//                 px={2}
//                 variant="gradient"
//                 bgColor="info"
//                 borderRadius="lg"
//                 coloredShadow="info"
//               >
//                 <MDTypography variant="h6" color="white">
//                 Inquiries({rows.length})
//                 </MDTypography>
//               </MDBox>
//               <MDBox pt={3}>
//                 <DataTable
//                   table={{ columns, rows }}
//                   isSorted={false}
//                   entriesPerPage={false}
//                   showTotalEntries={false}
//                   noEndBorder
//                 />
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default Inquiries;













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
import MDButton from "components/MDButton";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

// Data
import authorsTableData from "layouts/Inquiries/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import axios from "axios";
import { BASE_URL } from "BASE_URL";
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

//countries , state and city
import countries from "../../CountryStateCity.json";


import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function Inquiries() {
  const [categoryList, setCategoryList] = useState([]);
  const [productNameFilter, setProductNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  // const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  const [cities, setCities] = useState([]);
  const india = countries && countries.find((e) => e.name === "India")


  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(
        `${BASE_URL}/api/inquiryRoutes/all`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCategoryList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleProductNameChange = (event) => {
    setProductNameFilter(event.target.value);
  };

  const handleBuyerChange = (event) => {
    setBuyerFilter(event.target.value);
  };

  const handleSellerChange = (event) => {
    setSellerFilter(event.target.value);
  };

  const handleInquiryTypeChange = (event) => {
    setInquiryTypeFilter(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const { columns, rows } = authorsTableData({
    categoryList,
    productNameFilter,
    // selectedDateRange,
    selectedDate,
    statusFilter,
    buyerFilter,
    sellerFilter,
    inquiryTypeFilter,
    stateFilter,
    cityFilter
  });

  // const handleDateRangeChange = (dateRange) => {
  //   setSelectedDateRange(dateRange);
  // };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setStateFilter(e.target.value)
    setCityFilter("")
    const state = india.states.find((state) => state.name === selectedState);

    if (state) {
      setCities(state.cities);
    }
  }

  const handleCityChange = (e) => {
    setCityFilter(e.target.value)
  }

  const handleDateChange = (date) => {
    const selectedDateAsDate = date.toDate(); // Convert to JavaScript Date object
    setSelectedDate(selectedDateAsDate);
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
            {/* product name  */}
              <Grid item xs={2} className="mt-2">
                <FormControl fullWidth>
                  <TextField id="outlined-basic" label="Product Name" variant="outlined"
                    value={productNameFilter}
                    onChange={handleProductNameChange}
                  />
                </FormControl>
              </Grid>
              {/* buyer name  */}
              <Grid item xs={2} className="mt-2">
                <FormControl fullWidth>
                  <TextField id="outlined-basic" label="Buyer Name Search" variant="outlined"
                    value={buyerFilter}
                    onChange={handleBuyerChange}
                  />
                </FormControl>
              </Grid>
              {/* seller name  */}
              <Grid item xs={2} className="mt-2">
                <FormControl fullWidth>
                  <TextField id="outlined-basic" label="Seller Name Search" variant="outlined"
                    value={sellerFilter}
                    onChange={handleSellerChange}
                  />
                </FormControl>
              </Grid>
              {/* date  */}
              <Grid item xs={2.7}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} style={{paddingTop: "0px"}}>
                      <DatePicker
                        label="Inquiry Date"
                        value={selectedDate}
                        onChange={handleDateChange} // Pass the handleDateChange function as onChange
                        
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              {/* <Grid item xs={6}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                      value={selectedDateRange}
                      onChange={handleDateRangeChange}
                      startText="Check"
                      endText="Check-out"
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid> */}
              {/* status  */}
              <Grid item xs={1.5} className="mt-2">
                <FormControl fullWidth>
                  <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleStatusChange}
                    value={statusFilter}
                    label="Age"
                    style={{ padding: "10px 0px" }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">pending</MenuItem>
                    <MenuItem value="active">active</MenuItem>
                    <MenuItem value="inactive">inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* inquiry type  */}
              <Grid item xs={1.5} className="mt-2">
                <FormControl fullWidth>
                  <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">inq type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleInquiryTypeChange}
                    value={inquiryTypeFilter}
                    label="Age"
                    style={{ padding: "10px 0px" }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="inquiry">Commercial</MenuItem>
                    <MenuItem value="sample inquiry">sample inquiry</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* state  */}
              {/* <Grid item xs={1} className="mt-2">
                <FormControl fullWidth>
                  <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">State</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleStateChange}
                    value={stateFilter}
                    label="state"
                    style={{ padding: "10px 0px" }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {india && india.states.map((state) => (
                      <MenuItem value={state.name}>{state.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
              {/* city  */}
              {/* <Grid item xs={1} className="mt-2">
                <FormControl fullWidth>
                  <InputLabel style={{ paddingBottom: "10px" }} id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleCityChange}
                    value={cityFilter}
                    label="city"
                    style={{ padding: "10px 0px" }}
                  >
                    <MenuItem value="why">All</MenuItem>
                    {cities && cities.map((e) => (
                      <MenuItem value={e.name}>{e.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
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
                Inquiries({rows.length})
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

export default Inquiries;
