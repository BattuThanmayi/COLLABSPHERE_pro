import React from 'react';
import TopNavbar from './TopNavbar';
import SideNavbar from './SideNavbar';
import './Layout.css';

function LayoutWrapper({ children }) {
  return (
    <div className="layout-wrapper">
      <TopNavbar />
      <div className="layout-container">
        <SideNavbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default LayoutWrapper;
