import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ mode }) => {
    const isRegister = mode === 'register';
    const { user, request, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (event) => {
        event.preventDefault(); setError(''); setBusy(true);
        try {
            const { response, data } = await request(`/api/auth/${isRegister ? 'register' : 'login'}`, {
                method: 'POST', body: JSON.stringify({ ...(isRegister ? { name } : {}), email, password }),
            });
            if (!response.ok) throw new Error(data.error || 'Could not sign you in.');
            login(data);
            navigate(location.state?.from || '/', { replace: true });
        } catch (err) {
            setError(err.message || 'Could not connect to the server.');
        } finally { setBusy(false); }
    };

    return (
        <main className="simple-page auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <span className="auth-icon" aria-hidden="true">✿</span>
                <span className="eyebrow">A little more care, every day</span>
                <h2>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
                <p className="form-intro">{isRegister ? 'Sign up to keep your pet crew close.' : 'Log in to manage your pet crew.'}</p>
                {isRegister && <><label htmlFor="auth-name">Your name</label><input id="auth-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength="80" /></>}
                <label htmlFor="auth-email">Email</label>
                <input id="auth-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength="254" />
                <label htmlFor="auth-password">Password</label>
                <input id="auth-password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={isRegister ? 8 : undefined} maxLength="128" />
                {isRegister && <p className="password-hint">Use at least 8 characters.</p>}
                {error && <div className="error" role="alert">{error}</div>}
                <button className="submit-button" type="submit" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'} <span aria-hidden="true">→</span></button>
                <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Pet Sitting?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link></p>
            </form>
        </main>
    );
};

export default AuthPage;
