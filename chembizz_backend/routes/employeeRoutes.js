const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
 
const { validateEmployee } = require('../middleware/validationMiddleware');

//const { verifyToken } = require('../middleware/generateAccessToken');

// Display all employees
router.get('/employees',  employeeController.getAllEmployees);


// Display employee details
router.get('/employees/:employeeId',  employeeController.getEmployeeDetails);

// Add a new employee
//router.post('/employees', employeeController.addEmployee);
router.post('/employees', validateEmployee,  employeeController.addEmployee);


// Edit employee details and change status
router.put('/employees/:employeeId',  employeeController.editEmployee);

////////////////////////////////////////////////////////////////////////////////
//Company start here

// Add a new employee
//router.post('/employees', employeeController.addEmployee);
router.post('/employeess', validateEmployee,  employeeController.addEmployees);
// Display all employees
router.get('/employeess',  employeeController.getAllEmployeess);
// Display employee details
router.get('/employeess/:employeeId',  employeeController.getEmployeeDetailss);
// Edit employee details and change status
router.put('/employeess/:employeeId',  employeeController.editEmployees);

module.exports = router;


