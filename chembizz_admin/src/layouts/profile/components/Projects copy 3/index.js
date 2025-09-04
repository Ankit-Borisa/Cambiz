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

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/profile/components/Projects copy 3/data";
import ViewCheckModal from "./ViewCheckModal";
// import data from "layouts/dashboard/components/Projects/data";

function Projects() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkPhotoUrl, setCheckPhotoUrl] = useState("");
  
  const openModal = (url) => {
    setCheckPhotoUrl(url);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const { columns, rows } = data(openModal);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Other Address
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
      <ViewCheckModal isOpen={isModalOpen} onClose={closeModal} checkPhotoUrl={checkPhotoUrl} />
    </Card>
  );
}

export default Projects;
