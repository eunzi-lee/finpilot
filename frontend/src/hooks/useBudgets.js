import { useContext } from 'react'
import BudgetContext from '../context/BudgetContext'

function useBudgets() {
    const context = useContext(BudgetContext)

    if (!context) {
        throw new Error(
            'useBudgets는 BudgetProvider 내부에서 사용해야 합니다.',
        )
    }

    return context
}

export default useBudgets