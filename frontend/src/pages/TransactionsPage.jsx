import { useMemo, useState } from 'react'
import TransactionItem from '../components/transaction/TransactionItem'
import TransactionModal from '../components/transaction/TransactionModal'
import useTransactions from '../hooks/useTransactions'

const filters = [
    {
        value: 'all',
        label: '전체',
    },
    {
        value: 'expense',
        label: '지출',
    },
    {
        value: 'income',
        label: '수입',
    },
]

function TransactionsPage() {
    const {
        transactions,
        deleteTransaction,
    } = useTransactions()

    const [selectedFilter, setSelectedFilter] = useState('all')
    const [isTransactionModalOpen, setIsTransactionModalOpen] =
        useState(false)

    const filteredTransactions = useMemo(() => {
        if (selectedFilter === 'all') {
            return transactions
        }

        return transactions.filter(
            (transaction) =>
                transaction.type === selectedFilter,
        )
    }, [selectedFilter, transactions])

    const handleDelete = (transactionId) => {
        const shouldDelete = window.confirm(
            '이 거래 내역을 삭제할까요?',
        )

        if (shouldDelete) {
            deleteTransaction(transactionId)
        }
    }

    return (
        <>
            <main className="transactions-page">
                <section className="transactions-page-header">
                    <div>
                        <span className="dashboard-badge">
                            TRANSACTIONS
                        </span>

                        <h1>거래 내역</h1>

                        <p>
                            수입과 지출을 기록하고 전체 거래를
                            관리해보세요.
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

                <section className="transactions-card">
                    <div className="transactions-toolbar">
                        <div className="transaction-filter-buttons">
                            {filters.map((filter) => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    className={
                                        selectedFilter ===
                                        filter.value
                                            ? 'transaction-filter-button transaction-filter-button-active'
                                            : 'transaction-filter-button'
                                    }
                                    onClick={() =>
                                        setSelectedFilter(
                                            filter.value,
                                        )
                                    }
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        <span className="transaction-count">
                            총 {filteredTransactions.length}건
                        </span>
                    </div>

                    {filteredTransactions.length === 0 ? (
                        <div className="transactions-empty-state">
                            <div className="placeholder-icon">↔</div>

                            <h2>
                                표시할 거래 내역이 없습니다
                            </h2>

                            <p>
                                새로운 수입 또는 지출을 등록해보세요.
                            </p>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={() =>
                                    setIsTransactionModalOpen(true)
                                }
                            >
                                + 첫 거래 등록하기
                            </button>
                        </div>
                    ) : (
                        <div className="transaction-list">
                            {filteredTransactions.map(
                                (transaction) => (
                                    <TransactionItem
                                        key={transaction.id}
                                        transaction={transaction}
                                        onDelete={handleDelete}
                                    />
                                ),
                            )}
                        </div>
                    )}
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

export default TransactionsPage