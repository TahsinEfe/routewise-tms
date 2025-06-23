<h1 align="center">🚛 RouteWiseTMS</h1>
<p align="center">
  A modern Transportation Management System (TMS) built with React and Spring Boot to streamline logistics operations.
</p>

---

## 📚 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Design Patterns](#design-patterns)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Google Maps Integration](#google-maps-integration)
- [License](#license)

---

## 🏗️ Architecture Overview

RouteWiseTMS follows a modern layered architecture:

- **Frontend**: React-based SPA with reusable UI components
- **Backend**: Spring Boot with RESTful APIs
- **Database**: MySQL using JPA/Hibernate
- **Security**: JWT authentication with role-based access control
- **Docs**: Swagger/OpenAPI for API documentation

---

## 🎨 Design Patterns

RouteWiseTMS applies several Gang of Four (GoF) design patterns:

### 🔧 Creational
- **Factory Pattern**: `ClientFactory`, `OrderFactory`, `VehicleFactory`, etc. for object creation logic

### 🧩 Structural
- **Facade Pattern**: Service interfaces (e.g., `IOrderService`) to simplify complex operations
- **Data Mapper Pattern**: DTOs decouple database schema from business logic

### 🔁 Behavioral
- **Strategy Pattern**: Custom strategies for different order types/statuses
- **Observer Pattern**: Frontend state updates using React’s state management

---

## 🚀 Features

- ✅ User Registration & Authentication (JWT)
- ✅ Role-Based Access Control
- ✅ Company & Client Management
- ✅ Order Lifecycle Management
- ✅ Route Visualization with Interactive Maps
- ✅ Vehicle & Driver Assignment
- ✅ Dashboard Metrics (Admin/User-specific)
- ✅ Responsive UI for all screen sizes

---

## 🧰 Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- React Router, Leaflet, Google Maps API
- Recharts (Analytics), Lucide Icons

### Backend
- Spring Boot 3 (Java 21)
- Spring Security (JWT)
- Spring Data JPA + Hibernate
- MySQL
- Swagger/OpenAPI, Lombok

---

## 🗂 Project Structure

```
routewise-tms/
├── routewise-backend/ # Spring Boot backend
├── routewise-frontend/ # React frontend
│ └── .env.local # Google Maps API Key here
└── docs/
└── GOOGLE_MAPS_SETUP.md # Map integration guide
```



---

## ⚙️ Setup Instructions

### 🔙 Backend Setup

1. Create MySQL database named `routewise_tms`
2. Configure `application.properties` with DB credentials
3. Build & run the Spring Boot app:

```bash
mvn clean install
mvn spring-boot:run
```

➡ Access API Docs at: http://localhost:7070/swagger-ui.html


💻 Frontend Setup
Install dependencies:

```bash

cd routewise-frontend
npm install
```

Start dev server:

```bash
npm run dev
➡ Access app at: http://localhost:3000
```


🗺️ Google Maps Integration
Create a Google Cloud project

Enable:

* Maps JavaScript API

* Geocoding API

* Enable Billing

* Generate an API Key

* Add the key to .env.local:

env:

VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
📄 For full steps, see docs/GOOGLE_MAPS_SETUP.md.
