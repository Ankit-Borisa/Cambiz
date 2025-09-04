import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import { NavLink } from "react-router-dom";
import { useMaterialUIController } from "context";
import './first.css'

function ProfileInfoCard({
  title,
  description,
  info,
  social,
  action,
  shadow,
  features,
  id,
  status,
}) {
  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;
  const [statusColor, setStatusColor] = useState("");
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // Updated label formatting function
  const formatLabel = (label) => {
    // Replace underscores with spaces, then capitalize each word
    return label
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (info) {
    Object.keys(info).forEach((el) => {
      labels.push(formatLabel(el));
    });

    Object.values(info).forEach((el) => values.push(el));
  }

  const labelsWithoutKey = ["bio", "anotherLabel"];

  const handleStatusChange = (status) => {
    switch (status) {
      case "accept":
        setStatusColor("green");
        break;
      case "reject":
        setStatusColor("red");
        break;
      case "pending":
        setStatusColor("yellow");
        break;
      default:
        setStatusColor("");
        break;
    }
  };

  const renderFeatures = features.map((feature, index) => (
    <MDBox
      key={index}
      variant="button"
      fontWeight="regular"
      color="text"
      style={{ fontSize: "1rem" }}
    >
      {feature.status ? (
        <span role="img" style={{ marginRight: "0.5rem" }} aria-label="true">
          ✅
        </span>
      ) : (
        <span role="img" style={{ marginRight: "0.5rem" }} aria-label="false">
          ❌
        </span>
      )}
      {feature.featureName}
    </MDBox>
  ));

  const renderItems = labels.map((label, key) => {
    if (labelsWithoutKey.includes(label)) {
      return (
        <MDBox key={label} display="flex" py={1} pl={-2}>
          <MDTypography variant="button" fontWeight="bold" color="text">
            &nbsp;{values[key]}
          </MDTypography>
        </MDBox>
      );
    }
    return (
      <MDBox key={label} display="flex" py={1} pr={2}>
        <MDTypography
          variant="button"
          fontWeight="bold"
          textTransform="capitalize"
        >
          {label}: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{values[key]}
        </MDTypography>
      </MDBox>
    );
  });

  const renderSocial = social.map(({ link, icon, color }) => (
    <MDBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color={socialMediaColors[color].main}
      pr={1}
      pl={0.5}
      lineHeight={1}
    >
      {icon}
    </MDBox>
  ));

  return (
    <Card
      sx={{ height: "100%", width: "95%", boxShadow: !shadow && "none" , display: 'flex',
        flexDirection: 'column' }}
      style={{
        backgroundColor: darkMode ? "#003b6f" : "aliceblue",
        position: "relative",
      }}
      className="box-shadow"
    >
      <NavLink to={`/edit-package/${id}`}>
        <MDBox
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/84/84380.png"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            top: "5%",
            right: "6%",
            cursor: "pointer",
          }}
        />
      </NavLink>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={2}
        px={2}
        style={{ justifyContent: "center" }}
      >
        <MDTypography
          variant="h5"
          style={{ display: "flex" }}
          fontWeight="medium"
          textTransform="capitalize"
        >
          {title}
        </MDTypography>
      </MDBox>
      <MDBox
        p={2}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MDBox>
          {renderItems}
          {features.length > 0 && (
            <MDBox py={1} pr={2}>
              <MDTypography
                variant="h6"
                fontWeight="medium"
                textTransform="capitalize"
              >
                Features
              </MDTypography>
              <MDBox ml={1}>{renderFeatures}</MDBox>
            </MDBox>
          )}
          <MDBox display="flex" py={1} pr={2}>
            <MDTypography
              variant="button"
              fontWeight="bold"
              textTransform="capitalize"
            >
              &nbsp;
            </MDTypography>
            {renderSocial}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  shadow: true,
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  info: PropTypes.objectOf(PropTypes.string),
  social: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
  status: PropTypes.string,
  features: PropTypes.array,
  id: PropTypes.string,
};

export default ProfileInfoCard;
