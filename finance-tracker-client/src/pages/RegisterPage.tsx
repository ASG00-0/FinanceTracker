import { Bounce, BlurText } from '@appletosolutions/reactbits';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/apiService';

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email: string): string | null => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return null;
    };

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];

        // ASP.NET Core Identity default password requirements
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        return errors;
    };

    const handleRegister = async () => {
        setError('');
        setSuccess('');

        // Validate first name
        if (!firstName.trim()) {
            setError('First name is required');
            return;
        }

        // Validate email
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        // Validate password
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            setError(passwordErrors.join('. '));
            return;
        }

        // Confirm password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await authApi.register({ firstName, email, password });
            setSuccess('Account created successfully! You can now sign in.');

            // Clear form
            setFirstName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            // Handle server-side validation errors from Identity
            if (err.response?.data?.errors) {
                const serverErrors = err.response.data.errors;
                const errorMessages: string[] = [];

                // Extract error messages from Identity error format
                Object.values(serverErrors).forEach((errorArray: any) => {
                    if (Array.isArray(errorArray)) {
                        errorMessages.push(...errorArray);
                    }
                });

                setError(errorMessages.join('. '));
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
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
                <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37),0_0_0_1px_rgba(255,255,255,0.05)] ring-1 ring-white/20 px-10 py-12 space-y-6 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none">
                    <div className="flex justify-center">
                        <BlurText
                            text="Create Account"
                            delay={200}
                            animateBy="words"
                            className="relative text-4xl font-extrabold tracking-tight text-cyan-300 drop-shadow-[0_2px_8px_rgba(34,211,238,0.6)]"
                        />
                    </div>

                    {/* Success message */}
                    {success && (
                        <div className="rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-400/30 px-4 py-3 text-green-100 text-sm shadow-lg">
                            {success}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/30 px-4 py-3 text-red-100 text-sm shadow-lg">
                            {error}
                        </div>
                    )}

                    {/* Form fields in 2x2 grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* first name */}
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-white/90">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                                disabled={isLoading}
                                className="w-full rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50 shadow-inner"
                            />
                        </div>

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
                                onFocus={() => setShowPasswordRequirements(true)}
                                onBlur={() => setShowPasswordRequirements(false)}
                                placeholder="••••••••"
                                disabled={isLoading}
                                className="w-full rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50 shadow-inner"
                            />
                        </div>

                        {/* confirm password */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={isLoading}
                                className="w-full rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50 shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Password Requirements (outside grid, full width) */}
                    {showPasswordRequirements && (
                        <div className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/20 px-3 py-2 text-xs space-y-1">
                            <p className="text-white/80 font-medium mb-2">Password Requirements:</p>
                            <div className={`flex items-center space-x-2 ${password.length >= 6 ? 'text-green-300' : 'text-white/60'}`}>
                                <span>{password.length >= 6 ? '✓' : '○'}</span>
                                <span>At least 6 characters</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${/[A-Z]/.test(password) ? 'text-green-300' : 'text-white/60'}`}>
                                <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                                <span>One uppercase letter</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${/[a-z]/.test(password) ? 'text-green-300' : 'text-white/60'}`}>
                                <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                                <span>One lowercase letter</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${/\d/.test(password) ? 'text-green-300' : 'text-white/60'}`}>
                                <span>{/\d/.test(password) ? '✓' : '○'}</span>
                                <span>One number</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${/[^a-zA-Z0-9]/.test(password) ? 'text-green-300' : 'text-white/60'}`}>
                                <span>{/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'}</span>
                                <span>One special character</span>
                            </div>
                        </div>
                    )}

                    {/* actions */}
                    <div className="pt-2 space-y-4">
                        <button
                            type="button"
                            onClick={handleRegister}
                            disabled={isLoading}
                            className="relative w-full rounded-xl bg-gradient-to-r from-white/20 via-white/10 to-white/5 backdrop-blur-sm border border-white/30 py-3 text-white font-semibold shadow-[0_4px_16px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.15)] hover:bg-gradient-to-r hover:from-white/25 hover:via-white/15 hover:to-white/10 active:scale-98 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                        >
                            <span className="relative z-10">
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </span>
                        </button>

                        <p className="text-center text-xs text-white/70">
                            Already have an account? <Link to="/login" className="underline hover:text-white/90 transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </Bounce>
        </div>
    );
}