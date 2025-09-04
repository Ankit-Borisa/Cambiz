import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function AuthorsTableData({ categoryList, productNameFilter, statusFilter, buyerFilter, sellerFilter, inquiryTypeFilter, selectedDate, handleOpenModal }) {
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

  const [openMenus, setOpenMenus] = useState({});

  const handleClick = (event, _id) => {
    setOpenMenus({
      ...openMenus,
      [_id]: event.currentTarget,
    });
  };

  const handleClose = (_id) => {
    setOpenMenus({
      ...openMenus,
      [_id]: null,
    });
  };

  const handleModalOpen = (_id) => {
    handleOpenModal()
    handleClose(_id)
  }

  const filteredCategoryList = categoryList.filter((category) => {
    const productNameMatch = productNameFilter
      ? category?.product?.name_of_chemical.toLowerCase().includes(productNameFilter.toLowerCase())
      : true;

    const buyerMatch = buyerFilter
      ? category?.buyer_company_id?.company_name.toLowerCase().includes(buyerFilter.toLowerCase())
      : true;

    const sellerMatch = sellerFilter
      ? category?.seller_company?.company_name.toLowerCase().includes(sellerFilter.toLowerCase())
      : true;

    const statusMatch = statusFilter
      ? category.status.toLowerCase() === statusFilter.toLowerCase()
      : true;

    const inquiryTypeMatch = inquiryTypeFilter
      ? category.inq_type.toLowerCase() === inquiryTypeFilter.toLowerCase()
      : true;


    const dateMatch = selectedDate
      ? new Date(category.createdAt).toDateString() === selectedDate.toDateString()
      : true;

    return productNameMatch && buyerMatch && sellerMatch && statusMatch && inquiryTypeMatch && dateMatch;
  });


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
      { Header: "more details", accessor: "button", align: "center" },
    ],

    rows: filteredCategoryList.map((category) => ({
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
          style={{ cursor: "pointer" }}
        >
          VIEW
        </MDTypography>
      ),
      button: (
        <div>
          <Button
            id={`demo-positioned-button-${category.inquiry_id}`}
            aria-controls={`demo-positioned-menu-${category.inquiry_id}`}
            aria-haspopup="true"
            onClick={(event) => handleClick(event, category.inquiry_id)}
          >
            <MoreVertIcon />
          </Button>
          <Menu
            id={`demo-positioned-menu-${category.inquiry_id}`}
            anchorEl={openMenus[category.inquiry_id]}
            open={Boolean(openMenus[category.inquiry_id])}
            onClose={() => handleClose(category.inquiry_id)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={() => handleModalOpen(category.inquiry_id)}>View/Print PO</MenuItem>
            <MenuItem onClick={() => handleClose(category.inquiry_id)}>View/Print Invoice</MenuItem>
          </Menu>
        </div>
      ),
    })),
  };
}
