import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "BASE_URL";
import { useParams } from "react-router-dom";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function Data() {
  const { _id } = useParams();
  const [companyDetails, setCompanyDetails] = useState("");
  console.log(companyDetails);

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(
        `${BASE_URL}/company/companyDetail/${_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCompanyDetails(response?.data?.company?.employee_details);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return {
    columns: [
      { Header: "name", accessor: "companies", width: "35%", align: "left" },
      { Header: "mobile no", accessor: "number", width: "10%", align: "left" },
      { Header: "email", accessor: "members", width: "10%", align: "left" },
      { Header: "designation", accessor: "budget", align: "center" },
      { Header: "status", accessor: "completion", align: "center" },
    ],

    rows:
      companyDetails && Array.isArray(companyDetails) // Check if companyDetails exists and is an array
        ? companyDetails.map((e) => ({
            companies: (
              <MDTypography variant="a">{e.employee_name}</MDTypography>
            ),
            number: <MDTypography variant="a">{e.mobile_no}</MDTypography>,
            members: <MDTypography variant="a">{e.emailid}</MDTypography>,
            budget: (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {e.designation}
              </MDTypography>
            ),
            completion: (
              <MDBox ml={-1}>
                <MDBadge
                  badgeContent={e.status === "active" ? "active" : "inactive"}
                  color={e.status === "active" ? "success" : "danger"}
                  variant="gradient"
                  size="sm"
                />
              </MDBox>
            ),
          }))
        : [],
  };
}
