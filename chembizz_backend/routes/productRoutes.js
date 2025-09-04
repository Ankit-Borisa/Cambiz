const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploads = require('../middleware/uploads');

// productRoutes.js
const { validateProduct } = require('../middleware/validationMiddleware');
const { verifyToken } = require('../middleware/generateAccessToken');
//const { verifyToken } = require('../middleware/generateAccessToken');




// Define product routes
router.post('/create', uploads.single('structure'), validateProduct, productController.createProduct);
router.put('/editProduct/:productId', uploads.single('structure'), productController.editProductById);
router.delete('/deleteProduct/:id', productController.deleteProductById);
router.get('/displayAllProducts', productController.displayAllProducts);
router.get('/getProductInfo/:productId', productController.getProductInfo);
router.get('/show/:CAS_number', productController.show);


router.get('/displayProduct/:id', productController.displayProductDetailsById);


//Company here
// Define product routes
router.post('/create', uploads.single('structure'), validateProduct, productController.createProducts);
router.put('/editProduct/:id', productController.editProductsById);
router.delete('/deleteProduct/:id', productController.deleteProductsById);
router.get('/displayAllProductsByCompany', productController.displayAllProduct);


router.get('/get/:productId', productController.getProductInfos);

router.get("/productDetails", productController.productDetailsById)

// router.get('/getProductInfo/:id',  productController.getProductInfo);
// router.get('/show/:CAS_number',   productController.show);

router.get("/displayAllProductWithoutToken", productController.displayAllProductWithoutToken)

router.get("/displayAllProductByPage", productController.displayAllProductByLoginPage)


// router.get('/displayProduct/:id',  productController.displayProductDetailsById);


// this route is for edit product details which are avilable in productByCompany and product .


router.patch("/editCompanyProduct/:productId",uploads.single('structure'),verifyToken,productController.editCompanyProduct);

module.exports = router;





// Create a new product with a single file upload


/*
Add Product (POST):
 
http://localhost:3000/api/product/addProduct


Edit Product (PUT):

http://localhost:3000/api/product/editProduct/:id


Delete Product (DELETE):
http://localhost:3000/api/product/deleteProduct/:id


Display All Products (GET):
http://localhost:3000/api/product/displayAllProducts

Display Product Details (GET):


http://localhost:3000/api/product/displayProduct/:id



router.post('/addProduct', upload.single('file'), productController.createProduct);
router.put('/editProduct/:id', productController.editProductById);
router.delete('/deleteProduct/:id', productController.deleteProductById);
router.get('/displayAllProducts', productController.displayAllProducts);
router.get('/displayProduct/:id', productController.displayProductDetailsById);


*/