import { useEffect, useState } from 'react'
import transactionCategories from '../../data/transactionCategories'
import useTransactions from '../../hooks/useTransactions'

function getToday() {
    const today = new Date()
    const timezoneOffset = today.getTimezoneOffset() * 60000

    return new Date(today.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 10)
}

function createInitialForm() {
    return {
        type: 'expense',
        amount: '',
        category: transactionCategories.expense[0],
        date: getToday(),
        memo: '',
    }
}

function TransactionModal({ isOpen, onClose }) {
    const { addTransaction } = useTransactions()
    const [formData, setFormData] = useState(createInitialForm)

    useEffect(() => {
        if (!isOpen) {
            return undefined
        }

        const originalOverflow = document.body.style.overflow

        document.body.style.overflow = 'hidden'

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleEscape)

        return () => {
            document.body.style.overflow = originalOverflow
            window.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    const currentCategories =
        transactionCategories[formData.type]

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }))
    }

    const handleTypeChange = (type) => {
        setFormData((previousData) => ({
            ...previousData,
            type,
            category: transactionCategories[type][0],
        }))
    }

    const handleClose = () => {
        setFormData(createInitialForm())
        onClose()
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const amount = Number(formData.amount)

        if (!amount || amount <= 0) {
            alert('금액을 1원 이상 입력해주세요.')
            return
        }

        if (!formData.category) {
            alert('카테고리를 선택해주세요.')
            return
        }

        if (!formData.date) {
            alert('거래 날짜를 선택해주세요.')
            return
        }

        addTransaction({
            ...formData,
            amount,
            memo: formData.memo.trim(),
        })

        handleClose()
    }

    return (
        <div
            className="transaction-modal-overlay"
            onMouseDown={handleClose}
        >
            <section
                className="transaction-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="transaction-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="transaction-modal-header">
                    <div>
                        <span className="dashboard-badge">
                            NEW TRANSACTION
                        </span>

                        <h2 id="transaction-modal-title">
                            거래 등록
                        </h2>

                        <p>
                            새로운 수입 또는 지출을 기록해보세요.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="transaction-modal-close"
                        onClick={handleClose}
                        aria-label="거래 등록 창 닫기"
                    >
                        ×
                    </button>
                </div>

                <form
                    className="transaction-form"
                    onSubmit={handleSubmit}
                >
                    <div className="transaction-type-switch">
                        <button
                            type="button"
                            className={
                                formData.type === 'expense'
                                    ? 'transaction-type-button transaction-type-button-active expense'
                                    : 'transaction-type-button'
                            }
                            onClick={() =>
                                handleTypeChange('expense')
                            }
                        >
                            지출
                        </button>

                        <button
                            type="button"
                            className={
                                formData.type === 'income'
                                    ? 'transaction-type-button transaction-type-button-active income'
                                    : 'transaction-type-button'
                            }
                            onClick={() =>
                                handleTypeChange('income')
                            }
                        >
                            수입
                        </button>
                    </div>

                    <label className="transaction-form-field">
                        <span>금액</span>

                        <div className="amount-input-wrapper">
                            <input
                                type="number"
                                name="amount"
                                min="1"
                                step="1"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="금액을 입력해주세요"
                                autoFocus
                                required
                            />

                            <strong>원</strong>
                        </div>
                    </label>

                    <div className="transaction-form-row">
                        <label className="transaction-form-field">
                            <span>카테고리</span>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                {currentCategories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="transaction-form-field">
                            <span>거래 날짜</span>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>

                    <label className="transaction-form-field">
                        <span>메모</span>

                        <textarea
                            name="memo"
                            value={formData.memo}
                            onChange={handleInputChange}
                            rows="3"
                            maxLength="100"
                            placeholder="거래에 관한 메모를 입력해주세요."
                        />

                        <small>
                            {formData.memo.length}/100
                        </small>
                    </label>

                    <div className="transaction-modal-actions">
                        <button
                            type="button"
                            className="modal-cancel-button"
                            onClick={handleClose}
                        >
                            취소
                        </button>

                        <button
                            type="submit"
                            className="modal-save-button"
                        >
                            거래 저장
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default TransactionModal