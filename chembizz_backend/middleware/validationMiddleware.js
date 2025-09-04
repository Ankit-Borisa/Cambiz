const Joi = require('joi');

// validationMiddleware.js
const { superadminSchema, adminSchema, gradeSchema, productSchema, subcategorySchema, employeeValidationSchema, catalogSchema, documentsSchema, certificateSchema, companySchema, companyOtherInfoSchema, categorySchema, inquirySchema, bankDetailsSchema, billingAddressSchema, addressSchema } = require('./validationSchemas');
//documentsValidationSchema
// categorySchema, gradeSchema, subcategorySchema,
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}












////////////////////////////
const validatecertificate = validate(certificateSchema);
const validateSuperadmin = validate(superadminSchema);
const validateAdmin = validate(adminSchema);
const validateProduct = validate(productSchema);
const validateDocuments = validate(documentsSchema);
const validateCategory = validate(categorySchema);
const validateSubCategorySchema = validate(subcategorySchema);

const validateGrade = validate(gradeSchema);
const validatecompany = validate(companySchema);
const validatecompanyOtherInfo = validate(companyOtherInfoSchema);
const validateinquiry = validate(inquirySchema);
const validatebankDetails = validate(bankDetailsSchema);
const validatebillingAddress = validate(billingAddressSchema);
const validateaddress = validate(addressSchema);


const validateEmployee = validate(employeeValidationSchema);
const validateCatalog = validate(catalogSchema); // Renamed to avoid conflict
//const validateDocuments = validate(documentsValidationSchema);

module.exports = {
  validateSuperadmin,
  validateAdmin,
  validateProduct,
  validateEmployee,
  validateCatalog,
  validatecertificate,
  validateDocuments,
  validateCategory,
  validateGrade,
  validateSubCategorySchema,
  validatecompany,
  validatecompanyOtherInfo,
  validateinquiry,
  validatebankDetails,
  validatebillingAddress,
  validateaddress
};
