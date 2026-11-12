import { useCallback, useEffect, useState } from 'react';
import PetDetails from '../components/PetDetails';
import PetForm from '../components/PetForm';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [pets, setPets] = useState(null);
    const [loadError, setLoadError] = useState('');
    const { request } = useAuth();

    const fetchPets = useCallback(async () => {
        try {
            const { response, data: json } = await request('/api/pets');
            if (!response.ok) throw new Error(json.error || 'Could not load pets.');
            setPets(json);
            setLoadError('');
        } catch (error) {
            setLoadError(error.message || 'Could not connect to the server.');
            setPets([]);
        }
    }, [request]);

    useEffect(() => { fetchPets(); }, [fetchPets]);

    return (
        <main className="home">
            <section className="welcome">
                <span className="eyebrow">A little more care, every day</span>
                <h2>Good care starts with knowing them.</h2>
                <p>Keep the important details for every pet in one happy place.</p>
                <div className="welcome-art" aria-hidden="true"><span>🐾</span><span>🐕</span><span>🐈</span></div>
            </section>

            <div className="dashboard">
                <section className="pets-section" aria-labelledby="pets-heading">
                    <div className="section-heading">
                        <div><span className="eyebrow">Your little crew</span><h2 id="pets-heading">Pets</h2></div>
                <span className="pet-count">{pets ? pets.length : '…'} {pets?.length === 1 ? 'pet' : 'pets'}</span>
                    </div>
                    {loadError && <div className="notice" role="alert">{loadError} <button type="button" onClick={fetchPets}>Try again</button></div>}
                    {pets === null && !loadError && <p className="empty-state">Loading your pets…</p>}
                    {pets?.length === 0 && !loadError && <p className="empty-state">No pets yet. Add your first pet to get started.</p>}
                    <div className="pet-list">
                        {pets?.map((pet) => <PetDetails key={pet._id} pet={pet} />)}
                    </div>
                </section>
                <PetForm onCreated={fetchPets} />
            </div>
            <footer className="page-footer">Made with care for the pets who make a home.</footer>
        </main>
    );
};

export default Home;
