import { useState } from 'react'
import { sanPhamApi } from '../../../services/api'
import { showToast } from '../../../components/Toast'
import ProductForm, { EMPTY_FORM } from '../ProductForm'
import ProductTable from '../ProductTable'

export default function ProductsTab({ products, categories, suppliers, onRefresh }) {
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [imageFile, setImageFile]     = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]           = useState(false)
  const [editId, setEditId]           = useState(null)

  // ── Image handlers ──────────────────────────────────────
  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  // ── Form close ──────────────────────────────────────────
  const handleCloseForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    handleRemoveImage()
  }

  // ── Save ────────────────────────────────────────────────
  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => formData.append(key, val))
      if (imageFile) formData.append('hinh_anh', imageFile)

      if (editId) {
        await sanPhamApi.update(editId, formData)
        showToast('Cập nhật sản phẩm thành công!')
      } else {
        await sanPhamApi.create(formData)
        showToast('Thêm sản phẩm thành công!')
      }
      handleCloseForm()
      onRefresh()
    } catch {
      showToast('Lỗi khi lưu sản phẩm', '❌')
    } finally {
      setSaving(false)
    }
  }

  // ── Edit ────────────────────────────────────────────────
  const handleEdit = p => {
    setForm({
      ten_sp:      p.TEN_SP,
      ma_danh_muc: p.MA_DANH_MUC || '',
      ma_ncc:      p.MA_NCC || '',
      gia_ban:     p.GIA_BAN,
      gia_nhap:    p.GIA_NHAP || '',
      trong_luong: p.TRONG_LUONG || '',
      ton_kho:     p.SO_LUONG,
      mo_ta:       p.MO_TA || '',
      trang_thai:  p.TRANG_THAI ?? 1,
    })
    setImageFile(null)
    setImagePreview(p.HINH_ANH || null)
    setEditId(p.MA_SP)
    setShowForm(true)
  }

  // ── Delete ──────────────────────────────────────────────
  const handleDelete = async id => {
    if (!confirm('Xóa sản phẩm này?')) return
    try {
      await sanPhamApi.delete(id)
      showToast('Đã xóa!')
      onRefresh()
    } catch {
      showToast('Không thể xóa', '❌')
    }
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ color: 'var(--text-light)' }}>{products.length} sản phẩm</span>
        <button
          onClick={() => (showForm ? handleCloseForm() : setShowForm(true))}
          className='btn-primary'
          style={{ padding: '8px 18px' }}
        >
          {showForm ? '✕ Huỷ' : '+ Thêm sản phẩm'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <ProductForm
          form={form}
          setForm={setForm}
          imageFile={imageFile}
          imagePreview={imagePreview}
          saving={saving}
          editId={editId}
          categories={categories}
          suppliers={suppliers}
          onSave={handleSave}
          onClose={handleCloseForm}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />
      )}

      {/* Table */}
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  )
}
