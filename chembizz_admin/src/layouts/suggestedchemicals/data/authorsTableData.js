// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDAvatar from "components/MDAvatar";
// import MDBadge from "components/MDBadge";

// // Images
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";
// import chemical from "assets/images/f1.svg";
// import { useNavigate } from "react-router-dom";

// export default function AuthorsTableData(chemicalList, searchTerm) {
//   const Author = ({ image, name, email }) => (
//     <MDBox display="flex" alignItems="center" lineHeight={1}>
//       <MDAvatar src={image} name={name} size="sm" />
//       <MDBox ml={2} lineHeight={1}>
//         <MDTypography display="block" variant="button" fontWeight="medium">
//           {name}
//         </MDTypography>
//         <MDTypography variant="caption">{email}</MDTypography>
//       </MDBox>
//     </MDBox>
//   );

//   const Job = ({ title, description }) => (
//     <MDBox lineHeight={1} textAlign="left">
//       <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
//         {title}
//       </MDTypography>
//       {/* <MDTypography variant="caption">{description}</MDTypography> */}
//     </MDBox>
//   );

//   const navigate = useNavigate();

  // const handleNavigate = (id) => {
  //   navigate(`/chemical/edit-suggested-chemical/${id}`)
  // }

//   const filteredList = chemicalList?.filter(chemical => {
//     return (
//       chemical.name_of_chemical.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       chemical.CAS_number.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   return {
//     columns: [
//       { Header: "chemical", accessor: "company", width: "18%", align: "left" },
//       { Header: "cas", accessor: "cas", align: "left" },
//       { Header: "iupac name", accessor: "hsn", align: "left", width: "5%", },
//       { Header: "mol weight", accessor: "weight", align: "left" },
//       { Header: "synonums", accessor: "synonums", align: "left" },
//       { Header: "appearance", accessor: "remarks", width: "10%", align: "left" },
//       { Header: "storage", accessor: "uses", align: "left", width: "10%" },
//       { Header: "status", accessor: "status", align: "center" },
//       { Header: "action", accessor: "action", align: "center" },
//     ],


//     rows: filteredList?.reverse().map(chemical => ({
//       company: <Author name={chemical.name_of_chemical} email={chemical.molecularFormula} image={chemical.structure} />,
//       cas: (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {chemical.CAS_number}
//         </MDTypography>
//       ),
//       hsn: (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {chemical?.IUPAC_name}
//         </MDTypography>
//       ),
//       weight: <Job title={chemical.mol_weight} />,
//       synonums: (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {chemical.synonums}
//         </MDTypography>
//       ),
//       remarks: (
//         <MDTypography
//           component="a"
//           variant="caption"
//           color="text"
//           fontWeight="medium"
//           sx={{ maxWidth: '200px', wordWrap: 'break-word' }} // Adjust maxWidth as needed
//         >
//           {chemical.Appearance}
//         </MDTypography>
//       ),
//       uses: (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {chemical.storage}
//         </MDTypography>
//       ),
//       status: (
//         <MDBox ml={-1}>
//           <MDBadge badgeContent={chemical.status} color={chemical.status === "active" ? "success" : "info"} variant="gradient" size="sm" />
//         </MDBox>
//       ),
//       action: (
//         <MDTypography component="a" onClick={() => handleNavigate(chemical._id)} variant="caption" color="text" fontWeight="medium">
//           Edit
//         </MDTypography>
//       ),

//     })),
//   };
// }










// import React from "react";
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import MDAvatar from "components/MDAvatar";
// import MDBadge from "components/MDBadge";
// import IconButton from '@mui/material/IconButton';
// import VisibilityIcon from '@mui/icons-material/Visibility';

// export default function AuthorsTableData(chemicalList, searchTerm, handleOpen) {
//   const Author = ({ image, name, email }) => (
//     <MDBox display="flex" alignItems="center" lineHeight={1}>
//       <MDAvatar src={image} name={name} size="sm" />
//       <MDBox ml={2} lineHeight={1}>
//         <MDTypography display="block" variant="button" fontWeight="medium">
//           {name}
//         </MDTypography>
//         <MDTypography variant="caption">{email}</MDTypography>
//       </MDBox>
//     </MDBox>
//   );

//   const Job = ({ title }) => (
//     <MDBox lineHeight={1} textAlign="left">
//       <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
//         {title}
//       </MDTypography>
//     </MDBox>
//   );

//   const filteredList = chemicalList?.filter(chemical => {
//     return (
//       chemical.name_of_chemical.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       chemical.CAS_number.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   return {
//     columns: [
//       { Header: "chemical", accessor: "company", width: "18%", align: "center" },
//       { Header: "cas", accessor: "cas", align: "left" },
//       { Header: "iupac name", accessor: "hsn", align: "left", width: "5%", },
//       { Header: "mol weight", accessor: "weight", align: "left" },
//       { Header: "synonums", accessor: "synonums", align: "left" },
//       { Header: "appearance", accessor: "remarks", width: "10%", align: "left" },
//       { Header: "storage", accessor: "uses", align: "left", width: "10%" },
//       { Header: "status", accessor: "status", align: "center" },
//       { Header: "action", accessor: "action", align: "center" },
//     ],
//     rows: filteredList?.reverse().map(chemical => ({
//       company: <Author name={chemical.name_of_chemical} email={chemical.molecularFormula} image={chemical.structure} />,
//       cas: (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {chemical.CAS_number}
//         </MDTypography>
//       ),
//       hsn: (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {chemical?.IUPAC_name}
//         </MDTypography>
//       ),
//       weight: <Job title={chemical.mol_weight} />,
//       synonums: (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {chemical.synonums}
//         </MDTypography>
//       ),
//       remarks: (
//         <MDTypography
//           component="a"
//           variant="caption"
//           color="text"
//           fontWeight="medium"
//           sx={{ maxWidth: '200px', wordWrap: 'break-word' }} // Adjust maxWidth as needed
//         >
//           {chemical.Appearance}
//         </MDTypography>
//       ),
//       uses: (
//         <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
//           {chemical.storage}
//         </MDTypography>
//       ),
//       status: (
//         <MDBox ml={-1}>
//           <MDBadge 
//             badgeContent={chemical.status} 
//             color={chemical.status === "approve" ? "success" : chemical.status === "decline" ? "error" : "info"} 
//             // variant="contained" 
//             size="sm" 
//           />
//         </MDBox>
//       ),
//       action: (
//         <IconButton color="primary" onClick={() => handleOpen(chemical)}>
//           <VisibilityIcon />
//         </IconButton>
//       ),
//     })),
//   };
// }










import React from "react";
import { useNavigate } from "react-router-dom"; // Make sure to import useNavigate
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function AuthorsTableData(chemicalList, searchTerm, handleOpen) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavigate = (id) => {
    navigate(`/chemical/edit-suggested-chemical/${id}`);
  };

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  const filteredList = chemicalList?.filter(chemical => {
    return (
      chemical.name_of_chemical.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chemical.CAS_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return {
    columns: [
      { Header: "chemical", accessor: "company", width: "18%", align: "left" },
      { Header: "cas", accessor: "cas", align: "left" },
      { Header: "iupac name", accessor: "hsn", align: "left", width: "5%", },
      { Header: "mol weight", accessor: "weight", align: "left" },
      { Header: "synonums", accessor: "synonums", align: "left" },
      { Header: "appearance", accessor: "remarks", width: "10%", align: "left" },
      { Header: "storage", accessor: "uses", align: "left", width: "10%" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: filteredList?.reverse().map(chemical => ({
      company: <Author name={chemical.name_of_chemical} email={chemical.molecularFormula} image={chemical.structure} />,
      cas: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {chemical.CAS_number}
        </MDTypography>
      ),
      hsn: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {chemical?.IUPAC_name}
        </MDTypography>
      ),
      weight: <Job title={chemical.mol_weight} />,
      synonums: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {chemical.synonums}
        </MDTypography>
      ),
      remarks: (
        <MDTypography
          component="a"
          variant="caption"
          color="text"
          fontWeight="medium"
          sx={{ maxWidth: '200px', wordWrap: 'break-word' }} // Adjust maxWidth as needed
        >
          {chemical.Appearance}
        </MDTypography>
      ),
      uses: (
        <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
          {chemical.storage}
        </MDTypography>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge 
            badgeContent={chemical.status} 
            color={chemical.status === "approve" ? "success" : chemical.status === "decline" ? "error" : "info"} 
            size="sm" 
          />
        </MDBox>
      ),
      action: (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          {/* <IconButton color="primary" onClick={() => handleOpen(chemical)}>
            <VisibilityIcon />
          </IconButton> */}
          <MDTypography component="a" onClick={() => handleNavigate(chemical._id)} variant="caption" color="text" fontWeight="medium" sx={{ cursor: 'pointer', marginLeft: 1 }}>
            View & Edit
          </MDTypography>
        </MDBox>
      ),
    })),
  };
}
