/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import { BASE_URL } from "BASE_URL";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthorsTableData({handleDelete, categoryList}) {

  // const [categoryList, setCategoryList] = useState([])
  // console.log(categoryList);

  // const fetchUserList = async () => {
  //   try {
  //     const token = `Bearer ${localStorage.getItem("chemToken")}`;
  //     const response = await axios.get(
  //       `${BASE_URL}/api/subcategory/allsubcategories`,
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       }
  //     );
  //     setCategoryList(response.data.subcategoriesWithCategories);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserList();
  // }, []);

  const navigate = useNavigate();

  const handleNav = (_id) => {
    navigate(`/edit-subcategory/${_id}`)
  }

  return {
    columns: [
      { Header: "subcategory name", accessor: "subcategory", align: "left" },
      { Header: "category name", accessor: "category", align: "left" },
      { Header: "edit", accessor: "action", align: "center" },
      { Header: "delete", accessor: "status", align: "center" },
    ],


    rows: categoryList && [...categoryList].reverse().map((category) => ({
      subcategory: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {category.subcategory_name}
        </MDTypography>
      ),
      category: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {category?.categoryDetail?.[0]?.category_name}
        </MDTypography>
      ),
      status: (
        <MDButton
          variant="gradient"
          color="error"
          fullWidth
          type="submit"
          onClick={() => handleDelete(category._id)}
        >
          DELETE
        </MDButton>
      ),
      action: (
        <MDTypography component="a" onClick={() => handleNav(category._id)} variant="caption" color="text" fontWeight="medium">
          Edit
        </MDTypography>
      ),
    }))

  };
}
