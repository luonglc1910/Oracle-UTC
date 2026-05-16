import { useState, useEffect } from 'react'

let toastFn = null
export const showToast = (msg, emoji = '✅') => toastFn && toastFn(msg, emoji)

export default function Toast() {
  const [toast, setToast] = useState(null)
  useEffect(() => {
    toastFn = (msg, emoji) => {
      setToast({ msg, emoji })
      setTimeout(() => setToast(null), 3000)
    }
    return () => { toastFn = null }
  }, [])
  if (!toast) return null
  return (
    <div className="toast">
      <span>{toast.emoji}</span> {toast.msg}
    </div>
  )
}
