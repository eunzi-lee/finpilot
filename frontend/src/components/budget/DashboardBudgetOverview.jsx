import { useNavigate } from 'react-router'
import { getCategoryIcon } from '../../data/categoryIcons'
import useBudgets from '../../hooks/useBudgets'

function formatCurrency(amount) {
    const formattedAmount = new Intl.NumberFormat(
        'ko-KR',
    ).format(Math.abs(amount))

    return amount < 0
        ? `-${formattedAmount}원`
        : `${formattedAmount}원`
}

function DashboardBudgetOverview() {
    const navigate = useNavigate()

    const {
        budgetItems,
        budgetSummary,
    } = useBudgets()

    const previewBudgets = budgetItems.slice(0, 4)

    const totalProgressWidth = Math.min(
        budgetSummary.usageRate,
        100,
    )

    const totalProgressClass =
        budgetSummary.usageRate > 100
            ? 'dashboard-budget-progress-danger'
            : budgetSummary.usageRate >= 80
              ? 'dashboard-budget-progress-warning'
              : 'dashboard-budget-progress-normal'

    return (
        <article className="dashboard-budget-card">
            <div className="dashboard-budget-header">
                <div>
                    <span className="dashboard-card-label">
                        BUDGET STATUS
                    </span>

                    <h2>이번 달 예산 현황</h2>
                </div>

                <button
                    type="button"
                    className="text-button"
                    onClick={() => navigate('/budget')}
                >
                    예산 관리
                </button>
            </div>

            {budgetItems.length === 0 ? (
                <div className="dashboard-budget-empty">
                    <div className="dashboard-budget-empty-icon">
                        ₩
                    </div>

                    <div>
                        <strong>
                            아직 설정된 예산이 없습니다
                        </strong>

                        <p>
                            카테고리별 예산을 설정하고 소비
                            사용률을 확인해보세요.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate('/budget')}
                    >
                        예산 설정하기
                    </button>
                </div>
            ) : (
                <>
                    <div className="dashboard-budget-summary">
                        <div>
                            <span>전체 예산</span>

                            <strong>
                                {formatCurrency(
                                    budgetSummary.totalBudget,
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>사용 금액</span>

                            <strong>
                                {formatCurrency(
                                    budgetSummary.totalSpent,
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>남은 예산</span>

                            <strong
                                className={
                                    budgetSummary.remaining < 0
                                        ? 'dashboard-budget-negative'
                                        : ''
                                }
                            >
                                {formatCurrency(
                                    budgetSummary.remaining,
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>사용률</span>

                            <strong
                                className={
                                    budgetSummary.usageRate > 100
                                        ? 'dashboard-budget-negative'
                                        : ''
                                }
                            >
                                {budgetSummary.usageRate}%
                            </strong>
                        </div>
                    </div>

                    <div className="dashboard-budget-total-progress">
                        <div className="dashboard-budget-progress-title">
                            <span>전체 예산 사용률</span>

                            <strong>
                                {budgetSummary.usageRate}%
                            </strong>
                        </div>

                        <div className="dashboard-budget-progress-track">
                            <div
                                className={`dashboard-budget-progress-bar ${totalProgressClass}`}
                                style={{
                                    width: `${totalProgressWidth}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="dashboard-budget-category-list">
                        {previewBudgets.map((budget) => {
                            const progressWidth = Math.min(
                                budget.usageRate,
                                100,
                            )

                            const progressClass =
                                budget.isOverBudget
                                    ? 'dashboard-budget-progress-danger'
                                    : budget.isWarning
                                      ? 'dashboard-budget-progress-warning'
                                      : 'dashboard-budget-progress-normal'

                            return (
                                <div
                                    key={budget.id}
                                    className="dashboard-budget-category"
                                >
                                    <div className="dashboard-budget-category-top">
                                        <div className="dashboard-budget-category-name">
                                            <div
                                                className="dashboard-budget-category-icon"
                                                role="img"
                                                aria-label={`${budget.category} 아이콘`}
                                            >
                                                {getCategoryIcon(
                                                    budget.category,
                                                )}
                                            </div>

                                            <div>
                                                <strong>
                                                    {budget.category}
                                                </strong>

                                                <span>
                                                    {formatCurrency(
                                                        budget.spent,
                                                    )}
                                                    {' / '}
                                                    {formatCurrency(
                                                        budget.amount,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <strong
                                            className={
                                                budget.isOverBudget
                                                    ? 'dashboard-budget-negative'
                                                    : ''
                                            }
                                        >
                                            {budget.usageRate}%
                                        </strong>
                                    </div>

                                    <div className="dashboard-budget-progress-track">
                                        <div
                                            className={`dashboard-budget-progress-bar ${progressClass}`}
                                            style={{
                                                width: `${progressWidth}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {budgetItems.length > 4 && (
                        <button
                            type="button"
                            className="dashboard-budget-more-button"
                            onClick={() => navigate('/budget')}
                        >
                            나머지 예산 {budgetItems.length - 4}개
                            확인하기
                        </button>
                    )}
                </>
            )}
        </article>
    )
}

export default DashboardBudgetOverview