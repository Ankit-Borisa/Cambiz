
import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import { useMaterialUIController } from "context";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Audio } from "react-loader-spinner";
import MDAvatar from "components/MDAvatar";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { useParams } from 'react-router-dom';
import { BASE_URL } from "BASE_URL";
// import
const Editgrade = () => {

    const [errorMessage, setErrorMessage] = useState("")

    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const navigate = useNavigate();
    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successfull Updated"
            content="Grade Is Successfully Updated."
            dateTime="1 sec"
            open={successSB}
            onClose={closeSuccessSB}
            close={closeSuccessSB}
            bgWhite
        />
    );

    const renderErrorSB = (
        <MDSnackbar
            color="error"
            icon="warning"
            title="Filled Error"
            content={errorMessage}
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );


    const [category, setCategory] = useState("")
    const [Grade, setGrade] = useState("")

    const handleChange = (e) => {
        setCategory(e.target.value)
    }

    const handleGradeChange = (e) => {
        setGrade(e.target.value)
    }

    const { _id } = useParams();

    const handleSubmit = async () => {
        if (!category && !Grade) {
            setErrorMessage("Please Fill All Field!")
            openErrorSB();
            return
        }
        if (!category) {
            setErrorMessage("Please Select Category")
            openErrorSB();
            return
        }
        if (!Grade.trim()) {
            setErrorMessage("Please Enter Grade")
            openErrorSB();
            return
        }

        const token = `Bearer ${localStorage.getItem("chemToken")}`;
        const response = await fetch(`${BASE_URL}/api/grades/${_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                grade_name: Grade.trim(),
                category_id: category
            }),
        });

        openSuccessSB();
        setTimeout(() => {
            navigate(-1)
        }, 2000);
    }


    const [categoryId, setCategoryId] = useState([])

    const fetchUserList = async () => {
        try {
            const token = `Bearer ${localStorage.getItem("chemToken")}`;
            const response = await axios.get(
                `${BASE_URL}/api/category/categories`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            setCategoryId(response.data.categories);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUserList()
    }, []);


    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const token = `Bearer ${localStorage.getItem("chemToken")}`;
                const response = await axios.get(
                    `${BASE_URL}/api/grades/${_id}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setGrade(response?.data?.grade?.grade_name);
                setCategory(response?.data?.grade?.category_id);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserList();
    }, []);


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                style={{
                                    position: "relative",
                                }}
                            >
                                <MDTypography variant="h6" color="white">
                                    Edit Grade
                                </MDTypography>
                            </MDBox>
                            <MDBox py={3} px={2}>
                                <Grid container pt={4} pb={3} px={3}>
                                    <Grid item xs={12} md={6} xl={6} px={2}>
                                        <MDBox mb={2}>
                                            <div className="mb-4">
                                                <h6 className="mb-2">category</h6>
                                                <select
                                                    className="w-100"
                                                    onChange={handleChange}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="City"
                                                    style={{ color: "#7b809a", background: "transparent", border: "1px solid #dadbda", height: "44px", padding: "0px 15px", borderRadius: "5px", fontSize: "14px" }}
                                                    fullWidth
                                                    value={category}
                                                >
                                                    <option value="" disabled selected>Select Category</option>
                                                    {categoryId && categoryId.map((e) => {
                                                        return (
                                                            <option value={e._id}>{e.category_name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Grade Name"
                                                name="category"
                                                value={Grade}
                                                onChange={handleGradeChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mt={4} mb={1}>
                                            <MDButton
                                                variant="gradient"
                                                color="info"
                                                fullWidth
                                                type="submit"
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </MDButton>
                                            {renderSuccessSB}
                                            {renderErrorSB}
                                        </MDBox>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            {/* <Footer /> */}
        </DashboardLayout>
    );
};

export default Editgrade;