import { useRef } from 'react'

const EMPTY_FORM = {
  ten_sp: '',
  ma_danh_muc: '',
  ma_ncc: '',
  gia_ban: '',
  gia_nhap: '',
  trong_luong: '',
  ton_kho: 0,
  mo_ta: '',
  trang_thai: 1,
}

export { EMPTY_FORM }

export default function ProductForm({
  form,
  setForm,
  imageFile,
  imagePreview,
  saving,
  editId,
  categories,
  suppliers,
  onSave,
  onClose,
  onImageChange,
  onRemoveImage,
}) {
  const fileInputRef = useRef(null)

  const handleRemove = () => {
    onRemoveImage()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 24,
        marginBottom: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <h3 style={{ marginBottom: 16 }}>
        {editId ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
      </h3>

      <form onSubmit={onSave}>
        {/* Hàng 1: Tên + Danh mục */}
        <div className='form-row'>
          <div className='form-group'>
            <label>Tên sản phẩm *</label>
            <input
              required
              value={form.ten_sp}
              onChange={e => setForm(f => ({ ...f, ten_sp: e.target.value }))}
            />
          </div>
          <div className='form-group'>
            <label>Danh mục</label>
            <select
              value={form.ma_danh_muc}
              onChange={e => setForm(f => ({ ...f, ma_danh_muc: e.target.value }))}
            >
              <option value=''>-- Chọn danh mục --</option>
              {categories.map(c => (
                <option key={c.MA_DANH_MUC} value={c.MA_DANH_MUC}>
                  {c.TEN_DANH_MUC}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hàng 2: Nhà cung cấp + Trạng thái */}
        <div className='form-row'>
          <div className='form-group'>
            <label>Nhà cung cấp</label>
            <select
              value={form.ma_ncc}
              onChange={e => setForm(f => ({ ...f, ma_ncc: e.target.value }))}
            >
              <option value=''>-- Chọn NCC --</option>
              {(suppliers || []).map(s => (
                <option key={s.MA_NCC} value={s.MA_NCC}>
                  {s.TEN_NCC}
                </option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>Trạng thái</label>
            <select
              value={form.trang_thai}
              onChange={e => setForm(f => ({ ...f, trang_thai: e.target.value }))}
            >
              <option value={1}>✅ Đang bán</option>
              <option value={0}>⛔ Ngừng bán</option>
            </select>
          </div>
        </div>

        {/* Hàng 3: Giá bán + Giá nhập */}
        <div className='form-row'>
          <div className='form-group'>
            <label>Giá bán (VNĐ) *</label>
            <input
              required
              type='number'
              value={form.gia_ban}
              onChange={e => setForm(f => ({ ...f, gia_ban: e.target.value }))}
            />
          </div>
          <div className='form-group'>
            <label>Giá nhập (VNĐ)</label>
            <input
              type='number'
              value={form.gia_nhap}
              onChange={e => setForm(f => ({ ...f, gia_nhap: e.target.value }))}
            />
          </div>
        </div>

        {/* Hàng 4: Trọng lượng + Tồn kho */}
        <div className='form-row'>
          <div className='form-group'>
            <label>Trọng lượng (g)</label>
            <input
              type='number'
              value={form.trong_luong}
              onChange={e => setForm(f => ({ ...f, trong_luong: e.target.value }))}
            />
          </div>
          <div className='form-group'>
            <label>Tồn kho</label>
            <input
              type='number'
              value={form.ton_kho}
              onChange={e => setForm(f => ({ ...f, ton_kho: e.target.value }))}
            />
          </div>
        </div>

        {/* Mô tả */}
        <div className='form-group'>
          <label>Mô tả</label>
          <textarea
            rows={3}
            value={form.mo_ta}
            onChange={e => setForm(f => ({ ...f, mo_ta: e.target.value }))}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Upload ảnh */}
        <div className='form-group'>
          <label>Hình ảnh sản phẩm</label>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {imagePreview ? (
              <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                <img
                  src={imagePreview}
                  alt='preview'
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 10,
                    border: '2px solid #e2e8f0',
                  }}
                />
                <button
                  type='button'
                  onClick={handleRemove}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    cursor: 'pointer',
                    fontSize: 14,
                    lineHeight: '22px',
                    textAlign: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                style={{
                  width: 100,
                  height: 100,
                  border: '2px dashed #cbd5e1',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                🖼️
              </div>
            )}

            <div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={onImageChange}
                style={{ display: 'none' }}
                id='upload-hinh-anh'
              />
              <label
                htmlFor='upload-hinh-anh'
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'var(--cream)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                📁 Chọn ảnh
              </label>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-light)' }}>
                JPG, PNG, WEBP — tối đa 5MB
              </p>
              {imageFile && (
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--green-mid)' }}>
                  ✅ {imageFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <button type='submit' className='btn-primary' disabled={saving}>
          {saving ? '⏳ Đang lưu...' : '💾 Lưu sản phẩm'}
        </button>
      </form>
    </div>
  )
}
