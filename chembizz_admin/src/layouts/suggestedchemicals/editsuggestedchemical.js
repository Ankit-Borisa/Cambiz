
import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link, useNavigate, useParams } from "react-router-dom";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { BASE_URL } from "BASE_URL";

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// import
const EditSuggestedChemical = () => {

    const { _id } = useParams()

    const [exist, setExist] = useState("")
    const [purl, setPurl] = useState("")

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleCloseDeleteConfirm = () => {
        setConfirmOpen(false);
    };

    const [insertConfirmOpen, setInsertConfirmOpen] = useState(false);

    const handleInsertConfirm = () => {
        setInsertConfirmOpen(false);
    };

    useEffect(() => {
        const fetchChemical = async () => {
            try {
                const token = `Bearer ${localStorage.getItem("chemToken")}`;
                const response = await axios.get(
                    `${BASE_URL}/api/productByCompany/displayDetails/${_id}`,
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

                const chemicalData = response.data.data?.[0];

                setExist(chemicalData.company?.[0]);
                setFormData({
                    name_of_chemical: chemicalData.name_of_chemical,
                    molecularFormula: chemicalData.molecularFormula,
                    CAS_number: chemicalData.CAS_number,
                    IUPAC_name: chemicalData.IUPAC_name,
                    mol_weight: chemicalData.mol_weight,
                    synonums: chemicalData.synonums,
                    Appearance: chemicalData.Appearance,
                    storage: chemicalData.storage,
                });
                setPurl(chemicalData.structure)

            } catch (error) {
                console.log(error);
            }
        };
        fetchChemical();
    }, [_id]);


    const [errorMessage, setErrorMessage] = useState("")

    const [formData, setFormData] = useState({
        name_of_chemical: "",
        molecularFormula: "",
        CAS_number: "",
        IUPAC_name: "",
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

    const [successMessage, setSuccessMessage] = useState("");

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
            title="Successfully"
            content={successMessage}
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

        const { name_of_chemical, molecularFormula, CAS_number, IUPAC_name, structure, mol_weight, synonums, Appearance, storage } = formData;

        if (!name_of_chemical && !molecularFormula && !CAS_number && !IUPAC_name && !mol_weight && !synonums && !Appearance && !storage) {
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
            setErrorMessage("Please Enter IUPAC Name!")
            openErrorSB();
            return;
        }

        if (!structure && !purl) {
            setErrorMessage("Please Select Chemical Photo!")
            openErrorSB();
            return;
        }

        if (!mol_weight.trim()) {
            setErrorMessage("Please Enter Chemical Mol Weight!")
            openErrorSB();
            return;
        }

        if (!storage.trim()) {
            setErrorMessage("Please Enter storage!")
            openErrorSB();
            return;
        }

        if (!Appearance.trim()) {
            setErrorMessage("Please Enter Appearance!")
            openErrorSB();
            return;
        }

        if (!synonums.trim()) {
            setErrorMessage("Please Enter Synonums!")
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

        const formDataToSend = new FormData();
        formDataToSend.append("name_of_chemical", stringFields.name_of_chemical);
        formDataToSend.append("molecularFormula", stringFields.molecularFormula);
        formDataToSend.append("CAS_number", stringFields.CAS_number);
        formDataToSend.append("IUPAC_name", stringFields.IUPAC_name);
        formDataToSend.append("mol_weight", mol_weight);
        formDataToSend.append("synonums", stringFields.synonums);
        formDataToSend.append("Appearance", stringFields.Appearance);
        formDataToSend.append("storage", stringFields.storage);
        formDataToSend.append("pc_id", _id);
        formDataToSend.append("status", "active");

        if (structure) {
            formDataToSend.append("structure", structure);
            formDataToSend.append("p_url", "");
        } else {
            formDataToSend.append("structure", "");
            formDataToSend.append("p_url", purl);
        }

        try {

            const response = await axios.patch(`${BASE_URL}/api/product/editCompanyProduct/${_id}`, formDataToSend, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            });
            handleInsertConfirm()
            openSuccessSB();
            setSuccessMessage("Chemical Successfully Added")
            setTimeout(() => {
                navigate(-1)
            }, 2000);
        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
            openErrorSB();
        }


    }

    const handleDelete = async () => {
        try {
            const token = `Bearer ${localStorage.getItem("chemToken")}`;
            await axios.delete(`${BASE_URL}/api/productByCompany/delete/${_id}`, {
                headers: {
                    Authorization: token
                }
            });
            handleCloseDeleteConfirm()
            openSuccessSB();
            setSuccessMessage("Chemical Successfully Deleted")
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to delete chemical.");
            openErrorSB();
        }
    };

    const shouldShowAddButton = () => {
        const screenWidth =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        return screenWidth < 850;
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                                    Edit Suggested Chemical
                                </MDTypography>
                                <div style={{ textDecoration: "none" }}>
                                    <MDButton
                                        onClick={handleOpen}
                                        variant="gradient"
                                        color="dark"
                                        style={{ position: "absolute", top: "16px", right: "2%" }}
                                    >
                                        {shouldShowAddButton() ? "" : "view company details"}
                                    </MDButton>
                                </div>
                            </MDBox>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Card
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        maxWidth: 345,
                                        paddingBottom: "0px"
                                    }}
                                >
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                R
                                            </Avatar>
                                        }
                                        // action={
                                        //     <IconButton aria-label="settings">
                                        //         <MoreVertIcon />
                                        //     </IconButton>
                                        // }
                                        title={exist?.company_name}
                                        subheader={exist?.contact_person_name}
                                    />
                                    {/* <CardMedia
                                        component="img"
                                        height="194"
                                        image="/static/images/cards/paella.jpg"
                                        alt="Paella dish"
                                    /> */}
                                    <CardContent>
                                        <div className="d-flex gap-2 items-center">
                                            <MDTypography variant="h6" className="mb-0">
                                                Email :
                                            </MDTypography>
                                            <MDTypography variant="h6" className="mb-0">
                                                {exist?.emailid}
                                            </MDTypography>
                                        </div>
                                        <div className="d-flex gap-2 items-center">
                                            <MDTypography variant="h6" className="mb-0">
                                                Mobile No :
                                            </MDTypography>
                                            <MDTypography variant="h6" className="mb-0">
                                                {exist?.mobile_num}
                                            </MDTypography>
                                        </div>
                                        <div className="d-flex gap-2 items-center">
                                            <MDTypography variant="h6" className="mb-0">
                                                GST No :
                                            </MDTypography>
                                            <MDTypography variant="h6" className="mb-0">
                                                {exist?.gst}
                                            </MDTypography>
                                        </div>
                                        <div className="d-flex gap-2 items-center">
                                            <MDTypography variant="h6" className="mb-0">
                                                Address :
                                            </MDTypography>
                                            <MDTypography variant="h6" className="mb-0">
                                                {exist?.address}
                                            </MDTypography>
                                        </div>
                                        <div className="d-flex gap-2 items-center">
                                            <MDTypography variant="h6" className="mb-0">
                                                City :
                                            </MDTypography>
                                            <MDTypography variant="h6" className="mb-0">
                                                {exist?.city}
                                            </MDTypography>
                                        </div>
                                        <div className="d-flex gap-2 items-center">
                                            <MDTypography variant="h6" className="mb-0">
                                                State :
                                            </MDTypography>
                                            <MDTypography variant="h6" className="mb-0">
                                                {exist?.state}
                                            </MDTypography>
                                        </div>
                                        <div className="d-flex gap-2 items-center">
                                            <MDTypography variant="h6" className="mb-0">
                                                Country :
                                            </MDTypography>
                                            <MDTypography variant="h6" className="mb-0">
                                                {exist?.country}
                                            </MDTypography>
                                        </div>
                                        <div className="d-flex gap-2 items-center">
                                            <MDTypography variant="h6" className="mb-0">
                                                Address :
                                            </MDTypography>
                                            <MDTypography variant="h6" className="mb-0">
                                                main bajar ahmedabad
                                            </MDTypography>
                                        </div>
                                        <div className="d-flex justify-content-center mt-4">
                                            <MDButton
                                                variant="gradient"
                                                color="dark"
                                                onClick={() => navigate(`/company-full-detail/${exist?._id}`)}
                                            >
                                                VIEW MORE DETAILS
                                            </MDButton>
                                        </div>
                                    </CardContent>
                                    {/* <CardActions disableSpacing>
                                        <IconButton aria-label="add to favorites">
                                            <FavoriteIcon />
                                        </IconButton>
                                        <IconButton aria-label="share">
                                            <ShareIcon />
                                        </IconButton>
                                        <ExpandMore
                                            expand={expanded}
                                            onClick={handleExpandClick}
                                            aria-expanded={expanded}
                                            aria-label="show more"
                                        >
                                            <ExpandMoreIcon />
                                        </ExpandMore>
                                    </CardActions> */}
                                    {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        <CardContent>
                                            <Typography paragraph>Method:</Typography>
                                            <Typography paragraph>
                                                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
                                                aside for 10 minutes.
                                            </Typography>
                                            <Typography paragraph>
                                                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
                                                medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
                                                occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
                                                large plate and set aside, leaving chicken and chorizo in the pan. Add
                                                pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
                                                stirring often until thickened and fragrant, about 10 minutes. Add
                                                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                                            </Typography>
                                            <Typography paragraph>
                                                Add rice and stir very gently to distribute. Top with artichokes and
                                                peppers, and cook without stirring, until most of the liquid is absorbed,
                                                15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
                                                mussels, tucking them down into the rice, and cook again without
                                                stirring, until mussels have opened and rice is just tender, 5 to 7
                                                minutes more. (Discard any mussels that don&apos;t open.)
                                            </Typography>
                                            <Typography>
                                                Set aside off of the heat to let rest for 10 minutes, and then serve.
                                            </Typography>
                                        </CardContent>
                                    </Collapse> */}
                                </Card>
                            </Modal>
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
                                                src={formData.structure}
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
                                                src={formData.structure}
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
                                        {/* <MDBox mb={4}>
                                            <Grid item xl={2}>
                                                <div className="d-flex align-items-center" style={{ gap: "15px" }}>
                                                    <h6 className="mb-0">STATUS</h6>
                                                    <select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        name="status"
                                                        onChange={handleChange}
                                                        value={formData.status}
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
                                        </MDBox> */}
                                        <MDBox mt={4} mb={1}>
                                            <MDBox display="flex" gap="10px">
                                                <MDButton
                                                    variant="gradient"
                                                    color="error"
                                                    fullWidth
                                                    type="submit"
                                                    onClick={() => setConfirmOpen(true)}
                                                >
                                                    Delete
                                                </MDButton>
                                                <MDButton
                                                    variant="gradient"
                                                    color="info"
                                                    fullWidth
                                                    type="submit"
                                                    onClick={() => setInsertConfirmOpen(true)}
                                                >
                                                    Submit
                                                </MDButton>
                                            </MDBox>
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
                open={confirmOpen}
                onClose={handleCloseDeleteConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this chemical?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={insertConfirmOpen}
                onClose={handleInsertConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to add the chemical?
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

export default EditSuggestedChemical;