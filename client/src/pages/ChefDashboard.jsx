import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // Import axios

const ChefDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Poll for updates (in real app, use Socket.io)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('/api/orders');
                // Filter out completed ones if desired
                const activeOrders = res.data.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
                setOrders(activeOrders);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-rounded">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4 shadow-xl"></div>
            <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Igniting Kitchen Display...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-6 lg:p-12 font-rounded">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-primary mb-3 flex items-center gap-4 tracking-tighter">
                        <span className="text-4xl text-secondary">👨‍🍳</span> Kitchen Display
                    </h1>
                    <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
                        <span className="text-[#FF8A95] flex items-center gap-2 bg-[#FF8A95]/10 px-3 py-1.5 rounded-xl border border-[#FF8A95]/20"><FiAlertCircle /> Queued</span>
                        <span className="text-secondary flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-xl border border-secondary/20"><FiClock /> In Prep</span>
                        <span className="text-accent flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-xl border border-accent/20"><FiCheckCircle /> Ready</span>
                    </div>
                </div>
                <Link to="/" className="btn bg-surface text-primary border border-primary/10 hover:bg-primary hover:text-background text-[10px] font-black uppercase tracking-widest shadow-xl w-full sm:w-auto">Exit KDS</Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence>
                    {orders.map((order) => (
                        <motion.div
                            key={order._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`rounded-[2.5rem] overflow-hidden border-2 flex flex-col shadow-2xl transition-all ${order.status === 'placed' || order.status === 'assigned' ? 'bg-surface border-red-500/20' :
                                order.status === 'preparing' ? 'bg-surface border-secondary/20 shadow-secondary/5' :
                                    'bg-surface/50 border-accent/20 opacity-90'
                                }`}
                        >
                            <div className={`p-5 flex justify-between items-center ${order.status === 'placed' ? 'bg-red-500/5' :
                                order.status === 'preparing' ? 'bg-secondary/5' :
                                    'bg-accent/5'
                                }`}>
                                <h3 className="font-black text-xl text-primary tracking-tighter">{order.tableNumber}</h3>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 bg-background/30">
                                <ul className="space-y-4">
                                    {order.items.map((item, i) => (
                                        <li key={i} className="text-primary text-xl font-black border-b border-primary/5 pb-3 last:border-0 flex justify-between items-center group">
                                            <span className="tracking-tighter group-hover:translate-x-1 transition-transform">{item.name}</span>
                                            <span className="text-secondary text-sm font-black bg-surface px-2 py-1 rounded-lg border border-primary/5">x{item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-6 bg-surface/50 border-t border-primary/5">
                                {(order.status === 'placed' || order.status === 'assigned') && (
                                    <button
                                        onClick={() => updateStatus(order._id, 'preparing')}
                                        className="w-full py-4 rounded-xl bg-[#FDF8E1] text-[#1A3C34] font-black uppercase tracking-widest text-[10px] shadow-xl hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        Initiate Cooking
                                    </button>
                                )}
                                {order.status === 'preparing' && (
                                    <button
                                        onClick={() => updateStatus(order._id, 'ready')}
                                        className="w-full py-4 rounded-xl bg-secondary text-background font-black uppercase tracking-widest text-[10px] shadow-xl hover:brightness-110 active:scale-95 transition-all"
                                    >
                                        Dispatch Ready
                                    </button>
                                )}
                                {order.status === 'ready' && (
                                    <button
                                        onClick={() => updateStatus(order._id, 'served')}
                                        className="w-full bg-transparent text-secondary font-black py-2 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-transform"
                                    >
                                        <FiCheckCircle className="text-lg" /> Finalize Service
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChefDashboard;
