import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

import { useNavigate } from "react-router-dom";

export default function AuthorsTableData(filteredData) {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );


  const navigate = useNavigate();

  const handleNav = (_id, status) => {
    navigate(`/edit-company/${_id}`, { state: { status: status } });
  };

  return {
    columns: [
      { Header: "company", accessor: "company", width: "18%", align: "left" },
      { Header: "contact person", accessor: "contact", align: "left" },
      { Header: "gst", accessor: "gst", align: "left" },
      { Header: "business mode", accessor: "mode", align: "left" },
      { Header: "mobile number", accessor: "mobile", align: "left" },
      { Header: "landline number", accessor: "landline", align: "left" },
      { Header: "address", accessor: "address", align: "left" },
      { Header: "pincode", accessor: "pincode", align: "left" },
      { Header: "country", accessor: "country", align: "left" },
      { Header: "state", accessor: "state", align: "left" },
      { Header: "city", accessor: "city", align: "left" },
      { Header: "membership status", accessor: "membstaus", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
      { Header: "view", accessor: "view", align: "center" },
    ],

    rows:
      filteredData &&
      [...filteredData].reverse().map((category) => ({
        company: (
          <Author name={category.company_name} email={category.emailid} />
        ),
        membstaus: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={category.membership_status}
              color={category.status === "active" ? "success" : "error"}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={category.status}
              color={category.status === "active" ? "success" : "error"}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        address: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.address}
          </MDTypography>
        ),
        mode: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.mode_of_business.join(",")}
          </MDTypography>
        ),
        mobile: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.mobile_num}
          </MDTypography>
        ),
        landline: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.landline_num}
          </MDTypography>
        ),
        pincode: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.pincode}
          </MDTypography>
        ),
        gst: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.gst}
          </MDTypography>
        ),
        contact: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.contact_person_name}
          </MDTypography>
        ),
        country: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.country}
          </MDTypography>
        ),
        state: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.state}
          </MDTypography>
        ),
        city: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.city}
          </MDTypography>
        ),
        action: (
          <MDTypography
            component="a"
            href={`/edit-company/${category._id}`}
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            EDIT
          </MDTypography>
        ),
        view: (
          <MDTypography
            component="a"
            href={`/company-full-detail/${category._id}`}
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            VIEW
          </MDTypography>
        ),
      })),
  };
}
