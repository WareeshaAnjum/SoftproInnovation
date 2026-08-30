import React, { useState } from 'react';


const Ahead = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with: ${email}`);
      setEmail('');
    }
  };

  return (
    <section className="ahead-section py-5">
      <div className="container">
        
        {/* Main Orange Banner Box */}
        <div className="ahead-banner position-relative overflow-hidden">
          
          <div className="row align-items-center g-4 position-relative z-1">
            
            {/* Left Content (Title & Description) */}
            <div className="col-lg-6 col-md-7 text-start">
              <h2 className="ahead-title text-white mb-2">
                Stay <span>Ahead of the Curve</span>
              </h2>
              <p className="ahead-desc text-white-50 mb-0">
                Get launch alerts, project tutorials, and exclusive deals straight to your inbox.
              </p>
            </div>

            {/* Right Content (Input Field & Subscribe Button) */}
            <div className="col-lg-6 col-md-5">
              <form onSubmit={handleSubmit} className="d-flex flex-column flex-sm-row gap-2 justify-content-md-end">
                <input
                  type="email"
                  className="ahead-input"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="ahead-btn">
                  Subscribe
                </button>
              </form>
            </div>

          </div>

          {/* Right Side Subtle Circle Pattern Overlay */}
          <div className="circle-pattern"></div>

        </div>

      </div>
    </section>
  );
};

export default Ahead;