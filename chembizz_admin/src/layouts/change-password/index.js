import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MDSnackbar from "components/MDSnackbar";
import { IconButton, InputAdornment } from "@mui/material";
import { BASE_URL } from "BASE_URL";

// import
const Changepassword = () => {
  
  const [errorMessage, setErrorMessage] = useState("");

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("chemToken");

  useEffect(() => {
    if (!token) {
      navigate("/authentication/sign-in");
    }
  }, []);
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull Added"
      content="Password Changed Successfully."
      dateTime="1 sec"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Filled Error"
      content={errorMessage}
      dateTime="1 sec ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  // Separate state variables for each password field
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value.trim(),
    });
  };

  // Separate functions to toggle the visibility of each password field
  const handleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword.trim() && !newPassword.trim() && !confirmPassword.trim()) {
      setErrorMessage("Please Fill All Fields!");
      openErrorSB();
      return;
    }

    if (!oldPassword.trim()) {
      setErrorMessage("Please Enter Old Password!");
      openErrorSB();
      return;
    }

    if (!newPassword.trim()) {
      setErrorMessage("Please Enter New Password!");
      openErrorSB();
      return;
    }

    if (!confirmPassword.trim()) {
      setErrorMessage("Please Confirm Your Password!");
      openErrorSB();
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Please Enter Confirm Password as a New Password!");
      openErrorSB();
      return;
    }
    if (oldPassword === newPassword && newPassword === confirmPassword) {
      setErrorMessage("New password can't be the same as the old password.");
      openErrorSB();
      return;
    }

    const token = `Bearer ${localStorage.getItem("chemToken")}`;
    const username = localStorage.getItem("userName");
    const response = await fetch(`${BASE_URL}/api/superadmin/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        username: username.trim(),
        password: oldPassword.trim(),
        newPassword: newPassword.trim(),
      }),
    });

    if (response.ok) {
      openSuccessSB();
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      const responseData = await response.json();
      if (response.status === 401) {
        setErrorMessage("Your Old Password Is Wrong!");
      } else {
        setErrorMessage(responseData.message || "An error occurredl");
      }
      openErrorSB();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                style={{ position: "relative" }}
              >
                <MDTypography variant="h6" color="white">
                  Change Password
                </MDTypography>
              </MDBox>
              <MDBox py={3} px={2}>
                <Grid container pt={4} pb={3} px={3}>
                  <Grid item xs={12} md={6} xl={6} px={2} m={"auto"}>
                    <MDBox mb={2}>
                      <MDInput
                        type={showOldPassword ? "text" : "password"}
                        label="Old Password"
                        name="oldPassword"
                        fullWidth
                        value={passwords.oldPassword}
                        onChange={handlePasswordChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowOldPassword}>
                                {showOldPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        style={{ marginBottom: "20px" }}
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                        type={showNewPassword ? "text" : "password"}
                        label="New Password"
                        name="newPassword"
                        fullWidth
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowNewPassword}>
                                {showNewPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        style={{ marginBottom: "20px" }}
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        name="confirmPassword"
                        fullWidth
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowConfirmPassword}>
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        style={{ marginBottom: "20px" }}
                      />
                    </MDBox>
                    <MDBox mt={4} mb={1}>
                      <MDButton
                        variant="gradient"
                        color="info"
                        fullWidth
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                      </MDButton>
                      {renderSuccessSB}
                      {renderErrorSB}
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Changepassword;
