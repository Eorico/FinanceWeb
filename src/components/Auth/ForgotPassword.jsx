import React, { useState } from "react";
import { forgotPassword } from "../../api/authApi";

function ForgotPassword() 
{ 
    const [ email, setEmail ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await forgotPassword({ email });
            setMessage('Reset link sent to you email.com')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="auth-container">
        <h2>Forgot Password</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" disabled={loading}>
                {loading ? 'Sending...': 'Send Reset Link'}
            </button>
        </form>
        <p><a href="/login">Back to login</a></p>
    </div>
); }

export default ForgotPassword;
