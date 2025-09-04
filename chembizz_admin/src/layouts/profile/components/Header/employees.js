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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";

import axios from "axios";
import { BASE_URL } from "BASE_URL";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Employees() {

  const { _id } = useParams();
  const [companyDetails, setCompanyDetails] = useState("")

  const fetchUserList = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("chemToken")}`;
      const response = await axios.get(`${BASE_URL}/company/companyDetail/${_id}`, {
        headers: {
          Authorization: token,
        },
      });
      setCompanyDetails(response.data.company)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const bookingDateStr = companyDetails?.booking_details?.[0]?.bookingDate;
  let remainingDays = null;
  if (bookingDateStr) {
    const [day, month, year] = bookingDateStr.split('-').map(Number);
    const bookingDate = new Date(year, month - 1, day);
    remainingDays = Math.ceil((bookingDate - new Date()) / (1000 * 60 * 60 * 24));
  }

  const membershipFeatures = companyDetails.membership_features;
  const featuresString = membershipFeatures ? membershipFeatures.map(feature => feature.feature_name).join(', ') : '';

  return (

    <MDBox mt={5} mb={3}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
          <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
          <ProfileInfoCard
            title="profile information"
            info={{
              fullName: companyDetails.contact_person_name,
              mobile: companyDetails.mobile_num,
              GST: companyDetails.gst,
              business: Array.isArray(companyDetails.mode_of_business) && companyDetails.mode_of_business.length > 1
                ? companyDetails.mode_of_business.join(', ')
                : companyDetails.mode_of_business,
              address: companyDetails.address,
              pincode: companyDetails.pincode,
              country: companyDetails.country,
              state: companyDetails.state,
              city: companyDetails.city,
              status: companyDetails.status
            }}

            action={{ route: "", tooltip: "Edit Profile" }}
            shadow={false}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="Other Information"
                info={{
                  website: companyDetails?.other_info?.website,
                  mobile: companyDetails?.other_info?.other_contactno,
                  landline: "+91 111 111 1111",
                  email: companyDetails?.other_info?.other_emailid
                }}
                social={[
                  {
                    link: companyDetails?.other_info?.fb,
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: companyDetails?.other_info?.twitter,
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: companyDetails?.other_info?.insta,
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                  // {
                  //   link: "YOUR_YOUTUBE_LINK_HERE",
                  //   icon: <YouTubeIcon />,
                  //   color: "youtube",
                  // },
                  {
                    link: companyDetails?.other_info?.linkedin,
                    icon: <LinkedInIcon />,
                    color: "linkedin",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
            </Grid>
            {companyDetails?.membership_plans?.length > 0 && (
              <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="Booked Packages"
                  info={{
                    packageName: companyDetails.booking_details?.[0]?.book_package,
                    bookingDate: companyDetails.booking_details?.[0]?.bookingDate,
                    paymentStatus: companyDetails.booking_details?.[0]?.payment_status,
                    remainingDays: remainingDays !== null ? `${remainingDays} days` : "N/A",
                  }}

                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
              </Grid>
            )}
            {companyDetails?.membership_plans?.length > 0 && (
              <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="Booked Package Detail"
                  info={{
                    planName: companyDetails.membership_plans?.[0]?.plan_name,
                    planDays: companyDetails.membership_plans?.[0]?.plan_days,
                    planOriginalPrice: companyDetails.membership_plans?.[0]?.plan_original_price,
                    planSellingPrice: companyDetails.membership_plans?.[0]?.plan_selling_price,
                    planFeatures: featuresString,
                  }}

                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} xl={4}>
          <ProfilesList title="Documents" shadow={false} />
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default Employees;
