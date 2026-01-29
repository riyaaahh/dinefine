import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiImage, FiGrid } from 'react-icons/fi';
import axios from 'axios';

const MenuManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Main',
        description: '',
        image: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const res = await axios.get('/api/menu');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/menu', formData);
            setItems([...items, res.data]);
            setFormData({ name: '', price: '', category: 'Main', description: '', image: '', isAvailable: true });
            setIsAdding(false);
        } catch (err) {
            alert("Failed to create item");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this harvest from the menu?")) return;
        try {
            await axios.delete(`/api/menu/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (err) {
            alert("Failed to delete item");
        }
    };

    const toggleAvailability = async (item) => {
        try {
            const res = await axios.put(`/api/menu/${item._id}`, { isAvailable: !item.isAvailable });
            setItems(items.map(i => i._id === item._id ? res.data : i));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-center font-rounded font-black text-primary">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="uppercase tracking-widest text-[10px] opacity-40">Synchronizing Harvests...</p>
        </div>
    );

    return (
        <div className="font-rounded pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-primary mb-2 tracking-tighter">Menu Curation</h2>
                    <p className="text-text-muted font-bold text-sm leading-relaxed opacity-60">Architect your organic offerings and seasonal pricing.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary h-14 px-8 text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-black/20"
                >
                    {isAdding ? <><FiX /> Cancel</> : <><FiPlus /> New Item</>}
                </button>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-surface rounded-[4rem] p-10 border border-primary/10 shadow-2xl mb-12 relative overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Item Identity</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field h-14 text-primary"
                                        placeholder="e.g. Truffle Mushroom Risotto"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Category</label>
                                        <select
                                            className="input-field h-14 bg-background/50 text-primary border-white/10"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="Starter">Starter</option>
                                            <option value="Main">Main</option>
                                            <option value="Dessert">Dessert</option>
                                            <option value="Drinks">Drinks</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Price ($)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field h-14 text-primary"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Botanical Desc</label>
                                    <textarea
                                        className="input-field h-[164px] !py-4 text-primary resize-none"
                                        placeholder="Describe the sensory experience..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Imagery URL (Optional)</label>
                                <div className="flex gap-4">
                                    <input
                                        type="url"
                                        className="input-field h-14 flex-1 text-primary"
                                        placeholder="https://images.unsplash.com/..."
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                    <button type="submit" className="btn btn-primary h-14 px-12 shadow-2xl flex items-center gap-3">
                                        <FiCheck className="text-xl" /> <span className="text-[11px] uppercase tracking-[0.2em]">Add Harvest</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map(item => (
                    <motion.div
                        key={item._id}
                        layout
                        className="bg-primary rounded-[3rem] p-6 border border-primary/5 hover:border-secondary transition-all shadow-2xl flex flex-col relative group overflow-hidden"
                    >
                        <div className="w-full h-52 bg-background rounded-[2.5rem] mb-6 overflow-hidden relative border border-[#1A3C34]/5">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🍃</div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="bg-background px-4 py-1.5 rounded-xl border border-white/10 text-[9px] font-black text-primary uppercase tracking-widest shadow-xl">
                                    {item.category}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="absolute top-4 right-4 w-10 h-10 bg-background/20 backdrop-blur-md rounded-xl flex items-center justify-center text-[#1A3C34] border border-[#1A3C34]/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF8A95] hover:text-white"
                            >
                                <FiTrash2 />
                            </button>
                        </div>

                        <div className="flex-1 px-2">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-black text-2xl text-background tracking-tighter leading-tight">{item.name}</h3>
                                <span className="text-2xl font-black text-background/60 tracking-tighter">${item.price}</span>
                            </div>
                            <p className="text-background/60 text-sm font-bold line-clamp-2 leading-relaxed italic mb-8">
                                {item.description || "A masterfully crafted seasonal offering."}
                            </p>

                            <div className="mt-auto pt-6 border-t border-background/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        onClick={() => toggleAvailability(item)}
                                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-500 shadow-inner ${item.isAvailable ? 'bg-background' : 'bg-background/20'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-primary transition-all duration-500 shadow-sm ${item.isAvailable ? 'left-7' : 'left-1'}`}></div>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${item.isAvailable ? 'text-background' : 'text-background/40'}`}>
                                        {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                                <button className="p-3 text-background/40 hover:text-background transition-colors">
                                    <FiEdit2 size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MenuManagement;
