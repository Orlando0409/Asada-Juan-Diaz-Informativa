import React from 'react';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/header';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
        <Footer />
    </div>
  );
};

export default PublicLayout;