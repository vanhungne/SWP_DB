import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "./Authentication/AuthContext";
import ProtectedRoute from "./Component/ProtectedRoute/ProtectedRoute";
import Register from "./Component/Singin-up/Register";
import Login from "./Component/Singin-up/Login";
import Home from "./Component/Home/Home";
import Layout from "./Layouttest/Layout";
import VerifyCode from "./Component/Singin-up/VerifyCode";
import ProductDetail from "./Component/Product/ProductDetails"; // Correct import
import Cart from "./Component/Cart/Cart";
import Checkout from "./Component/Cart/CheckOut";
import ForgotPassword from "./Component/Singin-up/ForgotPassword";
import ResetPassword from "./Component/Singin-up/ResetPassword";
import ProductCategory from "./Component/Product/ProductCategory";
import Products from "./Component/Product/AllProduct";
import PaymentVnPayment from "./Component/Payment/PaymentVnPay";
import PaymentResult from "./Component/Payment/PaymentResult";
import OAuth2RedirectHandler from "./Authentication/OAuthe2Redirect/OAuth2RedirectHandler";
import MyAccount from "./Component/Customer/MyAccount";
import ManagerDashBoard from "./Component/Manager/ManagerDashBoard";
import AdminDashBoard from "./Component/DashboardAdmin/AdminDashBoard";
import OurStory from "./Component/About/Our Story";
import HistoryOrder from "./Component/OrderCustomer/HistoryOrder";
import OrderDetailsCustomer from "./Component/OrderCustomer/OrderDetailsCustomer";
import DiamondsPrice from "./Component/DiamondsPrice/DiamondsPrice";
import SaleDasboard from "./Component/Sale/SaleDasboard";
import DeliveryDasboard from "./Component/Delivery/DeliveryDasboard";
import Policy from "./Component/About/Policy"
import Contact from "./Component/About/Contact";
import AboutUs from "./Component/About/AboutUs";
import DiamondKnow from "./Component/About/DiamondKnowledge/diamondKnow";
import WarrantyDetails from "./Component/About/WarrantyDetails";
import HomeNotification from "./Component/Home/Notification";
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/*<HomeNotification />*/}
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
                        <Route path="history" element={<HistoryOrder />} />
                        <Route path="diamonds-price" element={<DiamondsPrice />} />
                        <Route path="order-details/:orderId" element={<OrderDetailsCustomer />} />

                        <Route path="contact" element={<Contact />} />
                        <Route path="story" element={<OurStory />} />
                        <Route path="policy" element={<Policy />} />
                        <Route path="about" element={<AboutUs />} />
                        <Route path="knowledge" element={<DiamondKnow />} />
                        <Route path="warranty" element={<WarrantyDetails />} />

                        {/* Protected router*/}
                        <Route
                            path="dashboard-account"
                            element={
                                <ProtectedRoute requiredRoles={['ADMIN']}>
                                    <AdminDashBoard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="manager"
                            element={
                                <ProtectedRoute requiredRoles={['MANAGER']}>
                                    <ManagerDashBoard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="sale-dashboard"
                            element={
                                <ProtectedRoute requiredRoles={['SALE_STAFF']}>
                                    <SaleDasboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="delivery-dashboard"
                            element={
                                <ProtectedRoute requiredRoles={['DELIVERY_STAFF']}>
                                    <DeliveryDasboard />
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
