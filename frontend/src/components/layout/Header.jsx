import { useLocation } from 'react-router'

const pageTitles = {
    '/dashboard': '대시보드',
    '/transactions': '거래 내역',
    '/budget': '예산 관리',
    '/ai-coach': 'AI 금융 코치',
    '/settings': '설정',
}

function Header({ onMenuClick }) {
    const location = useLocation()

    const currentTitle =
        pageTitles[location.pathname] || 'FinPilot'

    const currentDate = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    }).format(new Date())

    return (
        <header className="dashboard-topbar">
            <div className="topbar-left">
                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={onMenuClick}
                    aria-label="메뉴 열기"
                >
                    ☰
                </button>

                <div>
                    <span className="topbar-page-label">
                        FINPILOT
                    </span>

                    <h2>{currentTitle}</h2>
                </div>
            </div>

            <div className="topbar-right">
                <span className="topbar-date">{currentDate}</span>

                <div className="profile-area">
                    <div className="profile-avatar">은</div>

                    <div className="profile-information">
                        <strong>이은지</strong>
                        <span>FinPilot 사용자</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header