import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiRefreshCw, FiMoon, FiSun, FiGlobe, FiBell, FiLock } from 'react-icons/fi';
import axios from 'axios';

const Settings = () => {
    const [seeding, setSeeding] = useState(false);

    const handleSeed = async () => {
        if (!window.confirm("This will reset all menu items to default. Continue?")) return;
        setSeeding(true);
        try {
            await axios.post('/api/menu/seed');
            alert("Menu has been reset to defaults.");
            window.location.reload();
        } catch (err) {
            alert("Seeding failed.");
        } finally {
            setSeeding(false);
        }
    };

    const configSections = [
        {
            title: 'Visual Identity',
            icon: FiSun,
            desc: 'Customize your botanical branding and digital atmosphere.',
            options: ['Deep Forest Mode (Active)', 'Soft Sage Theme', 'Organic Minimalism']
        },
        {
            title: 'Guest Experience',
            icon: FiGlobe,
            desc: 'Managed digital menu localization and seating logic.',
            options: ['Auto-localize Currency', 'QR Intelligence', 'Digital Bill Settlement']
        },
        {
            title: 'Operational Security',
            icon: FiLock,
            desc: 'Configure staff access levels and encrypted protocols.',
            options: ['Two-Factor Identity', 'Session Harvesting', 'Audit Trail']
        }
    ];

    return (
        <div className="font-rounded pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-primary mb-2 tracking-tighter">System Configuration</h2>
                    <p className="text-text-muted font-bold text-sm leading-relaxed opacity-60">Fine-tune your botanical sanctuary's operational parameters.</p>
                </div>
                <button className="btn btn-primary h-14 px-8 text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-black/20 flex items-center gap-3">
                    <FiSave size={18} /> Preserve Changes
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {configSections.map((section, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-surface rounded-3xl p-10 border border-primary/5 shadow-2xl relative overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center text-secondary text-2xl shadow-inner border border-white/5">
                                <section.icon />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-primary tracking-tighter">{section.title}</h3>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">{section.desc}</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            {section.options.map((opt, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-background/40 border border-white/5 group hover:bg-background/60 transition-all cursor-pointer">
                                    <span className="text-sm font-bold text-primary/70 group-hover:text-primary">{opt}</span>
                                    <div className={`w-5 h-5 rounded-md border-2 ${idx === 0 ? 'bg-secondary border-secondary' : 'border-primary/10'}`}></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-surface rounded-3xl p-10 border border-primary/5 shadow-2xl overflow-hidden flex flex-col border-l-4 border-l-[#FF8A95]/20"
                >
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-[#FF8A95]/10 rounded-2xl flex items-center justify-center text-[#FF8A95] text-2xl shadow-inner border border-[#FF8A95]/10">
                            <FiRefreshCw className={seeding ? 'animate-spin' : ''} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-primary tracking-tighter text-[#FF8A95]">Reset Harvest</h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">Irreversible Botanical Factory Reset</p>
                        </div>
                    </div>

                    <p className="text-sm text-text-muted font-bold leading-relaxed mb-8 opacity-70">
                        Warning: This will purge all customized menu items and restore the digital menu to its original ceremonial seed data.
                    </p>

                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        className="mt-auto btn bg-[#FF8A95]/10 text-[#FF8A95] border border-[#FF8A95]/20 hover:bg-[#FF8A95] hover:text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all disabled:opacity-50"
                    >
                        {seeding ? 'Purging Records...' : 'Execute Recovery Seed'}
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
