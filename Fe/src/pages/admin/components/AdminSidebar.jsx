import { Link } from 'react-router-dom'
import { ADMIN_MENU, MENU_ICONS } from '../constants/statusConfig.jsx'

export default function AdminSidebar ({
  user,
  activeTab,
  onSwitchTab,
  onLogout
}) {
  return (
    <aside
      style={{
        width: 240,
        background: 'var(--green-dark)',
        color: 'white',
        padding: '24px 0',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Logo / User */}
      <div
        style={{
          padding: '0 20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div
          style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 18,
            color: 'var(--gold-light)',
            marginBottom: 4
          }}
        >
          🍵 Admin Panel
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          👑 {user?.USER_NAME}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {ADMIN_MENU.map(m => (
          <button
            key={m}
            onClick={() => onSwitchTab(m)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '11px 16px',
              border: 'none',
              borderRadius: 10,
              marginBottom: 4,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 14,
              transition: 'all .2s',
              background:
                activeTab === m ? 'rgba(201,168,76,0.15)' : 'transparent',
              color:
                activeTab === m ? 'var(--gold-light)' : 'rgba(255,255,255,0.7)',
              borderLeft:
                activeTab === m
                  ? '3px solid var(--gold)'
                  : '3px solid transparent'
            }}
          >
            {MENU_ICONS[m]} {m}
          </button>
        ))}
      </nav>

      {/* Footer actions */}
      <div style={{ padding: '0 12px 20px' }}>
        <Link
          to='/'
          style={{
            display: 'block',
            padding: '10px 16px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 13,
            textDecoration: 'none',
            marginBottom: 4
          }}
        >
          ← Về trang chủ
        </Link>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'rgba(231,76,60,0.15)',
            border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: 8,
            color: '#ff8080',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  )
}
