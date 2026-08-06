import { useContext } from 'react'
import TransactionContext from '../context/TransactionContext'

function useTransactions() {
    const context = useContext(TransactionContext)

    if (!context) {
        throw new Error(
            'useTransactions는 TransactionProvider 내부에서 사용해야 합니다.',
        )
    }

    return context
}

export default useTransactions