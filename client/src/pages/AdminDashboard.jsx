import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiSettings, FiUsers, FiFileText, FiBookOpen, FiHome } from 'react-icons/fi';
import AdminOverview from '../components/AdminOverview';
import MenuManagement from '../components/MenuManagement';
import SalesReports from '../components/SalesReports';
import StaffManagement from '../components/StaffManagement';
import Settings from '../components/Settings';
import TableManagement from '../components/TableManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const sidebarItems = [
        { label: 'Overview', id: 'overview', icon: FiHome },
        { label: 'Tables & QR', id: 'tables', icon: FiGrid },
        { label: 'Menu Management', id: 'menu', icon: FiBookOpen },
        { label: 'Sales Reports', id: 'sales', icon: FiFileText },
        { label: 'Staff', id: 'staff', icon: FiUsers },
        { label: 'Settings', id: 'settings', icon: FiSettings },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <AdminOverview />;
            case 'tables':
                return <TableManagement />;
            case 'menu':
                return <MenuManagement />;
            case 'sales':
                return <SalesReports />;
            case 'staff':
                return <StaffManagement />;
            case 'settings':
                return <Settings />;
            default:
                return <AdminOverview />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-background font-rounded">
            {/* Mobile Header */}
            <header className="md:hidden flex justify-between items-center p-5 bg-surface border-b border-primary/5 sticky top-0 z-30">
                <h2 className="text-2xl font-black text-primary">
                    dinefine
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Admin</span>
                    <div className="w-10 h-10 rounded-2xl bg-primary-soft/20 text-primary flex items-center justify-center font-black">
                        A
                    </div>
                </div>
            </header>

            {/* Sidebar (Desktop only) */}
            <div className="w-72 bg-surface border-r border-primary/5 p-8 flex flex-col hidden md:flex h-screen sticky top-0 shadow-2xl">
                <h2 className="text-3xl font-black text-primary mb-12 tracking-tighter">
                    dinefine
                </h2>
                <nav className="flex-1 space-y-3">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all ${activeTab === item.id
                                ? 'bg-primary text-background shadow-xl shadow-black/20 scale-105'
                                : 'text-text-muted hover:bg-primary-soft/20 hover:text-primary'
                                }`}
                        >
                            <item.icon className="text-xl" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <Link to="/" className="mt-auto flex items-center gap-2 text-text-muted hover:text-primary font-bold p-5 transition-colors uppercase tracking-widest text-[10px] opacity-60">
                    Log Out
                </Link>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-primary/5 px-2 py-3 flex justify-around items-center z-40 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
                {sidebarItems.slice(0, 5).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${activeTab === item.id
                            ? 'text-primary scale-110'
                            : 'text-text-muted'
                            }`}
                    >
                        <item.icon size={22} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
                    </button>
                ))}
            </nav>

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto mb-20 md:mb-0">
                <header className="hidden md:flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-primary mb-1 tracking-tighter">
                            {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                        <p className="text-text-muted font-black uppercase tracking-widest text-[10px] opacity-60">Welcome back, Administrator.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn bg-surface border border-primary/10 text-primary hover:border-primary/40 font-black text-[10px] uppercase tracking-widest shadow-xl">Export Report</button>
                        <button className="btn btn-primary shadow-2xl shadow-black/20 text-[10px] uppercase tracking-widest">Refresh Data</button>
                    </div>
                </header>

                {/* Mobile Title */}
                <div className="md:hidden mb-8">
                    <h1 className="text-2xl font-black text-primary">
                        {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                    </h1>
                </div>

                <div className="relative">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
