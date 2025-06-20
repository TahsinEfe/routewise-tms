# RouteWiseTMS

RouteWiseTMS is a full-stack Transportation Management System (TMS) designed to streamline and optimize transportation operations for companies. The project consists of a modern React-based frontend and a robust Spring Boot backend.

---

## Features

- User registration, authentication, and role-based dashboards
- Company, client, employee, vehicle, and order management
- Interactive maps and route planning
- Expense and payroll tracking
- Responsive, modern UI with shadcn-ui and Tailwind CSS
- Secure RESTful API with JWT authentication

---

## Tech Stack

### Frontend

- **React** (with Vite, TypeScript)
- **Tailwind CSS** & **shadcn-ui** for UI
- **React Router** for navigation
- **React Query** for data fetching
- **Leaflet** for interactive maps

### Backend

- **Spring Boot 3** (Java 21)
- **Spring Data JPA** (MySQL)
- **Spring Security** (JWT-based authentication)
- **OpenAPI/Swagger** for API documentation

---

## Project Structure

```
RouteWiseTMS/
  ├── route_wise_frontend/   # React frontend (Vite, TypeScript)
  └── routewise-tms/         # Spring Boot backend (Java)
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Java 21
- Maven
- MySQL

---

### Backend Setup

1. **Configure Database:**
   - Create a MySQL database (e.g., `routewise_tms`).
   - Update `src/main/resources/application.properties` with your DB credentials.

2. **Build & Run:**
   ```sh
   cd routewise-tms
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will start on [http://localhost:7070](http://localhost:7070).

3. **API Docs:**
   - Visit [http://localhost:7070/swagger-ui.html](http://localhost:7070/swagger-ui.html) for interactive API documentation.

---

### Frontend Setup

1. **Install dependencies:**
   ```sh
   cd route_wise_frontend
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm run dev
   ```
   The frontend will be available at [http://localhost:5173](http://localhost:5173) (or as indicated in the terminal).

---

## Deployment

- The frontend can be built with `npm run build` and deployed to any static hosting.
- The backend can be packaged as a JAR and deployed to any Java server.

---

## Customization

- **Google Maps/Leaflet:** See `GOOGLE_MAPS_SETUP.md` for map integration details.
- **Domain/Branding:** Update logos and company info in the frontend as needed.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the MIT License.
