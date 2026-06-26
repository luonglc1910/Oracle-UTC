export const STATUS_LIST = [
  { key: 'cho_xac_nhan',  label: 'Chờ xác nhận',   color: '#f59e0b', bg: '#fef3c7' },
  { key: 'da_xac_nhan',   label: 'Đã xác nhận',    color: '#3b82f6', bg: '#dbeafe' },
  { key: 'cho_giao_hang', label: 'Chờ giao hàng',  color: '#8b5cf6', bg: '#ede9fe' },
  { key: 'dang_giao_hang',label: 'Đang giao hàng', color: '#06b6d4', bg: '#cffafe' },
  { key: 'da_giao_hang',  label: 'Đã giao hàng',   color: '#10b981', bg: '#d1fae5' },
  { key: 'danh_gia',      label: 'Chờ đánh giá',   color: '#f97316', bg: '#ffedd5' },
  { key: 'hoan_thanh',    label: 'Hoàn thành',      color: '#16a34a', bg: '#dcfce7' },
  { key: 'huy',           label: 'Đã huỷ',          color: '#dc2626', bg: '#fee2e2' },
]

export const NEXT_MAP = {
  cho_xac_nhan:  ['da_xac_nhan', 'huy'],
  da_xac_nhan:   ['cho_giao_hang', 'huy'],
  cho_giao_hang: ['dang_giao_hang', 'huy'],
  dang_giao_hang:['da_giao_hang'],
  da_giao_hang:  ['danh_gia'],
  danh_gia:      ['hoan_thanh'],
  hoan_thanh:    [],
  huy:           [],
}

export const REVENUE_STATUSES = ['da_giao_hang', 'danh_gia', 'hoan_thanh']

export const ADMIN_MENU = [
  'Tổng quan',
  'Sản phẩm',
  'Khách hàng',
  'Danh mục',
  'Trạng thái đơn',
  'Thống kê',
]

export const MENU_ICONS = {
  'Tổng quan':       '📊',
  'Sản phẩm':        '🍵',
  'Khách hàng':      '👥',
  'Danh mục':        '📂',
  'Trạng thái đơn':  '🔄',
  'Thống kê':        '📈',
}
