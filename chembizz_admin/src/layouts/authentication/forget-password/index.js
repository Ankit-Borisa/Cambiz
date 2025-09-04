import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { Button, Modal } from "react-bootstrap";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import BasicLayout from "../components/BasicLayout";
import { BASE_URL } from "BASE_URL";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import axios from "axios";

function ForgetPassword() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setCOnfirmPassword] = useState("");
  const navigate = useNavigate();
  const [errorSB, setErrorSB] = useState(false);
  const openErrorSB = () => setErrorSB(true);
  const openSuccessSB = () => setSuccessSB(true);
  const [successSB, setSuccessSB] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [succesMessage, setSuccessMessage] = useState("");
  const closeSuccessSB = () => setSuccessSB(false);
  const closeErrorSB = () => setErrorSB(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPassword1, setShowNewPassword1] = useState(false);

  const handleContactNumberChange = (e) => {
    setEmail(e.target.value);
  };
  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Successfull"
      content={succesMessage}
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

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    if (!otpInput) {
      setErrorMessage("Please Enter Your OTP");
      openErrorSB();
      return;
    }
    if (otpInput.length < 6) {
      setErrorMessage("Please Enter Valid OTP");
      openErrorSB();
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/otp/verify_otp`,
        {
          emailid: email,
          otp_value: Number(otpInput.slice(0, 6)),
        },
      );

      if (response.status === 200) {
        setIsOtpVerified(true);
        setSuccessMessage("OTP Verify Successfully");
        openSuccessSB();
        handleClose();
      }
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.message);
      openErrorSB();
    }

    // if (otpInput.slice(0, 6) === "123456") {
    //   setIsOtpVerified(true);
    //   setSuccessMessage("OTP Verify Successfully");
    //   openSuccessSB();
    //   handleClose();
    // }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value.trim());
  };

  const handleConfirmPasswordChange = (e) => {
    setCOnfirmPassword(e.target.value.trim());
  };

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowNewPassword1 = () => {
    setShowNewPassword1(!showNewPassword1);
  };

  const handleSubmitNewPassword = async () => {
    if (!newPassword.trim()) {
      setErrorMessage("Please Enter New Password");
      openErrorSB();
      return;
    }
    if (!confirmPassword.trim()) {
      setErrorMessage("Please Enter Confirm Password");
      openErrorSB();
      return;
    }
    if (newPassword != confirmPassword) {
      setErrorMessage("New Password And Confirm Password Not Matched!");
      openErrorSB();
      return;
    }



    try {
      const response = await fetch(
        `${BASE_URL}/api/superadmin/forgotpassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, newPassword: newPassword }),
        }
      );

      if (response.ok) {
        setSuccessMessage("New Password Set Successfully");
        openSuccessSB();
        setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 2000);
        // Handle success
        // You can also redirect the user to a success page or take any other action
      } else {
        // Handle error
        console.error("Failed to update password");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error updating password:", error);
    }
  };

  const handleSent = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setErrorMessage("Please Enter EmailId");
      openErrorSB();
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMessage("Please Enter Valid Email");
      openErrorSB();
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/otp/send_otp`,
        {
          emailid: email,
        }
      );

      if (response.status === 200) {
        handleShow();
      }
    } catch (error) {
      setErrorMessage("There is a problem in sending OTP");
      openErrorSB();
    }
  };

  const handleKeyDown = (e) => {
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Forget Password
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 2 }}
          ></Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              {!isOtpVerified && (
                <MDInput
                  type="email"
                  label="Email"
                  name="email"
                  value={email}
                  onChange={handleContactNumberChange}
                  fullWidth
                />
              )}
            </MDBox>
            {isOtpVerified && (
              <MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type={showNewPassword ? "text" : "password"}
                    label="Enter New Password"
                    name="password"
                    fullWidth
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowNewPassword}>
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    style={{ marginBottom: "20px" }}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type={showNewPassword1 ? "text" : "password"}
                    label="Enter Confirm Password"
                    name="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowNewPassword1}>
                            {showNewPassword1 ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    style={{ marginBottom: "20px" }}
                  />
                </MDBox>
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              {!isOtpVerified ? (
                <MDButton
                  onClick={handleSent}
                  variant="gradient"
                  fullWidth
                  color="info"
                >
                  Sent Otp
                </MDButton>
              ) : (
                <MDButton
                  onClick={handleSubmitNewPassword}
                  variant="gradient"
                  fullWidth
                  color="info"
                >
                  Submit
                </MDButton>
              )}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          style={{ borderBottom: "none", paddingBottom: "0px" }}
          closeButton
        ></Modal.Header>
        <Modal.Body style={{ borderBottom: "none", paddingTop: "0px" }}>
          <MDBox
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <MDTypography
              component="h2"
              style={{ fontWeight: "700", fontSize: "24px" }}
            >
              Enter OTP
            </MDTypography>
            <MDInput
              type="tel"
              label="Enter OTP"
              name="otpInput"
              className="w-50 text-center"
              value={otpInput.slice(0, 6)}
              onKeyDown={handleKeyDown}
              onInput={(e) => (e.target.value) = e.target.value.replace(/[^0-9]/g, '')}
              maxLength={6}
              onChange={(e) => setOtpInput(e.target.value)}
              fullWidth
            />
            <Button variant="primary" onClick={handleOtpSubmit}>
              Submit OTP
            </Button>
          </MDBox>
        </Modal.Body>
      </Modal>
      {renderErrorSB}
      {renderSuccessSB}
    </BasicLayout>
  );
}

export default ForgetPassword;
