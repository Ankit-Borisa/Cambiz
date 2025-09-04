import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";

function Projects() {
  const [companies, setCompanies] = useState([]);
  const token = localStorage.getItem("chemToken");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("https://chemical-api-usa2.onrender.com/api/superadmin/deshboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCompanies(response.data.top10RegisteredCompanies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCompanies();
  }, []);

  const columns = [
    { Header: "Company Name", accessor: "company_name" },
    { Header: "GST", accessor: "gst" },
    { Header: "Contact Person", accessor: "contact_person_name" },
    { Header: "Mobile Number", accessor: "mobile_num" },
    { Header: "Email", accessor: "emailid" },
    { Header: "City", accessor: "city" },
    { Header: "State", accessor: "state" },
    { Header: "Country", accessor: "country" },
    { Header: "Status", accessor: "status" },
    { Header: "Membership Status", accessor: "membership_status" },
  ];

  const rows = companies.map(company => ({
    company_name: company.company_name,
    gst: company.gst,
    contact_person_name: company.contact_person_name,
    mobile_num: company.mobile_num,
    emailid: company.emailid,
    city: company.city,
    state: company.state,
    country: company.country,
    status: company.status,
    membership_status: company.membership_status,
  }));

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Top 10 Companies Details
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

export default Projects;
