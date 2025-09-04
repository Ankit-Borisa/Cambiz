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

// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for type-checking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

function ProfileInfoCard({ title, description, info, social, action, shadow, status, coaLink, pstatus, sstatus, bstatus, lrcopyLink, loricopyLink }) {
  console.log(lrcopyLink);

  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;

  // Convert this form `objectKey` of the object key into this `Object Key`
  Object.keys(info).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);

      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });

  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = Object.entries(info).map(([key, value]) => {
    const formattedLabel = key.replace(/_/g, ' '); // Replace underscores with spaces
    return (
      <MDBox key={key} display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          {formattedLabel}: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{value}
        </MDTypography>
      </MDBox>
    );
  });

  // Render the card social media icons if social media is available
  const renderSocial = social && social.length > 0 && social.map(({ link, icon, color }) => (
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

  let backgroundColor;
  let color;
  if (status === 'pending') {
    backgroundColor = 'yellow';
    color = 'black'
  } else if (status === 'active') {
    backgroundColor = 'green';
    color = 'white'
  } else if (status === 'inactive') {
    backgroundColor = 'red';
    color = 'white'
  }

  let backgroundColor1;
  let color1;
  if (pstatus === 'pending') {
    backgroundColor1 = 'yellow';
    color1 = 'black'
  } else if (pstatus === 'active') {
    backgroundColor1 = 'green';
    color1 = 'white'
  } else if (pstatus === 'inactive') {
    backgroundColor1 = 'red';
    color1 = 'white'
  }

  let backgroundColor2;
  let color2;
  if (sstatus === 'pending') {
    backgroundColor2 = 'yellow';
    color2 = 'black'
  } else if (sstatus === 'active') {
    backgroundColor2 = 'green';
    color2 = 'white'
  } else if (sstatus === 'inactive') {
    backgroundColor2 = 'red';
    color2 = 'white'
  }

  let backgroundColor3;
  let color3;
  if (bstatus === 'pending') {
    backgroundColor3 = 'yellow';
    color3 = 'black'
  } else if (bstatus === 'active') {
    backgroundColor3 = 'green';
    color3 = 'white'
  } else if (bstatus === 'inactive') {
    backgroundColor3 = 'red';
    color3 = 'white'
  }

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox pl={2} pt={2} pr={2}>
        <MDBox>
          {renderItems}
          {renderSocial && (
            <MDBox display="flex" py={1} pr={2}>
              <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                social: &nbsp;
              </MDTypography>
              {renderSocial}
            </MDBox>
          )}
        </MDBox>
      </MDBox>
      {status && (
        <MDBox pl={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            Inquiry Status: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" style={{ backgroundColor, color, padding: "4px 10px", textTransform: "capitalize", borderRadius: "4px" }}>
            &nbsp;{status}
          </MDTypography>
        </MDBox>
      )}
      {pstatus && (
        <MDBox pl={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            Payment Status: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" style={{ backgroundColor: backgroundColor1, color: color1, padding: "4px 10px", textTransform: "capitalize", borderRadius: "4px" }}>
            &nbsp;{pstatus}
          </MDTypography>
        </MDBox>
      )}
      {sstatus && (
        <MDBox pl={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            status: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" style={{ backgroundColor: backgroundColor2, color: color2, padding: "4px 10px", textTransform: "capitalize", borderRadius: "4px" }}>
            &nbsp;{sstatus}
          </MDTypography>
        </MDBox>
      )}
      {bstatus && (
        <MDBox pl={2}>
          <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
            status: &nbsp;
          </MDTypography>
          <MDTypography variant="button" fontWeight="regular" style={{ backgroundColor: backgroundColor3, color: color3, padding: "4px 10px", textTransform: "capitalize", borderRadius: "4px" }}>
            &nbsp;{bstatus}
          </MDTypography>
        </MDBox>
      )}

      {coaLink && (
        <MDBox pl={2}>
          <MDBox>
            <a href={coaLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
              COA
            </a>
          </MDBox>
        </MDBox>
      )}

      {lrcopyLink && (
        <MDBox pl={2}>
          <MDBox>
            <a href={lrcopyLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
              LR
            </a>
          </MDBox>
        </MDBox>
      )}
      

      {loricopyLink && (
        <MDBox pl={2}>
          <MDBox>
            <a href={lrcopyLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
              LR
            </a>
          </MDBox>
        </MDBox>
      )}
      
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  shadow: PropTypes.bool,
  status: PropTypes.string, // Adding prop type for status
  coaLink: PropTypes.string,
  pstatus: PropTypes.string,
  sstatus: PropTypes.string,
  bstatus: PropTypes.string,
};

export default ProfileInfoCard;
