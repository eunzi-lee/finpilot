import { useEffect, useMemo, useState } from 'react'
import TransactionContext from './TransactionContext'

const STORAGE_KEY = 'finpilot-transactions'

function getSavedTransactions() {
    try {
        const savedTransactions = localStorage.getItem(STORAGE_KEY)

        if (!savedTransactions) {
            return []
        }

        const parsedTransactions = JSON.parse(savedTransactions)

        return Array.isArray(parsedTransactions)
            ? parsedTransactions
            : []
    } catch (error) {
        console.error('거래 데이터를 불러오지 못했습니다.', error)
        return []
    }
}

function createTransactionId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random()}`
}

function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState(
        getSavedTransactions,
    )

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transactions),
        )
    }, [transactions])

    const addTransaction = (transactionData) => {
        const newTransaction = {
            id: createTransactionId(),
            ...transactionData,
            amount: Number(transactionData.amount),
            createdAt: new Date().toISOString(),
        }

        setTransactions((previousTransactions) => [
            newTransaction,
            ...previousTransactions,
        ])
    }

    const deleteTransaction = (transactionId) => {
        setTransactions((previousTransactions) =>
            previousTransactions.filter(
                (transaction) =>
                    transaction.id !== transactionId,
            ),
        )
    }

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((first, second) => {
            const dateComparison =
                new Date(`${second.date}T00:00:00`) -
                new Date(`${first.date}T00:00:00`)

            if (dateComparison !== 0) {
                return dateComparison
            }

            return (
                new Date(second.createdAt) -
                new Date(first.createdAt)
            )
        })
    }, [transactions])

    const monthlyTransactions = useMemo(() => {
        const today = new Date()
        const currentYear = today.getFullYear()
        const currentMonth = today.getMonth()

        return transactions.filter((transaction) => {
            const transactionDate = new Date(
                `${transaction.date}T00:00:00`,
            )

            return (
                transactionDate.getFullYear() === currentYear &&
                transactionDate.getMonth() === currentMonth
            )
        })
    }, [transactions])

    const monthlySummary = useMemo(() => {
        const income = monthlyTransactions
            .filter(
                (transaction) =>
                    transaction.type === 'income',
            )
            .reduce(
                (total, transaction) =>
                    total + transaction.amount,
                0,
            )

        const expense = monthlyTransactions
            .filter(
                (transaction) =>
                    transaction.type === 'expense',
            )
            .reduce(
                (total, transaction) =>
                    total + transaction.amount,
                0,
            )

        const balance = income - expense

        const savingsRate =
            income > 0
                ? Number(((balance / income) * 100).toFixed(1))
                : 0

        return {
            income,
            expense,
            balance,
            savingsRate,
        }
    }, [monthlyTransactions])

    const recentTransactions = useMemo(
        () => sortedTransactions.slice(0, 5),
        [sortedTransactions],
    )

    const contextValue = {
        transactions: sortedTransactions,
        recentTransactions,
        monthlySummary,
        addTransaction,
        deleteTransaction,
    }

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    )
}

export default TransactionProvider