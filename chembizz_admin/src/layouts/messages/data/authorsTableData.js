import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

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

  return {
    columns: [
      { Header: "Fullname", accessor: "fullname", width: "18%", align: "left" },
      { Header: "contact number", accessor: "contact", align: "left" },
      { Header: "contact for", accessor: "contactfor", align: "left" },
      { Header: "country", accessor: "country", align: "left" },
      { Header: "message", accessor: "message", align: "left" },
      { Header: "date", accessor: "date", align: "left" },
    ],

    rows:
      filteredData &&
      [...filteredData].reverse().map((category) => ({
        fullname: (
          <Author name={category.fullName} email={category.email_id} />
        ),
        contact: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.contact_no}
          </MDTypography>
        ),
        contactfor: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.contact_for ? category.contact_for : "-"}
          </MDTypography>
        ),
        country: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.country ? category.country : "-"}
          </MDTypography>
        ),
        message: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.message}
          </MDTypography>
        ),
        date: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.createdAt?.slice(0, 10)}
          </MDTypography>
        ),
      })),
  };
}
