import React from "react";


// Path me ../assets/ lagaya gaya hai kyunki file components folder me hai
import k from "../../assets/k.png";
import l from "../../assets/l.png";
import m from "../../assets/m.png";
import n from "../../assets/n.png";
import o from "../../assets/o.png";
import p from "../../assets/p.png";
import q from "../../assets/q.png";
import r from "../../assets/r.png";

const productsData = [
  {
    id: 1,
    category: "DISPLAYS",
    title: "7-Segment Displays",
    price: "₹8,000",
    image: k,
  },
  {
    id: 2,
    category: "DISPLAYS",
    title: "TFT",
    price: "₹595",
    image: l,
  },
  {
    id: 3,
    category: "INDICATORS",
    title: "0.96 OLED LCD",
    price: "₹7,000",
    image: m,
  },
  {
    id: 4,
    category: "INDICATORS",
    title: "20x4 LCD",
    price: "₹600",
    image: n,
  },
  {
    id: 5,
    category: "INDICATORS",
    title: "16x2 LCD",
    price: "₹4,500",
    image: o,
  },
  {
    id: 6,
    category: "INDICATORS",
    title: "WS2812",
    price: "₹4,530",
    image: p,
  },
  {
    id: 7,
    category: "MOTORS",
    title: "DRV8825 Stepper Motor Driver",
    price: "₹3,450",
    image: q,
  },
  {
    id: 8,
    category: "MOTORS",
    title: "L298N Motor Driver",
    price: "₹3,400",
    image: r,
  },
];

const Heroes = () => {
  return (
    <section className="heroes-section py-5">
      <div className="container">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4">
          <div>
            <span className="heroes-subtitle">HANDPICKED FOR YOU</span>
            <h2 className="heroes-title">
              Featured <span>Products</span>
            </h2>
            <div className="heroes-line"></div>
            <p className="heroes-desc mt-3 mb-0">
              Top-rated boards and components loved by engineers, students, and
              hobbyists.
            </p>
          </div>

          <div className="mt-3 mt-md-0">
            <button className="all-products-btn">All Products &rarr;</button>
          </div>
        </div>

        {/* Product Cards Grid Section */}
        <div className="row g-4">
          {productsData.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="heroes-card">
                {/* Product Image */}
                <div className="heroes-img-box">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid"
                  />
                </div>

                {/* Product Details */}
                <div className="heroes-card-body">
                  <span className="heroes-category">{item.category}</span>
                  <h5 className="heroes-product-title">{item.title}</h5>

                  {/* Price & Add to Cart */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="heroes-price">{item.price}</span>
                    <button className="heroes-cart-btn">+ Cart</button>
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

export default Heroes;
