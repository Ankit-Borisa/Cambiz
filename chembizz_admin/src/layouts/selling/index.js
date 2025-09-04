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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import DefaultInfoCard from "examples/Cards/InfoCards/SellerInfoCard";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/SellerStatitickCard";
import DefaultInquiryCard from "examples/Cards/InfoCards/InquiryDetailCard";

// Dashboard components

function Sellling() {

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="dark"
                                icon="weekend"
                                title="C10H7F2N3O"
                                count={"DFTA"}
                                name="106.89"
                                price="Intermidiate Chemical"
                                quantity="800 -850 rs"
                                storage="86404-63-9"
                                packaging_size="White to off white powder"
                                packaging_type="Fluconazol"
                                grade="ACS"
                                hsn_code="28044090"
                                packaging_s="10 * 10 sqrt"
                                packaging_t="sijsdi"
                                store="in room temperature"
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} xl={2.5}>
                        <DefaultInfoCard
                            icon="account_balance"
                            title="Webearl Technology"
                            description="webearl@gmail.com"
                            name="ashokbhai sindhav"
                            address="22,cradle,edii,ahmedabad"
                            country="ahmedabad,gujrat,india"
                            pincode="364265"
                            number="9033251903"
                            gstin="XX092YY2938GSTIN"
                            seller="seller"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={2.5}>
                        <DefaultInfoCard
                            icon="account_balance"
                            title="Webearl Technology"
                            description="webearl@gmail.com"
                            name="ashokbhai sindhav"
                            address="22,cradle,edii,ahmedabad"
                            country="ahmedabad,gujrat,india"
                            pincode="364265"
                            number="9033251903"
                            gstin="XX092YY2938GSTIN"
                            seller="buyer"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={2.5}>
                        <DefaultInquiryCard
                            seller="Inquiry Details"
                            inq_quantity_lable="INQUIRY QUANTITY"
                            inq_quantity="10 kg"
                            inq_quantity_type_lable="INQUIRY QUANTITY TYPE"
                            inq_quantity_type="NO"
                            testitive_dispatch_label="TESTITIVE DISPATCH DATE"
                            testitive_dispatch="10-02-2024"
                            date_label="INQUIRY DATE"
                            date="10-02-2024"
                        />
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Sellling;
