import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/users/login', { email, password });
            const user = res.data;

            // Store user info
            localStorage.setItem('userInfo', JSON.stringify(user));

            // Role-based navigation
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'chef') navigate('/chef');
            else if (user.role === 'supplier') navigate('/supplier');
            else navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Botanical access denied. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden font-rounded">
            {/* Deep decorative sage elements */}
            <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-[#2D5A4C] rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-[#C5D86D] rounded-full blur-[120px] opacity-10"></div>

            <motion.div
                className="bg-surface w-full max-w-md p-12 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-primary mb-2 tracking-tighter">dinefine</h1>
                    <h2 className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em]">
                        Botanical Staff Portal
                    </h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div>
                        <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-3 ml-2">Email Identity</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field h-16 text-lg"
                            placeholder="staff@dinefine.botany"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-text-muted uppercase tracking-widest mb-3 ml-2">Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field h-16 text-lg"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-5 text-xl mt-6 uppercase tracking-widest leading-none shadow-2xl disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Enter Workspace'}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-text-muted/40 uppercase tracking-[0.3em] mb-6">Secured Access Only</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Admin', 'Chef', 'Supplier'].map(role => (
                            <button
                                key={role}
                                onClick={() => setEmail(`${role.toLowerCase()}@dinefine.com`)}
                                className="px-5 py-2.5 rounded-2xl bg-primary/5 text-primary text-[10px] font-black hover:bg-primary hover:text-background transition-all border border-primary/10 tracking-widest uppercase"
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
