import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiUser, FiX, FiCheck, FiShield } from 'react-icons/fi';
import axios from 'axios';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'chef'
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await axios.get('/api/users/staff');
            setStaff(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/users/staff', formData);
            setStaff([...staff, res.data]);
            setFormData({ name: '', email: '', password: '', role: 'chef' });
            setIsAdding(false);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add staff member");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Rescind access for this staff member?")) return;
        try {
            await axios.delete(`/api/users/staff/${id}`);
            setStaff(staff.filter(s => s._id !== id));
        } catch (err) {
            alert("Failed to remove staff member");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-center font-rounded font-black text-primary">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="uppercase tracking-widest text-[10px] opacity-40">Verifying Credentials...</p>
        </div>
    );

    return (
        <div className="font-rounded pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-primary mb-2 tracking-tighter">Botanical Staffing</h2>
                    <p className="text-text-muted font-bold text-sm leading-relaxed opacity-60">Manage your team of culinary artisans and stewards.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary h-14 px-8 text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-black/20"
                >
                    {isAdding ? <><FiX /> Cancel</> : <><FiPlus /> New Staff</>}
                </button>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-surface rounded-3xl p-10 border border-primary/10 shadow-2xl mb-12"
                    >
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                            <div>
                                <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field h-14 text-primary"
                                    placeholder="Employee Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Email Identity</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field h-14 text-primary"
                                    placeholder="email@dinefine.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Passcode</label>
                                <input
                                    type="password"
                                    required
                                    className="input-field h-14 text-primary"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-2">Operational Role</label>
                                    <select
                                        className="input-field h-14 bg-background/50 text-primary border-white/10"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="chef">Chef</option>
                                        <option value="supplier">Supplier</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary h-14 w-14 shadow-2xl flex items-center justify-center">
                                    <FiCheck className="text-xl" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {staff.map(member => (
                    <motion.div
                        key={member._id}
                        layout
                        className="bg-surface rounded-3xl p-8 border border-primary/5 hover:border-primary/10 transition-all shadow-2xl relative group"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-background flex items-center justify-center text-secondary text-3xl mb-6 shadow-inner relative overflow-hidden">
                                {member.role === 'admin' ? <FiShield /> : <FiUser />}
                                <div className="absolute inset-0 bg-secondary/5 blur-xl"></div>
                            </div>
                            <h3 className="font-black text-xl text-primary tracking-tighter mb-1">{member.name}</h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 opacity-40">{member.email}</p>

                            <div className="bg-background/40 px-6 py-2 rounded-xl border border-white/5 inline-block mb-3">
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${member.role === 'admin' ? 'text-accent' : 'text-secondary'}`}>
                                    {member.role === 'admin' ? 'Administrator' : member.role === 'chef' ? 'Culinary Chef' : 'Operations/Supplier'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDelete(member._id)}
                            className="absolute top-6 right-6 text-text-muted/20 hover:text-[#FF8A95] transition-colors p-2 opacity-0 group-hover:opacity-100"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StaffManagement;
