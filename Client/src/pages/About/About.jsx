import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../Home/Footer";
import "./About.css";

const About = () => {
  const stats = [
    { value: "5,000+", label: "Products" },
    { value: "50K+", label: "Happy Customers" },
    { value: "7", label: "Years in Business" },
    { value: "99.8%", label: "Order Accuracy" },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Curated Quality",
      desc: "Every product is tested and verified by our in-house engineering team before it hits the shelf.",
    },
    {
      icon: "🚀",
      title: "Fast Fulfilment",
      desc: "Orders placed before 3 PM are dispatched same day. Most customers receive within 24–48 hours.",
    },
    {
      icon: "🛡️",
      title: "Genuine Components",
      desc: "We source directly from Raspberry Pi Ltd, Arduino S.r.l., and authorised distributors only.",
      highlight: true,
    },
    {
      icon: "🤝",
      title: "Maker Support",
      desc: "Our technical team is available via chat, email, and phone to help debug your projects.",
    },
    {
      icon: "🌱",
      title: "Community First",
      desc: "We sponsor hackathons, college labs, and open source hardware projects across India.",
    },
    {
      icon: "💡",
      title: "Continuous Learning",
      desc: "Free project tutorials, wiring guides, and datasheets ship with every order.",
    },
  ];

  const journey = [
    {
      year: "2018",
      milestone: "Founded in a small garage in Lucknow with 200 SKUs and a dream.",
    },
    {
      year: "2019",
      milestone: "Launched online store — 1,000 orders in the first six months.",
    },
    {
      year: "2021",
      milestone: "Reached 10,000 customers and opened our first warehouse.",
    },
    {
      year: "2023",
      milestone: "Became an official Raspberry Pi Approved Reseller for India.",
    },
    {
      year: "2024",
      milestone: "5,000+ products, 50,000+ orders, and growing every day.",
    },
  ];

  return (
    <div className="about-page-wrapper">
      <Header />

      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-bg-shapes">
          <div className="shape-circle shape-1" />
          <div className="shape-circle shape-2" />
        </div>
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-10 py-5">
              <span className="about-subtitle-tag text-uppercase fw-semibold">
                OUR STORY
              </span>
              <h1 className="about-hero-title my-3">
                Empowering <span className="font-italic-accent">Makers</span>
                <br />
                Across India
              </h1>
              <p className="about-hero-description mb-4">
                SoftproInnovation started with a simple belief: every engineer, student, and
                hobbyist deserves access to quality electronics components at fair prices,
                with support that actually helps them build.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-about-primary">
                  Browse Products
                </Link>
                <Link to="/contact" className="btn btn-about-secondary">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Stats Section */}
      <section className="about-mission-section py-5">
        <div className="container py-lg-4">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="about-subtitle-tag text-uppercase fw-semibold">
                OUR MISSION
              </span>
              <h2 className="about-section-heading mt-2 mb-3">
                Building the <span className="font-italic-accent">Future</span>
                <br />
                One Kit at a Time
              </h2>
              <div className="about-orange-divider mb-4" />
              <p className="about-text-lead mb-3">
                We believe in lowering the barrier to hardware innovation. From a school science project
                to a professional IoT product, we stock everything you need and ship it to your doorstep
                anywhere in India.
              </p>
              <p className="about-text-body">
                Our team of engineers hand-picks every product, writes detailed guides, and provides
                real human support — because we are makers ourselves.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                {stats.map((item, index) => (
                  <div key={index} className="col-sm-6">
                    <div className="about-stat-card">
                      <h3 className="about-stat-number">{item.value}</h3>
                      <p className="about-stat-label mb-0">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-values-section py-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="about-subtitle-tag text-uppercase fw-semibold">
              WHAT WE STAND FOR
            </span>
            <h2 className="about-section-heading mt-2 mb-3">
              Our Core <span className="font-italic-accent">Values</span>
            </h2>
            <div className="about-orange-divider mx-auto" />
          </div>

          <div className="row g-4">
            {values.map((val, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div className={`about-value-card ${val.highlight ? "highlight-card" : ""}`}>
                  <div className="about-value-icon-box mb-3">
                    <span className="value-emoji">{val.icon}</span>
                  </div>
                  <h4 className="about-value-title mb-2">{val.title}</h4>
                  <p className="about-value-desc mb-0">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="about-journey-section py-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="about-subtitle-tag text-uppercase fw-semibold">
              HOW WE GOT HERE
            </span>
            <h2 className="about-section-heading mt-2 mb-3">
              Our <span className="font-italic-accent">Journey</span>
            </h2>
            <div className="about-orange-divider mx-auto mb-4" />
          </div>

          <div className="about-timeline-container mx-auto">
            {journey.map((item, idx) => (
              <div key={idx} className="about-timeline-row">
                <div className="timeline-year-col">
                  <span className="timeline-year">{item.year}</span>
                </div>
                <div className="timeline-content-col">
                  <p className="timeline-milestone-text mb-0">{item.milestone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;