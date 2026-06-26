import { useState } from 'react'
import { donHangApi } from '../../../services/api'
import { showToast } from '../../../components/Toast'
import { normalizeStatus } from '../utils/statusHelpers.jsx'
import { NEXT_MAP } from '../constants/statusConfig.jsx'
import StatusFilters from './StatusFilters'
import BulkActionBar from './BulkActionBar'
import OrderTable from './OrderTable'

export default function StatusTab ({ orders, onRefresh }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [updating, setUpdating] = useState(null)
  const [selected, setSelected] = useState([])
  const [bulkUpdating, setBulkUpdating] = useState(false)

  const filtered =
    filterStatus === 'all'
      ? orders
      : orders.filter(o => normalizeStatus(o.TRANG_THAI) === filterStatus)

  const handleFilter = s => {
    setFilterStatus(s)
    setSelected([])
  }

  // Checkbox helpers
  const toggleAll = () => {
    const allIds = filtered.map(o => o.MA_DH)
    const isAllChecked = allIds.every(id => selected.includes(id))
    setSelected(isAllChecked ? [] : allIds)
  }

  const toggleOne = id =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  // Common next statuses for bulk actions
  const selectedOrders = filtered.filter(o => selected.includes(o.MA_DH))
  const commonNexts = (() => {
    if (selectedOrders.length === 0) return []
    const nextsPerOrder = selectedOrders.map(
      o => NEXT_MAP[normalizeStatus(o.TRANG_THAI)] || []
    )
    return nextsPerOrder[0].filter(nk =>
      nextsPerOrder.every(nexts => nexts.includes(nk))
    )
  })()

  // Single order update
  const handleNext = async (order, nextStatus) => {
    setUpdating(order.MA_DH)
    try {
      await donHangApi.updateStatus(order.MA_DH, nextStatus)
      showToast(`✅ Đơn #${order.MA_DH} → ${nextStatus}`)
      onRefresh()
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi cập nhật trạng thái', '❌')
    } finally {
      setUpdating(null)
    }
  }

  // Bulk update
  const handleBulk = async nextStatus => {
    if (selected.length === 0) return
    setBulkUpdating(true)
    let ok = 0,
      fail = 0
    for (const id of selected) {
      try {
        await donHangApi.updateStatus(id, nextStatus)
        ok++
      } catch {
        fail++
      }
    }
    showToast(`✅ Đã cập nhật ${ok} đơn${fail ? ` (${fail} lỗi)` : ''}`)
    setSelected([])
    setBulkUpdating(false)
    onRefresh()
  }

  return (
    <>
      <StatusFilters
        orders={orders}
        filterStatus={filterStatus}
        onFilter={handleFilter}
      />

      <BulkActionBar
        selectedCount={selected.length}
        commonNexts={commonNexts}
        bulkUpdating={bulkUpdating}
        onBulk={handleBulk}
        onClear={() => setSelected([])}
      />

      <OrderTable
        orders={filtered}
        selected={selected}
        updating={updating}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onNext={handleNext}
      />
    </>
  )
}
