import { Bounce, BlurText } from '@appletosolutions/reactbits';
import { useState } from 'react';
import { authApi } from '../services/apiService'; // Adjust path as needed
import { useNavigate } from 'react-router-dom'; // Add this import

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authApi.login({ email, password });

            // Store JWT token
            localStorage.setItem('token', response.token);
            // Redirect to dashboard or main app
            console.log('Login successful:', response);
            navigate('/dashboard', { replace: true });

        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-950 to-black p-4 overflow-hidden">
            {/* Enhanced floating glossy orbs */}
            <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/30 via-cyan-300/20 to-blue-600/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-gradient-to-tl from-sky-300/25 via-blue-400/15 to-transparent blur-2xl" />
            <div className="absolute top-1/3 left-1/4 h-60 w-60 rounded-full bg-gradient-to-r from-white/10 via-blue-200/20 to-transparent blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

            {/* enhanced glass card */}
            <Bounce>
                <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37),0_0_0_1px_rgba(255,255,255,0.05)] ring-1 ring-white/20 px-10 py-12 space-y-8 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none">
                    <BlurText
                        text="Welcome Back"
                        delay={200}
                        animateBy="words"
                        className="relative text-center text-4xl font-extrabold tracking-tight text-cyan-300 drop-shadow-[0_2px_8px_rgba(34,211,238,0.6)]"
                    />

                    {/* Error message */}
                    {error && (
                        <div className="rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/30 px-4 py-3 text-red-100 text-sm shadow-lg">
                            {error}
                        </div>
                    )}

                    {/* email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-white/90">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={isLoading}
                            className="w-full rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50 shadow-inner"
                        />
                    </div>

                    {/* password */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-white/90">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={isLoading}
                            className="w-full rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50 shadow-inner"
                        />
                    </div>

                    {/* actions */}
                    <div className="pt-2 space-y-4">
                        <button
                            type="button"
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="relative w-full rounded-xl bg-gradient-to-r from-white/20 via-white/10 to-white/5 backdrop-blur-sm border border-white/30 py-3 text-white font-semibold shadow-[0_4px_16px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.15)] hover:bg-gradient-to-r hover:from-white/25 hover:via-white/15 hover:to-white/10 active:scale-98 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                        >
                            <span className="relative z-10">
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </span>
                        </button>

                        <p className="text-center text-xs text-white/70">
                            Don't have an account? <a href="/register" className="underline hover:text-white/90 transition-colors">Register</a>
                        </p>
                    </div>
                </div>
            </Bounce>
        </div>
    );
}