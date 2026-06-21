import React, { useContext, useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../store';
import { Form, Button, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';


const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_ERROR':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
};

export default function ProfileScreen() {

    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(store);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // patikrina ar useris prisijunges jei ne nukreipia i signin
    useEffect(() => {
        if (!userInfo) {
            navigate('/signin');
        }
        document.title = 'Profile';
    }, [userInfo, navigate]);

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    });

    // paskyros kurimas
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!userInfo?.token) {
            toast.error('Please sign in again');
            navigate('/signin');
            return;
        }
        // tikrina ar slaptazodziai atitinka
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            // vardas - email - pasword
            dispatch({ type: 'UPDATE_REQUEST' });

            const updateData = { name, email };
            if (password) {
                updateData.password = password;
            }
            const { data } = await axios.put(
                '/api/users/profile',
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );

            dispatch({ type: 'UPDATE_SUCCESS' });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('User updated successfully');
        } catch (err) {
            dispatch({ type: 'UPDATE_ERROR' });
            toast.error(getError(err));
        }
    };

    return (
        <Container className="small-container">
            <h1 className="my-3">Profile</h1>
            {/* forma pakeist paskyros info */}
            <Form onSubmit={submitHandler}>

                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </Form.Group>

                <Button type="submit" className="btn btn-primary">
                    Update Profile
                </Button>
            </Form>
        </Container>
    );
}

