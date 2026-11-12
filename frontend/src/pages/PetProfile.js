import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PetProfile = () => {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [error, setError] = useState('');
    const { request } = useAuth();

    useEffect(() => {
        const load = async () => {
            try {
                const { response, data } = await request(`/api/pets/${id}`);
                if (!response.ok) throw new Error(data.error || 'Pet profile not found.');
                setPet(data);
            } catch (err) {
                setError(err.message || 'Could not connect to the server.');
            }
        };
        load();
    }, [id, request]);

    return (
        <main className="simple-page">
            <Link className="back-link" to="/pets">← All pets</Link>
            {error && <div className="notice" role="alert">{error}</div>}
            {!pet && !error && <p className="empty-state">Loading profile…</p>}
            {pet && <article className="profile-card">
                <div className="profile-avatar" aria-hidden="true">{pet.petName?.trim().charAt(0).toUpperCase() || '🐾'}</div>
                <span className="eyebrow">A very good companion</span>
                <h2>{pet.petName}</h2>
                <p className="profile-subtitle">A much loved member of the crew.</p>
                <dl className="profile-facts">
                    <div><dt>Age</dt><dd>{pet.age} {Number(pet.age) === 1 ? 'year' : 'years'} old</dd></div>
                    <div><dt>Sex</dt><dd>{pet.sex || 'Not specified'}</dd></div>
                    <div><dt>Pet parent</dt><dd>{pet.parent || 'Not added yet'}</dd></div>
                    <div><dt>With us since</dt><dd>{pet.createdAt ? new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(pet.createdAt)) : '—'}</dd></div>
                </dl>
                <Link className="text-link" to="/pets">Browse all pets →</Link>
            </article>}
        </main>
    );
};

export default PetProfile;
