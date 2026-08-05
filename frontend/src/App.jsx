import { Route, Routes } from 'react-router'
import HeroSection from './components/HeroSection'
import DashboardPage from './pages/DashboardPage'
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

            <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
    )
}

export default App