import React, { useState } from "react";
import { login } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button'
import { ArrowRightIcon } from "lucide-react";


function Login() 
{ 
    const [ formData, setFormData] = useState({ email: '', password: '' });
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await login(formData);
            localStorage.setItem('token', res.data.token); 
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login Failed');
        } finally {
            setLoading(false);
        }
    }; 

    return(
    <div className="auth-container">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <h3 className="auth-headers">Email</h3>
            <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
            <h3 className="auth-headers">Password</h3>
            <input type="password" placeholder="*****" name="password" onChange={handleChange} required />
            <Button 
            type="submit" 
            disabled={loading} 
            className="auth-button group">
            {loading ? (
                <>
                <span className="spinner"></span>
                <span>Loading...</span>
                </>
            ) : (
                <>
                    Login
                    <ArrowRightIcon
                        className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                        size={16}
                        aria-hidden="true"
                    />
                </>
            )}
            </Button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        <p><a href="/forgot-password">Forgot Password?</a></p>
    </div>
); }

export default Login;