const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const Category = require('./models/Category');
const Product = require('./models/Product');

const ASSETS_BASE = path.join(__dirname, '../Client/src/assets/IoT Robotics Drone & Embedded Systems Categories and Components');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Categories list
const categoriesList = [
  { name: "Displays", description: "OLED, TFT, LCD and 7-Segment visual display modules", status: "Active" },
  { name: "Indicators", description: "Alphanumeric LCD displays, addressable RGB LEDs and visual indicators", status: "Active" },
  { name: "Motors", description: "DC Gear motors, Stepper motors, Servo motors and motor driver modules", status: "Active" },
  { name: "Actuators", description: "Linear actuators, Solenoid valves and electromechanical actuators", status: "Active" },
  { name: "Battery Components", description: "Li-po batteries, 18650 cells, BMS protection and battery holders", status: "Active" },
  { name: "Power Components", description: "Voltage regulators, buck converters, solar panels and TP4056 chargers", status: "Active" },
  { name: "Communication Modules", description: "Bluetooth, Wi-Fi, LoRa, GSM, GPS and RF wireless modules", status: "Active" },
  { name: "Sensors", description: "Temperature, humidity, motion, gas, ultrasonic and environmental sensors", status: "Active" },
  { name: "Microcontrollers", description: "ATtiny, ESP8266, ESP32, PIC and compact microcontroller breakout boards", status: "Active" },
  { name: "Development Boards", description: "Arduino, Raspberry Pi, STM32 and BeagleBone development boards", status: "Active" }
];

// 72 Products data
const rawProducts = [
  // Displays (4 items)
  {
    name: "7-Segment Displays",
    categoryName: "Displays",
    price: 7200,
    original_price: 8000,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "6 Displays & Indicators/7-Segment Displays  .png",
    description: "Bright 7-segment digital numeric LED display module for counters, clocks, and digital instrumentation."
  },
  {
    name: "TFT Display",
    categoryName: "Displays",
    price: 476,
    original_price: 595,
    badge: "FEATURED",
    discount: "20% OFF",
    relImage: "6 Displays & Indicators/TFT Display  .png",
    description: "Full-color vibrant TFT display module featuring SPI interface and high-speed graphic rendering."
  },
  {
    name: "0.96 OLED LCD",
    categoryName: "Displays",
    price: 6300,
    original_price: 7000,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "6 Displays & Indicators/0.96 OLED LCD .png",
    description: "Crisp 128x64 I2C monochrome OLED display module with wide viewing angles and low power consumption."
  },
  {
    name: "20x4 LCD",
    categoryName: "Displays",
    price: 540,
    original_price: 600,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "6 Displays & Indicators/20x4 LCD.png",
    description: "20 character by 4 lines alphanumeric character display module with blue backlight and standard HD44780 controller."
  },

  // Indicators (2 items)
  {
    name: "16x2 LCD",
    categoryName: "Indicators",
    price: 4050,
    original_price: 4500,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "6 Displays & Indicators/16x2 LCD .png",
    description: "Standard 16 character x 2 line liquid crystal alphanumeric display module with bright green LED backlight."
  },
  {
    name: "WS2812",
    categoryName: "Indicators",
    price: 4077,
    original_price: 4530,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "6 Displays & Indicators/WS2812 RGB LEDS.png",
    description: "WS2812 individually addressable 5050 RGB LED strip with integrated driver IC for vibrant lighting effects."
  },

  // Motors (14 items)
  {
    name: "DRV8825 Stepper Motor Driver",
    categoryName: "Motors",
    price: 3105,
    original_price: 3450,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/DRV8825 Stepper Motor Driver .png",
    description: "High-performance microstepping stepper motor driver carrier with adjustable current limiting and 1/32 step resolution."
  },
  {
    name: "L298N Motor Driver",
    categoryName: "Motors",
    price: 3060,
    original_price: 3400,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/L298N Motor Driver.png",
    description: "Dual H-bridge motor driver module capable of driving two DC motors or one 4-wire two-phase stepper motor up to 2A."
  },
  {
    name: "MG995 Servo Motor",
    categoryName: "Motors",
    price: 6750,
    original_price: 7500,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/MG995 Servo Motor .png",
    description: "High-torque standard metal gear digital servo motor designed for robotics, RC planes, and heavy-duty steering."
  },
  {
    name: "SG90 Micro Servo Motor",
    categoryName: "Motors",
    price: 405,
    original_price: 450,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/SG90 Micro Servo Motor.png",
    description: "Lightweight 9g micro servo motor perfect for DIY robotics, robot arms, and small aircraft steering systems."
  },
  {
    name: "12V DC Gear Motor",
    categoryName: "Motors",
    price: 1260,
    original_price: 1400,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/12V DC Gear Motor .png",
    description: "Robust 12V metal gearbox DC motor providing smooth high torque for wheeled robotics and automation."
  },
  {
    name: "12V DC Gear Motor 100rpm",
    categoryName: "Motors",
    price: 1350,
    original_price: 1500,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/12V DC Gear Motor 100rpm .png",
    description: "Precision 100 RPM high-torque 12V DC gear motor engineered for continuous industrial and robotic operation."
  },
  {
    name: "12V DC Motor",
    categoryName: "Motors",
    price: 720,
    original_price: 800,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/12V DC Motor .png",
    description: "High-speed 12V standard brushed DC motor suitable for drills, small fans, and electric hobby projects."
  },
  {
    name: "24V DC Gear Motor",
    categoryName: "Motors",
    price: 1800,
    original_price: 2000,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/24V DC Gear Motor .png",
    description: "Heavy-duty 24V DC geared motor delivering exceptional torque for automated machinery and heavy conveyors."
  },
  {
    name: "24V DC Motor",
    categoryName: "Motors",
    price: 990,
    original_price: 1100,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/24V DC Motor .png",
    description: "High-efficiency 24V industrial grade DC electric motor with durable carbon brushes and ball bearings."
  },
  {
    name: "6V DC Gear Motor",
    categoryName: "Motors",
    price: 540,
    original_price: 600,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/6V DC Gear Motor .png",
    description: "Compact 6V micro geared DC motor ideal for battery-operated smart cars, line followers, and educational kits."
  },
  {
    name: "6V DC Motor",
    categoryName: "Motors",
    price: 360,
    original_price: 400,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/6V DC Motor .png",
    description: "Miniature 6V high-RPM DC hobby motor for simple toys, science fair projects, and motorized gadgets."
  },
  {
    name: "DC BO Motor",
    categoryName: "Motors",
    price: 180,
    original_price: 200,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/DC BO Motor.png",
    description: "Standard yellow dual-shaft Battery Operated (BO) DC gear motor widely used in basic 2WD/4WD robotic chassis."
  },
  {
    name: "NEMA17 Stepper motor",
    categoryName: "Motors",
    price: 1980,
    original_price: 2200,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/NEMA17 Stepper motor .png",
    description: "High-precision bipolar 1.8-degree NEMA 17 stepper motor trusted in 3D printers, CNC routers, and positioning rigs."
  },
  {
    name: "NEMA23 STEPPER MOTOR",
    categoryName: "Motors",
    price: 3420,
    original_price: 3800,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/NEMA23 STEPPER MOTOR .png",
    description: "Industrial strength NEMA 23 hybrid stepper motor with massive holding torque for CNC mills and robotics."
  },

  // Actuators (2 items)
  {
    name: "Solenoid Valves",
    categoryName: "Actuators",
    price: 4050,
    original_price: 4500,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/Solenoid Valves .png",
    description: "12V DC normally-closed electric solenoid water valve for smart irrigation, automatic dispensers, and fluid control."
  },
  {
    name: "Linear Actuators",
    categoryName: "Actuators",
    price: 585,
    original_price: 650,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "5 Actuators & Motors/Linear Actuators .png",
    description: "Electromechanical 12V telescopic stroke linear actuator designed for solar trackers, smart windows, and robot arms."
  },

  // Battery Components (6 items)
  {
    name: "12v Li-po Battery",
    categoryName: "Battery Components",
    price: 2250,
    original_price: 2500,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/12v Li-po Battery  .png",
    description: "High-discharge 3S 11.1V / 12V Lithium-Polymer rechargeable battery pack for RC drones, quadcopters, and mobile robots."
  },
  {
    name: "18650",
    categoryName: "Battery Components",
    price: 270,
    original_price: 300,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/18650 .png",
    description: "Standard 3.7V 2600mAh high-capacity rechargeable 18650 Li-ion battery cell for power banks and electronics projects."
  },
  {
    name: "BMS",
    categoryName: "Battery Components",
    price: 450,
    original_price: 500,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/BMS .png",
    description: "3S 20A Battery Management System protection circuit board protecting lithium cells from overcharge and short circuits."
  },
  {
    name: "Li-ion Charger",
    categoryName: "Battery Components",
    price: 360,
    original_price: 400,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/Li-ion Charger .png",
    description: "Smart dual-slot intelligent lithium-ion battery desktop charger with independent status indicators and cut-off safety."
  },
  {
    name: "Li-po battery",
    categoryName: "Battery Components",
    price: 1620,
    original_price: 1800,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/Li-po battery.png",
    description: "Lightweight 7.4V 2S rechargeable Li-Po battery pack providing steady peak current for high-demand drone systems."
  },
  {
    name: "Lithium Battery holder 4 slots",
    categoryName: "Battery Components",
    price: 180,
    original_price: 200,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/Lithium Battery holder 4 slots.png",
    description: "Durable 4-slot 18650 battery holder with wire leads for creating 14.8V series or high-capacity parallel battery banks."
  },

  // Power Components (6 items)
  {
    name: "AMS1117",
    categoryName: "Power Components",
    price: 45,
    original_price: 50,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/AMS1117.png",
    description: "Low-dropout 3.3V voltage regulator module converting 5V down to steady 3.3V for microcontrollers and sensors."
  },
  {
    name: "LM317",
    categoryName: "Power Components",
    price: 54,
    original_price: 60,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/LM317 .png",
    description: "Adjustable 1.2V to 37V positive linear voltage regulator module with built-in multi-turn precision potentiometer."
  },
  {
    name: "LM7805",
    categoryName: "Power Components",
    price: 45,
    original_price: 50,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/LM7805 .png",
    description: "Standard 5V 1.5A positive fixed voltage regulator IC with thermal overload and internal short-circuit protection."
  },
  {
    name: "Solar Panel",
    categoryName: "Power Components",
    price: 810,
    original_price: 900,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/Solar Panel .png",
    description: "Monocrystalline 6V 2W waterproof mini solar panel for outdoor IoT weather stations, battery harvesters, and eco kits."
  },
  {
    name: "TP4056",
    categoryName: "Power Components",
    price: 90,
    original_price: 100,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/TP4056.png",
    description: "1A Lithium battery charging board with Type-C input and dual battery discharge protection circuitry."
  },
  {
    name: "XL4015 Buck",
    categoryName: "Power Components",
    price: 450,
    original_price: 500,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "4 Power & Battery Components/XL4015 Buck.png",
    description: "High-power 5A DC-DC step-down adjustable buck converter module with efficiency up to 96%."
  },

  // Communication Modules (10 items)
  {
    name: "433MHz",
    categoryName: "Communication Modules",
    price: 315,
    original_price: 350,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/433MHz.png",
    description: "433MHz RF wireless transmitter and receiver link pair kit for wireless doorbells, remote switches, and telemetry."
  },
  {
    name: "CC2530",
    categoryName: "Communication Modules",
    price: 720,
    original_price: 800,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/CC2530.png",
    description: "TI CC2530 Zigbee 2.4GHz wireless SoC module with long-range antenna for smart home and mesh networking."
  },
  {
    name: "HC-05",
    categoryName: "Communication Modules",
    price: 540,
    original_price: 600,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/HC-05.png",
    description: "Master/Slave 6-pin serial Bluetooth RF transceiver module for wireless serial data transfer between MCU and mobile."
  },
  {
    name: "HC-06",
    categoryName: "Communication Modules",
    price: 495,
    original_price: 550,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/HC-06.png",
    description: "Slave-only serial Bluetooth module for transparent wireless UART communication with Android devices."
  },
  {
    name: "NEO-6M",
    categoryName: "Communication Modules",
    price: 990,
    original_price: 1100,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/NEO-6M .png",
    description: "High-sensitivity GPS satellite positioning receiver module with onboard ceramic antenna and EEPROM."
  },
  {
    name: "NRF24L01",
    categoryName: "Communication Modules",
    price: 270,
    original_price: 300,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/NRF24L01 .png",
    description: "2.4GHz ultra-low power RF wireless transceiver module with 2Mbps data rate for remote control drones and robotics."
  },
  {
    name: "SIM800L",
    categoryName: "Communication Modules",
    price: 1350,
    original_price: 1500,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/SIM800L.png",
    description: "Miniature quad-band GPRS/GSM cellular breakout module supporting SMS, voice call, and internet data communication."
  },
  {
    name: "SIM900A",
    categoryName: "Communication Modules",
    price: 1800,
    original_price: 2000,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/SIM900A.png",
    description: "Dual-band GSM/GPRS industrial grade wireless development modem module with RS232/TTL interface."
  },
  {
    name: "SX1278",
    categoryName: "Communication Modules",
    price: 1080,
    original_price: 1200,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/SX1278.png",
    description: "Long-range 433MHz LoRa spread spectrum wireless transceiver module capable of transmission over several kilometers."
  },
  {
    name: "XBee",
    categoryName: "Communication Modules",
    price: 2700,
    original_price: 3000,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "3 Wireless & Communication Modules/XBee.png",
    description: "Digi XBee Series 2 wireless RF module for reliable point-to-multipoint and mesh industrial communication."
  },

  // Sensors (14 items)
  {
    name: "ADXL345",
    categoryName: "Sensors",
    price: 360,
    original_price: 400,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/ADXL345.png",
    description: "Small, thin, ultra-low power 3-axis accelerometer with high resolution (13-bit) measurement up to ±16g."
  },
  {
    name: "DHT11",
    categoryName: "Sensors",
    price: 180,
    original_price: 200,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/DHT11.png",
    description: "Basic digital composite temperature and humidity sensor with calibrated single-wire digital signal output."
  },
  {
    name: "DHT22",
    categoryName: "Sensors",
    price: 450,
    original_price: 500,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/DHT22.png",
    description: "High-precision digital temperature and humidity sensor with 0.1 degree resolution and wide operating range."
  },
  {
    name: "DS18B20",
    categoryName: "Sensors",
    price: 270,
    original_price: 300,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/DS18B20 .png",
    description: "Waterproof stainless-steel digital temperature sensor probe operating over a 1-Wire bus with 9 to 12-bit precision."
  },
  {
    name: "Fingerprint sensor",
    categoryName: "Sensors",
    price: 1980,
    original_price: 2200,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "2 Sensor/Fingerprint sensor.png",
    description: "Optical biometric fingerprint reader module with onboard high-speed DSP image processing and UART interface."
  },
  {
    name: "IR",
    categoryName: "Sensors",
    price: 90,
    original_price: 100,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/IR.png",
    description: "Infrared obstacle avoidance proximity sensor module with adjustable distance potentiometer for autonomous robots."
  },
  {
    name: "KY-038",
    categoryName: "Sensors",
    price: 135,
    original_price: 150,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/KY-038 .png",
    description: "High-sensitivity acoustic microphone sound sensor module with both analog and digital threshold outputs."
  },
  {
    name: "LDR",
    categoryName: "Sensors",
    price: 72,
    original_price: 80,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/LDR.png",
    description: "Light Dependent Resistor sensor module for automatic street lights, darkness detection, and ambient light monitoring."
  },
  {
    name: "MPU6050",
    categoryName: "Sensors",
    price: 315,
    original_price: 350,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "2 Sensor/MPU6050.png",
    description: "6-axis motion tracking sensor combining a 3-axis gyroscope and a 3-axis accelerometer with digital motion processing (DMP)."
  },
  {
    name: "MQ-135",
    categoryName: "Sensors",
    price: 405,
    original_price: 450,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/MQ-135.png",
    description: "Air quality detection sensor module sensitive to Ammonia, Benzene, Alcohol, and smoke for smart ventilation systems."
  },
  {
    name: "MQ-2",
    categoryName: "Sensors",
    price: 360,
    original_price: 400,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/MQ-2 .png",
    description: "Combustible gas and smoke detection sensor module sensitive to LPG, Propane, Methane, and smoke particles."
  },
  {
    name: "PIR",
    categoryName: "Sensors",
    price: 180,
    original_price: 200,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/PIR .png",
    description: "Passive Infrared (PIR) motion detector sensor module designed for intruder alarms, automated lighting, and energy savers."
  },
  {
    name: "SW-420",
    categoryName: "Sensors",
    price: 135,
    original_price: 150,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "2 Sensor/SW-420 .png",
    description: "Normally-closed vibration sensor module with comparator circuitry for anti-theft alarms and impact detection."
  },
  {
    name: "Ultrasonic HC-SR04",
    categoryName: "Sensors",
    price: 180,
    original_price: 200,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "2 Sensor/Ultrasonic HC-SR04 .png",
    description: "Contactless 2cm to 400cm ultrasonic distance measuring sonar sensor module widely used in robot obstacle detection."
  },

  // Microcontrollers (7 items)
  {
    name: "ATtiny85",
    categoryName: "Microcontrollers",
    price: 180,
    original_price: 200,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/ATtiny85/ATtiny85 .png",
    description: "Ultra-compact 8-pin 8-bit AVR microcontroller with 8KB flash memory, perfect for mini wearable gadgets."
  },
  {
    name: "PIC Microcontrollers",
    categoryName: "Microcontrollers",
    price: 450,
    original_price: 500,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/PIC Microcontrollers/PIC Microcontrollers .png",
    description: "Microchip PIC microcontroller IC with versatile peripherals, analog inputs, and robust industrial resilience."
  },
  {
    name: "ESP8266",
    categoryName: "Microcontrollers",
    price: 360,
    original_price: 400,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/ESP8266 & ESP32/ESP8266 .png",
    description: "Low-cost standalone Wi-Fi microchip with full TCP/IP stack and microcontroller capabilities for IoT."
  },
  {
    name: "ESP32",
    categoryName: "Microcontrollers",
    price: 540,
    original_price: 600,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/ESP8266 & ESP32/ESP32.png",
    description: "Powerful dual-core 32-bit Wi-Fi and Bluetooth BLE microcontroller board delivering high compute for smart devices."
  },
  {
    name: "Arduino Nano",
    categoryName: "Microcontrollers",
    price: 360,
    original_price: 400,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/Arduino Boards/Arduino Nano.png",
    description: "Breadboard-friendly small development board based on the ATmega328P with integrated Mini-USB connection."
  },
  {
    name: "Arduino Pro Mini",
    categoryName: "Microcontrollers",
    price: 270,
    original_price: 300,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/Arduino Boards/Arduino Pro Mini  .png",
    description: "Ultra-miniature ATmega328P board stripped of heavy USB ports for lightweight embedded installs."
  },
  {
    name: "UNO R3 SMD Board",
    categoryName: "Microcontrollers",
    price: 540,
    original_price: 600,
    badge: "POPULAR",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/Arduino Boards/UNO R3 SMD Board .png",
    description: "SMD edition Arduino Uno R3 board offering reliable operation and complete shield compatibility."
  },

  // Development Boards (7 items)
  {
    name: "Arduino uno 1",
    categoryName: "Development Boards",
    price: 630,
    original_price: 700,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/Arduino Boards/Arduino uno 1 .png",
    description: "The classic ATmega328P Arduino Uno board, the gold standard for electronics education and rapid prototyping."
  },
  {
    name: "Arduino Mega",
    categoryName: "Development Boards",
    price: 1440,
    original_price: 1600,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/Arduino Boards/Arduino Mega.png",
    description: "High-capacity ATmega2560 board with 54 digital I/O pins, 16 analog inputs, and 4 hardware UART serial ports."
  },
  {
    name: "Raspberry Pi 3 Model B",
    categoryName: "Development Boards",
    price: 3600,
    original_price: 4000,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/Raspberry Pi/Raspberry Pi 3 Model B .png",
    description: "Single-board computer powered by a 1.2GHz 64-bit quad-core ARM processor with onboard Wi-Fi and Bluetooth."
  },
  {
    name: "Raspberry Pi 4 Model B",
    categoryName: "Development Boards",
    price: 5400,
    original_price: 6000,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/Raspberry Pi/Raspberry Pi 4 Model B .png",
    description: "Upgraded single-board computer with 1.5GHz quad-core CPU, dual 4K micro-HDMI ports, and Gigabit Ethernet."
  },
  {
    name: "Raspberry Pi 5",
    categoryName: "Development Boards",
    price: 8100,
    original_price: 9000,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/Raspberry Pi/Raspberry Pi 5 .png",
    description: "Next-generation Raspberry Pi 5 with 2.4GHz quad-core Cortex-A76 processor delivering 2-3x processing performance."
  },
  {
    name: "STM32 Boards",
    categoryName: "Development Boards",
    price: 450,
    original_price: 500,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/STM32 Boards/STM32 Boards .png",
    description: "STM32F103C8T6 'Blue Pill' ARM Cortex-M3 32-bit development board running up to 72MHz with fast hardware peripherals."
  },
  {
    name: "BeagleBone Black",
    categoryName: "Development Boards",
    price: 6300,
    original_price: 7000,
    badge: "FEATURED",
    discount: "10% OFF",
    relImage: "1 Microcontrollers & Development Boards/BeagleBone Black/BeagleBone Black .png",
    description: "Community-supported open-hardware computer for developers featuring Sitara AM3358 ARM Cortex-A8 processor."
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 1. Create or update Categories
    const categoryMap = {};
    for (const cat of categoriesList) {
      let existing = await Category.findOne({ category: cat.name });
      if (!existing) {
        existing = new Category({
          category: cat.name,
          description: cat.description,
          status: cat.status,
          photo: "default.png"
        });
        await existing.save();
        console.log(`Created Category: ${cat.name}`);
      } else {
        existing.description = cat.description;
        existing.status = cat.status;
        await existing.save();
      }
      categoryMap[cat.name] = existing._id;
    }

    // 2. Copy images to uploads and create or update Products
    let count = 0;
    for (const item of rawProducts) {
      const srcPath = path.join(ASSETS_BASE, item.relImage);
      const cleanFileName = path.basename(item.relImage).trim().replace(/\s+/g, '_');
      const destPath = path.join(UPLOADS_DIR, cleanFileName);

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      }

      const catId = categoryMap[item.categoryName];
      let existingProd = await Product.findOne({ name: item.name });

      const prodData = {
        name: item.name,
        short_description: item.description,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        cost_price: Math.round(item.price * 0.7),
        stock_quantity: 50,
        stock_status: "in_stock",
        thumbnail: cleanFileName,
        images: [cleanFileName],
        category_id: catId,
        tags: [item.categoryName, "SIPL", item.badge],
        is_featured: item.badge === "FEATURED",
        status: "active"
      };

      if (!existingProd) {
        await Product.create(prodData);
        count++;
      } else {
        await Product.findByIdAndUpdate(existingProd._id, prodData);
        count++;
      }
    }

    console.log(`Successfully seeded ${count} products across ${categoriesList.length} categories!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
