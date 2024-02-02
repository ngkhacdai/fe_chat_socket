import '../css/ChatBox.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { USERAPI } from '../utils/config';

const socket = io('http://192.168.1.187:8000', {
    transports: ['websocket']
});

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [receiverId, setReceiverId] = useState('')
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        socket.on('newMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    }, []);

    useEffect(() => {
        const data = async () => {
            try {
                const form = {
                    nameSearch: ''
                }
                await axios.post(`${USERAPI}search`, form, {
                    headers: {
                        'userId': localStorage.getItem('userId'),
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    setSearchResults(res.data.metadata.user);
                })

            } catch (error) {
                handleLogout()
            }
        };
        data();
    });

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            console.log('Connected to server!');
        });

        return () => {
            socket.off('connect');
            socket.off('newMessage');
        };
    }, [])
    useEffect(() => {
        if (receiverId) {
            socket.on('chatHistory', (data) => {
                setMessages(data);
            });
        }
    }, [receiverId]); // Thêm receiverId vào dependency array để useEffect chỉ gọi lại khi receiverId thay đổi

    const sendMessage = async () => {
        if (inputValue.trim() !== '') {
            const roomId = localStorage.getItem('roomId');
            socket.emit('chat', {
                roomId: roomId,
                senderId: localStorage.getItem('userId'),
                message: inputValue
            });
            setInputValue('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const handleSearch = async (searchTerm) => {
        try {
            const form = {
                nameSearch: searchTerm
            }
            const response = await axios.post(`${USERAPI}search`, form, {
                headers: {
                    'userId': localStorage.getItem('userId'),
                    'Authorization': localStorage.getItem('token')
                }
            });
            setSearchResults(response.data.metadata.user);
        } catch (error) {
            if (error.response.status === 500) {
                handleLogout()
            }
        }
    };

    const handleClick = (item) => {
        setReceiverId(item._id)
        const currentUserId = localStorage.getItem('userId');
        const sortedIds = [currentUserId, receiverId].sort();
        const roomId = sortedIds.join('-');
        localStorage.setItem('roomId', roomId);
        socket.emit('joinroom', roomId, currentUserId);
        socket.on('chatHistory', (data) => {
            setMessages(data);
        });
    };


    return (
        <div className="chat-container">
            <div className="sidebar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="search-input"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                {searchResults.map((item, index) => (
                    <div key={index} className="user-info" onClick={() => handleClick(item)}>
                        <span>{item.username}</span>
                    </div>
                ))}
            </div>
            <div className="chat-content">
                <div className="messages">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.senderId === localStorage.getItem('userId') ? 'sender-message' : 'receiver-message'}`}
                        >
                            {message.message}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                    />
                    <button onClick={sendMessage} className="send-button">Send</button>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
