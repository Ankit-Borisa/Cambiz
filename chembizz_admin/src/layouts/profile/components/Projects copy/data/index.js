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
  console.log(companyDetails);

  const arrayMy = [
    { name: "whyso" },
    { name: "whyso" },
    { name: "whyso" },
    { name: "whyso" },
    { name: "whyso" },
  ]

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
      setCompanyDetails(response?.data?.company?.bank_details);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return {
    columns: [
      { Header: "bank name", accessor: "bank_name", width: "25%", align: "left" },
      { Header: "ifsc code", accessor: "ifsc_code", width: "10%", align: "left" },
      { Header: "account no", accessor: "account_no", align: "center" },
      { Header: "branch address", accessor: "branch_address", align: "center" },
      { Header: "country", accessor: "country", align: "center" },
      { Header: "state", accessor: "state", align: "center" },
      { Header: "city", accessor: "city", align: "center" },
      { Header: "pincode", accessor: "pincode", align: "center" },
      { Header: "view check", accessor: "view_check", align: "center" },
      { Header: "status", accessor: "completion", align: "center" },
    ],

    rows:
      companyDetails
        ? companyDetails.map((e) => ({
          bank_name: (
            <MDTypography variant="a">{e.bank_name}</MDTypography>
          ),
          ifsc_code: <MDTypography variant="a">{e.IFSC_code}</MDTypography>,
          country: <MDTypography variant="a">{e.country}</MDTypography>,
          branch_address: <MDTypography variant="a">{e.branch_address}</MDTypography>,
          state: <MDTypography variant="a">{e.state}</MDTypography>,
          city: <MDTypography variant="a">{e.city}</MDTypography>,
          pincode: <MDTypography variant="a">{e.pinCode}</MDTypography>,
          view_check:
            <MDTypography variant="a" style={{ color: 'blue', textDecoration: 'underline', cursor: "pointer" }} onClick={() => openModal(e.cancel_cheque_photo)}>
              View Check
            </MDTypography>,
          account_no: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {e.account_number}
            </MDTypography>
          ),
          completion: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={e.status === "Active" ? "active" : "inactive"}
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
