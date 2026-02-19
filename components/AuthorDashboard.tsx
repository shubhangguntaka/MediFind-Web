
import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthorUser, Medicine } from '../types';
import { useToast } from '../contexts/ToastContext';

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);
const StoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
        <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 016 14.25zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 016 17.25zm9-3a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0115 14.25zm0 3a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0115 17.25z" clipRule="evenodd" />
    </svg>
);

// ─── Stock Badge ──────────────────────────────────────────────────────────────
const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
    if (stock === 0) return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
            Out of Stock
        </span>
    );
    if (stock <= 20) return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Low: {stock}
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            In Stock: {stock}
        </span>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AuthorDashboard: React.FC = () => {
    const { user, updateInventory } = useAuth();
    const { showToast } = useToast();
    const author = user as AuthorUser;

    const [editStock, setEditStock] = useState<{ [key: string]: string }>({});
    const [newItemName, setNewItemName] = useState('');
    const [newItemBrands, setNewItemBrands] = useState('');
    const [newItemStock, setNewItemStock] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [deletingItem, setDeletingItem] = useState<string | null>(null);

    const inventory: Medicine[] = author?.inventory ?? [];

    const filteredInventory = useMemo(() => {
        if (!searchFilter.trim()) return inventory;
        const q = searchFilter.toLowerCase();
        return inventory.filter(
            item =>
                item.name.toLowerCase().includes(q) ||
                item.brands.some(b => b.toLowerCase().includes(q))
        );
    }, [inventory, searchFilter]);

    // Stats
    const totalItems = inventory.length;
    const inStockCount = inventory.filter(i => i.stock > 0).length;
    const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock <= 20).length;
    const outOfStockCount = inventory.filter(i => i.stock === 0).length;

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
        showToast(`Stock for "${name}" updated.`, 'success');
        setIsSaving(false);
    };

    const handleDeleteItem = async (name: string) => {
        setDeletingItem(name);
        const newInventory = inventory.filter(item => item.name !== name);
        await updateInventory(newInventory);
        showToast(`"${name}" removed from inventory.`, 'success');
        setDeletingItem(null);
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const stock = parseInt(newItemStock, 10);
        if (!newItemName.trim() || isNaN(stock) || stock < 0) {
            showToast('Please fill in a valid name and stock.', 'error');
            return;
        }
        if (inventory.some(item => item.name.toLowerCase() === newItemName.trim().toLowerCase())) {
            showToast('A medicine with this generic name already exists.', 'error');
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
        showToast(`"${newItem.name}" added to inventory!`, 'success');
        setIsSaving(false);
    };

    // ── No profile yet (fallback user, profiles table not set up) ───────────────
    if (!author?.storeName) {
        return (
            <main className="container mx-auto px-4 pb-16 max-w-3xl">
                <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
                    <StoreIcon />
                    <h2 className="mt-4 text-xl font-bold text-amber-800 dark:text-amber-300">Store Profile Not Set Up</h2>
                    <p className="mt-2 text-amber-700 dark:text-amber-400 max-w-md mx-auto text-sm">
                        Your pharmacy profile wasn't found in the database. This usually means the Supabase
                        <code className="mx-1 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 rounded font-mono text-xs">profiles</code>
                        table hasn't been created yet, or your registration didn't save the profile row.
                    </p>
                    <div className="mt-6 text-left bg-white dark:bg-slate-800 rounded-xl p-5 border border-amber-200 dark:border-amber-800 max-w-md mx-auto">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick fix:</p>
                        <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                            <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">Supabase Dashboard</a></li>
                            <li>Open the SQL Editor and run the profiles table SQL</li>
                            <li>Re-register your pharmacy account</li>
                        </ol>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 pb-16 max-w-5xl space-y-6">

            {/* ── Store header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <StoreIcon />
                    </div>
                    <div>
                        <p className="text-primary-100 text-sm font-medium">Pharmacy Dashboard</p>
                        <h2 className="text-2xl font-black tracking-tight">{author.storeName}</h2>
                        <p className="text-primary-200 text-sm mt-0.5 truncate max-w-xs">{author.address}</p>
                    </div>
                </div>
            </div>

            {/* ── Stats row ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Medicines', value: totalItems, color: 'text-gray-800 dark:text-gray-100', bg: 'bg-white dark:bg-slate-800' },
                    { label: 'In Stock', value: inStockCount, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Low Stock', value: lowStockCount, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Out of Stock', value: outOfStockCount, color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
                ].map(stat => (
                    <div key={stat.label} className={`${stat.bg} border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm`}>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Add new medicine ─────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <span className="p-1.5 bg-primary-100 dark:bg-primary-900/40 rounded-lg text-primary-600">
                            <PlusIcon />
                        </span>
                        Add New Medicine
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a new item to your store's live inventory.</p>
                </div>
                <form onSubmit={handleAddItem} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4">
                        <label htmlFor="newItemName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Generic Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="newItemName"
                            type="text"
                            value={newItemName}
                            onChange={e => setNewItemName(e.target.value)}
                            placeholder="e.g., Paracetamol 650mg"
                            required
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <label htmlFor="newItemBrands" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Brand Names <span className="text-gray-400 font-normal">(comma-separated)</span>
                        </label>
                        <input
                            id="newItemBrands"
                            type="text"
                            value={newItemBrands}
                            onChange={e => setNewItemBrands(e.target.value)}
                            placeholder="e.g., Dolo 650, Calpol"
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="newItemStock" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Initial Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="newItemStock"
                            type="number"
                            min="0"
                            value={newItemStock}
                            onChange={e => setNewItemStock(e.target.value)}
                            placeholder="e.g., 100"
                            required
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
                        >
                            <PlusIcon />
                            {isSaving ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Inventory list ───────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Inventory</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {filteredInventory.length} of {totalItems} medicines shown
                        </p>
                    </div>
                    <div className="relative max-w-xs w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </span>
                        <input
                            type="search"
                            value={searchFilter}
                            onChange={e => setSearchFilter(e.target.value)}
                            placeholder="Filter by name or brand..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                    {filteredInventory.length > 0 ? filteredInventory.map(item => (
                        <div
                            key={item.name}
                            className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            {/* Medicine info */}
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
                                    <StockBadge stock={item.stock} />
                                </div>
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {item.brands.length > 0
                                        ? item.brands.map(brand => (
                                            <span key={brand} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                                                {brand}
                                            </span>
                                        ))
                                        : <span className="text-xs text-gray-400 italic">No brands listed</span>
                                    }
                                </div>
                            </div>

                            {/* Stock edit + delete */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <label htmlFor={`stock-${item.name}`} className="sr-only">Stock for {item.name}</label>
                                <input
                                    id={`stock-${item.name}`}
                                    type="number"
                                    min="0"
                                    value={editStock[item.name] ?? item.stock}
                                    onChange={e => handleStockChange(item.name, e.target.value)}
                                    className="w-24 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <button
                                    onClick={() => handleUpdateStock(item.name)}
                                    disabled={isSaving || !editStock[item.name] || editStock[item.name] === String(item.stock)}
                                    className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => handleDeleteItem(item.name)}
                                    disabled={deletingItem === item.name}
                                    title={`Remove ${item.name}`}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors disabled:opacity-40"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-16 px-8">
                            {searchFilter ? (
                                <>
                                    <p className="text-lg font-bold text-gray-600 dark:text-gray-300">No matches for "{searchFilter}"</p>
                                    <p className="mt-1 text-sm text-gray-400">Try a different medicine name or brand.</p>
                                    <button onClick={() => setSearchFilter('')} className="mt-4 text-primary-600 text-sm font-semibold hover:underline">
                                        Clear filter
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">💊</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Inventory is empty</p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use the form above to add your first medicine.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AuthorDashboard;
