import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Register.css'; // Import CSS file for styling
import axios from 'axios';

const Register = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook để lấy hàm navigate

    const handleSubmit = async () => {
        const form = {
            email,
            username,
            password
        }
        try {
            const res = await axios.post('http://localhost:8000/api/v1/access/register', form);
            if (res.data.status !== 200) {
                alert(res.data.message)
            }
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
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
            <button onClick={handleSubmit}>Register</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
