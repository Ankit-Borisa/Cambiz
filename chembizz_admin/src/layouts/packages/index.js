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
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard2";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { NavLink } from "react-router-dom";
import { Card } from "@mui/material";
import { BASE_URL } from "BASE_URL";

const Packages = () => {
  const [membershipPlan, setMembershipPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMembershipFeature, setSelectedMembershipFeature] =
    useState(null);
  const [successSB, setSuccessSB] = useState(false);
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successful Deleted"
      content="Category is successfully Deleted."
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
        const response = await axios.get(
          `${BASE_URL}/api/membership_plan/display`
        );

        setMembershipPlan(response.data.data);
        setIsLoading(false);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryList();
  }, []);
  console.log(membershipPlan);
  const handleDelete = async () => {
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
    return screenWidth < 900;
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
            Membership Plans
          </MDTypography>
          <Link to="/insert-package" style={{ textDecoration: "none" }}>
            <MDButton
              variant="gradient"
              color="dark"
              style={{ position: "absolute", top: "-15%", right: "1%" }}
            >
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;{shouldShowAddButton() ? "" : "add new Membership Plan"}
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
            <Card style={{ width: "100%", marginTop: "2rem" }}>
              <Grid container spacing={2}>
                {membershipPlan.map((membershipPlan, index) => {

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={membershipPlan._id}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "1rem",
                        marginTop: "1rem",
                      }}
                    >
                      <ProfileInfoCard
                        key={membershipPlan._id}
                        id={membershipPlan._id}
                        title={membershipPlan.plan_name}
                        info={{
                          sequence: membershipPlan?.sequence || "",
                          plan_days: membershipPlan.plan_days || "",
                          plan_original_price: "₹" + membershipPlan.plan_original_price || "",
                          plan_selling_price: "₹" + membershipPlan.plan_selling_price || "",
                          catalog_limit: membershipPlan.catalog_limit || "",
                        }}
                        social={[]}
                        action={{ route: "", tooltip: "Edit Profile" }}
                        shadow={false}
                        features={membershipPlan?.membership_feature_id && membershipPlan?.membership_feature_name
                          ? membershipPlan?.membership_feature_id.map((feature) => ({
                            featureName: membershipPlan?.membership_feature_name?.find(
                              (name) => name._id === feature.membership_id
                            )?.feature_name,
                            status: feature.membership_feature_status,
                          }))
                          : []}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Card>
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

export default Packages;
