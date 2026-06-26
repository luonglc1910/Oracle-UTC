import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  sanPhamApi,
  danhMucApi,
  khachHangApi,
  donHangApi,
  nhaCungCapApi
} from '../../services/api'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/helpers'
import { normalizeStatus } from './utils/statusHelpers.jsx'
import { REVENUE_STATUSES } from './constants/statusConfig.jsx'

import AdminSidebar from './components/AdminSidebar'
import Overview from './tabs/Overview'
import ProductsTab from './tabs/ProductsTab'
import CustomersTab from './tabs/CustomersTab'
import CategoriesTab from './tabs/CategoriesTab'
import StatusTab from './tabs/StatusTab.jsx'
import StatsTab from './tabs/StatsTab.jsx'

export default function AdminDashboard () {
  const { user, isAdmin, logoutUser } = useCart()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem('adminTab') || 'Tổng quan'
  )
  const [data, setData] = useState({
    products: [],
    orders: [],
    customers: [],
    categories: [],
    suppliers: []
  })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  const switchTab = tab => {
    setActiveTab(tab)
    localStorage.setItem('adminTab', tab)
  }

  const refreshOrders = () =>
    donHangApi.getAll().then(r => setData(d => ({ ...d, orders: r.data })))

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login')
      return
    }
    Promise.all([
      sanPhamApi.getAll(),
      donHangApi.getAll(),
      khachHangApi.getAll(),
      danhMucApi.getAll(),
      nhaCungCapApi.getAll()
    ])
      .then(([p, o, c, dm, ncc]) =>
        setData({
          products: p.data,
          orders: o.data,
          customers: c.data,
          categories: dm.data,
          suppliers: ncc.data
        })
      )
      .finally(() => setLoading(false))
  }, [isAdmin])

  useEffect(() => {
    if (activeTab === 'Thống kê') {
      donHangApi
        .getStats()
        .then(r => setStats(r.data))
        .catch(() => {})
    }
  }, [activeTab])

  if (!isAdmin) return null

  const revenue = data.orders
    .filter(o => REVENUE_STATUSES.includes(normalizeStatus(o.TRANG_THAI)))
    .reduce((s, o) => s + (o.TONG_TIEN || 0), 0)

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f1' }}>
      <AdminSidebar
        user={user}
        activeTab={activeTab}
        onSwitchTab={switchTab}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1, padding: 28, overflow: 'auto' }}>
        <h1
          style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 26,
            marginBottom: 24,
            color: 'var(--green-dark)'
          }}
        >
          {activeTab}
        </h1>

        {loading ? (
          <div className='loading'>
            <div className='spinner' />
          </div>
        ) : (
          <>
            {activeTab === 'Tổng quan' && (
              <Overview data={data} revenue={revenue} />
            )}
            {activeTab === 'Sản phẩm' && (
              <ProductsTab
                products={data.products}
                categories={data.categories}
                suppliers={data.suppliers}
                onRefresh={() =>
                  sanPhamApi
                    .getAll()
                    .then(r => setData(d => ({ ...d, products: r.data })))
                }
              />
            )}
            {activeTab === 'Khách hàng' && (
              <CustomersTab customers={data.customers} />
            )}
            {activeTab === 'Danh mục' && (
              <CategoriesTab categories={data.categories} />
            )}
            {activeTab === 'Trạng thái đơn' && (
              <StatusTab orders={data.orders} onRefresh={refreshOrders} />
            )}
            {activeTab === 'Thống kê' && <StatsTab stats={stats} />}
          </>
        )}
      </main>
    </div>
  )
}
