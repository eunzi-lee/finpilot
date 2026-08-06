import { Navigate, Route, Routes } from 'react-router'
import HeroSection from './components/HeroSection'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetPage from './pages/BudgetPage'
import AiCoachPage from './pages/AiCoachPage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <main className="landing-page">
                        <HeroSection />
                    </main>
                }
            />

            <Route element={<DashboardLayout />}>
                <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                />

                <Route
                    path="/transactions"
                    element={<TransactionsPage />}
                />

                <Route
                    path="/budget"
                    element={<BudgetPage />}
                />

                <Route
                    path="/ai-coach"
                    element={<AiCoachPage />}
                />

                <Route
                    path="/settings"
                    element={<SettingsPage />}
                />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    )
}

export default App