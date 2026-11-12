import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PetForm = ({ onCreated }) => {
    const { request, user } = useAuth();
    const [petName, setPetName] = useState('');
    const [age, setPetAge] = useState('');
    const [sex, setPetSex] = useState('');
    const [parent, setPetParent] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSaving(true);
        try {
            const { response, data: json } = await request('/api/pets', {
                method: 'POST',
                body: JSON.stringify({ petName: petName.trim(), age, sex: sex.trim(), parent: parent.trim() }),
            });
            if (!response.ok) throw new Error(json.error || 'Could not add this pet.');
            setPetName(''); setPetAge(''); setPetSex(''); setPetParent('');
            await onCreated?.();
        } catch (requestError) {
            setError(requestError.message || 'Could not connect to the server.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="create-card" onSubmit={handleSubmit}>
            <span className="eyebrow">New best friend?</span>
            <h2>Add a pet</h2>
            <p className="form-intro">Save their details so everything is ready for their next visit.</p>
            {!user && <div className="login-prompt"><p>Log in to add a pet and manage your crew.</p><Link className="text-link" to="/login">Log in →</Link></div>}
            <fieldset disabled={!user || saving} className="pet-fields">
            <label htmlFor="pet-name">Pet name</label>
            <input id="pet-name" type="text" placeholder="e.g. Biscuit" value={petName} onChange={(e) => setPetName(e.target.value)} required maxLength="60" />
            <label htmlFor="pet-age">Age in years</label>
            <input id="pet-age" type="number" min="0" max="100" step="1" placeholder="e.g. 3" value={age} onChange={(e) => setPetAge(e.target.value)} required />
            <label htmlFor="pet-sex">Sex</label>
            <select id="pet-sex" value={sex} onChange={(e) => setPetSex(e.target.value)} required>
                <option value="" disabled>Select one</option><option>Female</option><option>Male</option><option>Not specified</option>
            </select>
            <label htmlFor="pet-parent">Pet parent <span className="optional">Optional</span></label>
            <input id="pet-parent" type="text" placeholder="e.g. Jamie" value={parent} onChange={(e) => setPetParent(e.target.value)} maxLength="80" />
            </fieldset>
            {error && <div className="error" role="alert">{error}</div>}
            {user && <button className="submit-button" type="submit" disabled={saving}>{saving ? 'Adding…' : 'Add pet'} <span aria-hidden="true">→</span></button>}
        </form>
    );
};

export default PetForm;
