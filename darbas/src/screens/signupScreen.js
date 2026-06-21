import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { store } from '../store';

export default function SignupScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const { state, dispatch: ctxDispatch } = useContext(store);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // vartotojo registracija
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            // nauja vartotojo info issaugojama i duomenu baze
            const { data } = await axios.post('/api/users/signup', { name, email, password });
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
            <h1 className="my-3">Sign Up</h1>
            {/* forma prisijungti */}
            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        id="name"
                        type="text"
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

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

                <div className="mb-3">
                    <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                    <input
                        id="confirmpassword"
                        type="password"
                        className="form-control"
                        required
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>

                <div className="mb-3">
                    Already have an account?{' '}
                    <a href="/signin">Sign in</a>
                </div>
            </form>
        </Container>
    );
}
