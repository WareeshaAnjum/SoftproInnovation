import React from 'react';


// Testimonials ka clean array data
const reviewsData = [
  {
    id: 1,
    quote: "Ordered an Arduino starter kit and received it within 24 hours in Lucknow. The quality is excellent and the components are well-labelled. Will definitely order again.",
    rating: 5,
    initials: "AS",
    name: "Arjun Sharma",
    role: "Engineering Student, IIT Kanpur"
  },
  {
    id: 2,
    quote: "Best place for Raspberry Pi components in India. The Raspberry Pi 5 kit came with everything I needed and the price is very competitive.",
    rating: 5,
    initials: "PN",
    name: "Priya Nair",
    role: "IoT Developer, Bangalore"
  },
  {
    id: 3,
    quote: "Great selection of ESP32 boards and sensors. I have been ordering from Softpro for two years now and the customer support is always helpful.",
    rating: 4,
    initials: "RM",
    name: "Rahul Mehta",
    role: "Hobbyist Maker"
  }
];

const Loved = () => {
  return (
    <section className="loved-section py-5">
      <div className="container">
        
        {/* Header Section */}
        <div className="text-center mb-5">
          <span className="loved-subtitle">WHAT MAKERS SAY</span>
          <h2 className="loved-title">
            Loved by the <span>Community</span>
          </h2>
          <div className="loved-line mx-auto"></div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="row g-4">
          {reviewsData.map((review) => (
            <div key={review.id} className="col-12 col-md-4">
              <div className="loved-card">
                
                {/* Quote Icon */}
                <span className="quote-icon">“</span>

                {/* Rating Stars */}
                <div className="stars-rating">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                {/* Review Text */}
                <p className="review-text">{review.quote}</p>

                {/* User Profile */}
                <div className="user-profile d-flex align-items-center gap-3 mt-auto">
                  <div className="avatar-circle">{review.initials}</div>
                  <div>
                    <h6 className="user-name mb-0">{review.name}</h6>
                    <small className="user-role">{review.role}</small>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Loved;