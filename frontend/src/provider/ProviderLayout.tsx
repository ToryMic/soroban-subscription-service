import { NavLink, Outlet } from 'react-router-dom'
import './ProviderLayout.css'

const NAV_ITEMS = [
  { to: '/provider', label: 'Dashboard', end: true },
  { to: '/provider/plans', label: 'Plans' },
  { to: '/provider/revenue', label: 'Revenue' },
]

export function PageHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="provider-header">
      <h1 className="provider-header__title">{title}</h1>
      {subtitle && <p className="provider-header__subtitle">{subtitle}</p>}
    </div>
  )
}

export function ProviderLayout() {
  return (
    <div className="provider">
      <aside className="provider__sidebar">
        <p className="provider__sidebar-label">Provider</p>
        <nav className="provider__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `provider__nav-item${isActive ? ' provider__nav-item--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="provider__content">
        <Outlet />
      </div>
    </div>
  )
}

export default ProviderLayout