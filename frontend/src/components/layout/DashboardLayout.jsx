import { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'

function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const openSidebar = () => {
        setIsSidebarOpen(true)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    return (
        <div className="dashboard-layout">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
            />

            <div className="dashboard-main">
                <Header onMenuClick={openSidebar} />

                <div className="dashboard-page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout