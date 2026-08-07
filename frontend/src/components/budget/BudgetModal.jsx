import { useEffect, useMemo, useState } from 'react'
import transactionCategories from '../../data/transactionCategories'
import useBudgets from '../../hooks/useBudgets'
import useTransactions from '../../hooks/useTransactions'

function createInitialForm() {
    return {
        category: transactionCategories.expense[0],
        amount: '',
    }
}

function createEditForm(budget) {
    return {
        category: budget.category,
        amount: budget.amount,
    }
}

function formatMonth(selectedMonth) {
    const [year, month] = selectedMonth.split('-')

    return `${year}년 ${Number(month)}월`
}

function BudgetModal({
    isOpen,
    onClose,
    budgetToEdit = null,
}) {
    const { selectedMonthBudgets, saveBudget } =
        useBudgets()

    const { selectedMonth } = useTransactions()

    const [formData, setFormData] = useState(
        createInitialForm,
    )

    const isEditMode = Boolean(budgetToEdit)

    const usedCategories = useMemo(() => {
        return selectedMonthBudgets.map(
            (budget) => budget.category,
        )
    }, [selectedMonthBudgets])

    const availableCategories = useMemo(() => {
        if (isEditMode) {
            return transactionCategories.expense
        }

        return transactionCategories.expense.filter(
            (category) =>
                !usedCategories.includes(category),
        )
    }, [isEditMode, usedCategories])

    useEffect(() => {
        if (!isOpen) {
            return undefined
        }

        if (budgetToEdit) {
            setFormData(createEditForm(budgetToEdit))
        } else {
            setFormData({
                category:
                    availableCategories[0] ||
                    transactionCategories.expense[0],
                amount: '',
            })
        }

        const originalOverflow =
            document.body.style.overflow

        document.body.style.overflow = 'hidden'

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener(
            'keydown',
            handleEscape,
        )

        return () => {
            document.body.style.overflow =
                originalOverflow

            window.removeEventListener(
                'keydown',
                handleEscape,
            )
        }
    }, [
        availableCategories,
        budgetToEdit,
        isOpen,
        onClose,
    ])

    if (!isOpen) {
        return null
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const amount = Number(formData.amount)

        if (!Number.isFinite(amount) || amount <= 0) {
            alert('예산 금액을 1원 이상 입력해주세요.')
            return
        }

        if (!formData.category) {
            alert('카테고리를 선택해주세요.')
            return
        }

        saveBudget({
            id: budgetToEdit?.id,
            category: formData.category,
            amount,
        })

        onClose()
    }

    return (
        <div
            className="transaction-modal-overlay"
            onMouseDown={onClose}
        >
            <section
                className="transaction-modal budget-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="budget-modal-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="transaction-modal-header">
                    <div>
                        <span className="dashboard-badge">
                            {isEditMode
                                ? 'EDIT BUDGET'
                                : 'NEW BUDGET'}
                        </span>

                        <h2 id="budget-modal-title">
                            {isEditMode
                                ? '예산 수정'
                                : '예산 설정'}
                        </h2>

                        <p>
                            {formatMonth(selectedMonth)}의
                            카테고리별 예산을 관리해보세요.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="transaction-modal-close"
                        onClick={onClose}
                        aria-label="예산 설정 창 닫기"
                    >
                        ×
                    </button>
                </div>

                <form
                    className="transaction-form"
                    onSubmit={handleSubmit}
                >
                    <label className="transaction-form-field">
                        <span>카테고리</span>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            disabled={isEditMode}
                            required
                        >
                            {isEditMode ? (
                                <option
                                    value={formData.category}
                                >
                                    {formData.category}
                                </option>
                            ) : (
                                availableCategories.map(
                                    (category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ),
                                )
                            )}
                        </select>

                        {isEditMode && (
                            <small className="budget-form-help">
                                수정 시 카테고리는 변경할 수
                                없습니다.
                            </small>
                        )}
                    </label>

                    <label className="transaction-form-field">
                        <span>월 예산 금액</span>

                        <div className="amount-input-wrapper">
                            <input
                                type="number"
                                name="amount"
                                min="1"
                                step="1"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="예산 금액을 입력해주세요"
                                autoFocus
                                required
                            />

                            <strong>원</strong>
                        </div>
                    </label>

                    <div className="budget-modal-guide">
                        <span>💡</span>

                        <p>
                            실제 지출은 거래 내역의 카테고리를
                            기준으로 자동 합산됩니다.
                        </p>
                    </div>

                    <div className="transaction-modal-actions">
                        <button
                            type="button"
                            className="modal-cancel-button"
                            onClick={onClose}
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="modal-save-button"
                        >
                            {isEditMode
                                ? '예산 수정'
                                : '예산 저장'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default BudgetModal