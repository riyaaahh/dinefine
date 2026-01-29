import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDownload, FiDollarSign, FiShoppingBag, FiLayers, FiCalendar } from 'react-icons/fi';
import axios from 'axios';

const SalesReports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/reports/sales');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-center font-rounded font-black text-primary">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="uppercase tracking-widest text-[10px] opacity-40">Compiling Analytics...</p>
        </div>
    );

    const highlights = [
        {
            label: 'Estimated Revenue',
            value: `$${data?.summary?.totalRevenue?.toLocaleString() || '0'}`,
            change: '+12%',
            icon: FiDollarSign
        },
        {
            label: 'Total Orders',
            value: data?.summary?.totalOrders || '0',
            change: '+8%',
            icon: FiShoppingBag
        },
        {
            label: 'Average Ticket',
            value: `$${data?.summary?.avgTicket || '0'}`,
            change: '+5%',
            icon: FiLayers
        },
    ];

    return (
        <div className="font-rounded pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-primary mb-2 tracking-tighter">Growth Insights</h2>
                    <p className="text-text-muted font-bold text-sm leading-relaxed opacity-60">Analyze your botanical commerce records and organic growth.</p>
                </div>
                <button className="btn btn-primary h-14 px-8 text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-black/20 flex items-center gap-3">
                    <FiDownload /> Export Full Audit
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {highlights.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-surface rounded-3xl p-8 border border-primary/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center text-secondary text-2xl shadow-inner">
                                <stat.icon />
                            </div>
                            <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1 opacity-40">{stat.label}</p>
                        <h3 className="text-3xl font-black text-primary tracking-tighter">{stat.value}</h3>
                        <div className="absolute inset-0 bg-secondary/5 blur-3xl rounded-full -z-10 translate-y-1/2"></div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div className="bg-surface rounded-[3rem] p-10 border border-primary/5 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black text-primary tracking-tighter">Velocity Matrix</h3>
                        <div className="flex gap-2">
                            <span className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/5">Daily Pulse</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-6 px-4 relative">
                        <div className="absolute inset-x-0 bottom-0 h-px bg-primary/10"></div>

                        {(data?.chartData?.length > 0 ? data.chartData : [20, 40, 30, 50, 70, 40, 60]).map((day, i) => {
                            const val = typeof day === 'object' ? day.total : day;
                            const label = typeof day === 'object' ? day._id.split('-').slice(2).join('/') : `P${i + 1}`;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min((val / 500) * 100, 100)}%` }}
                                        className={`w-full max-w-[14px] rounded-full transition-all duration-500 bg-secondary/30 group-hover:bg-secondary relative shadow-[0_0_20px_rgba(197,216,109,0.1)]`}
                                    >
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-background font-black text-[10px] px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-2xl pointer-events-none whitespace-nowrap">
                                            ${val.toLocaleString()}
                                        </div>
                                    </motion.div>
                                    <span className="text-[9px] font-black text-text-muted/40 uppercase mt-5 tracking-tighter">{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-surface rounded-[3rem] p-10 border border-primary/5 shadow-2xl">
                    <h3 className="text-2xl font-black text-primary mb-10 tracking-tighter">Settled Records</h3>
                    <div className="space-y-4">
                        {data?.recentOrders?.length === 0 ? (
                            <p className="text-text-muted font-bold text-xs uppercase tracking-widest text-center py-20 opacity-30">No settled records yet.</p>
                        ) : (
                            data?.recentOrders?.map((order, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] bg-background/40 border border-white/5 group hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-background text-xs font-black shadow-lg">
                                            {order.tableNumber.slice(-2)}
                                        </div>
                                        <div>
                                            <p className="text-primary font-black text-sm tracking-tight">Table {order.tableNumber}</p>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-secondary font-black text-lg tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                            <span className="text-[8px] font-black text-secondary uppercase tracking-[0.2em]">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesReports;
