import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import TransactionProvider from './context/TransactionProvider.jsx'
import BudgetProvider from './context/BudgetProvider.jsx'
import './config/chartConfig.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <TransactionProvider>
                <BudgetProvider>
                    <App />
                </BudgetProvider>
            </TransactionProvider>
        </BrowserRouter>
    </StrictMode>,
)