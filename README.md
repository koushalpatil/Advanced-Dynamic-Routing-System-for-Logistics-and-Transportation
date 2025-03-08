# Advanced Dynamic Routing System for Logistics and Transportation

## 🚀 Overview
The **Advanced Dynamic Routing System** is designed to optimize vehicle routes for logistics and transportation. By leveraging real-time data, the system enhances efficiency, reduces carbon emissions, and improves delivery timelines.

### 🌍 Key Features
- **Real-time Traffic Analysis**: Uses **Google Maps API** & **TomTom API** to dynamically adjust routes based on live traffic data.
- **Environmental Impact Reduction**: Incorporates **AQICN API** for air quality and carbon emission considerations.
- **Weather-Aware Routing**: Adjusts routes based on **real-time weather conditions**.
- **Optimized Travel Time**: Uses **OSRM API** for the most efficient route calculations.
- **WebSocket-Powered Updates**: Implements **Socket.IO** for live route updates and real-time communication.
- **Interactive UI**: Built with **React + Vite** for a seamless user experience.
- **Robust Backend**: Developed with **Node.js & Express.js** for API handling and data processing.
- **Database Management**: Uses **MongoDB** to store route history, user preferences, and analytics.

## 🛠️ Tech Stack
### **Frontend**
- React.js
- Vite
- TailwindCSS
- Google Maps API
- TomTom API
- AQICN API
- OSRM API

### **Backend**
- Node.js
- Express.js
- MongoDB
- Socket.IO

## 📸 Screenshots
### 🌍 **Interactive Routing System**
![Image 1](./frontend/w1.png)

### 📍 **Real-time Route Optimization**
![Image 2](./frontend/w2.png)

### 📊 **Traffic & Environmental Insights**
![Image 3](./frontend/w3.png)

## 🏗️ Installation & Setup
### **1️⃣ Clone the Repository**
```sh
 git clone https://github.com/your-username/Advanced-Dynamic-Routing-System.git
 cd Advanced-Dynamic-Routing-System
```

### **2️⃣ Install Dependencies**
#### **Frontend**
```sh
cd frontend
npm install
npm run dev
```

#### **Backend**
```sh
cd backend
npm install
npm start
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the backend directory and configure API keys:
```sh
GOOGLE_MAPS_API_KEY=your_api_key
TOMTOM_API_KEY=your_api_key
AQICN_API_KEY=your_api_key
OSRM_API_ENDPOINT=your_osrm_server_url
```



---
Start optimizing your logistics routes today with **Advanced Dynamic Routing System**! 🚚⚡


