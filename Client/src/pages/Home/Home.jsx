import React from "react";
import { Splide } from "@splidejs/react-splide";
import Slider from "./Slider";
import Hero from "./Hero";
import Browse from "./Browse";
import Heroes from "./Heroes";
import Loved from "./Loved";
import Ahead from "./Ahead";
import Footer from "./Footer";
import Header from "../../components/Header";
const Home = () => {
  return (
    <>
    <Header/>
       <Slider></Slider>
      <Hero/>
      <Browse></Browse>
      <Heroes></Heroes>
      <Loved></Loved>
      <Ahead/>
      <Footer></Footer>  
    </>
  );
};

export default Home;
