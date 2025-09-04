// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthorsTable = () => {
//   const [messages, setMessages] = useState([]);
//   const token = localStorage.getItem("chemToken");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate("/authentication/sign-in");
//     } else {
//       // Fetch data from your API
//       fetch("https://chemical-api-usa2.onrender.com/api/subscriber/display", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("Fetched data:", data);
//           setMessages(data?.subscriber); // Assuming data is already an array of messages
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     }
//   }, [token]);

//   const columns = [
//     { Header: "Subscriber", accessor: "subscriber", width: "20%", align: "left" },
//     { Header: "Date", accessor: "date", width: "20%", align: "left" },
//   ];

//   const rows = messages.map((item) => ({
//     subscriber: item.email,
//     date: new Date(item.createdAt).toLocaleDateString("en-GB"), // Format as dd-mm-yyyy
//   }));

//   return { columns, rows };
// };

// export default AuthorsTable;


import MDTypography from "components/MDTypography";
export default function AuthorsTableData(filteredData) {

  return {
    columns: [
          { Header: "Subscriber", accessor: "subscriber", width: "20%", align: "left" },
          { Header: "Date", accessor: "date", width: "20%", align: "left" },
    ],

    rows:
      filteredData &&
      [...filteredData].reverse().map((category) => ({
        subscriber: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {category.email}
          </MDTypography>
        ),
        date: (
          <MDTypography
            component="a"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {new Date(category.createdAt).toLocaleDateString("en-GB")}
          </MDTypography>
        ),
      })),
  };
}
