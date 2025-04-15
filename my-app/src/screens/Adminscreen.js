import React, { useEffect, useState } from 'react';
import { Tabs, Card, Table, Tag, Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';
import {
    UserOutlined,
    HomeOutlined,
    PlusOutlined,
    BookOutlined,
} from '@ant-design/icons';

const { Option } = Select;

function Adminscreen() {
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.isAdmin) {
            window.location.href = '/home';
        }
    }, []);

    return (
        <div className='mt-3 ml-3 mr-3'>
            <h2 className='text-center' style={{ fontSize: '30px' }}><b>Admin Panel</b></h2>
            <Tabs
                defaultActiveKey="1"
                type="card"
                size="large"
                centered
                items={[
                    {
                        key: '1',
                        label: (
                            <span><BookOutlined /> Bookings</span>
                        ),
                        children: <Card><Bookings /></Card>,
                    },
                    {
                        key: '2',
                        label: (
                            <span><HomeOutlined /> Rooms</span>
                        ),
                        children: <Card><Rooms /></Card>,
                    },
                    {
                        key: '3',
                        label: (
                            <span><PlusOutlined /> Add Room</span>
                        ),
                        children: <Card><AddRoom /></Card>,
                    },
                    {
                        key: '4',
                        label: (
                            <span><UserOutlined /> Users</span>
                        ),
                        children: <Card><Users /></Card>,
                    },
                ]}
            />
        </div>
    );
}

export function Bookings() {
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const { data } = await axios.get('/api/bookings/getallbookings');
                setbookings(data);
                setloading(false);
            } catch (error) {
                console.error(error);
                setloading(false);
            }
        }
        fetchBookings();
    }, []);

    const columns = [
        { title: 'Booking Id', dataIndex: '_id', key: '_id' },
        { title: 'User Id', dataIndex: 'userid', key: 'userid' },
        { title: 'Room', dataIndex: 'room', key: 'room' },
        { title: 'From', dataIndex: 'fromdate', key: 'fromdate' },
        { title: 'To', dataIndex: 'todate', key: 'todate' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 'cancelled' ? 'volcano' : 'green'}>{status.toUpperCase()}</Tag>,
        },
    ];

    return loading ? <Loader /> : <Table dataSource={bookings} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />;
}

export function Rooms() {
    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        async function fetchRooms() {
            try {
                const { data } = await axios.get('/api/rooms/getallrooms');
                setrooms(data);
                setloading(false);
            } catch (error) {
                console.error(error);
                setloading(false);
            }
        }
        fetchRooms();
    }, []);

    const columns = [
        { title: 'Room Id', dataIndex: '_id', key: '_id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Rent per day', dataIndex: 'rentperday', key: 'rentperday' },
        { title: 'Max Count', dataIndex: 'maxcount', key: 'maxcount' },
        { title: 'Phone Number', dataIndex: 'phonenumber', key: 'phonenumber' },
    ];

    return loading ? <Loader /> : <Table dataSource={rooms} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />;
}

export function Users() {
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const { data } = await axios.get('/api/users/getallusers');
                setusers(data);
                setloading(false);
            } catch (error) {
                console.error(error);
                setloading(false);
            }
        }
        fetchUsers();
    }, []);

    const columns = [
        { title: 'User Id', dataIndex: '_id', key: '_id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Is Admin',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (isAdmin) => <Tag color={isAdmin ? 'green' : 'red'}>{isAdmin ? 'YES' : 'NO'}</Tag>,
        },
    ];

    return loading ? <Loader /> : <Table dataSource={users} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />;
}

export function AddRoom() {
    const [loading, setloading] = useState(false);
    const [form] = Form.useForm();

    async function addRoom(values) {
        const newroom = {
            ...values,
            imageurls: [values.imageurl1, values.imageurl2, values.imageurl3],
        };

        try {
            setloading(true);
            await axios.post('/api/rooms/addroom', newroom);
            setloading(false);
            Swal.fire('Success', 'Room added successfully', 'success').then(() => {
                window.location.href = '/home';
            });
        } catch (error) {
            setloading(false);
            Swal.fire('Error', 'Failed to add room', 'error');
        }
    }

    return (
        <>
            {loading && <Loader />}
            <Form
                layout="vertical"
                form={form}
                onFinish={addRoom}
                initialValues={{ type: 'delux' }}
            >
                <Form.Item label="Room Name" name="name" rules={[{ required: true }]}> <Input /> </Form.Item>
                <Form.Item label="Rent per day" name="rentperday" rules={[{ required: true }]}> <Input /> </Form.Item>
                <Form.Item label="Max Count" name="maxcount" rules={[{ required: true }]}> <Input /> </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true }]}> <Input.TextArea rows={3} /> </Form.Item>
                <Form.Item label="Phone Number" name="phonenumber" rules={[{ required: true }]}> <Input /> </Form.Item>
                <Form.Item label="Type" name="type" rules={[{ required: true }]}> <Select> <Option value="delux">Delux</Option> <Option value="non-delux">Non-Delux</Option> </Select> </Form.Item>
                <Form.Item label="Image URL 1" name="imageurl1" rules={[{ required: true }]}> <Input /> </Form.Item>
                <Form.Item label="Image URL 2" name="imageurl2"> <Input /> </Form.Item>
                <Form.Item label="Image URL 3" name="imageurl3"> <Input /> </Form.Item>
                <Form.Item> <Button type="primary" htmlType="submit">Add Room</Button> </Form.Item>
            </Form>
        </>
    );
}

export default Adminscreen;
