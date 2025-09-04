/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Billing from "layouts/billing";

// @mui icons
import Icon from "@mui/material/Icon";
import Chemicals from "layouts/chemicallist/chemical";
import Editchemical from "layouts/chemicallist/editchemical";
import Addchemical from "layouts/chemicallist/addchemical";
import Company from "layouts/tables";
import EditCompanyStatus from "layouts/tables/Editstatus";
// import Employee from "layouts/employee";
import Addcertificate from "layouts/certificates/add-certificate";
import Editcertificate from "layouts/certificates/edit-certificate";
import Fulldetail from "layouts/profile";
import Changepassword from "layouts/change-password";
import Admins from "layouts/admins";
import Addadmin from "layouts/admins/Addadmin";
import Editadmin from "layouts/admins/Editadmin";
import Sellling from "layouts/selling";
import Sells from "layouts/selling-inquiry-details";
import Addcategory from "layouts/categories/add-category";
import Editcategory from "layouts/categories/edit-category";
import Addsubcategory from "layouts/subcategories/add-subcategory";
import Editsubcategory from "layouts/subcategories/edit-subcategory";
import Addgrade from "layouts/grade/add-subcategory";
import Editgrade from "layouts/grade/edit-subcategory";
import Inquiries from "layouts/Inquiries/Inquiries";
import Inquiry_detail from "layouts/inquiry detail/Inquiry-detail";
import Expiry from "layouts/Expiry/Expiry";
import Packages from "layouts/packages";
import ManageFeature from "layouts/feature";
import InsertPackage from "layouts/packages/insert";
import InsertMembershipFeature from "layouts/feature/insert";
import EditMembershipPackage from "layouts/feature/edit";
import EditPackage from "layouts/packages/edit";
import PoData from "layouts/poData";
import SalesData from "layouts/salesData";
import Terms from "layouts/term&condition/terms";
import Design from "layouts/design";
import AddDesign from "layouts/design/AddDesign";
import Suggested from "layouts/suggestedchemicals/chemical";
import EditSuggestedChemical from "layouts/suggestedchemicals/editsuggestedchemical";
import StandardTerms from "layouts/standardtermsandcondition/terms";
import PrivacyPolicies from "layouts/privacy-policy/privacy-policies";
import Blogs from "layouts/blog/blog";
import InsertBlog from "layouts/blog/AddBlog";
import PurchaseOrder from "examples/Podesign/Po";
import Messages from "layouts/messages";
import Demo from "layouts/demo";
import Subscriber from "layouts/subscriber";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AttachEmailOutlinedIcon from '@mui/icons-material/AttachEmailOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PurchaseOrderForm from "layouts/poData/PurchaseOrderForm";
import SalseOrderForm from "layouts/salesData/SalseOrderForm";
import PerformaInvoice from "layouts/salesData/PerformInvoice";


const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Admin List",
    key: "admin",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/admin",
    component: <Admins />,
  },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  {
    type: "collapse",
    name: "Chemicals List",
    key: "chemicals",
    icon: <Icon fontSize="small">science</Icon>,
    route: "/chemicals",
    component: <Chemicals />,
  },
  {
    type: "collapse",
    name: "Suggested Chemicals",
    key: "suggested-chemical",
    icon: <Icon fontSize="small">science</Icon>,
    route: "/suggested-chemical",
    component: <Suggested />,
  },
  {
    type: "collapse",
    name: "Company List",
    key: "company",
    icon: <Icon fontSize="small">apartment</Icon>,
    route: "/company",
    component: <Company />,
  },
  {
    type: "collapse",
    name: "Inquiries",
    key: "inquiries",
    icon: <Icon fontSize="small">quiz</Icon>,
    route: "/inquiries",
    component: <Inquiries />,
  },
  {
    type: "collapse",
    name: "Packages",
    key: "packages",
    icon: <Icon fontSize="small">book</Icon>,
    route: "/packages",
    component: <Packages />,
  },
  {
    type: "collapse",
    name: "packages features",
    key: "package-features",
    icon: <FileCopyIcon fontSize="small" />,
    route: "/package-features",
    component: <ManageFeature />,
  },
  {
    type: "collapse",
    name: "Po Data",
    key: "po-data",
    icon: <ShoppingCartIcon fontSize="small" />,
    route: "/po-data",
    component: <PoData />,
  },
  {
    type: "collapse",
    name: "Sales Data",
    key: "sales-data",
    icon: <ShowChartIcon fontSize="small" />,
    route: "/sales-data",
    component: <SalesData />,
  },
  {
    type: "collapse",
    name: "Expiry Days",
    key: "expiry",
    icon: <ThumbDownIcon fontSize="small" />,
    route: "/expiry-days",
    component: <Expiry />,
  },
  {
    type: "collapse",
    name: "Messages",
    key: "messages",
    icon: <EmailOutlinedIcon fontSize="small" />,
    route: "/messages",
    component: <Messages />,
  },
  {
    type: "collapse",
    name: "Demo",
    key: "demo",
    icon: <AttachEmailOutlinedIcon fontSize="small" />,
    route: "/demo",
    component: <Demo />,
  },
  {
    type: "collapse",
    name: "Terms & Condition",
    key: "Terms",
    icon: <Icon fontSize="small">gavel</Icon>,
    route: "/Terms-and-condition",
    component: <Terms />,
  },
  {
    type: "collapse",
    name: "privacy & policies",
    key: "privacy-policies",
    icon: <Icon fontSize="small">apartment</Icon>,
    route: "/privacy-policies",
    component: <PrivacyPolicies />,
  },
  {
    type: "collapse",
    name: "Blogs",
    key: "blogs",
    icon: <BurstModeIcon fontSize="small" />,
    route: "/blogs",
    component: <Blogs />,
  },
  {
    type: "collapse",
    name: "Subscriber",
    key: "subscriber",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/subscriber",
    component: <Subscriber />,
  },
  {
    type: "collapse",
    name: "Standard Terms & Condition",
    key: "Standard",
    icon: <Icon fontSize="small">apartment</Icon>,
    route: "/Standard-Term-and-condition",
    component: <StandardTerms />,
  },
  // {
  //   type: "collapse",
  //   name: "Categories",
  //   key: "categories",
  //   icon: <Icon fontSize="small">category</Icon>,
  //   route: "/category-list",
  //   component: <Categories />,
  // },
  // {
  //   type: "collapse",
  //   name: "Subcategories",
  //   key: "subcategories",
  //   icon: <Icon fontSize="small">category</Icon>,
  //   route: "/subcategory-list",
  //   component: <Subcategories />,
  // },
  // {
  //   type: "collapse",
  //   name: "Grade",
  //   key: "grade",
  //   icon: <Icon fontSize="small">grading</Icon>,
  //   route: "/grade-list",
  //   component: <Grade />,
  // },
  // {
  //   type: "collapse",
  //   name: "Employee",
  //   key: "employee",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/employee-list",
  //   component: <Employee />,
  // },
  // {
  //   type: "collapse",
  //   name: "Certificate List",
  //   key: "certificates",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/certificates",
  //   component: <Certificate />,
  // },
  {
    type: "collapse",
    name: "Change Password",
    key: "change-password",
    icon: <Icon fontSize="small">lockReset</Icon>,
    route: "/change-password",
    component: <Changepassword />,
  },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Out",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/sign-in",
  //   component: <SignIn />,
  // },
  {
    type: "routes",
    name: "chemicals",
    key: "insert-chemical",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/chemicals/insert-chemical",
    component: <Addchemical />,
  },
  {
    type: "collapse",
    name: "Design",
    key: "design",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/design",
    component: <Design />,
  },
  // {
  //   type: "collapse",
  //   name: "po",
  //   key: "po",
  //   icon: <Icon fontSize="small">add_box</Icon>,
  //   route: "/po",
  //   component: <PurchaseOrder />,
  // },
  {
    type: "routes",
    name: "Inquiry Detail",
    key: "inquiry-detail",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/inquiries/inquiry-detail/:_id",
    component: <Inquiry_detail />,
  },
  {
    type: "routes",
    name: "Edit Chemical",
    key: "edit-chemical",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/chemicals/edit-chemical/:_id",
    component: <Editchemical />,
  },
  {
    type: "routes",
    name: "Edit Company",
    key: "edit-company",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/edit-company/:_id",
    component: <EditCompanyStatus />,
  },
  {
    type: "routes",
    name: "Edit Suggested Chemical",
    key: "edit-suggested-chemical",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/chemical/edit-suggested-chemical/:_id",
    component: <EditSuggestedChemical />,
  },
  {
    type: "routes",
    name: "Add Certificate",
    key: "add-certificate",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/add-certificate",
    component: <Addcertificate />,
  },
  {
    type: "routes",
    name: "Edit Certificate",
    key: "edit-certificate/:_id",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/edit-certificate/:_id",
    component: <Editcertificate />,
  },
  {
    type: "routes",
    name: "Company Full Detail",
    key: "company-full-detail",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/company-full-detail/:_id",
    component: <Fulldetail />,
  },
  {
    type: "routes",
    name: "Add Admin",
    key: "add-admin",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/add-admin",
    component: <Addadmin />,
  },
  {
    type: "routes",
    name: "Edit Admin",
    key: "edit-admin",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/edit-admin/:_id",
    component: <Editadmin />,
  },
  {
    type: "routes",
    name: "Selling Inquiry",
    key: "selling-inquiry-details",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/selling-inquiry-details",
    component: <Sellling />,
  },
  {
    type: "routes",
    name: "Selling Inquiry",
    key: "selling-inquiry-details",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/selling-inquiry-detail/:companyId/:catalogId",
    component: <Sells />,
  },
  {
    type: "routes",
    name: "Add Category",
    key: "add-category",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/add-category",
    component: <Addcategory />,
  },
  {
    type: "routes",
    name: "Edit Category",
    key: "edit-category",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/edit-category/:_id",
    component: <Editcategory />,
  },
  {
    type: "routes",
    name: "Add Subategory",
    key: "add-subcategory",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/add-subcategory",
    component: <Addsubcategory />,
  },
  {
    type: "routes",
    name: "Edit Subcategory",
    key: "edit-subcategory",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/edit-subcategory/:_id",
    component: <Editsubcategory />,
  },
  {
    type: "routes",
    name: "Add Grade",
    key: "add-grade",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/add-grade",
    component: <Addgrade />,
  },
  {
    type: "routes",
    name: "Edit Grade",
    key: "edit-grade",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/edit-grade/:_id",
    component: <Editgrade />,
  },
  {
    type: "routes",
    name: "Insert Package",
    key: "insert-package",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/insert-package",
    component: <InsertPackage />,
  },
  {
    type: "routes",
    name: "Insert Package Featured",
    key: "insert-package-featured",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/insert-package-featured",
    component: <InsertMembershipFeature />,
  },
  {
    type: "routes",
    name: "Edit Package Featured",
    key: "edit-package-featured",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/edit-package-featured/:_id",
    component: <EditMembershipPackage />,
  },
  {
    type: "routes",
    name: "Edit Package ",
    key: "edit-package",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/edit-package/:_id",
    component: <EditPackage />,
  },
  {
    type: "routes",
    name: "Add Design ",
    key: "add-design",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/add-design",
    component: <AddDesign />,
  },
  {
    type: "routes",
    name: "insert blog ",
    key: "insert-blog",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/insert-blog",
    component: <InsertBlog />,
  },
  {
    type: "routes",
    name: "Po Detail",
    key: "po-detail",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/po-detail/:_id",
    component: <PurchaseOrderForm />,
  },
  {
    type: "routes",
    name: "Salse Detail",
    key: "salse-detail",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/performa-invoice-detail/:_id",
    component: <SalseOrderForm />,
  },
  {
    type: "routes",
    name: "Salse Detail",
    key: "salse-detail",
    icon: <Icon fontSize="small">add_box</Icon>,
    route: "/salse-detail/:_id",
    component: <PerformaInvoice />,
  },
];

export default routes;
