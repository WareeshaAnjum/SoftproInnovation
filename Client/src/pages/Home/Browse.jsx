import React from "react";


// Assets folder se images import kar rahe hain
import a from "../../assets/a.png";
import b from "../../assets/b.png";
import c from "../../assets/c.png";
import d from "../../assets/d.png";
import e from "../../assets/e.png";
import f from "../../assets/f.png";
import g from "../../assets/g.png";
import h from "../../assets/h.png";
import i from "../../assets/i.png";
import j from "../../assets/j.png";

const categoriesData = [
  { id: 1, name: "Microcontrollers", image: a },
  { id: 2, name: "Sensors", image: b },
  { id: 3, name: "Indicators", image: c },
  { id: 4, name: "Motors", image: d },
  { id: 5, name: "Communication Modules", image: e },
  { id: 6, name: "Battery Components", image: f },
  { id: 7, name: "Development Boards", image: g },
  { id: 8, name: "Displays", image: h },
  { id: 9, name: "Actuators", image: i },
  { id: 10, name: "Power Components", image: j },
];

const Browse = () => {
  return (
    <section className="browse-section py-5">
      <div className="container">
        
        {/* Header Section */}
        <div className="mb-4">
          <span className="browse-subtitle">BROWSE BY TYPE</span>
          <h2 className="browse-title">
            Popular <span>Categories</span>
          </h2>
          <div className="browse-underline"></div>
          <p className="browse-desc mt-3">
            Find exactly what your project needs from our curated electronics
            families.
          </p>
        </div>

        {/* Categories Grid (4 Columns on Large Screens) */}
        <div className="row g-4">
          {categoriesData.map((category) => (
            <div
              key={category.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div className="browse-card text-center">
                {/* Inner White/Light Icon Box */}
                <div className="browse-icon-box">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="browse-img"
                  />
                </div>
                {/* Title */}
                <h5 className="browse-card-title">{category.name}</h5>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Browse;