# Project Overview: Government Startup Scheme Recommender

This project is a full-stack web application designed to help founders find government startup schemes they are eligible for. The application is divided into a frontend client and a backend server.

## 1. Project Structure

The project follows a standard client-server architecture.

### Server (Backend)
The backend is a REST API built with Node.js and Express.js, connecting to a MongoDB database. It handles user authentication, scheme matching logic, and AI-powered recommendation explanations.

Key directories:
- `config/`: Contains configuration files for connecting to the MongoDB database and loading environment variables.
- `models/`: Defines the data structures (schemas) using Mongoose for `User`, `FounderProfile`, `Scheme`, and `RecommendationLog`.
- `controllers/`: Contains the core logic for handling incoming API requests (e.g., registering a user, fetching schemes).
- `routes/`: Maps specific URL endpoints to their corresponding controller functions (e.g., `/api/auth`, `/api/recommend`).
- `services/`: Houses business logic that is independent of HTTP requests, such as the `schemeMatcher` (rule-based filtering) and `aiExplainer` (LLM API wrapper).
- `middleware/`: Contains Express middleware functions for tasks like verifying JWT authentication tokens, checking admin roles, and error handling.
- `seed/`: Includes scripts (`seedSchemes.js`, `createAdmin.js`) to populate the database with initial scheme data and an admin account.

### Client (Frontend)
The frontend is a Single Page Application (SPA) built with React and Vite, styled using Tailwind CSS. It provides the user interface for founders to fill out questionnaires and view recommended schemes, as well as an admin interface to manage schemes and users.

Key directories:
- `src/pages/`: Contains the main page components corresponding to different routes (e.g., `Login`, `Questionnaire`, `Results`, `Dashboard`, and `admin` pages).
- `src/components/`: Reusable UI components used across different pages (e.g., `Navbar`, `SchemeCard`, `StepIndicator`).
- `src/context/`: Contains React Context providers, such as `AuthContext`, for managing global state like the current logged-in user.
- `src/services/`: Includes utilities for making API calls to the backend (e.g., `api.js` using Axios).
- `src/hooks/`: Custom React hooks, such as `useAuth`, to encapsulate complex logic for components.

---

## 2. Libraries and Dependencies

### Backend Libraries (`server/package.json`)

**Core Framework & Database:**
- `express`: A fast, minimalist web framework for Node.js used to build the REST API.
- `mongoose`: A MongoDB object modeling tool that provides a straightforward, schema-based solution to model application data.

**Security & Authentication:**
- `bcrypt`: Used to securely hash user passwords before storing them in the database.
- `jsonwebtoken`: Used to generate and verify JSON Web Tokens (JWT) for stateless user authentication.
- `cors`: Middleware to enable Cross-Origin Resource Sharing, allowing the frontend to communicate with the backend.
- `helmet`: Sets secure HTTP headers to protect the app from some well-known web vulnerabilities.
- `express-rate-limit`: Middleware to limit repeated requests to public APIs and endpoints, preventing brute-force attacks.
- `cookie-parser`: Middleware to parse cookies attached to the client request object (useful for refresh tokens).

**Utilities:**
- `dotenv`: Loads environment variables from a `.env` file into `process.env`.
- `express-validator`: Middleware used to validate and sanitize incoming data from client requests.
- `morgan`: An HTTP request logger middleware to help monitor server traffic and debug.

**Development Tools:**
- `nodemon`: Automatically restarts the Node application when file changes in the directory are detected.

### Frontend Libraries (`client/package.json`)

**Core Framework:**
- `react`, `react-dom`: The core libraries for building user interfaces with React.
- `react-router-dom`: Enables dynamic routing in the web app, allowing seamless navigation between different pages without reloading.

**Styling & UI:**
- `tailwindcss`: A utility-first CSS framework for rapidly building custom user interfaces.
- `postcss`, `autoprefixer`, `@tailwindcss/postcss`: Tools required to process Tailwind CSS and add vendor prefixes for cross-browser compatibility.
- `react-hot-toast`: A library for adding beautiful and customizable toast notifications (success/error messages) to the app.

**Form Handling & API:**
- `react-hook-form`: A performant library for managing form state and validation, crucial for the multi-step questionnaire.
- `axios`: A promise-based HTTP client used to make API requests to the backend server.

**Development Tools:**
- `vite`, `@vitejs/plugin-react`: A modern, blazing-fast frontend build tool and development server.
- `oxlint`: A fast JavaScript linter to catch and fix problems in the codebase during development.
