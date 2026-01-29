import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiChevronLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CustomerMenu = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [menuItems, setMenuItems] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Menu & Active Order
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuRes, orderRes] = await Promise.all([
                    axios.get('/api/menu'),
                    axios.get(`/api/orders/active/table-${tableId ? tableId.replace(/\D/g, '') : '01'}`)
                ]);
                setMenuItems(menuRes.data);
                setActiveOrder(orderRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Optional: Poll for order updates or use Socket.io
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`/api/orders/active/table-${tableId ? tableId.replace(/\D/g, '') : '01'}`);
                setActiveOrder(res.data);
            } catch (err) {
                console.error("Failed to update active order", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [tableId]);

    const addToCart = (item) => setCart([...cart, item]);
    const removeFromCart = (itemIndex) => setCart(cart.filter((_, i) => i !== itemIndex));

    const placeOrder = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const items = cart.map(item => ({
                menuItem: item._id,
                name: item.name,
                price: item.price,
                quantity: 1
            }));
            const totalAmount = cart.reduce((a, b) => a + b.price, 0);

            if (activeOrder) {
                // Add to existing order
                await axios.put(`/api/orders/${activeOrder._id}/items`, { items, totalAmount });
                setCart([]);
                navigate(`/order-status/${activeOrder._id}`);
            } else {
                // Create new order
                const orderData = {
                    tableNumber: `Table ${tableId ? tableId.replace(/\D/g, '') : '1'}`,
                    items,
                    totalAmount
                };
                const res = await axios.post('/api/orders', orderData);
                setCart([]);
                navigate(`/order-status/${res.data._id}`);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update botanical basket");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredMenu = activeCategory === 'All'
        ? menuItems
        : menuItems.filter(m => m.category === activeCategory);

    if (loading) return <div className="text-white text-center p-10">Loading Menu...</div>;

    return (
        <div className="min-h-screen bg-background pb-32 font-rounded">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-lg border-b border-primary/10 p-5">
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-black text-primary tracking-tighter">dinefine</h1>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em]">Table {tableId ? tableId.replace(/\D/g, '') : '1'}</p>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-surface border border-primary/20 flex items-center justify-center relative shadow-xl text-primary">
                        <FiShoppingCart className="text-xl" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-surface rounded-full text-[10px] flex items-center justify-center font-black shadow-lg">{cart.length}</span>
                        )}
                    </button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-4 mt-8 overflow-x-auto pb-2 scrollbar-hide max-w-2xl mx-auto">
                    {['All', 'Starter', 'Main', 'Dessert', 'Drinks'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`category-pill px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${activeCategory === cat
                                ? 'bg-primary text-background shadow-xl scale-105'
                                : 'bg-surface/50 text-text-muted border border-primary/10 hover:border-primary/40'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Order Banner - Green & Sage */}
            <AnimatePresence>
                {activeOrder && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-5 max-w-5xl mx-auto"
                        onClick={() => navigate(`/order-status/${activeOrder._id}`)}
                    >
                        <div className="bg-primary border border-secondary/20 rounded-[2.5rem] p-6 flex items-center justify-between cursor-pointer group hover:bg-white/5 transition-all shadow-2xl shadow-black/20">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-3xl bg-background flex items-center justify-center text-secondary text-4xl shadow-inner">
                                    {activeOrder.status === 'preparing' ? '🍵' : activeOrder.status === 'ready' ? '🛎️' : '📝'}
                                </div>
                                <div>
                                    <h4 className="text-background font-black text-xl tracking-tight">Track Progress</h4>
                                    <p className="text-background/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                                        {activeOrder.status} • #{activeOrder._id.slice(-4)}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-background text-primary text-2xl">
                                <FiPlus className="rotate-45" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Menu Grid - No White, Just Deep Green Cards */}
            <div className="p-5 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {filteredMenu.map(item => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-primary rounded-[3rem] p-5 flex gap-6 border border-primary/5 hover:border-secondary/20 transition-all cursor-pointer group shadow-2xl"
                    >
                        <div className="w-32 h-32 md:w-36 md:h-36 bg-background rounded-[2.5rem] flex-shrink-0 overflow-hidden relative border border-[#1A3C34]/10">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">🍃</div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-2">
                            <div>
                                <h3 className="font-black text-background text-2xl leading-tight mb-2 tracking-tight group-hover:text-background/80 transition-colors">{item.name}</h3>
                                <p className="text-sm text-background/60 line-clamp-2 font-medium leading-relaxed italic">
                                    {item.description || "An organic harvest prepared with artisanal care."}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <span className="font-black text-background/80 text-2xl tracking-tighter">${item.price}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(item);
                                    }}
                                    className="w-14 h-14 rounded-2xl bg-background text-primary flex items-center justify-center text-3xl shadow-xl hover:bg-secondary transition-all active:scale-90"
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Floating Checkout - Solid Deep Theme */}
            <AnimatePresence>
                {cart.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-10 left-0 right-0 px-6 flex justify-center z-30"
                    >
                        <div className="w-full max-w-lg bg-primary text-background rounded-[3rem] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-background flex items-center justify-center font-black text-primary text-2xl shadow-inner">
                                    {cart.length}
                                </div>
                                <div>
                                    <p className="text-[10px] text-background/40 font-black uppercase tracking-[0.2em] mb-1">Basket Total</p>
                                    <p className="text-3xl font-black tracking-tighter leading-none">${cart.reduce((a, b) => a + b.price, 0)}</p>
                                </div>
                            </div>
                            <button
                                onClick={placeOrder}
                                disabled={loading}
                                className="bg-secondary text-background hover:brightness-110 h-16 px-12 text-xl rounded-3xl font-black shadow-2xl tracking-widest uppercase transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : activeOrder ? 'Add to Order' : 'Place Order'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerMenu;
