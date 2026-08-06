function BudgetPage() {
    return (
        <main className="placeholder-page">
            <section className="placeholder-header">
                <span className="dashboard-badge">
                    BUDGET MANAGEMENT
                </span>

                <h1>예산 관리</h1>

                <p>
                    카테고리별 예산을 설정하고 지출 현황을
                    확인할 수 있습니다.
                </p>
            </section>

            <section className="placeholder-card">
                <div className="placeholder-icon">₩</div>

                <h2>이번 달 예산을 설정해보세요</h2>

                <p>
                    식비, 교통비, 쇼핑 등 카테고리별로
                    예산을 관리할 수 있습니다.
                </p>

                <button type="button" className="primary-button">
                    예산 설정하기
                </button>
            </section>
        </main>
    )
}

export default BudgetPage