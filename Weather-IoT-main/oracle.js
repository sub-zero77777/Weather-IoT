/**
 * oracle.js — Off-chain oracle service
 *
 * Fetches Weather data from OpenWeatherMap + simulates IoT sensors,
 * then pushes the readings on-chain to WeatherOracle.sol every POLL_INTERVAL_MS.
 *
 * Usage:
 *   1. cp .env.example .env  && fill in values
 *   2. npm install
 *   3. node oracle.js
 */

require("dotenv").config();
const axios  = require("axios");
const { ethers } = require("ethers");

// ── ABI (only the functions we call) ───────────────────────────────────────
const ABI = [
  "function updateWeather(string,int256,uint256,uint256,string) external",
  "function updateIoT(string,int256,string) external",
  "function getLatestWeather() external view returns (tuple(string location,int256 temperatureCelsius,uint256 humidity,uint256 windSpeedKmh,string condition,uint256 timestamp))",
  "event WeatherUpdated(string,int256,uint256,uint256,string,uint256)",
  "event IoTUpdated(string,int256,string,uint256)"
];

// ── Config ──────────────────────────────────────────────────────────────────
const {
  RPC_URL            = "http://127.0.0.1:8545",
  ORACLE_PRIVATE_KEY,
  CONTRACT_ADDRESS,
  WEATHER_API_KEY,
  WEATHER_CITY       = "London",
  POLL_INTERVAL_MS   = "60000",
} = process.env;

if (!ORACLE_PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("❌  Set ORACLE_PRIVATE_KEY and CONTRACT_ADDRESS in .env");
  process.exit(1);
}

// ── Provider / Signer / Contract ────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer   = new ethers.Wallet(ORACLE_PRIVATE_KEY, provider);
const oracle   = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// ── Fetch Weather ────────────────────────────────────────────────────────────
async function fetchWeather() {
  if (!WEATHER_API_KEY) {
    // Demo / mock data when no API key is provided
    console.log("⚠️  No WEATHER_API_KEY set — using mock weather data");
    return {
      location   : "MockCity",
      tempScaled : 2350n,   // 23.50°C  (x100)
      humidity   : 65n,
      windSpeed  : 18n,
      condition  : "Partly Cloudy",
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather`
            + `?q=${WEATHER_CITY}&appid=${WEATHER_API_KEY}&units=metric`;
  const { data } = await axios.get(url);

  return {
    location   : data.name,
    tempScaled : BigInt(Math.round(data.main.temp * 100)),
    humidity   : BigInt(Math.round(data.main.humidity)),
    windSpeed  : BigInt(Math.round(data.wind.speed * 3.6)), // m/s → km/h
    condition  : data.weather[0].main,
  };
}

// ── Simulate IoT sensors ─────────────────────────────────────────────────────
function mockIoTReadings() {
  return [
    { id: "SENSOR-TEMP-01",  value: BigInt(Math.round((20 + Math.random()*10)*100)),  unit: "°C x100"  },
    { id: "SENSOR-HUMIDITY-02", value: BigInt(Math.round(40 + Math.random()*50)),     unit: "%"        },
    { id: "SENSOR-CO2-03",   value: BigInt(Math.round(400 + Math.random()*200)),      unit: "ppm"      },
    { id: "SENSOR-PRESSURE-04", value: BigInt(Math.round((1000 + Math.random()*30)*10)), unit: "hPa x10" },
  ];
}

// ── Push data on-chain ───────────────────────────────────────────────────────
async function pushData() {
  console.log(`\n[${new Date().toISOString()}] 🔄  Fetching off-chain data…`);

  // --- Weather ---
  try {
    const w = await fetchWeather();
    console.log(`   🌤  Weather → ${w.location}: ${Number(w.tempScaled)/100}°C, ${w.humidity}% hum, ${w.windSpeed} km/h, ${w.condition}`);
    const txW = await oracle.updateWeather(
      w.location, w.tempScaled, w.humidity, w.windSpeed, w.condition
    );
    await txW.wait();
    console.log(`   ✅  Weather tx: ${txW.hash}`);
  } catch (err) {
    console.error("   ❌  Weather push failed:", err.message);
  }

  // --- IoT sensors ---
  const readings = mockIoTReadings();
  for (const r of readings) {
    try {
      console.log(`   📡  IoT → ${r.id}: ${r.value} ${r.unit}`);
      const txI = await oracle.updateIoT(r.id, r.value, r.unit);
      await txI.wait();
      console.log(`   ✅  IoT tx: ${txI.hash}`);
    } catch (err) {
      console.error(`   ❌  IoT push failed (${r.id}):`, err.message);
    }
  }
}

// ── Main loop ────────────────────────────────────────────────────────────────
(async () => {
  console.log("🚀  Weather/IoT Oracle started");
  console.log(`   RPC            : ${RPC_URL}`);
  console.log(`   Contract       : ${CONTRACT_ADDRESS}`);
  console.log(`   Oracle wallet  : ${signer.address}`);
  console.log(`   Poll interval  : ${POLL_INTERVAL_MS} ms`);

  await pushData();                                     // run immediately
  setInterval(pushData, parseInt(POLL_INTERVAL_MS));    // then every N ms
})();
