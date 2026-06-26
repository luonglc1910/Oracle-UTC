import { STATUS_LIST } from '../constants/statusConfig.jsx'

const STATUS_NORMALIZE = {
  da_giao: 'da_giao_hang',
  dang_giao: 'dang_giao_hang',
  cho_giao: 'cho_giao_hang',
  xac_nhan: 'da_xac_nhan',
  da_xac_nhan: 'da_xac_nhan',
  cho_xac_nhan: 'cho_xac_nhan',
  dang_giao_hang: 'dang_giao_hang',
  da_giao_hang: 'da_giao_hang',
  cho_giao_hang: 'cho_giao_hang',
  danh_gia: 'danh_gia',
  hoan_thanh: 'hoan_thanh',
  huy: 'huy'
}

export function normalizeStatus (raw) {
  if (!raw) return ''
  const lower = raw.toLowerCase()
  return STATUS_NORMALIZE[lower] || lower
}

export function statusMeta (key) {
  const norm = normalizeStatus(key)
  return (
    STATUS_LIST.find(s => s.key === norm) || {
      key: norm,
      label: key || '?',
      color: '#888',
      bg: '#f3f4f6'
    }
  )
}
