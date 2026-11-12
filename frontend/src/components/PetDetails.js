import { Link } from 'react-router-dom';

const PetDetails = ({ pet }) => {
    const initials = pet.petName?.trim().charAt(0).toUpperCase() || '🐾';
    const addedDate = pet.createdAt
        ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(pet.createdAt))
        : null;

    return (
        <Link className="pet-card" to={`/pets/${pet._id}`} aria-label={`View ${pet.petName}'s profile`}>
            <div className="pet-avatar" aria-hidden="true">{initials}</div>
            <div className="pet-info">
                <div className="pet-title-row"><h3>{pet.petName}</h3>{pet.sex && <span className="pet-tag">{pet.sex}</span>}</div>
                <p>{pet.age} {Number(pet.age) === 1 ? 'year' : 'years'} old{pet.parent ? ` · Parent: ${pet.parent}` : ''}</p>
                {addedDate && <span className="pet-date">Added {addedDate}</span>}
            </div>
            <span className="paw-mark" aria-hidden="true">✳</span>
        </Link>
    );
};

export default PetDetails;
