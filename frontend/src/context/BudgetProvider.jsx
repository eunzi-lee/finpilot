import { useEffect, useMemo, useState } from 'react'
import BudgetContext from './BudgetContext'
import useTransactions from '../hooks/useTransactions'

const STORAGE_KEY = 'finpilot-budgets'

function getSavedBudgets() {
    try {
        const savedBudgets = localStorage.getItem(STORAGE_KEY)

        if (!savedBudgets) {
            return []
        }

        const parsedBudgets = JSON.parse(savedBudgets)

        return Array.isArray(parsedBudgets)
            ? parsedBudgets
            : []
    } catch (error) {
        console.error('예산 데이터를 불러오지 못했습니다.', error)
        return []
    }
}

function createBudgetId() {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random()}`
}

function BudgetProvider({ children }) {
    const {
        selectedMonth,
        monthlyTransactions,
    } = useTransactions()

    const [budgets, setBudgets] = useState(getSavedBudgets)

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(budgets),
        )
    }, [budgets])

    const saveBudget = (budgetData) => {
        const normalizedAmount = Number(budgetData.amount)

        if (budgetData.id) {
            setBudgets((previousBudgets) =>
                previousBudgets.map((budget) => {
                    if (budget.id !== budgetData.id) {
                        return budget
                    }

                    return {
                        ...budget,
                        amount: normalizedAmount,
                        updatedAt: new Date().toISOString(),
                    }
                }),
            )

            return
        }

        setBudgets((previousBudgets) => {
            const existingBudget = previousBudgets.find(
                (budget) =>
                    budget.month === selectedMonth &&
                    budget.category === budgetData.category,
            )

            if (existingBudget) {
                return previousBudgets.map((budget) => {
                    if (budget.id !== existingBudget.id) {
                        return budget
                    }

                    return {
                        ...budget,
                        amount: normalizedAmount,
                        updatedAt: new Date().toISOString(),
                    }
                })
            }

            const newBudget = {
                id: createBudgetId(),
                month: selectedMonth,
                category: budgetData.category,
                amount: normalizedAmount,
                createdAt: new Date().toISOString(),
                updatedAt: null,
            }

            return [
                newBudget,
                ...previousBudgets,
            ]
        })
    }

    const deleteBudget = (budgetId) => {
        setBudgets((previousBudgets) =>
            previousBudgets.filter(
                (budget) => budget.id !== budgetId,
            ),
        )
    }

    const selectedMonthBudgets = useMemo(() => {
        return budgets
            .filter(
                (budget) =>
                    budget.month === selectedMonth,
            )
            .sort(
                (first, second) =>
                    second.amount - first.amount,
            )
    }, [budgets, selectedMonth])

    const expenseByCategory = useMemo(() => {
        return monthlyTransactions
            .filter(
                (transaction) =>
                    transaction.type === 'expense',
            )
            .reduce((totals, transaction) => {
                const category =
                    transaction.category || '기타 지출'

                totals[category] =
                    (totals[category] || 0) +
                    Number(transaction.amount)

                return totals
            }, {})
    }, [monthlyTransactions])

    const budgetItems = useMemo(() => {
        return selectedMonthBudgets
            .map((budget) => {
                const spent =
                    expenseByCategory[budget.category] || 0

                const remaining =
                    budget.amount - spent

                const usageRate =
                    budget.amount > 0
                        ? Number(
                              (
                                  (spent / budget.amount) *
                                  100
                              ).toFixed(1),
                          )
                        : 0

                return {
                    ...budget,
                    spent,
                    remaining,
                    usageRate,
                    isWarning:
                        usageRate >= 80 &&
                        usageRate <= 100,
                    isOverBudget: usageRate > 100,
                }
            })
            .sort(
                (first, second) =>
                    second.usageRate - first.usageRate,
            )
    }, [
        expenseByCategory,
        selectedMonthBudgets,
    ])

    const budgetSummary = useMemo(() => {
        const totalBudget = selectedMonthBudgets.reduce(
            (total, budget) =>
                total + Number(budget.amount),
            0,
        )

        const totalSpent = budgetItems.reduce(
            (total, budget) =>
                total + Number(budget.spent),
            0,
        )

        const remaining =
            totalBudget > 0
                ? totalBudget - totalSpent
                : 0

        const usageRate =
            totalBudget > 0
                ? Number(
                      (
                          (totalSpent / totalBudget) *
                          100
                      ).toFixed(1),
                  )
                : 0

        const overBudgetCount = budgetItems.filter(
            (budget) => budget.isOverBudget,
        ).length

        const warningCount = budgetItems.filter(
            (budget) => budget.isWarning,
        ).length

        return {
            totalBudget,
            totalSpent,
            remaining,
            usageRate,
            overBudgetCount,
            warningCount,
        }
    }, [
        budgetItems,
        monthlyTransactions,
        selectedMonthBudgets,
    ])

    const contextValue = {
        budgets,
        selectedMonthBudgets,
        budgetItems,
        budgetSummary,
        saveBudget,
        deleteBudget,
    }

    return (
        <BudgetContext.Provider value={contextValue}>
            {children}
        </BudgetContext.Provider>
    )
}

export default BudgetProvider