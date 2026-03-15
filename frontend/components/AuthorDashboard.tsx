
import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthorUser, Medicine } from '../types';
import { useToast } from '../contexts/ToastContext';

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AuthorDashboard: React.FC = () => {
    const { user, updateInventory } = useAuth();
    const { showToast } = useToast();
    const author = user as AuthorUser;

    const [editStock, setEditStock] = useState<{ [key: string]: string }>({});
    const [newItemName, setNewItemName] = useState('');
    const [newItemBrands, setNewItemBrands] = useState('');
    const [newItemStock, setNewItemStock] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

    // Show timeout message after 5 seconds if still "loading"
    React.useEffect(() => {
        const timer = setTimeout(() => setShowTimeoutMessage(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    const inventory: Medicine[] = author?.inventory ?? [];

    const handleStockChange = (name: string, value: string) => {
        setEditStock(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateStock = async (name: string) => {
        const newStockValue = parseInt(editStock[name], 10);
        if (isNaN(newStockValue) || newStockValue < 0) {
            showToast('Please enter a valid stock number.', 'error');
            return;
        }
        setIsSaving(true);
        const newInventory = inventory.map(item =>
            item.name === name ? { ...item, stock: newStockValue } : item
        );
        await updateInventory(newInventory);
        setEditStock(prev => {
            const s = { ...prev };
            delete s[name];
            return s;
        });
        showToast(`Stock updated.`, 'success');
        setIsSaving(false);
    };

    const handleDeleteItem = async (name: string) => {
        if (!window.confirm(`Are you sure you want to remove ${name} from your inventory?`)) return;
        setIsSaving(true);
        const newInventory = inventory.filter(item => item.name !== name);
        await updateInventory(newInventory);
        showToast(`Item removed.`, 'info');
        setIsSaving(false);
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const stock = parseInt(newItemStock, 10);
        if (!newItemName.trim() || isNaN(stock) || stock < 0) {
            showToast('Valid name and stock required.', 'error');
            return;
        }
        setIsSaving(true);
        const brands = newItemBrands.split(',').map(b => b.trim()).filter(Boolean);
        const newItem: Medicine = { name: newItemName.trim(), brands, stock };
        const newInventory = [...inventory, newItem].sort((a, b) => a.name.localeCompare(b.name));
        await updateInventory(newInventory);
        setNewItemName('');
        setNewItemBrands('');
        setNewItemStock('');
        showToast(`Item added.`, 'success');
        setIsSaving(false);
    };

    if (!author?.storeName) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading pharmacy data...</p>
                {showTimeoutMessage && (
                    <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl max-w-md animate-fade-in">
                        <h3 className="text-red-800 dark:text-red-300 font-bold mb-2">Store Profile Not Found</h3>
                        <p className="text-sm text-red-700 dark:text-red-400 mb-6">
                            We couldn't link your account to a pharmacy store. This usually happens if the database setup is incomplete or there was an error during registration.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => window.location.reload()}
                                className="w-full py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
                            >
                                Retry Sync
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                className="w-full py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50"
                            >
                                Try Relogging
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            
            {/* Add New Medicine */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Medicine</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a new item to your store's inventory list.</p>
                    
                    <form onSubmit={handleAddItem} className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Generic Name</label>
                            <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="e.g., Paracetamol" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-slate-600 rounded-lg dark:text-white" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Brand Names (comma-separated)</label>
                            <input value={newItemBrands} onChange={e => setNewItemBrands(e.target.value)} placeholder="e.g., Calpol, Dolo 650" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-slate-600 rounded-lg dark:text-white" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Stock</label>
                            <input type="number" min="0" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} placeholder="e.g., 100" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#334155] border border-gray-200 dark:border-slate-600 rounded-lg dark:text-white" />
                        </div>
                        <div className="md:col-span-1">
                            <button type="submit" disabled={isSaving} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                                {isSaving ? '...' : 'Add Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Your Inventory */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Inventory</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        View and update stock levels for <span className="font-bold text-gray-700 dark:text-gray-200">{author.storeName}</span>.
                    </p>

                    <div className="mt-8 space-y-4">
                        {inventory.length > 0 ? inventory.map(item => (
                            <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 dark:bg-[#0f172a] rounded-xl border border-gray-100 dark:border-slate-800">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {item.brands.map(b => (
                                            <span key={b} className="px-2 py-0.5 bg-gray-200 dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 rounded text-[10px] font-bold uppercase">{b}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="number" 
                                        min="0" 
                                        value={editStock[item.name] ?? item.stock} 
                                        onChange={e => handleStockChange(item.name, e.target.value)}
                                        className="w-24 px-4 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-600 rounded-lg text-center font-bold dark:text-white"
                                    />
                                    <button 
                                        onClick={() => handleUpdateStock(item.name)}
                                        disabled={isSaving || !editStock[item.name] || editStock[item.name] === String(item.stock)}
                                        className="px-6 py-2 bg-slate-200 dark:bg-[#334155] text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-30"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteItem(item.name)}
                                        disabled={isSaving}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete Item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-400 italic">No medicines in inventory yet.</div>
                        )}
                    </div>
                </div>
            </div>

        </main>
    );
};

export default AuthorDashboard;
