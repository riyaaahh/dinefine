import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background overflow-hidden relative">
            {/* Decorative Sage Accents - "Green is more" */}
            <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-[#2D5A4C] rounded-full opacity-30 blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-5%] right-[-10%] w-[50%] h-[50%] bg-[#C5D86D] rounded-full opacity-10 blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: 'spring' }}
                className="text-center mb-16 relative z-10"
            >
                <h1 className="text-7xl md:text-9xl lg:text-[8rem] font-black text-primary mb-6 drop-shadow-2xl tracking-tighter leading-none">
                    dinefine
                </h1>
                <p className="text-base md:text-2xl text-primary font-bold  tracking-[0.2em] mb-4">
                    life begins after fine meals
                </p>
                <p className="mt-8 text-sm md:text-base text-text-muted max-w-md mx-auto font-medium leading-relaxed">
                    A premium botanical dining experience. <br />
                    Seamless QR ordering, powerful management.
                </p>
            </motion.div>

            <div className="flex flex-wrap gap-8 justify-center relative z-10">
                <Link to="/login" className="btn btn-primary min-w-[240px] h-16 text-lg tracking-widest uppercase">
                    Staff Portal
                </Link>
                <Link to="/menu/table-01" className="btn bg-transparent text-primary border-2 border-primary/30 hover:bg-primary/10 hover:border-primary min-w-[240px] h-16 text-lg font-black tracking-widest uppercase transition-all">
                    Explore Menu
                </Link>
            </div>

            <div className="absolute bottom-10 left-0 right-0 text-center z-10">
                <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.5em] opacity-40">Est. 2026 • DineFine Organic</p>
            </div>
        </div>
    );
};

export default Home;
