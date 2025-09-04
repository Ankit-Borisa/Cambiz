import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CreateNewPassword from "./pages/CreateNewPassword";
import OtpVerification from "./pages/OtpVerification";
import AdminPage from "./pages/AdminPage";
import Pricing from "./pages/Pricing";
import BuyList from "./pages/BuyList";
import CompanyProfile from "./pages/CompanyProfile";
import ChemicalDetail from "./pages/Chemicaldetail";
import DashBoard from "./components/DashBoard";
import Employees from "./components/Employees";
import MyDocuments from "./components/MyDocuments";
import MyCataLog from "./components/MyCataLog";
import ChangePassword from "./components/Changepassword";
import Addchemical from "./components/Addchemical";
import Message from "./components/Message";
import Payment from "./pages/Payment";
import Payment2 from "./pages/Payment2";
import Invoice1 from "./components/Invoice1";
import Invoice2 from "./components/Invoice2";
import Invoice3 from "./components/Invoice3";
import { ActiveContextProvider } from "./context/ActiveLink";
import TermsCondition from "./pages/Terms&Condition";
import PrivacyPolicies from "./pages/PrivacyPolicies";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";

import PlanGuard from "./context/PlanGuard"


function App() {
  return (
    <BrowserRouter>
      <ActiveContextProvider>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <HomePage />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Header />
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Header />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route
            path="/pricing"
            element={
              <>
                <Header />
                <Pricing />
                <Footer />
              </>
            }
          />
          <Route
            path="/buying"
            element={
              <>
                <Header />
                <BuyList />
                <Footer />
              </>
            }
          />
          <Route
            path="/company-profile/:_id"
            element={
              <>
                <Header />
                <CompanyProfile />
                <Footer />
              </>
            }
          />
          <Route
            path="/product-detail/:_id"
            element={
              <>
                <Header />
                <ChemicalDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Header />
                <CreateAccount />
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Header />
                <Login />
                <Footer />
              </>
            }
          />
          <Route
            path="/payment"
            element={
              <>
                <Header />
                <Payment />
                <Footer />
              </>
            }
          />
          <Route
            path="/payment2/:_id"
            element={
              <>
                <Header />
                <Payment2 />
                <Footer />
              </>
            }
          />
          <Route
            path="/terms-and-conditions"
            element={
              <>
                <Header />
                <TermsCondition />
                <Footer />
              </>
            }
          />
          <Route
            path="/privacy-policies"
            element={
              <>
                <Header />
                <PrivacyPolicies />
                <Footer />
              </>
            }
          />

          <Route
            path="/blogs"
            element={
              <>
                <Header />
                <Blog />
                <Footer />
              </>
            }
          />

          <Route
            path="/blog-detail"
            element={
              <>
                <Header />
                <BlogDetail />
                <Footer />
              </>
            }
          />

          <Route
            path="/company/*"
            element={
              <PlanGuard>
                <AdminPage>
                  <Routes>
                    <Route path="dashboard" element={<DashBoard />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="documents" element={<MyDocuments />} />
                    <Route path="catalog" element={<MyCataLog />} />
                    <Route path="profile" element={<CompanyProfile />} />
                    <Route path="change-password" element={<ChangePassword />} />
                    <Route path="insert-chemical" element={<Addchemical />} />
                    <Route path="message" element={<Message />} />
                  </Routes>
                </AdminPage>
              </PlanGuard>
            }
          />

          <Route
            path="/invoice1/:_id"
            element={
              <>
                {/* <Header /> */}
                <Invoice1 />
                {/* <Footer /> */}
              </>
            }
          />
          <Route
            path="/invoice2"
            element={
              <>
                {/* <Header /> */}
                <Invoice2 />
                {/* <Footer /> */}
              </>
            }
          />
          <Route
            path="/invoice3/:_id"
            element={
              <>
                {/* <Header /> */}
                <Invoice3 />
                {/* <Footer /> */}
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <Header />
                <ForgotPassword />
                <Footer />
              </>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <>
                <Header />
                <OtpVerification />
                <Footer />
              </>
            }
          />
          <Route
            path="/create-password"
            element={
              <>
                <Header />
                <CreateNewPassword />
                <Footer />
              </>
            }
          />
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </ActiveContextProvider>
    </BrowserRouter>
  );
}

export default App;
