// validationSchemas.js
const Joi = require('joi');

const superadminSchema = Joi.object({
  // Define schema for Superadmin validation
  username: Joi.string().required(),
  password: Joi.string().min(3).required(),
  newPassword: Joi.string(), // Allow newPassword field
  // Add other Superadmin-specific validations
});

const validateSuperadmin = (superadminData) => {
  return superadminSchema.validate(superadminData);
};

const adminSchema = Joi.object({
  // Define schema for Admin validation
  username: Joi.string().required(),
  password: Joi.string().min(3).required(),
  fullname: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
  // Add other Admin-specific validations
});

const validateAdmin = (adminData) => {
  return adminSchema.validate(adminData);
};

const productSchema = Joi.object({
  // Define schema for Product validation
  //name: Joi.string().min(3).max(50).required(),
  CAS_number: Joi.string(),
  name_of_chemical: Joi.string().required(),
  structure: Joi.string().valid('photo').allow(''), // Assuming 'photo' is a placeholder for a valid photo format
  molecularFormula: Joi.string().required(),
  mol_weight: Joi.string().required(),
  synonums: Joi.string(),
  status: Joi.string().valid('active', 'inactive').required(),
  IUPAC_name: Joi.string(),
  Appearance: Joi.string().required(),
  storage: Joi.string(),
  pc_id: Joi.string(),
  p_url: Joi.string().allow('')

});

const validateProduct = (productData) => {
  return productSchema.validate(productData);
};






const employeeValidationSchema = Joi.object({
  employee_name: Joi.string().required(),
  designation: Joi.string().required(),
  emailid: Joi.string().required(),
  mobile_no: Joi.string().required(),
  password: Joi.string().custom((value, helpers) => {
    // Custom validation for password
    if (!value) {
      // If password is not provided, generate a default password using RAND function + datetime
      const randomString = Math.random().toString(36).slice(2);
      const datetimeString = new Date().toISOString().replace(/[-T:\.Z]/g, '');
      return randomString + datetimeString;
    }

    // Return the original password if provided
    return value;
  }),
  status: Joi.string().valid('active', 'inactive').default('active'),
});





const catalogSchema = Joi.object({
  product_id: Joi.string().required(),
  category: Joi.string().required(),
  subcategory: Joi.string().allow(''),
  grade: Joi.allow(''),
  COA: Joi.string().valid('pdf'), // Assuming COA is a URL
  min_price: Joi.number().required(),
  hsn_code: Joi.string().required(),
  max_price: Joi.number().required(),
  qty: Joi.number().required(),
  qty_type: Joi.string().valid('mg', 'gm', 'kg').required(),
  active_chemicals: Joi.string().valid('active', 'inactive').required(),
  status: Joi.string().valid('active', 'inactive').required(),
  country_origin: Joi.string().required(),
  supply_capacity: Joi.string().required(),
  purity: Joi.string().required(),
  one_lot_qty: Joi.number().required(),
  one_lot_qty_type: Joi.string().valid('mg', 'gm', 'kg').required(),
  one_lot_qty_price: Joi.number().required(),
  max_lot_qty: Joi.number().required(),
  sample_price: Joi.number().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date()
});






const documentsSchema = Joi.object({
  company_id: Joi.string(),
  certificate_name: Joi.string().required(),
  certificate_no: Joi.string().required(),
  issue_date: Joi.date().required(),
  valid_till: Joi.date().required(),
  status: Joi.string().valid('pending', 'active', 'inactive').required(),
  //doc_file: Joi.string().valid('pdf','png').required()  // Assuming 'pdf' is a placeholder for a valid PDF format
  doc_file: Joi.string().valid('pdf').allow(''),

});





// Define Joi validation schema for Certificate
const certificateSchema = Joi.object({
  certificate_name: Joi.string().required(),
});



// // Joi validation schema for Category
const categorySchema = Joi.object({
  category_name: Joi.string().required()
});


const gradeSchema = Joi.object({
  grade_name: Joi.string().required(),
  category_id: Joi.string().required()
});




// // Joi validation schema for subcategory
const subcategorySchema = Joi.object({
  subcategory_name: Joi.string().required(),
  category_id: Joi.string().required(),
  createdAt: Joi.date().default(Date.now()),
  updatedAt: Joi.date().default(Date.now())
});



const companySchema = Joi.object({
  company_name: Joi.string().required(),
  gst: Joi.string().required(),
  contact_person_name: Joi.string().required(),
  address: Joi.string().required(),
  landline_num: Joi.string().allow(''),
  mobile_num: Joi.string().required(),
  emailid: Joi.string().email().required(),
  mode_of_business: Joi.array().items(Joi.string().valid('manufacture', 'trader')), // Accept only two valid values for mode_of_business
  password: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  pincode: Joi.string().length(6).required(), // Enforce pincode to be exactly 6 digits
  status: Joi.string().valid('active', 'inactive').default('active'),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
});


// Define Joi schema for company other info
const companyOtherInfoSchema = Joi.object({
  company_id: Joi.string(),
  logo: Joi.string().valid('photo').allow(''),
  banner: Joi.string().valid('photo').allow(''),
  website: Joi.string().allow(''),
  other_emailid: Joi.string().allow(''),
  other_contactno: Joi.string().allow(''),
  fb: Joi.string().allow(''),
  insta: Joi.string().allow(''),
  twitter: Joi.string().allow(''),
  linkedin: Joi.string().allow(''),
});



const inquirySchema = Joi.object({
  buyer_company_id: Joi.string(),
  seller_company_id: Joi.string().required(),
  inq_type: Joi.string().valid('commercial', 'sample inquiry').required(),
  product_id: Joi.string().required(),
  category: Joi.string().required(),
  subcategory: Joi.string().allow(''),
  grade: Joi.string().allow(''),
  country_origin: Joi.string().required(),
  supply_capacity: Joi.number().required(),
  purity: Joi.string().required(),
  inquiry_qty: Joi.number(),
  qty_type: Joi.string().valid('mg', 'gm', 'kg'),
  status: Joi.string(),
  COA: Joi.string(),
  hsn_code: Joi.string(),
  min_price: Joi.number(),
  max_price: Joi.number(),
  one_lot_qty: Joi.number(),
  one_lot_qty_type: Joi.string(),
  one_lot_qty_price: Joi.number(),
  payment_status: Joi.string().valid('pending', 'paid', 'reject'),
  payment_type: Joi.string(),
  total_lot: Joi.number(),
  inco_terms: Joi.string(),
  payment_terms: Joi.string().valid("Advance", "Immediate", "15 Days Credit", "30 Days Credit", "45 Days Credit"),
  delivery_time: Joi.string(),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
});



const bankDetailsSchema = Joi.object({
  bank_name: Joi.string().required(),
  account_number: Joi.string().required(),
  branch_code: Joi.string().allow(''),
  IFSC_code: Joi.string().required(),
  country: Joi.string().required(),
  branch_address: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  pinCode: Joi.string().length(6).required(),
  status: Joi.string(),
  // Define cancel_cheque_photo as a string representing the path or URL of the photo
  cancel_cheque_photo: Joi.string().valid('photo'),
  company_id: Joi.string(),
});





const billingAddressSchema = Joi.object({
  bill_to_address: Joi.string(),
  bill_to_country: Joi.string(),
  bill_to_state: Joi.string(),
  bill_to_city: Joi.string(),
  bill_to_pin: Joi.string().length(6),
  ship_to_address: Joi.string(),
  ship_to_country: Joi.string(),
  ship_to_state: Joi.string(),
  ship_to_city: Joi.string(),
  ship_to_pin: Joi.string().length(6),
  datetime: Joi.date().default(Date.now),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
});


// Define Joi validation schema
const addressSchema = Joi.object({
  addressType: Joi.string().valid('bill_to', 'ship_to').required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  pincode: Joi.number().required(),
  companyId: Joi.string().required()
});


module.exports = {
  superadminSchema,
  adminSchema,
  productSchema,
  employeeValidationSchema,
  documentsSchema,
  certificateSchema,
  catalogSchema,
  categorySchema,
  // gradeSchema,ctSchema,
  employeeValidationSchema,
  documentsSchema,
  certificateSchema,
  // categorySchema,
  gradeSchema,
  subcategorySchema,
  companySchema,
  companyOtherInfoSchema,
  inquirySchema,
  bankDetailsSchema,
  billingAddressSchema,
  addressSchema



};