const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const superAdminRoutes = require('./routes/superAdminRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const certificateRoutes = require('./routes/certificatesRouter')
const companyRoutes = require('./routes/company')
const companyotherinfoRoutes = require('./routes/company_otherinfo')
const inquiryRoutes = require('./routes/inquiryRoutes')
const bank_detailsRoutes = require('./routes/bank_detailsRoutes')
const Billing_addressRoutes = require('./routes/Billing_addressRoutes')
const stampRouters = require("./routes/stampRouter")
const expireRouter = require("./routes/expireRouter")
const employeeRoutes = require('./routes/employeeRoutes');
//const documentsRoutes = require('./routes/documentsRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const membership_plan_router = require("./routes/membership_plan_router")
const documentsRoutes = require('./routes/documentsRoutes'); // Adjust the path
const categoryRouter = require('./routes/categoryRouter');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const membership_feature_router = require("./routes/membership_feature_router")
const bookingRouter = require("./routes/bookingRouter")
const chatRouter = require("./routes/chatRouter");
const notificationRouter = require("./routes/notificationRouter")
const salesInvoiceRouter = require("./routes/salesRouter")
const teamsAndConditionRouter = require("./routes/terms_and_conditionsRouter")
const adminTeamsAndConditionRouter = require("./routes/admin_terms_and_condition")
const companyAddressRouter = require("./routes/company_address_router");
const designRouter = require("./routes/designRouter")
const myDesignRouter = require("./routes/myDesignRouter");
const package_booking_router = require("./routes/package_booking_router")
const productByCompanyRouter = require("./routes/productByCompanyRouter")
const standard_terms_and_condition_router = require("./routes/standard_terms_and_condition_router")
const messageRouter = require("./routes/message.routes")
const otpRouter = require("./routes/otpRouter")
const inquiry_status_router = require("./routes/inquiry_status_router")
const payment_router = require("./routes/payment_routes")
const return_order_router = require("./routes/return_order_router")
const request_demo_router = require("./routes/request_demo_router")
const contact_message_router = require("./routes/contact_message_router")
const subscriber_router = require("./routes/subscriber_router");
const transaction_router = require("./routes/transaction_router")
const blogRouter = require("./routes/blog_router")
const privacyPolicyRouter = require("./routes/privacy_policy_router")
const publicRouter = require("./routes/public.routes")
const gstRouter = require("./routes/gst.routes")
// const gradeRoutes = require('./routes/gradeRoutes');



// const uploadMiddleware = require('./middleware/coa'); // Adjust the path
// const upload = require('./middleware/upload'); // Adjust the path
// const uploads = require('./middleware/uploads'); // Adjust the path

//const {  generateAccessToken,  verifyAccessToken,  verifyToken } = require('./middleware/generateAccessToken');

// Import validation middleware
const { validateSuperadmin, validateAdmin, validateProduct, validateEmployee, validateCatalog, validatecertificate, validateDocuments, validateCategory, validateGrade, validateSubCategorySchema, validatecompany, validatecompanyOtherInfo, validateinquiry, validatebankDetails, validatebillingAddress } = require('./middleware/validationMiddleware');
const myDesign = require('./models/myDesign');

const {daysCountCron} = require('./cronJobs/daysCountIncrementer')

dotenv.config();
// const app = express();

const { app, server } = require("./socket/socket")

const dbURI = process.env.DB_URI; // Read MongoDB connection URI from environment variable

// Connect to MongoDB with additional options
mongoose.connect(dbURI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(4000);
    daysCountCron();
  })
  .catch((err) => console.error(err));

const db = mongoose.connection;

db.on('error', (err) => {
  console.log(err);
});

db.once('open', () => {
  console.log('Database Connection Established!');
});




// Middleware

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(['/uploads', "upload",'/coa'], express.static('uploads'));
//app.use('/uploads', express.static('uploads'));
//app.use('/coa', express.static('coa'));
app.use('/upload', express.static('upload'));
app.use('/uploads', express.static('uploads'));
app.use('/', express.static('uploadss'));
app.use('/', express.static('blog'));
// app.use('/coa', express.static('coa'));
app.use('/docs', express.static('docs'));
app.use('/coa_inquiry', express.static('coa_inquiry'));
app.use("/", express.static('public/image/stampImage'))
app.use("/", express.static('public/image/salesUploadPdf'))
app.use("/", express.static('public/image/design'))
app.use("/", express.static('public/image/coa'))
app.use('/cancel_cheque_photo', express.static('cancel_cheque_photo'));

const allowedOrigins = [
  "http://localhost:5173",
  "https://chembizz.in",
  "https://www.chembizz.in",
  "https://adminchembizz.netlify.app",
  "https://admin.chembizz.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);




// // Example routes
// app.post('/superadmin', validateSuperadmin, (req, res) => {
//   // Handle Superadmin route
//   res.json({ message: 'superadmin validated successfully' });
// });

// app.post('/admin', validateAdmin, (req, res) => {
//   // Handle Admin route
//   res.json({ message: 'admin validated successfully' });
// });



// Routes
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/product', productRoutes);
app.use('/api/productByCompany', productByCompanyRouter);
app.use('/api', employeeRoutes);
app.use('/api', catalogRoutes);
// app.use('/api', gradeRoutes);
app.use('/api/stamp', stampRouters)
app.use('/api/expire', expireRouter)
app.use('/api/certificate', certificateRoutes);
app.use('/company', companyRoutes)
app.use('/api', companyotherinfoRoutes)
app.use('/api/documents', documentsRoutes)
app.use('/api/category', categoryRouter)
app.use('/api/subcategory', subcategoryRoutes)
app.use('/api/inquiryRoutes', inquiryRoutes)
app.use('/api/bank_details', bank_detailsRoutes)
app.use('/api/Billing_address', Billing_addressRoutes)
app.use("/api/membership_feature", membership_feature_router)
app.use('/api/membership_plan', membership_plan_router);
app.use('/api/booking', bookingRouter)
app.use('/api/chat', chatRouter)
app.use('/api/notification', notificationRouter);
app.use('/api/salesInvoice', salesInvoiceRouter)
app.use('/api/teams_and_condition', teamsAndConditionRouter)
app.use('/api/admin_teams_and_condition', adminTeamsAndConditionRouter);
app.use("/api/company_address", companyAddressRouter)
app.use("/api/design", designRouter);
app.use("/api/myDesign", myDesignRouter);
app.use("/api/package_booking", package_booking_router)
app.use("/api/standard_terms_and_condition", standard_terms_and_condition_router)
app.use("/api/message", messageRouter)
app.use("/api/otp", otpRouter)
app.use("/api/inquiry_status", inquiry_status_router)
app.use("/api/payment", payment_router)
app.use("/api/return_order", return_order_router)
app.use("/api/request_demo", request_demo_router)
app.use("/api/contactMessage", contact_message_router)
app.use("/api/subscriber", subscriber_router)
app.use("/api/transaction", transaction_router)
app.use("/api/blog", blogRouter)
app.use("/api/privacy_policy", privacyPolicyRouter)
app.use("/api/public",publicRouter)
app.use("/api/gst",gstRouter)

// Welcome message
app.get('/', (req, res) => {
  res.send('welcome to the chembizz system!');
});

// Sample protected route (removed authentication middleware)
app.get('/protected', (req, res) => {
  res.json({
    success: true,
    message: 'you have access to this protected route!',
    user: req.user,
  });
});

// app.post('/product', validateProduct, (req, res) => {
//   // Handle Product route
//   res.json({ message: 'product validated successfully' });
// });

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'not found: the requested resource does not exist.',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: 'internal server error',
    error: err.message,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT,"0.0.0.0",() => {
  console.log(`server is running on port ${PORT}`);
});
