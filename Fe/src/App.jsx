import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Toast />
      <Routes>
        {/* Admin - no footer/navbar */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Public pages with Navbar + Footer */}
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/san-pham" element={<AppLayout><Products /></AppLayout>} />
        <Route path="/san-pham/:id" element={<AppLayout><ProductDetail /></AppLayout>} />
        <Route path="/gio-hang" element={<AppLayout><Cart /></AppLayout>} />
        <Route path="/thanh-toan" element={<AppLayout><Checkout /></AppLayout>} />
        <Route path="/dat-hang-thanh-cong" element={<AppLayout><OrderSuccess /></AppLayout>} />
        <Route path="/don-hang" element={<AppLayout><MyOrders /></AppLayout>} />
        <Route path="/dang-ky" element={<AppLayout><Register /></AppLayout>} />
        <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
      </Routes>
    </CartProvider>
  )
}
