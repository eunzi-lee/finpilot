import { useState } from 'react'
import BudgetModal from '../components/budget/BudgetModal'
import BudgetProgressItem from '../components/budget/BudgetProgressItem'
import useBudgets from '../hooks/useBudgets'
import useTransactions from '../hooks/useTransactions'

function formatCurrency(amount) {
    const formattedAmount =
        new Intl.NumberFormat('ko-KR').format(
            Math.abs(amount),
        )

    return amount < 0
        ? `-${formattedAmount}원`
        : `${formattedAmount}원`
}

function formatMonth(selectedMonth) {
    const [year, month] = selectedMonth.split('-')

    return `${year}년 ${Number(month)}월`
}

function BudgetPage() {
    const {
        budgetItems,
        budgetSummary,
        deleteBudget,
    } = useBudgets()

    const {
        selectedMonth,
        setSelectedMonth,
    } = useTransactions()

    const [isBudgetModalOpen, setIsBudgetModalOpen] =
        useState(false)

    const [budgetToEdit, setBudgetToEdit] =
        useState(null)

    const selectedMonthText =
        formatMonth(selectedMonth)

    const openCreateModal = () => {
        setBudgetToEdit(null)
        setIsBudgetModalOpen(true)
    }

    const openEditModal = (budget) => {
        setBudgetToEdit(budget)
        setIsBudgetModalOpen(true)
    }

    const closeBudgetModal = () => {
        setIsBudgetModalOpen(false)
        setBudgetToEdit(null)
    }

    const handleDelete = (budgetId) => {
        const shouldDelete = window.confirm(
            '이 카테고리 예산을 삭제할까요?',
        )

        if (shouldDelete) {
            deleteBudget(budgetId)
        }
    }

    return (
        <>
            <main className="budget-page">
                <section className="budget-page-header">
                    <div>
                        <span className="dashboard-badge">
                            BUDGET MANAGEMENT
                        </span>

                        <h1>예산 관리</h1>

                        <p>
                            {selectedMonthText}의 카테고리별
                            예산과 실제 지출을 비교해보세요.
                        </p>
                    </div>

                    <div className="budget-header-actions">
                        <label className="month-selector">
                            <span>조회 월</span>

                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(event) => {
                                    if (event.target.value) {
                                        setSelectedMonth(
                                            event.target.value,
                                        )
                                    }
                                }}
                            />
                        </label>

                        <button
                            type="button"
                            className="transaction-add-button"
                            onClick={openCreateModal}
                        >
                            + 예산 설정
                        </button>
                    </div>
                </section>

                <section className="budget-summary-grid">
                    <article className="budget-summary-card">
                        <span>전체 예산</span>

                        <strong>
                            {formatCurrency(
                                budgetSummary.totalBudget,
                            )}
                        </strong>

                        <p>{selectedMonthText} 설정 금액</p>
                    </article>

                    <article className="budget-summary-card">
                        <span>전체 지출</span>

                        <strong>
                            {formatCurrency(
                                budgetSummary.totalSpent,
                            )}
                        </strong>

                        <p>거래 내역 기준 실제 지출</p>
                    </article>

                    <article className="budget-summary-card">
                        <span>남은 예산</span>

                        <strong
                            className={
                                budgetSummary.remaining < 0
                                    ? 'budget-negative-value'
                                    : ''
                            }
                        >
                            {formatCurrency(
                                budgetSummary.remaining,
                            )}
                        </strong>

                        <p>
                            {budgetSummary.totalBudget === 0
                                ? '예산을 먼저 설정해주세요'
                                : budgetSummary.remaining >= 0
                                    ? '현재 사용할 수 있는 예산'
                                    : '전체 예산을 초과했어요'}
                        </p>
                    </article>

                    <article className="budget-summary-card">
                        <span>전체 사용률</span>

                        <strong
                            className={
                                budgetSummary.usageRate > 100
                                    ? 'budget-negative-value'
                                    : ''
                            }
                        >
                            {budgetSummary.usageRate}%
                        </strong>

                        <p>
                            {budgetSummary.totalBudget > 0
                                ? '전체 예산 대비 지출'
                                : '예산을 먼저 설정해주세요'}
                        </p>
                    </article>
                </section>

                {budgetSummary.overBudgetCount > 0 && (
                    <section className="budget-alert budget-alert-danger">
                        <span>!</span>

                        <div>
                            <strong>
                                예산을 초과한 카테고리가
                                있습니다
                            </strong>

                            <p>
                                총{' '}
                                {
                                    budgetSummary.overBudgetCount
                                }
                                개 카테고리가 설정한 예산을
                                초과했습니다.
                            </p>
                        </div>
                    </section>
                )}

                {budgetSummary.overBudgetCount === 0 &&
                    budgetSummary.warningCount > 0 && (
                        <section className="budget-alert budget-alert-warning">
                            <span>!</span>

                            <div>
                                <strong>
                                    예산 사용률을 확인해주세요
                                </strong>

                                <p>
                                    총{' '}
                                    {
                                        budgetSummary.warningCount
                                    }
                                    개 카테고리가 예산의 80%
                                    이상을 사용했습니다.
                                </p>
                            </div>
                        </section>
                    )}

                <section className="budget-list-card">
                    <div className="budget-list-header">
                        <div>
                            <span className="dashboard-card-label">
                                CATEGORY BUDGET
                            </span>

                            <h2>카테고리별 예산 현황</h2>
                        </div>

                        <span className="transaction-count">
                            총 {budgetItems.length}개
                        </span>
                    </div>

                    {budgetItems.length === 0 ? (
                        <div className="budget-empty-state">
                            <div className="placeholder-icon">
                                ₩
                            </div>

                            <h2>
                                설정된 예산이 없습니다
                            </h2>

                            <p>
                                식비, 교통, 쇼핑 등 카테고리별
                                예산을 설정해보세요.
                            </p>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={openCreateModal}
                            >
                                + 첫 예산 설정하기
                            </button>
                        </div>
                    ) : (
                        <div className="budget-progress-list">
                            {budgetItems.map((budget) => (
                                <BudgetProgressItem
                                    key={budget.id}
                                    budget={budget}
                                    onEdit={openEditModal}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <BudgetModal
                isOpen={isBudgetModalOpen}
                onClose={closeBudgetModal}
                budgetToEdit={budgetToEdit}
            />
        </>
    )
}

export default BudgetPage