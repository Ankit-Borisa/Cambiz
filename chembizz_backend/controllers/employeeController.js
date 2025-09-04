const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');




const addEmployee = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Proceed to add inquiry if the user has the required role
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    const { company_id, employee_name, designation, emailid, mobile_no, password, status } = req.body;

    // Check if required fields are missing
    if (!company_id || !employee_name || !designation || !emailid || !mobile_no || !password) {
      return res.status(400).json({ error: 'required fields are missing' });
    }



    // Create a new employee with the provided data
    const newEmployee = new Employee({
      company_id,
      employee_name,
      designation,
      emailid,
      mobile_no,
      password, // Store the hashed password
      status,
    });

    // Save the new employee
    const savedEmployee = await newEmployee.save();

    // Omit the password from the response for security reasons
    const employeeResponse = {
      _id: savedEmployee._id,
      company_id: savedEmployee.company_id,
      employee_name: savedEmployee.employee_name,
      designation: savedEmployee.designation,
      emailid: savedEmployee.emailid,
      mobile_no: savedEmployee.emailmobile_noid,
      password: savedEmployee.password,
      status: savedEmployee.status,
    };

    // Send the saved employee in the response
    res.status(201).json({
      success: true,
      message: 'employee added successfully',
      employee: employeeResponse
    });

    // res.status(201).json({ employee: employeeResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Proceed to add inquiry if the user has the required role
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    const employees = await Employee.find();
    res.status(200).json({
      success: true,
      message: 'all employees retrieved successfully!',
      employees: employees,
    });
    //res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeeDetails = async (req, res) => {
  const { employeeId } = req.params;
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Proceed to add inquiry if the user has the required role
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'employee not found' });
    }

    res.status(200).json({
      success: true,
      message: 'employee details retrieved successfully',
      employee: employee
    });

    // res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Function to edit employee data and change status
const editEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { status, ...updatedData } = req.body;

  // Validate the status
  if (status && status !== 'active' && status !== 'inactive') {
    return res.status(400).json({
      success: false,
      message: 'invalid status. Status must be either "active" or "inactive".',
    });
  }

  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Proceed to edit employee data if the user has the required role
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'employee not found' });
    }

    // Update employee data if any fields are provided
    if (Object.keys(updatedData).length > 0) {
      Object.assign(employee, updatedData);
      await employee.save();
    }

    // Update the status if it has changed
    if (status && employee.status !== status) {
      employee.status = status;
      await employee.save();
    }

    // Fetch the updated employee data to include all fields
    const updatedEmployee = await Employee.findById(employeeId);

    res.status(200).json({
      success: true,
      message: 'employee data updated successfully!',
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





//Company start here

const addEmployees = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the provided company_id matches the company ID in the token
    // if (decodedToken.companyId !== req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access to add employee for this company' });
    // }

    const { employee_name, designation, emailid, mobile_no, password, status } = req.body;

    // Check if required fields are missing
    if (!employee_name || !designation || !emailid || !mobile_no || !password) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Use bcrypt to hash the password before storing it

    // Create a new employee with the provided data
    const newEmployee = new Employee({
      company_id: decodedToken.companyId,
      employee_name,
      designation,
      emailid,
      mobile_no,
      password,
      status,
    });

    // Save the new employee
    const savedEmployee = await newEmployee.save();

    // Omit the password from the response for security reasons
    const employeeResponse = {
      _id: savedEmployee._id,
      company_id: savedEmployee.company_id,
      employee_name: savedEmployee.employee_name,
      designation: savedEmployee.designation,
      emailid: savedEmployee.emailid,
      mobile_no: savedEmployee.emailmobile_noid,
      password: savedEmployee.password,
      status: savedEmployee.status,
    };

    // Send the saved employee in the response
    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee: employeeResponse
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAllEmployeess = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the provided company_id matches the company ID in the token
    // if (req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access to add employee for this company' });
    // }


    const employees = await Employee.find({ company_id: decodedToken.companyId }); // Retrieve employees belonging to the requesting company only

    res.status(200).json({
      success: true,
      message: 'All employees retrieved successfully!',
      employees: employees,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getEmployeeDetailss = async (req, res) => {
  const { employeeId } = req.params;
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the provided company_id matches the company ID in the token
    // if (req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access to add employee for this company' });
    // }


    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(200).json({ message: 'employee not available' });
    }

    res.status(200).json({
      success: true,
      message: 'employee details retrieved successfully',
      employee: employee
    });

    // res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Function to edit employee data and change status
const editEmployees = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the user's role is 'company'
    if (decodedToken.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Check if the provided company_id matches the company ID in the token
    // if (req.body.company_id) {
    //   return res.status(403).json({ success: false, message: 'Unauthorized access to add employee for this company' });
    // }

    const { employeeId } = req.params;
    const { status, ...updatedData } = req.body;

    // Validate the status
    if (status && status !== 'active' && status !== 'inactive') {
      return res.status(400).json({
        success: false,
        message: 'invalid status. Status must be either "active" or "inactive".',
      });
    }
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'employee not found' });
    }

    // Update employee data if any fields are provided
    if (Object.keys(updatedData).length > 0) {
      Object.assign(employee, updatedData);
      await employee.save();
    }

    // Update the status if it has changed
    if (status && employee.status !== status) {
      employee.status = status;
      await employee.save();
    }

    // Fetch the updated employee data to include all fields
    const updatedEmployee = await Employee.findById(employeeId);

    res.status(200).json({
      success: true,
      message: 'employee data updated successfully!',
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  addEmployee: [verifyToken, addEmployee],
  getAllEmployees: [verifyToken, getAllEmployees],
  getEmployeeDetails: [verifyToken, getEmployeeDetails],
  editEmployee: [verifyToken, editEmployee],

  //Company start here
  addEmployees: [verifyToken, addEmployees],
  getAllEmployeess: [verifyToken, getAllEmployeess],
  getEmployeeDetailss: [verifyToken, getEmployeeDetailss],
  editEmployees: [verifyToken, editEmployees],
  verifyAccessToken, // Added JWT verification middleware
};


