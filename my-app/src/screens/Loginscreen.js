import React, { useState } from 'react';
import axios from "axios";
import Loader from '../components/Loader';
import Error from '../components/Error';
import { Button, Input, Form, Spin, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function Loginscreen() {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form] = Form.useForm(); // For Ant Design form control

    async function Login() {
        const user = {
            email,
            password,
        };
        try {
            setLoading(true);
            const result = (await axios.post('https://hotel-room-booking-1.onrender.com/api/users/login', user)).data;
            setLoading(false);
            localStorage.setItem('currentUser', JSON.stringify(result));
            window.location.href = '/home';
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError('Invalid credentials, please try again.');
        }
    }

    return (
        <div className="login-screen">
            {loading && (<Loader />)}

            <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col xs={24} sm={18} md={12} lg={8}>
                    <div className="login-box">
                        <h2>Login</h2>

                        {/* Display error message if any */}
                        {error && <Error message={error} />}

                        <Form form={form} onFinish={Login}>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                    size="large"
                                    autoFocus
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

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    icon={loading ? <Spin /> : null}
                                    loading={loading}
                                >
                                    {loading ? 'Logging In...' : 'Login'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Loginscreen;
