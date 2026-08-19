import { useState } from 'react';
import Header from './Header'; 
import MenuMobile from './MenuMobile'; 
import Footer from './Footer';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">

      <Header onMenuToggle={() => setIsMenuOpen((prev) => !prev)} isMenuOpen={isMenuOpen} />

      <MenuMobile
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Contenido principal */}
      <main className="pt-28">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;