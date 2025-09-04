// AuthorsTableData.js
import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import { useNavigate } from "react-router-dom";

export default function AuthorsTableData({ categoryList, productNameFilter, statusFilter, buyerFilter, sellerFilter, inquiryTypeFilter, stateFilter, cityFilter, selectedDate }) {
  const Author = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const navigate = useNavigate();

  const handleNavigate = (_id) => {
    navigate(`/inquiries/inquiry-detail/${_id}`);
  };

  return {
    columns: [
      { Header: "product", accessor: "product", width: "18%", align: "left" },
      { Header: "buyer company", accessor: "buyer", align: "left" },
      { Header: "seller company", accessor: "seller", align: "left" },
      { Header: "inquiry type", accessor: "type", align: "left" },
      { Header: "inquiry quantity", accessor: "quantity", align: "left" },
      { Header: "inquiry date", accessor: "date", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "view", accessor: "view", align: "center" },
    ],

    rows: categoryList
      .filter(
        (item) =>
          item?.product?.name_of_chemical.toLowerCase().includes(productNameFilter.toLowerCase()) &&
          (statusFilter === "" || item.status.toLowerCase() === statusFilter.toLowerCase()) && // Filter by status
          (buyerFilter === "" || item.buyer_company_id.company_name.toLowerCase().includes(buyerFilter.toLowerCase())) && // Filter by buyer
          (sellerFilter === "" || item.seller_company.company_name.toLowerCase().includes(sellerFilter.toLowerCase())) && // Filter by seller
          (inquiryTypeFilter === "" || item.inq_type.toLowerCase().includes(inquiryTypeFilter.toLowerCase())) && // Filter by inquiry type
          (stateFilter === "" || item.buyer_company_id.state.toLowerCase().includes(stateFilter.toLowerCase())) &&  // Filter by state
          (cityFilter === "" || item.buyer_company_id.city.toLowerCase().includes(cityFilter.toLowerCase())) && // Filter by city
          (!selectedDate || new Date(item.createdAt).toDateString() === selectedDate.toDateString()) // Filter by selected date or display all if selectedDate is null
      )
      .map((category) => ({
        product: (
          <Author name={category?.product?.name_of_chemical} email={category?.product?.CAS_number} />
        ),
        buyer: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.buyer_company_id?.company_name}
          </MDTypography>
        ),
        seller: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.seller_company?.company_name}
          </MDTypography>
        ),
        type: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.inq_type}
          </MDTypography>
        ),
        quantity: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.inquiry_qty}/{category?.qty_type}
          </MDTypography>
        ),
        date: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.createdAt?.slice(0, 10)}
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={category.status}
              color={category.status === "active" ? "success" : "error"}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        view: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
            onClick={() => handleNavigate(category.inquiry_id)}
          >
            VIEW
          </MDTypography>
        ),
      })),
  };
}
