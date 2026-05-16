const TEA_EMOJIS = { 1: '🍵', 2: '🌿', 3: '📦', 4: '🫖', 5: '🎁' }
export const getTeaEmoji = (maDanhMuc) => TEA_EMOJIS[maDanhMuc] || '🍵'

export const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN')
}
