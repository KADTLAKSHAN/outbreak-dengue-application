# Dengue Case Prediction Web Application

A web-based dengue case prediction system that forecasts dengue cases based on weather factors. The system supports public users and Health officials by providing predictive analytics, real-time dengue data visualization, alerts, complaints handling, and public awareness features.

---

## 📌 Project Overview

Dengue is a major public health concern influenced by environmental and weather conditions. This application leverages machine learning and modern web technologies to predict dengue cases and support early decision-making for health authorities.

The system allows:
- Public users to view predictions, submit complaints, and receive alerts
- MOH officials to monitor real-time dengue cases, manage alerts, complaints, and awareness posts
- Administrators to manage users, locations, and weather data used for prediction

---

## ⚙️ Functional Requirements

### 1. Dengue Case Prediction
- Predicts dengue cases based on user-input weather factors
- Users can select a specific week to view predicted dengue cases
- MOH officials receive automatic predictions for the upcoming week using assumed weather values entered by the admin
- Predictions are generated using the latest data stored in the database

### 2. User Registration & Authentication
- Public users can register using a valid email and username
- Secure login with role-based access control
- Authenticated users can access predictions, alerts, and complaint features

### 3. Real-Time Dengue Cases View
- Displays dengue cases by **month** and **district**
- Provides real-time insights for MOH officials to identify trends and potential outbreaks

### 4. Alert Management System
MOH officials can create and manage alerts with different risk levels:
- Low Risk  
- Moderate Risk  
- High Risk  
- Outbreak Alert  
- Critical Alert  
- Local Outbreak  
- Nearby Outbreaks  
- Travel Alert  
- Public Health Announcements  

These alerts help the public and authorities take preventive actions in advance.

### 5. Complaint Submission System
Public users can submit dengue-related complaints, which are reviewed and addressed by MOH officials.

Complaint categories include:
- Symptoms Reporting  
- Mosquito Breeding Sites  
- Public Health Concerns  
- Awareness Issues  
- Medical Facility Issues  
- Environmental Health Concerns  
- Community Engagement  
- Technical Issues  

### 6. Dengue Awareness Posts
- MOH officials can publish educational posts
- Focuses on dengue prevention, outbreak control, and public awareness
- Ensures accurate and timely health information reaches the community

### 7. Admin Functionalities
Administrators are responsible for:
- **User Management** – Managing registered users and access permissions  
- **District & Division Management** – Maintaining up-to-date location data  
- **Weather Data Management** – Updating and assuming weather factors for predictive modeling  

---

## 🛠️ Technology Stack

### Frontend (React Vite)
- **React (Vite)** – Fast and lightweight frontend framework
- **Axios** – API communication between frontend and backend
- **React-Select** – Customizable dropdown components
- **React-Table** – Dynamic tables for complaints, cases, and alerts
- **Headless UI** – Pop-up screens and interactive components
- **Tailwind CSS** – Responsive and modern UI design

---

### Backend (Spring Boot 6 – Java 17)
- **Spring Boot 6** – Backend API and business logic
- **Java 17** – Modern Java features and performance
- **Maven** – Dependency management and project build
- **ModelMapper** – DTO to entity mapping
- **Spring Security** – Authentication and authorization
- **Spring Validation** – Input validation
- **CORS Configuration** – Cross-origin frontend-backend communication
- **Packaged as JAR** – For easy deployment

---

### Machine Learning Model (FastAPI & Jupyter Notebook)
- **FastAPI** – Serves the ML model via REST API
- **Uvicorn** – ASGI server for FastAPI
- **Pickle File** – Stores trained model, scaler, encoder, and features
- **NumPy & Pandas** – Data processing and analysis
- **Model Training** – Performed in Jupyter Notebook
- **Visualization** – Plotly Express, Matplotlib, Seaborn
- **Feature Scaling** – MinMaxScaler
- **Categorical Encoding** – OneHotEncoder for district names
- **Model Evaluation** – K-Fold Cross Validation using `cross_val_score`

---

### Database
- **H2 Database** – Used during development and testing
- **MySQL** – Production database
- **JWT Authentication** – Secure login and role-based access control

---

### Development Tools
- **IntelliJ IDEA** – Spring Boot backend development
- **Visual Studio Code** – React frontend development
- **Postman** – API testing
- **Anaconda Navigator** – Jupyter Notebook execution
- **MySQL Workbench** – Database management
- **Git & GitHub** – Version control and collaboration

---

## 🚀 Deployment (Localhost Setup)

| Component | URL / Port |
|---------|------------|
| Backend (Spring Boot) | `http://localhost:8080` |
| ML API (FastAPI) | `http://0.0.0.0:8000` |
| Frontend (React Vite) | `http://localhost:5173` |

---

## 🔐 Authentication & Security
- JWT-based authentication
- Role-based access for Public Users, MOH Officials, and Admins
- Secure API endpoints using Spring Security

---

## 📊 Key Features Summary
- Weather-based dengue case prediction
- Real-time dengue case visualization
- Role-based alert management system
- Complaint handling and response system
- Public awareness and education platform
- Machine learning–powered forecasting

---

## 📄 License
This project is developed for academic and research purposes.

---

## 🙌 Acknowledgements
- Dengue Control Unit and MOH Resources
- Open-source libraries and frameworks used in this project
