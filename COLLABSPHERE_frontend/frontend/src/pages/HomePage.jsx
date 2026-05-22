import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Pages.css';

function HomePage() {
  const { token } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to CollabSphere</h1>
          <p>Connect with talented collaborators and build amazing projects together</p>
          <div className="hero-actions">
            <Link to="/projects" className="btn-primary btn-large">
              Explore Projects
            </Link>
            {!token && (
              <Link to="/register" className="btn-secondary btn-large">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose CollabSphere?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Find Projects</h3>
            <p>Discover exciting projects that match your skills and interests</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Meet Collaborators</h3>
            <p>Connect with like-minded developers and creators</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Collaborate</h3>
            <p>Communicate with your team members in real-time</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Build Together</h3>
            <p>Create amazing projects with your dedicated team</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <h3>1000+</h3>
          <p>Projects</p>
        </div>
        <div className="stat-item">
          <h3>5000+</h3>
          <p>Developers</p>
        </div>
        <div className="stat-item">
          <h3>500+</h3>
          <p>Teams</p>
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="cta">
          <h2>Ready to start collaborating?</h2>
          <p>Join CollabSphere today and find your next great team</p>
          <Link to="/register" className="btn-primary btn-large">
            Sign Up Now
          </Link>
        </section>
      )}
    </div>
  );
}

export default HomePage;
