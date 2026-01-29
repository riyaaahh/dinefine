import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FiDownload, FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const TableManagement = () => {
    const [tables, setTables] = useState([]);
    const [newTableNumber, setNewTableNumber] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch tables from backend
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get('/api/tables');
                setTables(res.data);
            } catch (err) {
                console.error("Failed to fetch tables", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    const addTable = async (e) => {
        e.preventDefault();
        if (!newTableNumber.trim()) return;

        try {
            const res = await axios.post('/api/tables', { number: newTableNumber });
            setTables([...tables, res.data]);
            setNewTableNumber('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add table');
        }
    };

    const removeTable = async (id) => {
        if (!window.confirm('Are you sure you want to remove this table?')) return;

        try {
            await axios.delete(`/api/tables/${id}`);
            setTables(tables.filter(t => t._id !== id));
        } catch (err) {
            alert('Failed to remove table');
        }
    };

    const downloadQRCode = (tableNumber) => {
        const canvas = document.getElementById(`qr-code-${tableNumber}`);
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `table-${tableNumber}-qr.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    const getMenuUrl = (tableNumber) => `${baseUrl}/menu/${tableNumber}`;

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-center font-rounded">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-muted font-black uppercase tracking-widest text-[10px] animate-pulse">Syncing Tables...</p>
        </div>
    );

    return (
        <div className="space-y-10 font-rounded">
            <div className="bg-surface rounded-[3rem] p-10 border border-primary/5 shadow-2xl relative overflow-hidden">
                <header className="mb-10 relative z-10">
                    <h2 className="text-3xl font-black text-primary mb-3 tracking-tighter">Table & QR Orchestration</h2>
                    <p className="text-text-muted font-bold text-sm leading-relaxed max-w-2xl opacity-70">
                        Generate and distribute botanical QR signatures. <br />
                        Guests can scan these to explore your menu and place organic orders.
                    </p>
                </header>

                <form onSubmit={addTable} className="relative z-10 flex flex-col sm:flex-row gap-6 items-stretch sm:items-end bg-background/40 p-8 rounded-[2.5rem] border border-white/5 max-w-2xl shadow-inner">
                    <div className="flex-1">
                        <label className="block text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2" htmlFor="tableNumber">
                            Designate New Table
                        </label>
                        <input
                            id="tableNumber"
                            type="text"
                            value={newTableNumber}
                            onChange={(e) => setNewTableNumber(e.target.value)}
                            placeholder="e.g. 12 or A1"
                            className="input-field h-14 bg-background/50 border-white/10 text-primary placeholder:text-text-muted/30"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary h-14 px-8 text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-black/20"
                    >
                        <FiPlus /> Add Table
                    </button>
                </form>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-primary/5"></div>
                <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.4em]">Active Botanical QR Tags</h3>
                <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-primary/5"></div>
            </div>

            {tables.length === 0 ? (
                <div className="text-center py-24 rounded-[3rem] border-2 border-dashed border-primary/5 text-text-muted font-black uppercase tracking-widest text-xs opacity-30">
                    Garden is empty. Add a table to begin.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tables.map((table) => (
                        <div key={table._id} className="bg-surface rounded-[3rem] p-8 flex flex-col items-center text-center group border border-primary/5 hover:border-primary/20 transition-all shadow-2xl relative">
                            <button
                                onClick={() => removeTable(table._id)}
                                className="absolute top-6 right-6 text-text-muted/40 hover:text-[#FF8A95] transition-colors p-2"
                                title="Remove table"
                            >
                                <FiTrash2 size={20} />
                            </button>

                            <div className="bg-white p-6 rounded-[2.5rem] mb-6 shadow-2xl shadow-black/40">
                                <QRCodeCanvas
                                    id={`qr-code-${table.number}`}
                                    value={getMenuUrl(table.number)}
                                    size={140}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>

                            <h4 className="text-2xl font-black text-primary mb-2 tracking-tighter">Table {table.number}</h4>
                            <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-6 opacity-40 truncate w-full px-2 italic">{getMenuUrl(table.number)}</p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => downloadQRCode(table.number)}
                                    className="flex-1 btn bg-background text-primary border border-primary/10 hover:bg-primary hover:text-background text-[10px] font-black uppercase tracking-widest tracking-[0.2em] py-4 rounded-2xl shadow-xl transition-all"
                                >
                                    <FiDownload /> Download PNG
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TableManagement;
