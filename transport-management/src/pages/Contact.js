import React from 'react';
function Contact() {
    return (
      <div className="contact-page">
        <div className="image-container">
          <img src="contact-transport-image.jpg" alt="Kontakt" className="contact-image" />
          <div className="overlay">
            <div className="contact-info">
            <h2>Kontakt</h2>
              <div className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <p>tel.: 777 888 999</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <p>e-mail: firmowy@gmail.com</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <p>adres: ul. Fiołkowa 234, Kraków</p>
              </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  export default Contact;