import React, { useState } from 'react';

function Login() {

    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
    };

    return (
        <form onSubmit={onSubmit} className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-5">

                {/* Heading */}
                <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-800">
                        {state === 'Sign Up' ? "Create Account" : "Login"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Please {state === 'Sign Up' ? "sign up" : "login"} to book appointment
                    </p>
                </div>

                {/* Name */}
                {state === 'Sign Up' && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                        />
                    </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                        className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="mt-2 bg-primary text-white py-2 rounded-full font-medium hover:opacity-90 transition duration-300"
                >
                    {state === 'Sign Up' ? "Create Account" : "Login"}
                </button>

                {/* Toggle */}
                <p
                    onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                    className="text-center text-sm text-primary cursor-pointer hover:underline"
                >
                    {state === 'Sign Up'
                        ? "Already have an account? Login"
                        : "Create new account"}
                </p>

            </div>
        </form>
    );
}

export default Login;
