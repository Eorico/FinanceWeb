import React, { useState } from "react";
import { signup } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import { ArrowLeftIcon } from "lucide-react";
import Invalidation from "../../ui/Notifier";

function Signup() 
{ 
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }


        try {
        await signup(formData);
        navigate('/login');
        } catch (err) {
        setError(err.response?.data?.message || 'Signup failed');
        } finally {
        setLoading(false);
        }
    };

    return (
    <div className="auth-container">
        <h2>Sign Up</h2>
        {error && <Invalidation>{error}</Invalidation>}
        <form onSubmit={handleSubmit}>
        <h3 className="auth-headers">Full Name</h3>
            <input
                type="text"
                name="name"        
                placeholder="Mark Anthony"
                onChange={handleChange}
                value={formData.name}
                required
            />
        <h3 className="auth-headers">Email</h3>
            <input
                type="email"
                name="email"       
                placeholder="user@gmail.com"
                onChange={handleChange}
                value={formData.email}
                required
            />
        <h3 className="auth-headers">Password</h3>
            <input
                type="password"
                name="password"    
                placeholder="*******"
                onChange={handleChange}
                value={formData.password}
                required
            />  
        <h3 className="auth-headers">Confirm Password</h3>
            <input
                type="password"
                name="confirmPassword"
                placeholder="*******"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
            />
        <Button 
            type="submit" 
            disabled={loading}
            className="auth-button group"
            >
            {loading ?( 
                <>
                    <span className="spinner"></span>
                    <span>Creating Account...</span>
                </>) : (
                    <>
                    <ArrowLeftIcon 
                            className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                            size={16}
                            aria-hidden="true"
                        />
                        Create
                    </>)}
        </Button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
    </div>
); }

export default Signup;