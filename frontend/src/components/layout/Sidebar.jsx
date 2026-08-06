import { Link, NavLink } from 'react-router'

const menuItems = [
    {
        path: '/dashboard',
        icon: '⌂',
        label: '대시보드',
    },
    {
        path: '/transactions',
        icon: '↔',
        label: '거래 내역',
    },
    {
        path: '/budget',
        icon: '₩',
        label: '예산 관리',
    },
    {
        path: '/ai-coach',
        icon: '✦',
        label: 'AI 금융 코치',
    },
    {
        path: '/settings',
        icon: '⚙',
        label: '설정',
    },
]

function Sidebar({ isOpen, onClose }) {
    return (
        <>
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <Link
                        to="/dashboard"
                        className="sidebar-logo"
                        onClick={onClose}
                    >
                        Fin<span>Pilot ✈️</span>
                    </Link>

                    <button
                        type="button"
                        className="sidebar-close-button"
                        onClick={onClose}
                        aria-label="메뉴 닫기"
                    >
                        ×
                    </button>
                </div>

                <p className="sidebar-description">
                    AI Personal Finance
                </p>

                <nav className="sidebar-navigation">
                    {menuItems.map((menuItem) => (
                        <NavLink
                            key={menuItem.path}
                            to={menuItem.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `sidebar-menu-item ${
                                    isActive ? 'sidebar-menu-item-active' : ''
                                }`
                            }
                        >
                            <span className="sidebar-menu-icon">
                                {menuItem.icon}
                            </span>

                            <span>{menuItem.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-tip">
                        <span className="sidebar-tip-icon">💡</span>

                        <div>
                            <strong>FinPilot Tip</strong>
                            <p>꾸준한 기록이 좋은 금융 습관을 만들어요.</p>
                        </div>
                    </div>

                    <Link to="/" className="sidebar-home-link">
                        처음 화면으로
                    </Link>
                </div>
            </aside>

            {isOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    onClick={onClose}
                    aria-label="사이드바 닫기"
                />
            )}
        </>
    )
}

export default Sidebar