import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import splide1 from "../../assets/splide1.jpg";
import splide2 from "../../assets/splide2.jpg";
import splide3 from "../../assets/splide3.jpg";

function Slider() {
  return (
    <div className="container2">
      <Splide
        options={{
          type: "loop",
          perPage: 1,
          perMove: 1,
          interval: 2000,
          pauseOnHover: true,
          arrows: true,
          pagination: true,
        }}
      >
        <SplideSlide>
          <div className="textslider ">
            <span className="popular-badge">Most Popular</span>

            <h1 className="fw-bolder text-white" style={{ fontSize: "50px" }}>
              <i>
                {" "}
                Raspberry Pi 5{" "}
                <span className="in">
                  Kits <br />&{" "}
                </span>
                <span>Accessories</span>
              </i>
            </h1>
            <p className="tp">
              Complete starter kits, camera modules, HATs, and peripherals for{" "}
              <br /> Raspberry Pi projects.
            </p>
            <button className="abc">
              <a href="">Explore Kits</a>
            </button>

            <button className="abc">
              <a href="">Learn More</a>
            </button>
          </div>
          <img src={splide1} alt="Product 1" />
        </SplideSlide>

        <SplideSlide>
          <div className="textslider ">
            <span className="popular-badge">New Arrival 2025</span>

            <h1 className="fw-bolder text-white" style={{ fontSize: "50px" }}>
              <i>
                {" "}
                Power Your <span className="in">Next</span>
                <span>Big</span>
                <br />
                <span>project</span>
              </i>
            </h1>
            <p className="tp">
              Explore Raspberry Pi 5, Arduino R4, ESP32-S3 boards <br /> and
              over 5,000 components. Fast shipping across India.
            </p>
            <button className="abc">
              <a href="">Shop Now</a>
            </button>

            <button className="abc">
              <a href="">View Cataglog</a>
            </button>
          </div>
          <img src={splide2} alt="Product 2" />
        </SplideSlide>

        <SplideSlide>
          <div className="textslider ">
            <span className="popular-badge">Arduino Corner</span>

            <h1 className="fw-bolder text-white" style={{ fontSize: "30px" }}>
              <i>
                {" "}
                Arduino Corner Arduino Boards <br />
                For EveryMaker <span className="in"> </span>
              </i>
            </h1>
            <p className="tp fw-semibold text-dark">
              UNO, Mega, Nano, Leonardo and the all-new R4 series. <br /> Pick
              your perfect development platform.
            </p>
            <button className="abc">
              <a href="">BrowseArduino</a>
            </button>

            <button className="abc">
              <a href="">ProjectIdaeas</a>
            </button>
          </div>
          <img src={splide3} alt="Product 3" />
        </SplideSlide>
      </Splide>
    </div>
  );
}

export default Slider;
