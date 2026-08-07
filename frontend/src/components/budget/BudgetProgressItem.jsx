import { getCategoryIcon } from '../../data/categoryIcons'
function formatCurrency(amount) {
    return `${new Intl.NumberFormat('ko-KR').format(
        Math.abs(amount),
    )}원`
}

function BudgetProgressItem({
    budget,
    onEdit,
    onDelete,
}) {
    const progressWidth = Math.min(
        budget.usageRate,
        100,
    )

    const statusClass = budget.isOverBudget
        ? 'budget-progress-danger'
        : budget.isWarning
          ? 'budget-progress-warning'
          : 'budget-progress-normal'

    const statusText = budget.isOverBudget
        ? `${formatCurrency(
              budget.remaining,
          )} 초과`
        : `${formatCurrency(
              budget.remaining,
          )} 남음`

    return (
        <article className="budget-progress-item">
            <div className="budget-progress-header">
                <div className="budget-category-information">
                    <div
                        className="budget-category-icon"
                        role="img"
                        aria-label={`${budget.category} 아이콘`}
                    >
                        {getCategoryIcon(budget.category)}
                    </div>

                    <div>
                        <strong>{budget.category}</strong>

                        <span>{statusText}</span>
                    </div>
                </div>

                <div className="budget-item-actions">
                    <button
                        type="button"
                        className="transaction-edit-button"
                        onClick={() => onEdit(budget)}
                    >
                        수정
                    </button>

                    <button
                        type="button"
                        className="transaction-delete-button"
                        onClick={() =>
                            onDelete(budget.id)
                        }
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="budget-amount-row">
                <span>
                    {formatCurrency(budget.spent)}
                    {' / '}
                    {formatCurrency(budget.amount)}
                </span>

                <strong
                    className={
                        budget.isOverBudget
                            ? 'budget-rate-danger'
                            : ''
                    }
                >
                    {budget.usageRate}%
                </strong>
            </div>

            <div className="budget-progress-track">
                <div
                    className={`budget-progress-bar ${statusClass}`}
                    style={{
                        width: `${progressWidth}%`,
                    }}
                />
            </div>

            {budget.isOverBudget && (
                <p className="budget-warning-message">
                    설정한 예산을 초과했습니다. 남은 지출을
                    조정해보세요.
                </p>
            )}

            {!budget.isOverBudget &&
                budget.isWarning && (
                    <p className="budget-caution-message">
                        예산의 80% 이상을 사용했습니다.
                    </p>
                )}
        </article>
    )
}

export default BudgetProgressItem