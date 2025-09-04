
// import React, { useEffect, useState } from "react";
// import Grid from "@mui/material/Grid";
// import { Button, Modal } from "@mui/material";
// import TextareaAutosize from "@mui/material/TextareaAutosize";

// import MDBox from "components/MDBox";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import { Padding, WidthFull } from "@mui/icons-material";
// import { BASE_URL } from "BASE_URL";
// import MDSnackbar from "components/MDSnackbar";
// import axios from "axios";

// function Terms() {
//     const [successSB, setSuccessSB] = useState(false);
//     const [errorSB, setErrorSB] = useState(false);
//     const [message, setMessage] = useState("");

//     const openSuccessSB = () => setSuccessSB(true);
//     const closeSuccessSB = () => setSuccessSB(false);
//     const openErrorSB = () => setErrorSB(true);
//     const closeErrorSB = () => setErrorSB(false);

//     const renderSuccessSB = (
//         <MDSnackbar
//             color="success"
//             icon="check"
//             title="Successful"
//             content={message}
//             dateTime="1 sec"
//             open={successSB}
//             onClose={closeSuccessSB}
//             close={closeSuccessSB}
//             bgWhite
//         />
//     );

//     const renderErrorSB = (
//         <MDSnackbar
//             color="error"
//             icon="warning"
//             title="Error"
//             content={message}
//             dateTime="1 sec ago"
//             open={errorSB}
//             onClose={closeErrorSB}
//             close={closeErrorSB}
//             bgWhite
//         />
//     );

//     const [terms, setTerms] = useState("");
//     const [termsId, setTermsId] = useState("");

//     const fetchTerms = async () => {
//         const token = `Bearer ${localStorage.getItem("chemToken")}`;
//         try {
//             const res = await fetch(`${BASE_URL}/api/admin_teams_and_condition/display?adminId=${localStorage.getItem("admin_id")}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: token,
//                 },
//             });
//             const data = await res.json();
//             console.log(data);
//             if (data && data.data) {
//                 setTerms(data.data?.[0]?.values || "");  
//                 setTermsId(data.data?.[0]?._id || "");  
//             } else {
//                 setMessage("Failed to fetch terms and conditions.");
//                 openErrorSB();
//             }
//         } catch (error) {
//             setMessage("Error fetching terms and conditions.");
//             openErrorSB();
//             console.error("Error fetching terms:", error.message);
//         }
//     };

//     useEffect(() => {
//         fetchTerms();
//     }, []);

//     const handleSubmit = async () => {
//         if (!terms) {
//             setMessage("Please Enter Terms & Condition");
//             openErrorSB();
//             return;
//         }

//         const token = `Bearer ${localStorage.getItem("chemToken")}`;

//         try {
//             const response = await axios.put(
//                 `${BASE_URL}/api/admin_teams_and_condition/update?adminId=${localStorage.getItem("admin_id")}`,
//                 { values: terms },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: token,
//                     },
//                 }
//             );

//             console.log(response.status);

//             if (response.status === 200) {
//                 setMessage("Terms & Condition Updated Successfully");
//                 openSuccessSB();
//             } else {
//                 setMessage("Failed to update Terms & Condition.");
//                 openErrorSB();
//             }
//         } catch (error) {
//             setMessage("Error updating Terms & Condition.");
//             openErrorSB();
//             console.error("Error updating terms:", error.message);
//         }
//     };

//     const style = {
//         backgroundColor: "transparent",
//         border: "1px solid black",
//         borderRadius: "10px",
//         width: "100%",
//         padding: "10px 20px"
//     };

//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//             <MDBox pt={6} pb={3}>
//                 <Grid container spacing={6}>
//                     <Grid item xs={12}>
//                         <textarea
//                             cols="30"
//                             rows="8"
//                             value={terms}
//                             style={style}
//                             onChange={(e) => setTerms(e.target.value)}
//                         ></textarea>
//                         <div className="d-flex justify-content-center mt-3">
//                             <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
//                                 Submit
//                             </Button>
//                         </div>
//                     </Grid>
//                 </Grid>
//             </MDBox>
//             {renderSuccessSB}
//             {renderErrorSB}
//             <Footer />
//         </DashboardLayout>
//     );
// }

// export default Terms;









import React, { useEffect, useRef, useState } from "react";

import Grid from "@mui/material/Grid";
import { Button, Modal } from "@mui/material";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { BASE_URL } from "BASE_URL";
import MDSnackbar from "components/MDSnackbar";
import axios from "axios";

// ck editor 

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    AccessibilityHelp,
    Alignment,
    Autosave,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Indent,
    IndentBlock,
    Italic,
    List,
    Paragraph,
    SelectAll,
    Strikethrough,
    Underline,
    Undo
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './ck.css';

function Terms() {
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const [message, setMessage] = useState("");
    const [termsId, setTermsId] = useState("");

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const renderSuccessSB = (
        <MDSnackbar
            color="success"
            icon="check"
            title="Successful"
            content={message}
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
            title="Error"
            content={message}
            dateTime="1 sec ago"
            open={errorSB}
            onClose={closeErrorSB}
            close={closeErrorSB}
            bgWhite
        />
    );

    const [terms, setTerms] = useState("");

    const fetchTerms = async () => {
        const token = `Bearer ${localStorage.getItem("chemToken")}`;
        try {
            const res = await fetch(`${BASE_URL}/api/admin_teams_and_condition/display?adminId=${localStorage.getItem("admin_id")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
            const data = await res.json();
            console.log(data);
            if (data && data.data) {
                setTerms(data.data?.[0]?.values || "");
            } else {
                setMessage("Failed to fetch terms and conditions.");
                openErrorSB();
            }
        } catch (error) {
            setMessage("Error fetching terms and conditions.");
            openErrorSB();
            console.error("Error fetching terms:", error.message);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const handleSubmit = async () => {
        if (!terms) {
            setMessage("Please Enter Terms & Condition");
            openErrorSB();
            return;
        }

        const token = `Bearer ${localStorage.getItem("chemToken")}`;

        try {
            const response = await axios.put(
                `${BASE_URL}/api/admin_teams_and_condition/update?adminId=${localStorage.getItem("admin_id")}`,
                { values: terms },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            console.log(response.status);

            if (response.status === 200) {
                setMessage("Terms & Condition Updated Successfully");
                openSuccessSB();
            } else {
                setMessage("Failed to update Terms & Condition.");
                openErrorSB();
            }
        } catch (error) {
            setMessage("Error updating Terms & Condition.");
            openErrorSB();
            console.error("Error updating terms:", error.message);
        }
    };

    const style = {
        backgroundColor: "transparent",
        border: "1px solid black",
        borderRadius: "10px",
        width: "100%",
        padding: "10px 20px"
    };

    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    const editorConfig = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'selectAll',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'blockQuote',
                '|',
                'alignment',
                '|',
                'bulletedList',
                'numberedList',
                'indent',
                'outdent',
                '|',
                'accessibilityHelp'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            AccessibilityHelp,
            Alignment,
            Autosave,
            BlockQuote,
            Bold,
            Essentials,
            Heading,
            Indent,
            IndentBlock,
            Italic,
            List,
            Paragraph,
            SelectAll,
            Strikethrough,
            Underline,
            Undo
        ],
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <div>
                            <div className="main-container">
                                <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                                    <div className="editor-container__editor">
                                        <div ref={editorRef}>{isLayoutReady && <CKEditor
                                            data={terms} editor={ClassicEditor} config={editorConfig}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setTerms(data)
                                            }}
                                        />}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
                                Submit
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </MDBox>
            {renderSuccessSB}
            {renderErrorSB}
            <Footer />
        </DashboardLayout>
    );
}

export default Terms;
