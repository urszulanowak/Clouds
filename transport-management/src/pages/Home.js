import React from 'react';
function Home() {
    return (
      <div className="home-page">
        <section className="hero">
          <div className="hero-content">
            <h1>Zarządzaj transportem sprawniej niż kiedykolwiek!</h1>
            <p>
              Planowanie tras, zarządzanie połączeniami, optymalizacja podróży — wszystko w jednym miejscu.
            </p>
            <a href="/obliczanie-tras" className="cta-button">Zacznij teraz</a>
          </div>
        </section>
  
        <section className="features">
          <h2>Nasze Funkcjonalności</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Planowanie tras</h3>
              <p>Optymalizuj trasy i oszczędzaj czas oraz koszty.</p>
            </div>
            <div className="feature-card">
              <h3>Monitorowanie połączeń</h3>
              <p>Wizualizacja i zarządzanie połączeniami między miastami.</p>
            </div>
            <div className="feature-card">
              <h3>Statystyki i raporty</h3>
              <p>Analizuj dane i podejmuj świadome decyzje.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  export default Home;