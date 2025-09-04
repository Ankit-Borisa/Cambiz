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

  return {
    columns: [
      { Header: "Company Name", accessor: "companyname", width: "28%", align: "left" },
      { Header: "contact number", accessor: "contactperson", align: "left" },
      { Header: "contact time", accessor: "time", align: "left" },
      { Header: "date", accessor: "date", align: "left" },
    ],

    rows:
      filteredData &&
      [...filteredData].reverse().map((category) => ({
        companyname: (
          <Author name={category.company_name} email={category.contact_person_name} />
        ),
        contactperson: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.contact_number}
          </MDTypography>
        ),
        time: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.contact_time}
          </MDTypography>
        ),
        date: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category?.contact_date?.slice(0, 10)}
          </MDTypography>
        ),
      })),
  };
}
