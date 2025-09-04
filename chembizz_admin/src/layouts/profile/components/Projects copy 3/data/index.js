import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "BASE_URL";
import { useParams } from "react-router-dom";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function Data(openModal) {
  
  const { _id } = useParams();
  const [companyDetails, setCompanyDetails] = useState([]);

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
      console.log(response?.data?.company)
      setCompanyDetails(response?.data?.company?.company_address);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return {
    columns: [
      { Header: "address type", accessor: "address_type", width: "25%", align: "left" },
      { Header: "address", accessor: "address_details", width: "10%", align: "left" },
      { Header: "pincode", accessor: "pincode", align: "center" },
      { Header: "location", accessor: "location", align: "center" },
    ],

    rows:
      companyDetails
        ? companyDetails.map((e) => ({
          address_type: (
            <MDTypography variant="a">{e.address_type}</MDTypography>
          ),
          address_details: <MDTypography variant="a">{e.address_details}</MDTypography>,
          country: <MDTypography variant="a">{e.country}</MDTypography>,
          location: <MDTypography variant="a">{e?.city}, {e?.state}, {e?.country}</MDTypography>,
          pincode: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {e.pincode}
            </MDTypography>
          ),
        }))
        : [],
  };
}
