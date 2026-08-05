function DashboardPage() {
    return (
        <main className="dashboard-page">
            <section className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <span className="dashboard-badge">FINPILOT DASHBOARD</span>
                        <h1>안녕하세요, 은지님 👋</h1>
                        <p>이번 달 금융 현황을 확인해보세요.</p>
                    </div>
                </div>

                <section className="summary-grid">
                    <article className="summary-card">
                        <span>이번 달 수입</span>
                        <strong>2,800,000원</strong>
                    </article>

                    <article className="summary-card">
                        <span>이번 달 지출</span>
                        <strong>1,730,000원</strong>
                    </article>

                    <article className="summary-card">
                        <span>이번 달 잔액</span>
                        <strong>1,070,000원</strong>
                    </article>

                    <article className="summary-card">
                        <span>저축률</span>
                        <strong>38.2%</strong>
                    </article>
                </section>

                <section className="dashboard-content">
                    <h2>AI 소비 인사이트</h2>

                    <p>
                        아직 등록된 거래가 없습니다. 앞으로 실제 거래 데이터를
                        분석하여 맞춤형 금융 코칭을 제공할 예정입니다.
                    </p>
                </section>
            </section>
        </main>
    )
}

export default DashboardPage