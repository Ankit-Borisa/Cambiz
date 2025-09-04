import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate } from "react-router-dom";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "BASE_URL";

const ManageFeature = () => {
  const [membershipFeatures, setMembershipFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMembershipFeature, setSelectedMembershipFeature] = useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successful Deleted"
      content="Membership Feature is successfully Deleted."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        // const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/membership_feature/findAll`
        );

        setMembershipFeatures(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);

  const handleDelete = async () => {
    try {
      if (selectedMembershipFeature) {
        const token = `Bearer ${localStorage.getItem("chemToken")}`;
        const responseDelete = await axios.delete(
          `${BASE_URL}/api/membership_feature/delete/${selectedMembershipFeature._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (responseDelete.data.success) {
          openSuccessSB();
        }
        setMembershipFeatures((prevMembershipFeatureList) =>
          prevMembershipFeatureList.filter(
            (membershipFeatures) =>
              membershipFeatures._id !== selectedMembershipFeature._id
          )
        );
        setSelectedMembershipFeature(null);
      }
    } catch (error) {
      console.log(error);
    }

    // Close the delete dialog
    setDeleteDialogOpen(false);
  };
  const navigate = useNavigate();
  const openDeleteDialog = (membershipFeature) => {
    setSelectedMembershipFeature(membershipFeature);
    setDeleteDialogOpen(true);
  };
  const shouldShowAddButton = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 850;
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} style={{ opacity: deleteDialogOpen ? 0.3 : 1 }}>
        <MDBox
          textAlign="center"
          mb={4}
          style={{
            position: "relative",
          }}
        >
          <MDTypography variant="h4" fontWeight="bold">
            Manage Feature
          </MDTypography>
          <Link
            to="/insert-package-featured"
            style={{ textDecoration: "none" }}
          >
            <MDButton
              variant="gradient"
              color="dark"
              style={{ position: "absolute", top: "-15%", right: "1%" }}
            >
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;{shouldShowAddButton() ? "" : "add new Membership Feature"}
            </MDButton>
          </Link>
        </MDBox>
        <Grid container spacing={3}>
          {isLoading ? (
            <Grid item xs={12}>
              <Audio
                height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            </Grid>
          ) : (
            membershipFeatures.map((membershipFeature, index) => (
              <Grid item xs={12} sm={6} md={4} key={membershipFeature._id}>
                <MDBox
                  component="li"
                  display="flex"
                  alignItems="center"
                  py={1}
                  mb={1}
                  style={{
                    backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s ease",
                    position: "relative",
                  }}
                >
                  <MDBox
                    component="img"
                    src="https://w7.pngwing.com/pngs/895/550/png-transparent-black-and-white-logo-computer-icons-symbol-free-of-close-button-icon-miscellaneous-trademark-sign-thumbnail.png"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "green",
                      position: "absolute",
                      top: "4%",
                      right: "1%",
                      cursor: "pointer",
                    }}
                    onClick={() => openDeleteDialog(membershipFeature)}
                  />
                  <NavLink
                    to={`/edit-package-featured/${membershipFeature._id}`}
                  >
                    <MDBox
                      component="img"
                      src="https://cdn-icons-png.flaticon.com/512/84/84380.png"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "4%",
                        right: "8%",
                        cursor: "pointer",
                      }}
                    />
                  </NavLink>
                  <MDBox mr={3} ml={3} py={1}>
                    <MDAvatar
                      src={
                        membershipFeature.cateogry_icon
                          ? membershipFeature.cateogry_icon
                          : "https://static9.depositphotos.com/1431107/1174/i/950/depositphotos_11740425-stock-photo-members-only-stamp.jpg"
                      }
                      alt="something here"
                      shadow="md"
                    />
                  </MDBox>
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center"
                  >
                    <MDTypography variant="button" fontWeight="medium">
                      {membershipFeature.feature_name}
                    </MDTypography>
                  </MDBox>
                  {renderSuccessSB}
                </MDBox>
              </Grid>
            ))
          )}
        </Grid>
      </MDBox>
      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          ></div>
          <MDBox
            backgroundColor="#fff"
            width="300px"
            padding="20px"
            borderRadius="4px"
            boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
            textAlign="center"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: darkMode ? "rgb(26 46 79)" : "#FFFFFF",
              borderRadius: "1rem",
              zIndex: 1000,
            }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={3}>
              Confirm Deletion
            </MDTypography>
            <MDTypography variant="body1" mb={3}>
              Are you sure you want to delete this category?
            </MDTypography>
            <MDBox display="flex" justifyContent="center">
              <MDBox
                component="button"
                type="button"
                onClick={handleDelete}
                style={{
                  marginRight: "10px",
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                padding="8px 16px"
                borderRadius="4px"
                border="none"
              >
                OK
              </MDBox>
              <MDBox
                component="button"
                type="button"
                onClick={closeDeleteDialog}
                padding="8px 16px"
                borderRadius="4px"
                border="none"
                cursor="pointer"
                style={{ backgroundColor: "green", cursor: "pointer" }}
              >
                Cancel
              </MDBox>
            </MDBox>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
};

export default ManageFeature;
