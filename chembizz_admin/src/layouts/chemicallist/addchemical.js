
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
import TextField from '@mui/material/TextField';
import { BASE_URL } from "BASE_URL";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Addchemical = () => {

    const [insertConfirmOpen, setInsertConfirmOpen] = useState(false);

    const handleInsertConfirm = () => {
        setInsertConfirmOpen(false);
    };
    
    const [formData, setFormData] = useState({
        name_of_chemical: "",
        molecularFormula: "",
        CAS_number: "",
        IUPAC_name: "",
        status: "",
        structure: "",
        mol_weight: "",
        synonums: "",
        Appearance: "",
        storage: ""
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'structure' && files.length > 0) {
            const selectedFile = files[0];
            setFormData((prevData) => ({
                ...prevData,
                [name]: URL.createObjectURL(selectedFile) // Update the image preview
            }));
            setFormData((prevTemp) => ({ ...prevTemp, structure: selectedFile })); // Update the temp state with the selected file
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };
    
    
    
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
            title="Successfull Added"
            content="Chemical Added Successfully."
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


    const handleSubmit = async () => {

        const { name_of_chemical, molecularFormula, CAS_number, IUPAC_name, status, structure, mol_weight, synonums, Appearance, storage } = formData;

        if (!name_of_chemical.trim() && !molecularFormula.trim() && !CAS_number.trim() && !IUPAC_name.trim() && !status.trim() && !structure && !mol_weight && !synonums.trim() && !Appearance.trim() && !storage.trim()) {
            setErrorMessage("Please Fill All Fields!")
            openErrorSB();
            return;
        }

        if (!name_of_chemical.trim()) {
            setErrorMessage("Please Enter Chemical Name!")
            openErrorSB();
            return;
        }

        if (!molecularFormula.trim()) {
            setErrorMessage("Please Enter Chemical Formula!")
            openErrorSB();
            return;
        }

        if (!CAS_number.trim()) {
            setErrorMessage("Please Enter CAS Number!")
            openErrorSB();
            return;
        }

        if (!IUPAC_name.trim()) {
            setErrorMessage("Please Enter HSN Code!")
            openErrorSB();
            return;
        }

        if (!status.trim()) {
            setErrorMessage("Please Select Status!")
            openErrorSB();
            return;
        }

        if (!structure) {
            setErrorMessage("Please Select Chemical Photo!")
            openErrorSB();
            return;
        }

        if (!mol_weight) {
            setErrorMessage("Please Enter Chemical Mol Weight!")
            openErrorSB();
            return;
        }

        if (!storage.trim()) {
            setErrorMessage("Please Enter storage!")
            openErrorSB();
            return;
        }

        const token = `Bearer ${localStorage.getItem("chemToken")}`;

        const stringFields = {
            name_of_chemical: String(name_of_chemical),
            molecularFormula: String(molecularFormula),
            CAS_number: String(CAS_number),
            IUPAC_name: String(IUPAC_name),
            synonums: String(synonums),
            Appearance: String(Appearance),
            storage: String(storage)
        };

        // Create FormData object
        const formDataToSend = new FormData();
        formDataToSend.append("name_of_chemical", stringFields.name_of_chemical);
        formDataToSend.append("molecularFormula", stringFields.molecularFormula);
        formDataToSend.append("CAS_number", stringFields.CAS_number);
        formDataToSend.append("IUPAC_name", stringFields.IUPAC_name);
        formDataToSend.append("status", status);
        formDataToSend.append("structure", structure);
        formDataToSend.append("mol_weight", mol_weight);
        formDataToSend.append("synonums", stringFields.synonums);
        formDataToSend.append("Appearance", stringFields.Appearance);
        formDataToSend.append("storage", stringFields.storage);
        formDataToSend.append("p_url", "");

        const response = await axios.post(`${BASE_URL}/api/product/create`, formDataToSend, {
            headers: {
                Authorization: token,
                "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
            },
        });

        handleInsertConfirm()
        openSuccessSB();
        setTimeout(() => {
            navigate(-1)
        }, 2000);

    }
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
                                    Add New Chemical
                                </MDTypography>
                            </MDBox>
                            <MDBox py={3} px={2}>
                                <Grid container pt={4} pb={3} px={3}>
                                    <Grid item xs={12} md={6} xl={6} px={2}>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Chemical Name"
                                                name="name_of_chemical"
                                                value={formData.name_of_chemical}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Molecular Formula"
                                                name="molecularFormula"
                                                value={formData.molecularFormula}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="CAS Number"
                                                name="CAS_number"
                                                value={formData.CAS_number}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="IUPAC name"
                                                name="IUPAC_name"
                                                value={formData.IUPAC_name}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox display="flex" alignItems="center">
                                            <MDBox
                                                component="img"
                                                alt="Preview"
                                                style={{
                                                    width: "3rem",
                                                    height: "3rem",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                }}
                                            />
                                            <input
                                                type="file"
                                                name="structure"
                                                onChange={handleChange}
                                                accept="image/jpeg, image/png, image/jpg"
                                                style={{ marginLeft: "20px" }}
                                            />
                                        </MDBox>
                                    </Grid>
                                    <Grid item xs={12} md={6} xl={6} px={2}>
                                        <MDBox mb={2} style={{ position: 'relative' }}>
                                            <MDInput
                                                type="text"
                                                label="Mol Weight"
                                                name="mol_weight"
                                                value={formData.mol_weight}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2} style={{ position: 'relative' }}>
                                            <MDInput
                                                type="text"
                                                label="Synonums"
                                                name="synonums"
                                                value={formData.synonums}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>

                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Appearance"
                                                name="Appearance"
                                                value={formData.Appearance}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={2}>
                                            <MDInput
                                                type="text"
                                                label="Storage"
                                                name="storage"
                                                value={formData.storage}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{ marginBottom: "20px" }}
                                            />
                                        </MDBox>
                                        <MDBox mb={4}>
                                            <Grid item xl={2}>
                                                <div className="d-flex align-items-center" style={{ gap: "15px" }}>
                                                    <h6 className="mb-0">STATUS</h6>
                                                    <select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        name="status"
                                                        onChange={handleChange}
                                                        style={{ color: "#7b809a", background: "transparent", border: "1px solid #dadbda", height: "44px", padding: "0px 15px", borderRadius: "5px", fontSize: "14px" }}
                                                        fullWidth
                                                    >
                                                        <option value="" >SELECT</option>
                                                        <option value="active" >ACTIVE</option>
                                                        <option value="inactive" >INACTIVE</option>
                                                        <option value="pending" >PENDING</option>
                                                        <option value="unavailable" >UNAVAILABLE</option>
                                                    </select>
                                                </div>
                                            </Grid>
                                        </MDBox>
                                        <MDBox mt={4} mb={1}>
                                            <MDButton
                                                variant="gradient"
                                                color="info"
                                                fullWidth
                                                type="submit"
                                                onClick={() => setInsertConfirmOpen(true)}
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

            <Dialog
                open={insertConfirmOpen}
                onClose={handleInsertConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to add this chemical?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleInsertConfirm} color="primary">
                        No
                    </Button>
                    <Button onClick={handleSubmit} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* <Footer /> */}
        </DashboardLayout>
    );
};

export default Addchemical;