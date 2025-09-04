import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) =>
    createStyles({
        messageRow: {
            display: "flex",
        },
        messageRowRight: {
            display: "flex",
            justifyContent: "flex-end"
        },
        displyFlex: {
            display: "flex",
            alignItems: "center",
            gap: "20px"
        },
        messageBlue: {
            position: "relative",
            marginLeft: "20px",
            marginBottom: "10px",
            padding: "10px 25px",
            backgroundColor: "gainsboro",
            width: "60%",
            textAlign: "left",
            font: "400 .9em 'Open Sans', sans-serif",
            // border: "1px solid #97C6E3",
            borderRadius: "10px",
            "&:after": {
                content: "''",
                position: "absolute",
                width: "0",
                height: "0",
                borderTop: "15px solid gainsboro",
                borderLeft: "15px solid transparent",
                borderRight: "15px solid transparent",
                top: "0",
                left: "-15px"
            },
            "&:before": {
                content: "''",
                position: "absolute",
                width: "0",
                height: "0",
                // borderTop: "17px solid #97C6E3",
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
                top: "-1px",
                left: "-17px"
            }
        },
        messageOrange: {
            position: "relative",
            marginRight: "20px",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "gainsboro",
            width: "60%",
            textAlign: "left",
            font: "400 .9em 'Open Sans', sans-serif",
            // border: "1px solid #dfd087",
            borderRadius: "10px",
            "&:after": {
                content: "''",
                position: "absolute",
                width: "0",
                height: "0",
                borderTop: "15px solid gainsboro",
                borderLeft: "15px solid transparent",
                borderRight: "15px solid transparent",
                top: "0",
                right: "-15px"
            },
            "&:before": {
                content: "''",
                position: "absolute",
                width: "0",
                height: "0",
                // borderTop: "17px solid #dfd087",
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
                top: "-1px",
                right: "-17px"
            }
        },

        messageContent: {
            margin: 0,
            lineHeight: "22px",
            fontSize: "14px"
        },
        messageTimeStampRight: {
            position: "absolute",
            fontSize: "10px",
            fontWeight: "300",
            marginTop: "10px",
            bottom: "-6px",
            right: "5px",
            marginBottom: "10px",
            textAlign: "end"
        },

        orange: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500],
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
        avatarNothing: {
            color: "transparent",
            backgroundColor: "transparent",
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
        displayName: {
            marginLeft: "20px",
            fontWeight: "700",
            fontSize: "14px"
        },
        displayImage: {
            marginLeft: "20px",
            fontWeight: "700",
            fontSize: "14px"
        },
        messageBgSet: {
            position: "relative",
            marginLeft: "20px",
            marginBottom: "10px",
            // padding: "10px 25px",
            padding: "10px 0px",
            backgroundColor: "gainsboro",
            width: "310px",
            textAlign: "left",
            font: "400 .9em 'Open Sans', sans-serif",
            // border: "1px solid #97C6E3",
            borderRadius: "10px",
        },
        cancelCard: {
            width: "310px",
            padding: "0px 15px"
        },
        cancelCardFirstP: {
            fontSize: "10px"
        },
        cancelCardSecondP: {
            fontSize: "14px",
            textAlign: "end",
            fontWeight: "600",
            borderBottom: "1px solid black",
            paddingBottom: "7px",
            marginBottom: "4px"
        },
        cancelCardThirdP: {
            fontSize: "10px",
            textAlign: "end",
            paddingBottom: "7px"
        },
        cancelGroup: {
            fontSize: "16px",
            textAlign: "end",
            paddingBottom: "7px"
        },
        cancelBtn: {
            fontSize: "18px",
            backgroundColor: "transparent",
            border: "1px solid black",
            borderRadius: "10px",
            padding: "10px 0px",
            width: "100%"
        },
        approvedBtn: {
            fontSize: "18px",
            backgroundColor: "black",
            
            color: "white",
            border: "1px solid black",
            borderRadius: "10px",
            padding: "10px 0px",
            width: "100%"
        }

    })
);

export const MessageLeft = (props) => {
    const message = props.message ? props.message : "no message";
    const timestamp = props.timestamp ? props.timestamp : "";
    const photoURL = props.photoURL ? props.photoURL : "dummy.js";
    const displayName = props.displayName ? props.displayName : "whySOserious";
    const classes = useStyles();
    return (
        <>
            <div>
                <div className={classes.messageRow}>
                    <Avatar
                        alt={displayName}
                        className={classes.orange}
                        src={photoURL}
                    ></Avatar>
                    <div>
                        <div className={classes.displayName}>{displayName}</div>
                        <div className={classes.messageBlue}>
                            <div className="py-2">
                                <p className={classes.messageContent}>{message}</p>
                            </div>
                            <div className={classes.messageTimeStampRight}>{timestamp}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const MessageRight = (props) => {
    const classes = useStyles();
    const message = props.message ? props.message : "no message";
    const timestamp = props.timestamp ? props.timestamp : "";
    const photoURL = props.photoURL ? props.photoURL : "dummy.js";
    const displayName = props.displayName ? props.displayName : "whySOserious";
    return (
        <>
            <div>
                <div className={classes.messageRowRight}>
                    <span>
                        <div className={classes.displyFlex}>
                            <div className={classes.displayImage}>{displayName}</div>
                            <Avatar
                                alt={displayName}
                                className={classes.orange}
                                src={photoURL}
                            ></Avatar>
                        </div>
                        <div className={classes.messageOrange}>
                            <p className={classes.messageContent}>{message}</p>
                            <div className={classes.messageTimeStampRight}>{timestamp}</div>
                        </div>
                    </span>
                </div>
            </div>
        </>
    );
};
