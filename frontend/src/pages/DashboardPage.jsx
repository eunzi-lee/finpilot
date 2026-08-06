import { useState } from 'react'
import { useNavigate } from 'react-router'
import TransactionItem from '../components/transaction/TransactionItem'
import TransactionModal from '../components/transaction/TransactionModal'
import useTransactions from '../hooks/useTransactions'

function formatCurrency(amount) {
    return `${new Intl.NumberFormat('ko-KR').format(amount)}원`
}

function DashboardPage() {
    const navigate = useNavigate()

    const {
        monthlySummary,
        recentTransactions,
    } = useTransactions()

    const [isTransactionModalOpen, setIsTransactionModalOpen] =
        useState(false)

    const summaryData = [
        {
            title: '이번 달 수입',
            amount: formatCurrency(monthlySummary.income),
            description: '이번 달 누적 수입',
            type: 'income',
        },
        {
            title: '이번 달 지출',
            amount: formatCurrency(monthlySummary.expense),
            description: '이번 달 누적 지출',
            type: 'expense',
        },
        {
            title: '이번 달 잔액',
            amount: formatCurrency(monthlySummary.balance),
            description:
                monthlySummary.balance >= 0
                    ? '현재 사용 가능한 금액'
                    : '지출이 수입보다 많아요',
            type: 'balance',
        },
        {
            title: '저축률',
            amount: `${monthlySummary.savingsRate}%`,
            description:
                monthlySummary.income > 0
                    ? '수입 대비 남은 금액'
                    : '수입을 먼저 등록해주세요',
            type: 'saving',
        },
    ]

    return (
        <>
            <main className="dashboard-page">
                <section className="dashboard-welcome">
                    <div>
                        <span className="dashboard-badge">
                            FINPILOT DASHBOARD
                        </span>

                        <h1>안녕하세요, 은지님 👋</h1>

                        <p>
                            이번 달 금융 현황을 한눈에 확인해보세요.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="transaction-add-button"
                        onClick={() =>
                            setIsTransactionModalOpen(true)
                        }
                    >
                        + 거래 등록
                    </button>
                </section>

                <section className="summary-grid">
                    {summaryData.map((item) => (
                        <article
                            key={item.title}
                            className={`summary-card summary-card-${item.type}`}
                        >
                            <div className="summary-card-header">
                                <span>{item.title}</span>
                                <div className="summary-card-dot" />
                            </div>

                            <strong>{item.amount}</strong>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </section>

                <section className="dashboard-content-grid">
                    <article className="dashboard-content">
                        <div className="dashboard-card-header">
                            <div>
                                <span className="dashboard-card-label">
                                    AI ANALYSIS
                                </span>

                                <h2>AI 소비 인사이트</h2>
                            </div>

                            <span className="ai-badge">AI</span>
                        </div>

                        <div className="insight-box">
                            <span className="insight-icon">✦</span>

                            <div>
                                <strong>
                                    거래 데이터를 분석하고 있어요
                                </strong>

                                <p>
                                    거래가 쌓이면 소비 패턴과
                                    카테고리별 지출을 분석하여 맞춤형
                                    금융 코칭을 제공할 예정입니다.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => navigate('/ai-coach')}
                        >
                            AI 코치 확인하기
                        </button>
                    </article>

                    <article className="dashboard-content">
                        <div className="dashboard-card-header">
                            <div>
                                <span className="dashboard-card-label">
                                    RECENT TRANSACTIONS
                                </span>

                                <h2>최근 거래 내역</h2>
                            </div>

                            <button
                                type="button"
                                className="text-button"
                                onClick={() =>
                                    navigate('/transactions')
                                }
                            >
                                전체 보기
                            </button>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <div className="empty-transaction">
                                <span>↔</span>

                                <strong>
                                    등록된 거래가 없습니다
                                </strong>

                                <p>
                                    첫 번째 수입 또는 지출을
                                    기록해보세요.
                                </p>
                            </div>
                        ) : (
                            <div className="recent-transaction-list">
                                {recentTransactions.map(
                                    (transaction) => (
                                        <TransactionItem
                                            key={transaction.id}
                                            transaction={transaction}
                                            showDelete={false}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </article>
                </section>
            </main>

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() =>
                    setIsTransactionModalOpen(false)
                }
            />
        </>
    )
}

export default DashboardPage