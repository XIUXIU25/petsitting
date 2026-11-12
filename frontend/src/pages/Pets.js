import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PetDetails from '../components/PetDetails';
import { useAuth } from '../context/AuthContext';

const Pets = () => {
    const [pets, setPets] = useState(null);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const { request } = useAuth();

    useEffect(() => {
        const load = async () => {
            try {
                const { response, data } = await request('/api/pets');
                if (!response.ok) throw new Error(data.error || 'Could not load pets.');
                setPets(data);
            } catch (err) {
                setError(err.message || 'Could not connect to the server.');
                setPets([]);
            }
        };
        load();
    }, [request]);

    const filteredPets = (pets || []).filter((pet) =>
        `${pet.petName} ${pet.parent || ''} ${pet.sex || ''}`.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <main className="simple-page">
            <div className="page-title-row"><div><span className="eyebrow">Meet the regulars</span><h2>Our pets</h2><p>Every pet has their own little personality. Here’s the whole crew.</p></div><Link className="text-link" to="/">Add a pet <span aria-hidden="true">＋</span></Link></div>
            <label className="search-label" htmlFor="pet-search">Find a pet</label>
            <input id="pet-search" className="search-input" type="search" placeholder="Search by name, parent, or sex" value={query} onChange={(event) => setQuery(event.target.value)} />
            {error && <div className="notice" role="alert">{error}</div>}
            {pets === null && <p className="empty-state">Loading pets…</p>}
            {pets && filteredPets.length === 0 && <p className="empty-state">{query ? 'No pets match that search.' : 'No pets have been added yet.'}</p>}
            <div className="directory-grid">{filteredPets.map((pet) => <PetDetails key={pet._id} pet={pet} />)}</div>
        </main>
    );
};

export default Pets;
