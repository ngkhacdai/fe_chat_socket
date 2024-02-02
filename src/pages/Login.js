import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css'; // Import CSS file for styling
import axios from 'axios'
const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async () => {
        const form = {
            email,
            password
        }
        try {
            const res = await axios.post('http://localhost:8000/api/v1/access/login', form);
            if (res.data.status !== 200) {
                return alert(res.data.message)
            }
            localStorage.setItem('token', res.data.metadata.token)
            localStorage.setItem('userId', res.data.metadata.userId)
            setIsLoggedIn(true)
            navigate('/')
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit} type="submit">Login</button>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
};

export default Login;
