import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar=()=>{
    const { user, logout } = useAuth();
    return (
        <header>
            <div className="container">
                <Link to='/'>
                <h1>Pet Sitting</h1>
                </Link>
                <nav aria-label="Main navigation">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/pets">Our pets</NavLink>
                    <NavLink to="/about">About</NavLink>
                    {user ? <><span className="nav-user">Hi, {user.name}</span><button className="nav-auth-button" type="button" onClick={logout}>Log out</button></> : <NavLink className="nav-login" to="/login">Log in</NavLink>}
                </nav>
            </div>
        </header>
    )
}

export default Navbar
