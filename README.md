# 🌦️ Weather-IoT with Blockchain

An IoT-based Weather Monitoring System that combines **IoT**, **Blockchain (Ethereum)**, and **Smart Contracts** to securely collect, store, and verify real-time environmental data. Weather parameters such as temperature and humidity are captured using IoT sensors and transmitted to the cloud, while critical sensor records are securely stored on the Ethereum blockchain through smart contracts, ensuring data integrity, transparency, and tamper-proof record keeping.

---

## 🚀 Features

* 🌡️ Real-Time Temperature Monitoring
* 💧 Humidity Measurement
* 📡 IoT Sensor Integration
* ☁️ Cloud-Based Data Storage
* ⛓️ Ethereum Blockchain Integration
* 📜 Smart Contract-Based Data Storage
* 🔒 Immutable On-Chain Weather Records
* 📊 Live Dashboard for Data Visualization
* 📈 Historical Weather Data Analysis
* 🌐 Remote Monitoring via Web Dashboard

---

## 🛠️ Tech Stack

* **Programming Language:** Python
* **IoT Device:** ESP32 / ESP8266
* **Sensors:** DHT11 / DHT22
* **Blockchain:** Ethereum
* **Smart Contracts:** Solidity
* **Blockchain Framework:** Web3.py
* **Cloud Platform:** Firebase / ThingSpeak *(Update as applicable)*
* **Database:** Cloud Storage
* **Visualization:** Dashboard

---

## 📂 Project Structure

```text
Weather-IoT/
│
├── sensors/
├── blockchain/
│   ├── smart_contract.sol
│   ├── deploy.py
│   └── web3_client.py
├── dashboard/
├── cloud/
├── config/
├── requirements.txt
├── main.py
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/sub-zero77777/Weather-IoT.git
cd Weather-IoT
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Project

```bash
python main.py
```

---

## ⛓️ Blockchain Workflow

1. IoT sensors collect temperature and humidity data.
2. Sensor readings are sent to the Python backend.
3. The backend processes and validates the data.
4. Important weather records are submitted to an Ethereum Smart Contract.
5. The smart contract stores the data on the blockchain.
6. Transaction hashes provide proof of authenticity.
7. Users can verify weather records directly on-chain while viewing live data through the dashboard.

---

## 📊 System Architecture

```text
DHT11/DHT22 Sensor
        │
        ▼
   ESP32 / ESP8266
        │
        ▼
   Python Backend
        │
 ┌──────┴────────┐
 ▼               ▼
Cloud Database   Ethereum Blockchain
                    │
            Smart Contract
                    │
                    ▼
          Immutable Weather Records
                    │
                    ▼
          Dashboard / Web Interface
```

---

## 🔐 Blockchain Features

* Ethereum-based decentralized storage
* Solidity smart contracts
* On-chain weather data verification
* Tamper-proof sensor records
* Immutable transaction history
* Secure and transparent data management
* Transaction hash generation for every stored record

---

## 🔮 Future Enhancements

* AI-Based Weather Prediction
* Air Quality Monitoring
* Rainfall Detection
* Wind Speed Monitoring
* NFT-Based Weather Certificates
* Decentralized Data Sharing
* Mobile Application
* Email/SMS Weather Alerts

---

## 👨‍💻 Author

GitHub: https://github.com/sub-zero77777

---

## 📄 License

This project is developed for educational and learning purposes.
