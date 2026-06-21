import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { store } from '../store';

export default function SignInScreen() {

    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const { state, dispatch: ctxDispatch } = useContext(store);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const submitHandler = async (e) => {

        e.preventDefault();
        try {
            // prasymas prisijungti su vartotojo duomenin
            const { data } = await axios.post('/api/users/signin', { email, password });
            // website atnaujinamas su nauja vartotojo informacija
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect);
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
            );
        }
    };

    return (
        <Container className="small-container">
            <h1 className="my-3">Sign In</h1>
            {/* prisijungimo forma*/}
            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Sign In</button>
                </div>

                <div className="mb-3">
                    New customer?{' '}
                    <a href="/signup">Create your account</a>
                </div>
            </form>
        </Container>
    );
}
