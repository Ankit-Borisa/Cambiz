import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import { BASE_URL } from "BASE_URL";
import axios from "axios";

const Data = () => {

  const [adminList, setAdminList] = useState([])

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const token = `Bearer ${localStorage.getItem("chemToken")}`;
        const response = await axios.get(
          `${BASE_URL}/api/superadmin/alladmins`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setAdminList(response.data.chemical_admins);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserList();
  }, []);

  return {
    columns: [
      { Header: "full name", accessor: "employee", width: "35%", align: "left" },
      { Header: "user name", accessor: "username", width: "35%", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [...adminList].reverse().map((admin) => ({
      employee: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {admin.fullname}
        </MDTypography>
      ),
      username: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {admin.username}
        </MDTypography>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={admin.status} color={admin.status === "active" ? "success" : "error"} variant="gradient" size="sm" />
        </MDBox>
      ),
      action: (
        <MDTypography component="a" href={`/edit-admin/${admin._id}`} variant="caption" color="text" fontWeight="medium" style={{cursor:"pointer"}}>
          Edit
        </MDTypography>
      ),
    })),
  };
}

export default Data;
