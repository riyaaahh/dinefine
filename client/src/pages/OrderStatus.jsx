import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlus, FiCheck, FiClock, FiCoffee, FiChevronLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

// Order Status Tracking Component

const OrderStatus = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    // Initial Fetch & Polling
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/api/orders/${orderId}`);
                setOrder(res.data);

                // Map status string to step index
                const statusMap = {
                    'placed': 0, 'assigned': 0,
                    'preparing': 1,
                    'ready': 2, 'served': 3,
                    'completed': 3
                };
                setCurrentStep(statusMap[res.data.status] || 0);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrder();
        const interval = setInterval(fetchOrder, 3000);
        return () => clearInterval(interval);
    }, [orderId]);

    // Helper to format time
    const formatTime = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const steps = [
        {
            label: 'Order Sent',
            time: order ? formatTime(order.statusTimestamps?.placedAt || order.createdAt) : '-',
            icon: FiCheck,
            activeColor: 'bg-blue-500'
        },
        {
            label: 'In Kitchen',
            time: order?.statusTimestamps?.preparingAt ? formatTime(order.statusTimestamps.preparingAt) : 'Waiting...',
            icon: FiCoffee,
            activeColor: 'bg-amber-500'
        },
        {
            label: 'Ready!',
            time: order?.statusTimestamps?.readyAt ? formatTime(order.statusTimestamps.readyAt) : 'Estimating...',
            icon: FiClock,
            activeColor: 'bg-emerald-500'
        },
        {
            label: 'Served & Enjoy',
            time: order?.statusTimestamps?.servedAt ? formatTime(order.statusTimestamps.servedAt) : 'Soon...',
            icon: FiCheck,
            activeColor: 'bg-indigo-500'
        },
    ];

    if (!order) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Harvesting your details...</p>
        </div>
    );

    if (order.status === 'cancelled') return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-12 text-center font-rounded">
            <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/10 flex items-center justify-center text-red-500 text-5xl mb-8 border border-red-500/20">
                🍂
            </div>
            <h1 className="text-4xl font-black text-primary mb-4 tracking-tighter">Order Cancelled</h1>
            <p className="text-text-muted font-bold text-sm mb-12 max-w-xs leading-relaxed opacity-60">
                This botanical request has been successfully withdrawn from our harvest cycle.
            </p>
            <Link
                to={`/menu/${order.tableNumber.toLowerCase().replace(/\s+/g, '-')}`}
                className="btn btn-primary px-12 py-5 text-xl tracking-widest uppercase shadow-2xl"
            >
                Back to Menu
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-5 md:p-8 flex flex-col items-center max-w-2xl mx-auto font-rounded text-primary">
            <Link to={`/menu/${order.tableNumber.toLowerCase().replace(/\s+/g, '-')}`} className="self-start text-primary/40 font-black flex items-center gap-2 mb-8 hover:text-primary p-3 rounded-2xl transition-all uppercase tracking-widest text-[10px]">
                <FiChevronLeft className="text-xl" /> Back to Harvest
            </Link>

            <div className="text-center mb-12">
                <div className="inline-block px-5 py-2 rounded-full bg-surface border border-primary/10 text-primary text-[10px] font-black mb-4 uppercase tracking-[0.3em]">
                    Live Botanical Prep
                </div>
                <h1 className="text-5xl font-black text-primary mb-3 tracking-tighter">
                    Crafting Your Plate
                </h1>
                <p className="text-text-muted font-bold text-xs uppercase tracking-widest">Order Identity: #{orderId.slice(-6).toUpperCase()}</p>
            </div>

            {/* Steps Container - Inverted Dark Theme */}
            <div className="w-full bg-surface/50 rounded-[4rem] p-12 mb-10 border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-md">
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 top-8 bottom-8 w-1 bg-primary/10 rounded-full -z-0"></div>
                    <div
                        className="absolute left-8 top-8 w-1 bg-secondary transition-all duration-1000 rounded-full z-0 shadow-[0_0_15px_rgba(197,216,109,0.3)]"
                        style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step, index) => {
                        const isActive = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: isActive ? 1 : 0.2, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-10 mb-14 last:mb-0 relative z-10"
                            >
                                <div
                                    className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-3xl transition-all duration-700 ${isActive ? 'bg-secondary text-background shadow-2xl shadow-secondary/20' : 'bg-background text-primary/20'
                                        } ${isCurrent ? 'ring-[12px] ring-secondary/5 scale-110' : ''}`}
                                >
                                    <step.icon className={`${isCurrent && index === 1 ? 'animate-bounce' : ''}`} />
                                </div>
                                <div className="pt-3">
                                    <h3 className={`text-2xl font-black transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                                        {step.label}
                                    </h3>
                                    <p className={`text-[10px] mt-2 font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-secondary' : 'text-text-muted/40'}`}>
                                        {step.time}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Order Summary - Dark Aesthetic */}
            <div className="w-full bg-surface/30 rounded-[3rem] p-10 border border-white/5 shadow-2xl mb-32">
                <h2 className="text-primary font-black text-xl mb-8 flex items-center gap-4">
                    <span className="w-4 h-4 bg-secondary rounded-full shadow-lg shadow-secondary/30"></span>
                    Gathered Items
                </h2>
                <div className="space-y-5">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-background/40 p-5 rounded-[2rem] border border-white/5">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-background flex items-center justify-center text-sm font-black shadow-inner">
                                    {item.quantity}x
                                </div>
                                <span className="text-primary font-bold text-lg">{item.name}</span>
                            </div>
                            <span className="text-secondary font-black text-xl tracking-tighter">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="pt-8 mt-8 border-t border-white/10 flex justify-between items-center">
                        <span className="text-text-muted font-bold uppercase tracking-[0.3em] text-[10px]">Total Investment</span>
                        <span className="text-4xl font-black text-primary tracking-tighter shadow-sm">${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-background via-background/80 to-transparent flex flex-col items-center gap-4 z-50">
                <div className="w-full max-w-sm flex flex-col gap-4">
                    <div className="flex gap-4">
                        <Link
                            to={`/menu/${order.tableNumber.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex-1 btn bg-primary text-background h-16 text-sm font-black shadow-2xl flex items-center justify-center gap-3 tracking-widest uppercase hover:brightness-110 transition-all"
                        >
                            <FiPlus className="text-xl" /> Add More
                        </Link>

                        {(order.status === 'placed' || order.status === 'assigned') && (
                            <button
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to cancel this botanical order?')) {
                                        try {
                                            await axios.put(`/api/orders/${orderId}/cancel`);
                                            // Status will update via polling
                                        } catch (err) {
                                            alert(err.response?.data?.message || 'Failed to cancel order');
                                        }
                                    }
                                }}
                                className="flex-1 btn bg-red-500/10 text-red-500 border border-red-500/20 h-16 text-sm font-black shadow-2xl flex items-center justify-center gap-3 tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <button className="w-full btn btn-primary h-16 text-xl shadow-2xl flex items-center justify-center gap-4 tracking-widest uppercase shadow-black/40">
                        <FiCheck className="text-3xl" /> Settle Bill
                    </button>
                </div>
                <p className="text-center text-[9px] text-text-muted/40 font-black uppercase tracking-[0.4em]">Botanical Transaction • Secure</p>
            </div>
        </div>
    );
};

export default OrderStatus;
