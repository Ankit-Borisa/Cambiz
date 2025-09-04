import React from 'react';
import { Stepper, Step, StepLabel, Typography, Box } from '@mui/material';

const StatusProgress = ({ statuses }) => {

    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    };

    return (
        <Box>
            <Stepper alternativeLabel activeStep={statuses?.length - 1}>
                {statuses && statuses.map((statusObj, index) => (
                    <Step key={index}>
                        <StepLabel>
                            {statusObj.status}
                            <Typography variant="caption" display="block">
                                {formatDate(statusObj.dateAndTime)}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default StatusProgress;
