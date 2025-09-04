import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import axios from "axios";

function OrdersOverview() {
  const [productInquiries, setProductInquiries] = useState([]);
  const token = localStorage.getItem("chemToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://chemical-api-usa2.onrender.com/api/superadmin/deshboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProductInquiries(response.data.top10ProductInquiries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Top 10 Products Details
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {productInquiries.map((inquiry, index) => {
          const product = inquiry.productDetails[0];
          return (
            <TimelineItem
              key={index}
              color="primary"
              icon={
                <img
                  src={`path_to_image_directory/${product.structure}`} // Replace with the actual path to the image directory
                  alt={product.name_of_chemical}
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
                />
              }
              title={product.name_of_chemical}
              dateTime={`Inquiries: ${inquiry.count}`}
              lastItem={index === productInquiries.length - 1}
            />
          );
        })}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
