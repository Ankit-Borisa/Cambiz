import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Avatar from "@mui/material/Avatar"; // Import Avatar component for displaying images
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

function ProfileInfoCard({ title, description, info, social, action, shadow, imageSrc, imgLink }) {
  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;

  const formatLabel = (key) => {
    return key.split('_').join(' ');
  };

  Object.entries(info).forEach(([key, value]) => {
    labels.push(formatLabel(key));
    values.push(value);
  });

  const renderItems = info ?
    Object.entries(info).map(([key, value]) => (
      <MDBox key={key} display="flex" py={1} pr={2}>
        <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
          {formatLabel(key)}: &nbsp;
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{value}
        </MDTypography>
      </MDBox>
    )) : [];

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

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        {/* <MDTypography component={Link} to={action.route} variant="body2" color="secondary">
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </MDTypography> */}
      </MDBox>
      <MDBox p={2}>
        <MDBox>
          {/* Render the image section */}
          {imageSrc && <>
            <div>
              <img alt="check image" src={imageSrc} sx={{ width: 100, height: 100 }} className="d-block" />
              <a href={imgLink} target="_blank" className="" style={{fontSize: "10px"}}>{imgLink}</a>
            </div>
            <Divider />
          </>}
        </MDBox>
        <Divider />
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
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  shadow: true,
};

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
  imageSrc: PropTypes.string.isRequired, // Define prop for image source
};

export default ProfileInfoCard;
