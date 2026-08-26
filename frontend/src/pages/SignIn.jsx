import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
            }, { withCredentials: true });
            dispatch(setUserData(result.data));
            setErr("");
            setLoading(false);
        } catch (error) {
            setErr(error?.response?.data?.message);
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                email: result.user.email,
            }, { withCredentials: true });
            dispatch(setUserData(data));
        } catch (error) {
            console.log(error);
            setErr("Google Sign In failed");
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
            {/* Left Side - Hero Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                        alt="Delicious Food"
                        className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-[20s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                {/* Floating Icons Animation */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-20 left-20 text-4xl animate-bounce delay-100 opacity-20">🍕</div>
                    <div className="absolute bottom-40 right-20 text-4xl animate-bounce delay-300 opacity-20">🍔</div>
                    <div className="absolute top-1/2 left-10 text-4xl animate-bounce delay-700 opacity-20">🥗</div>
                    <div className="absolute top-40 right-40 text-4xl animate-bounce delay-500 opacity-20">🍦</div>
                </div>

                <div className="relative z-20 text-center px-12">
                    <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
                        Smart<span className="text-[#ff4d2d]">Eats</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-light leading-relaxed max-w-md mx-auto">
                        Experience the joy of food delivered right to your doorstep. Fresh, fast, and delicious.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h2>
                        <p className="text-gray-500">Sign in to continue your food journey</p>
                    </div>

                    <div className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] outline-none transition-all duration-200 font-medium text-gray-700 placeholder-gray-400"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff4d2d]/20 focus:border-[#ff4d2d] outline-none transition-all duration-200 font-medium text-gray-700 placeholder-gray-400 pr-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff4d2d] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => navigate("/forgot-password")}
                                className="text-sm font-semibold text-[#ff4d2d] hover:text-[#e64323] transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Error Message */}
                        {err && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <p className="text-red-600 text-sm font-medium">{err}</p>
                            </div>
                        )}

                        {/* Sign In Button */}
                        <button
                            onClick={handleSignIn}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#ff8c42] hover:from-[#e64323] hover:to-[#ff7b30] text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff4d2d]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                            {loading ? <ClipLoader size={24} color="white" /> : "Sign In"}
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Auth Button */}
                        <button
                            onClick={handleGoogleAuth}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
                        >
                            <FcGoogle size={24} />
                            <span>Sign in with Google</span>
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-gray-600 font-medium">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-[#ff4d2d] font-bold hover:underline focus:outline-none ml-1"
                            >
                                Create Account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
