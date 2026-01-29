import React from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiActivity, FiClock, FiUsers } from 'react-icons/fi';

const AdminOverview = () => {
    const stats = [
        { label: 'Total Revenue', value: '$25,400', change: '+12%', icon: FiDollarSign, color: 'text-secondary' },
        { label: 'Active Orders', value: '18', change: '+4', icon: FiActivity, color: 'text-accent' },
        { label: 'Avg Wait Time', value: '14m', change: '-2m', icon: FiClock, color: 'text-primary' },
        { label: 'Total Guests', value: '142', change: '+8%', icon: FiUsers, color: 'text-secondary' },
    ];

    return (
        <div className="font-rounded">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-surface rounded-3xl p-6 border border-primary/5 shadow-2xl relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-background shadow-inner ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest border border-secondary/10">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-primary tracking-tighter">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity / Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-surface rounded-[3rem] p-10 border border-primary/5 shadow-2xl">
                    <h3 className="text-2xl font-black text-primary mb-10 tracking-tighter">Revenue Analytics</h3>
                    <div className="h-64 flex items-end justify-between gap-6 px-4">
                        {[65, 40, 75, 55, 80, 70, 90].map((h, i) => (
                            <div key={i} className="w-full bg-background/50 rounded-2xl relative group overflow-hidden border border-primary/5 shadow-inner">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className="absolute bottom-0 w-full bg-secondary shadow-[0_0_20px_rgba(197,216,109,0.2)] group-hover:bg-accent transition-all duration-500"
                                ></motion.div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-8 text-[10px] font-black text-text-muted uppercase tracking-[0.3em] px-2 opacity-40">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-surface rounded-[3rem] p-10 border border-primary/5 shadow-2xl">
                    <h3 className="text-2xl font-black text-primary mb-10 tracking-tighter">Popular Items</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Truffle Pasta', sales: '142', trend: 'up' },
                            { name: 'Wagyu Burger', sales: '98', trend: 'up' },
                            { name: 'Caesar Salad', sales: '85', trend: 'down' },
                            { name: 'Lava Cake', sales: '76', trend: 'stable' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-primary/5 hover:border-primary/20 transition-all">
                                <div>
                                    <p className="text-primary text-sm font-black tracking-tight">{item.name}</p>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">{item.sales} orders</p>
                                </div>
                                <div className={`w-3 h-3 rounded-full shadow-lg ${item.trend === 'up' ? 'bg-secondary' : item.trend === 'down' ? 'bg-[#FF8A95]' : 'bg-primary/20'
                                    }`}></div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 btn bg-background text-primary border border-primary/10 hover:bg-primary hover:text-background text-[10px] font-black uppercase tracking-[0.3em] py-4 rounded-2xl shadow-xl transition-all">View Full Menu</button>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
