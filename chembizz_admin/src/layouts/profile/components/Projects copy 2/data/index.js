import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "BASE_URL";
import { useParams } from "react-router-dom";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { FontSize } from "ckeditor5";

export default function Data(openModal) {

  const { _id } = useParams();
  const [companyDetails, setCompanyDetails] = useState([]);

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
      setCompanyDetails(response?.data?.company?.buying_inquiry_details);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return {
    columns: [
      { Header: "Product", accessor: "bank_name", width: "25%", align: "left" },
      { Header: "seller company", accessor: "ifsc_code", width: "10%", align: "left" },
      { Header: "inquiry type", accessor: "country", align: "center" },
      { Header: "quantity", accessor: "account_no", align: "center" },
      { Header: "status", accessor: "completion", align: "center" },
    ],

    rows:
      companyDetails
        ? companyDetails.map((e) => ({
          bank_name: (
            <>
              <MDTypography variant="h6">{e?.product_details?.[0]?.name_of_chemical}</MDTypography>
              <MDTypography variant="span">{e?.product_details?.[0]?.CAS_number}</MDTypography>
            </>
          ),
          ifsc_code: (
            <>
              <MDTypography variant="h6">{e?.seller_company_details?.[0]?.company_name}</MDTypography>
              <MDTypography variant="span">{e?.seller_company_details?.[0]?.gst}</MDTypography>
            </>
          ),
          country: <MDTypography variant="a">{e.inq_type}</MDTypography>,
          account_no: (
            <MDTypography variant="a">{e.inquiry_qty}{e.qty_type}</MDTypography>
          ),
          completion: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={e.status}
                color={e.status === "delivered" ? "success" : e.status === "pending" ? "secondary" : e.status === "deal done" ? "success" : e.status === "cancel" ? "error" : e.status === "rejected" ? "error" : "info"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
        }))
        : [],
  };
}
