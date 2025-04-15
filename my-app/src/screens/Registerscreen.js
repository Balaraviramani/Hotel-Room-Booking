import React, { useState } from 'react';
import axios from "axios";
import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';
import { Button, Input, Form, notification, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';  // <-- Changed here

function Registerscreen() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();  // <-- Changed here

    // Form fields
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [cpassword, setcpassword] = useState('');

    async function register() {
        if (password !== cpassword) {
            notification.error({
                message: 'Password Mismatch',
                description: 'The passwords you entered do not match.',
            });
            return;
        }

        const user = { name, email, password };

        try {
            setLoading(true);
            const result = (await axios.post('https://hotel-room-booking-1.onrender.com/api/users/register', user)).data;
            setLoading(false);
            setSuccess(true);
            notification.success({
                message: 'Registration Successful',
                description: 'You have registered successfully, please login.',
            });
            // Redirect to login screen after successful registration
            setTimeout(() => navigate('/login'), 3000);  // <-- Changed here
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(true);
            notification.error({
                message: 'Registration Failed',
                description: 'There was an error while registering. Please try again.',
            });
        }
    }

    return (
        <div className="register-screen">
            {loading && <Loader />}
            {error && <Error />}
            {success && <Success message="Registration successful! Redirecting to login..." />}

            <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col xs={24} sm={18} md={12} lg={8}>
                    <div className="register-box">
                        <h2>Register</h2>

                        <Form onFinish={register}>
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Please enter your name!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please enter your password!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="cpassword"
                                rules={[{ required: true, message: 'Please confirm your password!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm Password"
                                    value={cpassword}
                                    onChange={(e) => setcpassword(e.target.value)}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    loading={loading}
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Registerscreen;
