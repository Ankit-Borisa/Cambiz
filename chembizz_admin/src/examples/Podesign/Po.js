import React from 'react';
import {
    Button,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Divider,
} from '@mui/material';

const PurchaseOrder = () => {
    return (
        <Card style={{ margin: '20px', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
                <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    Purchase Order
                </Typography>
                <Divider style={{ marginBottom: '20px' }} />
                <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Typography variant="body1">Order #12345</Typography>
                    <Typography variant="body1">Date: 01/01/2024</Typography>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Item 1</TableCell>
                                <TableCell align="right">1</TableCell>
                                <TableCell align="right">$100</TableCell>
                                <TableCell align="right">$100</TableCell>
                            </TableRow>
                            {/* Add more rows as needed */}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">$100</Typography>
                </Box>
                <Divider style={{ margin: '20px 0' }} />
                <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
                        Approve
                    </Button>
                    <Button variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PurchaseOrder;
