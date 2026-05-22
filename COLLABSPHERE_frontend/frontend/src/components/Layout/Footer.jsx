import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>CollabSphere</h4>
          <p>Connect with collaborators and build amazing projects together.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/projects">Projects</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@collabsphere.com</p>
          <p>Follow us on social media</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} CollabSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
