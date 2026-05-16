import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

export const sanPhamApi = {
  getAll: () => api.get('/sanpham'),
  getById: (id) => api.get(`/sanpham/${id}`),
  getByDanhMuc: (maDanhMuc) => api.get(`/sanpham/danhmuc/${maDanhMuc}`),
  create: (data) => api.post('/sanpham', data),
  update: (id, data) => api.put(`/sanpham/${id}`, data),
  delete: (id) => api.delete(`/sanpham/${id}`)
}

export const danhMucApi = {
  getAll: () => api.get('/danhmuc'),
  getById: (id) => api.get(`/danhmuc/${id}`)
}

export const khachHangApi = {
  getAll: () => api.get('/khachhang'),
  getById: (id) => api.get(`/khachhang/${id}`),
  create: (data) => api.post('/khachhang', data),
  update: (id, data) => api.put(`/khachhang/${id}`, data)
}

export const donHangApi = {
  getAll: () => api.get('/donhang'),
  getById: (id) => api.get(`/donhang/${id}`),
  getByKhachHang: (maKh) => api.get(`/donhang/khachhang/${maKh}`),
  getChiTiet: (maDh) => api.get(`/donhang/${maDh}/chitiet`),
  create: (data) => api.post('/donhang', data),
  update: (id, data) => api.put(`/donhang/${id}`, data),
  updateStatus: (id, trang_thai) => api.patch(`/donhang/${id}/trangthai`, { trang_thai }),
  createChiTiet: (data) => api.post('/donhang/chitiet', data),
  getStats: () => api.get('/donhang/thongke')
}

export const khuyenMaiApi = {
  apply: (maCode) => api.post('/khuyenmai/apply', { ma_code: maCode }),
  getAll: () => api.get('/khuyenmai')
}

export const danhGiaApi = {
  getBySanPham: (maSp) => api.get(`/danhgia/sanpham/${maSp}`),
  create: (data) => api.post('/danhgia', data)
}

export const thanhToanApi = {
  create: (data) => api.post('/thanhtoan', data)
}

export const userApi = {
  login: (username, password) => api.post('/users/login', { username, password }),
  getAll: () => api.get('/users')
}

export default api
