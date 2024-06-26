import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "./Authentication/AuthContext";
import ProtectedRoute from "./Component/ProtectedRoute/ProtectedRoute";
import Register from "./Component/Register";
import Login from "./Component/Login";
import Home from "./Component/Home/Home";
import Layout from "./Layouttest/Layout";
import VerifyCode from "./Component/VerifyCode";
import ProductDetail from "./Component/Product/ProductDetails"; // Correct import
import Cart from "./Component/Cart/Cart";
import Checkout from "./Component/Cart/CheckOut";
import ForgotPassword from "./Component/ForgotPassword";
import ResetPassword from "./Component/ResetPassword";
import ProductCategory from "./Component/Product/ProductCategory";
import Products from "./Component/Product/AllProduct";
import PaymentVnPayment from "./Component/Payment/PaymentVnPay";
import PaymentResult from "./Component/Payment/PaymentResult";
import OAuth2RedirectHandler from "./Component/O/OAuth2RedirectHandler";
import MyAccount from "./Component/MyAccount";
import ManagerDashBoard from "./Component/Manager/ManagerDashBoard";
import AdminDashBoard from "./Component/DashboardAdmin/AdminDashBoard";
import OurStory from "./Component/About/Our Story";
import HistoryOrder from "./Component/OrderCustomer/HistoryOrder";
import OrderDetailsCustomer from "./Component/OrderCustomer/OrderDetailsCustomer";
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="products" element={<Products />} />
                        <Route path="product/:productId" element={<ProductDetail />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="/payment/:orderId" element={<PaymentVnPayment />} />
                        <Route path="/payment/result" element={<PaymentResult />} />
                        <Route path="login" element={<Login />} />
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                        <Route path="register" element={<Register />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="reset-password/:email" element={<ResetPassword />} />
                        <Route path="verifycode/:email" element={<VerifyCode />} />
                        <Route path="category" element={<ProductCategory />} />
                        <Route path="myAccount" element={<MyAccount />} />
                        <Route path="manager" element={<ManagerDashBoard />} />
                        <Route path="story" element={<OurStory />} />
                        <Route path="history" element={<HistoryOrder />} />
                        <Route path="order-details/:orderId" element={<OrderDetailsCustomer />} />
                        {/* Protected router*/}
                        <Route
                            path="dashboard-account"
                            element={
                                <ProtectedRoute requiredRoles={['ADMIN']}>
                                    <AdminDashBoard />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
