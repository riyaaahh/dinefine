import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiList, FiCheckSquare, FiUser, FiPrinter } from 'react-icons/fi';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const SupplierDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders, chefs and poll for updates
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, usersRes] = await Promise.all([
                    axios.get('/api/orders'),
                    axios.get('/api/users')
                ]);
                setOrders(ordersRes.data);
                // Filter only chef users (case-insensitive)
                const chefUsers = usersRes.data.filter(user => user.role && user.role.toLowerCase() === 'chef');
                console.log('All users:', usersRes.data);
                console.log('Filtered chefs:', chefUsers);
                setChefs(chefUsers);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const assignToChef = async (orderId, chefId) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`, { status: 'assigned', chef: chefId });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'assigned', chef: chefId } : o));
        } catch (err) {
            alert("Failed to assign order to chef");
        }
    };

    const handleGenerateBill = (order) => {
        // Logic to generate/print bill
        alert(`Generating bill for ${order.tableNumber}... Total: $${order.totalAmount}`);
        updateStatus(order._id, 'completed');
        // In a real app, this might open a window.print() or a PDF
    };

    const unassignedOrders = orders.filter(o => o.status === 'placed' && !o.chef);
    const billingOrders = orders.filter(o => o.status === 'ready' || o.status === 'served');

    // Group orders by chef
    const ordersByChef = chefs.reduce((acc, chef) => {
        acc[chef._id] = orders.filter(o =>
            o.chef === chef._id &&
            ['assigned', 'preparing'].includes(o.status)
        );
        return acc;
    }, {});

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-rounded shadow-inner">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4 shadow-xl"></div>
            <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Syncing Management Hub...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-6 lg:p-12 font-rounded">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-primary mb-2 flex items-center gap-4 tracking-tighter">
                        <span className="p-3 bg-surface border border-primary/10 rounded-2xl text-secondary text-2xl shadow-xl">🏢</span>
                        Supplier & Manager
                    </h1>
                    <p className="text-text-muted font-bold tracking-widest uppercase text-[10px] opacity-60">Syncing Guest Orders • Kitchen • Logistics</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="hidden sm:flex items-center gap-4 bg-surface p-2 pr-6 rounded-2xl border border-primary/5 shadow-2xl">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-background font-black text-sm shadow-inner">JS</div>
                        <div>
                            <p className="text-xs text-primary font-black uppercase tracking-tight">John Supplier</p>
                            <p className="text-[9px] text-secondary font-black flex items-center gap-1.5 uppercase"><span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-sm shadow-secondary"></span> Operational</p>
                        </div>
                    </div>
                    <Link to="/" className="btn bg-surface text-primary border border-primary/10 hover:bg-primary hover:text-background text-[10px] font-black uppercase tracking-widest shadow-xl">Sign Out</Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Column 1: Unassigned Orders - Assign to Chef */}
                <div className="bg-surface rounded-[3rem] p-8 relative overflow-hidden flex flex-col min-h-[600px] border border-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none text-primary">
                        <FiList size={80} />
                    </div>
                    <div className="flex items-center justify-between mb-8 relative">
                        <h2 className="text-xl font-black flex items-center gap-3 text-primary tracking-tight">
                            <FiPackage className="text-secondary" /> New Basket
                        </h2>
                        <span className="px-3 py-1 rounded-xl bg-primary text-background text-[10px] font-black shadow-lg shadow-black/20">{unassignedOrders.length}</span>
                    </div>

                    <div className="space-y-5 flex-1 relative">
                        <AnimatePresence mode="popLayout">
                            {unassignedOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-4 opacity-30">
                                    <FiPackage size={50} />
                                    <p className="italic font-bold text-xs uppercase tracking-widest">Quiet Harvest...</p>
                                </div>
                            ) : (
                                unassignedOrders.map(order => (
                                    <motion.div
                                        key={order._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-5 rounded-[2rem] bg-background border border-primary/5 hover:border-primary/20 transition-all border-l-4 border-l-secondary shadow-lg shadow-black/5"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-black text-primary text-lg tracking-tighter leading-none">{order.tableNumber}</span>
                                            <span className="text-[9px] text-text-muted font-black uppercase tracking-widest opacity-40">#{order._id.slice(-4)}</span>
                                        </div>
                                        <div className="space-y-1.5 mb-5 pl-1 border-l border-primary/5">
                                            {order.items.map((item, i) => (
                                                <p key={i} className="text-xs text-primary/70 font-medium">
                                                    <span className="text-secondary font-black">{item.quantity}x</span> {item.name}
                                                </p>
                                            ))}
                                        </div>

                                        {chefs.length === 0 ? (
                                            <p className="text-xs text-text-muted/60 italic text-center py-3">No chefs available. Add chefs in Staff Management.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-2">Assign to Chef:</p>
                                                {chefs.map(chef => (
                                                    <button
                                                        key={chef._id}
                                                        onClick={() => assignToChef(order._id, chef._id)}
                                                        className="w-full py-2.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-background flex items-center justify-center gap-2 border border-primary/20"
                                                    >
                                                        <FiUser /> {chef.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Columns for each Chef */}
                {chefs.map(chef => (
                    <div key={chef._id} className="bg-surface rounded-[3rem] p-8 relative overflow-hidden flex flex-col min-h-[600px] border border-white/5 shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none text-primary">
                            <FiUser size={80} />
                        </div>
                        <div className="flex items-center justify-between mb-8 relative">
                            <h2 className="text-xl font-black flex items-center gap-3 text-primary tracking-tight">
                                <span className="text-secondary">👨‍🍳</span> {chef.name}
                            </h2>
                            <span className="px-3 py-1 rounded-xl bg-secondary text-background text-[10px] font-black shadow-lg shadow-secondary/20">{ordersByChef[chef._id]?.length || 0}</span>
                        </div>

                        <div className="space-y-5 flex-1 relative">
                            <AnimatePresence mode="popLayout">
                                {(!ordersByChef[chef._id] || ordersByChef[chef._id].length === 0) ? (
                                    <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-4 opacity-30">
                                        <p className="italic font-bold text-xs text-center uppercase tracking-widest">No orders<br />assigned yet.</p>
                                    </div>
                                ) : (
                                    ordersByChef[chef._id].map(order => (
                                        <motion.div
                                            key={order._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-5 rounded-[2rem] bg-background border border-primary/5 shadow-lg shadow-black/5"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-black text-primary text-lg tracking-tighter leading-none">{order.tableNumber}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${order.status === 'preparing' ? 'bg-secondary animate-pulse shadow-sm shadow-secondary' : 'bg-primary/20'}`}></span>
                                                    <span className="text-[9px] text-secondary font-black uppercase tracking-[0.2em]">
                                                        {order.status === 'preparing' ? 'Cooking' : 'In Queue'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 mb-4 pl-1 border-l border-primary/5">
                                                {order.items.map((item, i) => (
                                                    <p key={i} className="text-xs text-primary/70 font-medium">
                                                        <span className="text-secondary font-black">{item.quantity}x</span> {item.name}
                                                    </p>
                                                ))}
                                            </div>
                                            <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: order.status === 'preparing' ? '66%' : '25%' }}
                                                    className="h-full bg-secondary shadow-sm shadow-secondary"
                                                ></motion.div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}

                {/* Final Harvest Column */}
                <div className="bg-surface rounded-[3rem] p-8 relative overflow-hidden flex flex-col min-h-[600px] border border-white/5 shadow-2xl">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none text-primary">
                        <FiCheckSquare size={80} />
                    </div>
                    <div className="flex items-center justify-between mb-8 relative">
                        <h2 className="text-xl font-black flex items-center gap-3 text-primary tracking-tight">
                            <FiTruck className="text-secondary" /> Final Harvest
                        </h2>
                        <span className="px-3 py-1 rounded-xl bg-accent text-background text-[10px] font-black shadow-lg shadow-accent/20">{billingOrders.length}</span>
                    </div>

                    <div className="space-y-5 flex-1 relative">
                        <AnimatePresence mode="popLayout">
                            {billingOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-4 opacity-30">
                                    <FiTruck size={55} />
                                    <p className="italic text-xs uppercase tracking-[0.3em] font-black text-center">Clear Skies • All Paid</p>
                                </div>
                            ) : (
                                billingOrders.map(order => (
                                    <motion.div
                                        key={order._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="p-6 rounded-[2.5rem] bg-background border border-primary/5 shadow-2xl shadow-black/10 relative overflow-hidden"
                                    >
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 blur-3xl rounded-full"></div>
                                        <div className="flex justify-between items-center mb-6 relative">
                                            <div>
                                                <span className="font-black text-2xl text-primary tracking-tighter leading-none">{order.tableNumber}</span>
                                                <p className="text-[9px] text-secondary font-black uppercase mt-2 tracking-[0.2em]">{order.status === 'ready' ? 'Ready' : 'Served'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-black text-3xl text-primary tracking-tighter leading-none scale-110 inline-block">${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleGenerateBill(order)}
                                            className="w-full py-4 rounded-xl bg-secondary text-background font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-secondary/10 hover:brightness-110 active:scale-95"
                                        >
                                            <FiPrinter className="text-lg" /> Finalize Bill & Print
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboard;
