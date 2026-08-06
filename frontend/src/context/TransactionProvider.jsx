import { useEffect, useMemo, useState } from 'react'
import TransactionContext from './TransactionContext'

const STORAGE_KEY = 'finpilot-transactions'

function getCurrentMonth() {
    const today = new Date()
    const timezoneOffset = today.getTimezoneOffset() * 60000

    return new Date(today.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 7)
}

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
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random()}`
}

function TransactionProvider({ children }) {
    const [transactions, setTransactions] = useState(
        getSavedTransactions,
    )

    const [selectedMonth, setSelectedMonth] = useState(
        getCurrentMonth,
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
            updatedAt: null,
        }

        setTransactions((previousTransactions) => [
            newTransaction,
            ...previousTransactions,
        ])
    }

    const updateTransaction = (
        transactionId,
        transactionData,
    ) => {
        setTransactions((previousTransactions) =>
            previousTransactions.map((transaction) => {
                if (transaction.id !== transactionId) {
                    return transaction
                }

                return {
                    ...transaction,
                    ...transactionData,
                    amount: Number(transactionData.amount),
                    updatedAt: new Date().toISOString(),
                }
            }),
        )
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

            const secondCreatedAt = second.createdAt
                ? new Date(second.createdAt)
                : new Date(0)

            const firstCreatedAt = first.createdAt
                ? new Date(first.createdAt)
                : new Date(0)

            return secondCreatedAt - firstCreatedAt
        })
    }, [transactions])

    const monthlyTransactions = useMemo(() => {
        return sortedTransactions.filter(
            (transaction) =>
                transaction.date.slice(0, 7) === selectedMonth,
        )
    }, [selectedMonth, sortedTransactions])

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
        () => monthlyTransactions.slice(0, 5),
        [monthlyTransactions],
    )

    const contextValue = {
        transactions: sortedTransactions,
        monthlyTransactions,
        recentTransactions,
        monthlySummary,
        selectedMonth,
        setSelectedMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
    }

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    )
}

export default TransactionProvider