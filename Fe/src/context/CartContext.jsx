import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })

  // user = admin/staff account (USER_SEQ), khachHang = customer (KHACH_HANG)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null } catch { return null }
  })
  const [khachHang, setKhachHang] = useState(() => {
    try { return JSON.parse(localStorage.getItem('khachHang')) || null } catch { return null }
  })

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)) }, [cart])

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.MA_SP === product.MA_SP)
      if (existing) return prev.map(i => i.MA_SP === product.MA_SP ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
  }
  const removeFromCart = (maSp) => setCart(prev => prev.filter(i => i.MA_SP !== maSp))
  const updateQty = (maSp, qty) => {
    if (qty <= 0) return removeFromCart(maSp)
    setCart(prev => prev.map(i => i.MA_SP === maSp ? { ...i, qty } : i))
  }
  const clearCart = () => setCart([])
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.GIA_BAN * i.qty, 0)

  // Admin login (USER_SEQ)
  const loginUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }
  const logoutUser = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  // Khách hàng login/register (KHACH_HANG)
  const loginKhach = (kh) => {
    setKhachHang(kh)
    localStorage.setItem('khachHang', JSON.stringify(kh))
  }
  const logoutKhach = () => {
    setKhachHang(null)
    localStorage.removeItem('khachHang')
    clearCart()
  }

  const isAdmin = user?.ROLE === 'admin'
  const currentName = user?.USER_NAME || khachHang?.HO_TEN || null

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice,
      user, loginUser, logoutUser, isAdmin,
      khachHang, loginKhach, logoutKhach,
      currentName
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
