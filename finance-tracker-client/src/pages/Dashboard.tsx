import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    TrendingUp, TrendingDown, DollarSign, Activity, Bell, Search, Menu, X,
    Settings, LogOut, Plus, Calendar, FileText, Home, CreditCard, PieChart as PieChartIcon,
    Wallet, ArrowUpRight, ArrowDownRight, Filter, Download
} from 'lucide-react';
import axios from 'axios';

// API Configuration
const API_URL = 'https://localhost:7120/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add axios interceptor for token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
    (response) => response,

    (error) => {
        console.log('Interceptor error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

// API Service
const api = {
    // Transactions
    getTransactions: async () => {
        const response = await axios.get('/transactions');
        return response.data;
    },
    createTransaction: async (transaction: any) => {
        const response = await axios.post('/transactions', transaction);
        return response.data;
    },
    deleteTransaction: async (id: number) => {
        await axios.delete(`/transactions/${id}`);
    },

    // Categories
    getCategories: async () => {
        const response = await axios.get('/categories');
        return response.data;
    },
    createCategory: async (category: any) => {
        const response = await axios.post('/categories', category);
        return response.data;
    },

    // Summary
    getSummary: async () => {
        const response = await axios.get('/transactions/summary');
        return response.data;
    },
    getMonthlySummary: async () => {
        const response = await axios.get('/transactions/summary/monthly');
        return response.data;
    },
    getCategorySpending: async () => {
        const response = await axios.get('/transactions/summary/by-category');
        return response.data;
    }
};

// Type definitions
interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: 'Income' | 'Expense';
    categoryId: number;
    categoryName: string;
    date: string;
}

interface Category {
    id: number;
    name: string;
    type: string;
}

interface Summary {
    totalIncome: number;
    totalExpenses: number;
}

interface MonthlySummary {
    month: string;
    totalIncome: number;
    totalExpenses: number;
}

interface CategorySpending {
    categoryName: string;
    totalSpent: number;
}

// Animated Background
const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

            <motion.div
                className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full blur-[150px] opacity-20"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ top: '10%', left: '10%' }}
            />
            <motion.div
                className="absolute w-[500px] h-[500px] bg-blue-600 rounded-full blur-[130px] opacity-20"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ bottom: '10%', right: '10%' }}
            />
        </div>
    );
};

// Glass Card Component
interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", hover = true }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            className={`relative backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={hover ? { scale: 1.02, y: -5 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {isHovered && hover && (
                <motion.div
                    className="absolute w-96 h-96 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                        left: mousePosition.x,
                        top: mousePosition.y,
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                />
            )}

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

interface NavButtonProps {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, isActive = false, onClick }) => {
    return (
        <motion.button
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full mb-2 ${isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            onClick={onClick}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{label}</span>
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r"
                />
            )}
        </motion.button>
    );
};
const testCreateCategory = async () => {
    try {
        console.log('Testing category creation...');

        // Test with the simplest possible category
        const testCategory = {
            name: "Test Category",
            type: "Expense"
        };

        console.log('Sending category data:', testCategory);
        console.log('Request headers will include:', {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        });

        const response = await axios.post('/categories', testCategory);
        console.log('Success! Created category:', response.data);

    } catch (error: any) {
        console.error('Failed to create category');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Response Data:', error.response?.data);
        console.error('Request Config:', error.config);

        // Check if it's a validation error
        if (error.response?.status === 400) {
            console.error('This is a validation error. Server response:');
            console.error(JSON.stringify(error.response.data, null, 2));
        }

        // Check if it's an auth error
        if (error.response?.status === 401) {
            console.error('Authentication error - token might be invalid');
        }
    }
};

// Transaction Modal
interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onSubmit: (data: any) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, categories, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'Expense' as 'Income' | 'Expense',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        console.log('Submitting transaction payload:', {
            title: formData.title,
            amount: parseFloat(formData.amount),
            type: formData.type,
            date: new Date(formData.date).toISOString(),
            categoryId: parseInt(formData.categoryId)
        });

        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount),
            categoryId: parseInt(formData.categoryId),
            date: new Date(formData.date).toISOString()
        });

        // Reset form
        setFormData({
            title: '',
            amount: '',
            type: 'Expense',
            categoryId: '',
            date: new Date().toISOString().split('T')[0]
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const filteredCategories = categories.filter(category => category.type === formData.type);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full max-w-md"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <GlassCard className="p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Add Transaction</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${errors.title ? 'border-red-400' : 'border-white/20'
                                        } text-white placeholder-white/50 focus:outline-none focus:border-purple-400`}
                                    placeholder="e.g., Grocery Shopping"
                                />
                                {errors.title && (
                                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${errors.amount ? 'border-red-400' : 'border-white/20'
                                        } text-white placeholder-white/50 focus:outline-none focus:border-purple-400`}
                                    placeholder="0.00"
                                />
                                {errors.amount && (
                                    <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">Type</label>
                                <div className="flex gap-4">
                                    {['Income', 'Expense'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: type as 'Income' | 'Expense', categoryId: '' })}
                                            className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.type === type
                                                    ? type === 'Income'
                                                        ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                                                        : 'bg-red-500/20 text-red-400 border border-red-400/50'
                                                    : 'bg-white/10 text-white/70 border border-white/20'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className={`w-full px-4 py-2 rounded-lg bg-white/10 border ${errors.categoryId ? 'border-red-400' : 'border-white/20'
                                        } text-white focus:outline-none focus:border-purple-400`}
                                >
                                    <option value="">Select a category</option>
                                    {filteredCategories.map((category) => (
                                        <option key={category.id} value={category.id} className="bg-gray-800">
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-2 rounded-lg bg-white/10 text-white/70 font-medium hover:bg-white/20 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all"
                                >
                                    Add Transaction
                                </button>
                          </div>
                        </form>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Main Dashboard Component
export default function FinanceTrackerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeNav, setActiveNav] = useState('dashboard');
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    // Data states
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [summary, setSummary] = useState<Summary>({ totalIncome: 0, totalExpenses: 0 });
    const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
    const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get user info from token
    const getUserName = () => {
        const token = localStorage.getItem('token');
        if (!token) return 'User';

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            // .NET ClaimTypes create claims with full URI names
            const standardClaimNames = {
                givenName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
                name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
                email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
            };

            // Try to get the first name first (from ClaimTypes.GivenName)
            if (payload[standardClaimNames.givenName]) {
                return payload[standardClaimNames.givenName];
            }

            // Fall back to username (from ClaimTypes.Name)
            if (payload[standardClaimNames.name]) {
                return payload[standardClaimNames.name];
            }

            // Fall back to email if available
            if (payload[standardClaimNames.email]) {
                const emailName = payload[standardClaimNames.email].split('@')[0];
                return emailName.charAt(0).toUpperCase() + emailName.slice(1);
            }

            // Final fallback - check for any short claim names (just in case)
            return payload.given_name || payload.name || payload.firstName || 'User';
        } catch {
            return 'User';
        }
    };

    // Fetch all data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [transactionsData, categoriesData, summaryData, monthlyData, categoryData] = await Promise.all([
                api.getTransactions(),
                api.getCategories(),
                api.getSummary(),
                api.getMonthlySummary(),
                api.getCategorySpending()
            ]);

            // If no categories exist, create default ones
            if (!categoriesData || categoriesData.length === 0) {
                const defaultCategories = [
                    { name: "Food & Dining", type: "Expense" },
                    { name: "Salary", type: "Income" },
                    { name: "Transportation", type: "Expense" },
                    { name: "Freelance", type: "Income" },
                    { name: "Entertainment", type: "Expense" },
                    { name: "Shopping", type: "Expense" },
                    { name: "Healthcare", type: "Expense" },
                    { name: "Investment", type: "Income" },
                    { name: "Utilities", type: "Expense" },
                    { name: "Rent/Mortgage", type: "Expense" },
                    { name: "Insurance", type: "Expense" },
                    { name: "Education", type: "Expense" },
                    { name: "Bonus", type: "Income" },
                    { name: "Other Income", type: "Income" },
                    { name: "Other Expense", type: "Expense" }
                ];

                const createdCategories = [];
                for (const cat of defaultCategories) {
                    try {
                        const created = await api.createCategory(cat);
                        createdCategories.push(created);
                    } catch (error) {
                        console.error('Error creating default category:', error);
                    }
                }
                setCategories(createdCategories);
            } else {
                setCategories(categoriesData);
            }

            setTransactions(transactionsData || []);
            setSummary(summaryData || { totalIncome: 0, totalExpenses: 0 });
            setMonthlySummary(monthlyData || []);
            setCategorySpending(categoryData || []);
        } catch (error: any) {
            console.log('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle new transaction
    const handleNewTransaction = async (transactionData: any) => {
        try {
            await api.createTransaction(transactionData);
            await fetchData(); // Refresh all data
        } catch (error) {
            console.error("❌ Error creating transaction:", error);

            if (error.response) {
                console.error("📦 Server response data:", error.response.data);
                alert(error.response.data?.message || "Something went wrong. Check the console.");
            } else {
                alert("Network error or server not reachable.");
            }
        }
    };

    // Handle delete transaction
    const handleDeleteTransaction = async (id: number) => {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            await api.deleteTransaction(id);
            await fetchData(); // Refresh all data
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction. Please try again.');
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        };

    // Calculate additional metrics
    const balance = summary.totalIncome - summary.totalExpenses;
    const savingsRate = summary.totalIncome > 0
        ? ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome * 100).toFixed(1)
        : '0';

    // Prepare chart data
    const monthlyChartData = monthlySummary.slice(0, 6).reverse().map(item => ({
        month: item.month.split(' ')[0].slice(0, 3),
        income: item.totalIncome,
        expenses: item.totalExpenses,
        savings: item.totalIncome - item.totalExpenses
    }));

    const categoryChartData = categorySpending.map(item => ({
        name: item.categoryName,
        value: item.totalSpent,
        percentage: summary.totalExpenses > 0
            ? ((item.totalSpent / summary.totalExpenses) * 100).toFixed(1)
            : '0'
    }));

    // Colors for pie chart
    const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AnimatedBackground />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AnimatedBackground />
                <GlassCard className="p-8 max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                    <p className="text-white/70 mb-6">{error}</p>
                    <button
                        onClick={fetchData}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all"
                    >
                        Retry
                    </button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative text-white">
            <AnimatedBackground />

            <div className="relative z-10 flex">
                {/* Sidebar */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="w-72 h-screen sticky top-0"
                        >
                            <GlassCard className="h-full rounded-none rounded-r-2xl p-6 flex flex-col" hover={false}>
                                {/* Logo */}
                                <div className="flex items-center gap-3 mb-8">
                                    <motion.div
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Wallet className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                        FinanceTracker
                                    </h1>
                                </div>

                                {/* Navigation - Main section */}
                                <nav className="flex-1 space-y-1">
                                    <NavButton
                                        icon={Home}
                                        label="Dashboard"
                                        isActive={activeNav === 'dashboard'}
                                        onClick={() => setActiveNav('dashboard')}
                                    />
                                    <NavButton
                                        icon={FileText}
                                        label="Transactions"
                                        isActive={activeNav === 'transactions'}
                                        onClick={() => setActiveNav('transactions')}
                                    />
                                    <NavButton
                                        icon={PieChartIcon}
                                        label="Analytics"
                                        isActive={activeNav === 'analytics'}
                                        onClick={() => setActiveNav('analytics')}
                                    />
                                    <NavButton
                                        icon={CreditCard}
                                        label="Categories"
                                        isActive={activeNav === 'categories'}
                                        onClick={() => setActiveNav('categories')}
                                    />
                                </nav>

                                {/* Bottom Section - Fixed at bottom */}
                                <div className="mt-auto space-y-1 pt-6 border-t border-white/10">
                                    <NavButton icon={Settings} label="Settings" />
                                    <NavButton icon={LogOut} label="Logout" onClick={handleLogout} />
                                </div>
                            </GlassCard>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {/* Header */}
                    <header className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <motion.button
                                className="p-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </motion.button>

                            <div>
                                <h2 className="text-3xl font-bold">Welcome back, {getUserName()}!</h2>
                                <p className="text-white/70">Here's your financial overview</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button
                                className="px-4 py-2 rounded-xl backdrop-blur-xl bg-gradient-to-r from-purple-500 to-pink-500 border border-white/20 font-medium flex items-center gap-2"
                                onClick={() => setShowTransactionModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Plus className="w-5 h-5" />
                                Add Transaction
                            </motion.button>
                        </div>
                    </header>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-green-400 text-sm font-medium">Income</span>
                            </div>
                            <h3 className="text-3xl font-bold">${summary.totalIncome.toLocaleString()}</h3>
                            <p className="text-white/50 text-sm mt-1">Total income</p>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600">
                                    <TrendingDown className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-red-400 text-sm font-medium">Expenses</span>
                            </div>
                            <h3 className="text-3xl font-bold">${summary.totalExpenses.toLocaleString()}</h3>
                            <p className="text-white/50 text-sm mt-1">Total expenses</p>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-sm font-medium ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    Balance
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold">
                                ${Math.abs(balance).toLocaleString()}
                            </h3>
                            <p className="text-white/50 text-sm mt-1">
                                {balance >= 0 ? 'Available' : 'Deficit'}
                            </p>
                        </GlassCard>

                        <GlassCard className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-blue-400 text-sm font-medium">Savings</span>
                            </div>
                            <h3 className="text-3xl font-bold">{savingsRate}%</h3>
                            <p className="text-white/50 text-sm mt-1">Savings rate</p>
                        </GlassCard>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Monthly Overview */}
                        <GlassCard className="p-6" hover={false}>
                            <h3 className="text-xl font-semibold mb-4">Monthly Overview</h3>
                            {monthlyChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyChartData}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                                        <YAxis stroke="rgba(255,255,255,0.5)" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0,0,0,0.8)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '8px',
                                                backdropFilter: 'blur(10px)',
                                            }}
                                        />
                                        <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                                        <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpenses)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-white/50">
                                    <p>No data available</p>
                                </div>
                            )}</GlassCard>

                        {/* Category Spending */}
                        <GlassCard className="p-6" hover={false}>
                            <h3 className="text-xl font-semibold mb-4">Category Spending</h3>
                            {categoryChartData.length > 0 ? (
                                <div className="flex flex-col lg:flex-row items-center">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoryChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percentage }) => `${name} ${percentage}%`}
                                            >
                                                {categoryChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '8px',
                                                    backdropFilter: 'blur(10px)',
                                                }}
                                            />
                                            <Legend
                                                layout="vertical"
                                                verticalAlign="middle"
                                                align="right"
                                                formatter={(value, entry, index) => (
                                                    <span className="text-white">
                                                        {categoryChartData[index].name}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-white/50">
                                    <p>No data available</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* Recent Transactions */}
                    <GlassCard className="p-6" hover={false}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Recent Transactions</h3>
                            <button className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-white/50 text-sm border-b border-white/10">
                                        <th className="pb-3">Title</th>
                                        <th className="pb-3">Category</th>
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3 text-right">Amount</th>
                                        <th className="pb-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 5).map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-white/10 last:border-0">
                                            <td className="py-4">
                                                <div className="font-medium">{transaction.title}</div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: COLORS[transaction.categoryId % COLORS.length] }}
                                                    />
                                                    {transaction.categoryName}
                                                </div>
                                            </td>
                                            <td className="py-4 text-white/70">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className={`flex items-center justify-end gap-1 ${transaction.type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {transaction.type === 'Income' ? (
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    ) : (
                                                        <ArrowDownRight className="w-4 h-4" />
                                                    )}
                                                    ${transaction.amount.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                                    className="p-2 text-white/50 hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {transactions.length === 0 && (
                            <div className="h-[200px] flex items-center justify-center text-white/50">
                                <p>No transactions found</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>

            {/* Transaction Modal */}
            <TransactionModal
                isOpen={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
                categories={categories}
                onSubmit={handleNewTransaction}
            />
        </div>
    );
}