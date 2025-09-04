import MDTypography from "components/MDTypography";
// Images
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";

export default function AuthorsTableData({ handleDelete, ceritificateList, handleView }) {
  console.log(ceritificateList);

  const navigate = useNavigate();

  const handleNav = (_id) => {
    navigate(`/edit-certificate/${_id}`)
  }

  const Author = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Design Image", accessor: "company", align: "left" },
      { Header: "Title", accessor: "title", align: "left" },
      { Header: "view", accessor: "view", align: "center" },
      { Header: "edit", accessor: "action", align: "center" },
      { Header: "delete", accessor: "status", align: "center" },
    ],


    rows: ceritificateList && [...ceritificateList].reverse().map((e) => ({

      company: <Author image={e?.design_photo} />,
      title: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {e?.design_title}
        </MDTypography>
      ),
      status: (
        <MDButton
          variant="gradient"
          color="error"
          fullWidth
          type="submit"
          onClick={() => handleDelete(e._id)}
        >
          DELETE
        </MDButton>
      ),
      view: (
        <MDTypography component="p" onClick={() => handleView(e.design_photo)} variant="caption" color="text" fontWeight="medium">
          view
        </MDTypography>
      ),
      action: (
        <MDTypography component="p" onClick={() => handleNav(e._id)} variant="caption" color="text" fontWeight="medium">
          Edit
        </MDTypography>
      ),
    }))


  };
}
