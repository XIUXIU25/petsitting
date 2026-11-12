import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


import Home from './pages/Home';
import Pets from './pages/Pets';
import PetProfile from './pages/PetProfile';
import About from './pages/About';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route
              path='/'
              element={<Home/>}
            />
            <Route path='/pets' element={<Pets />} />
            <Route path='/pets/:id' element={<PetProfile />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<AuthPage mode="login" />} />
            <Route path='/register' element={<AuthPage mode="register" />} />
            <Route path='*' element={<main className="simple-page"><span className="eyebrow">Page not found</span><h2>That page wandered off.</h2><p>Head back home and we’ll help you find your way.</p><Link className="text-link" to="/">Back to home →</Link></main>} />
          </Routes>
         
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
