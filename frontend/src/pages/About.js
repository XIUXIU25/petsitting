import { Link } from 'react-router-dom';

const About = () => (
    <main className="simple-page about-page">
        <span className="eyebrow">A softer kind of pet care</span>
        <h2>Care feels better when it’s personal.</h2>
        <p className="about-lead">Pet Sitting keeps the small but important details close at hand, so every pet can feel a little more at home.</p>
        <div className="about-grid">
            <article><span className="about-icon" aria-hidden="true">♡</span><h3>Know every pet</h3><p>Keep names, ages, and family details together in one easy place.</p></article>
            <article><span className="about-icon" aria-hidden="true">✿</span><h3>Make care feel familiar</h3><p>A little context helps make each visit feel more comfortable and thoughtful.</p></article>
            <article><span className="about-icon" aria-hidden="true">☀</span><h3>Keep it simple</h3><p>Browse the directory or add a new friend in just a few moments.</p></article>
        </div>
        <Link className="text-link" to="/">Meet your pets →</Link>
    </main>
);

export default About;
