function formatCurrency(amount) {
    return `${new Intl.NumberFormat('ko-KR').format(amount)}원`
}

function formatDate(date) {
    return new Intl.DateTimeFormat('ko-KR', {
        month: 'long',
        day: 'numeric',
    }).format(new Date(`${date}T00:00:00`))
}

function TransactionItem({
    transaction,
    onEdit,
    onDelete,
    showActions = true,
}) {
    const isIncome = transaction.type === 'income'

    return (
        <article
            className={`transaction-item ${
                isIncome
                    ? 'transaction-item-income'
                    : 'transaction-item-expense'
            }`}
        >
            <div className="transaction-item-icon">
                {isIncome ? '+' : '−'}
            </div>

            <div className="transaction-item-information">
                <div className="transaction-item-title">
                    <strong>
                        {transaction.memo || transaction.category}
                    </strong>

                    <span>{transaction.category}</span>
                </div>

                <p>{formatDate(transaction.date)}</p>
            </div>

            <strong className="transaction-item-amount">
                {isIncome ? '+' : '−'}
                {formatCurrency(transaction.amount)}
            </strong>

            {showActions && (
                <div className="transaction-item-actions">
                    <button
                        type="button"
                        className="transaction-edit-button"
                        onClick={() => onEdit(transaction)}
                    >
                        수정
                    </button>

                    <button
                        type="button"
                        className="transaction-delete-button"
                        onClick={() => onDelete(transaction.id)}
                    >
                        삭제
                    </button>
                </div>
            )}
        </article>
    )
}

export default TransactionItem