# AI-Enhanced Community-Based Missing Children Reporting and Tracking System

> ISJ107V — Integrated Software Project 2026  
> Tshwane University of Technology | N Mathebula

---

## Overview

A centralised, secure web platform that enables South African communities to report missing children, share information, and receive real-time alerts. An AI duplicate-detection module automatically identifies reports describing the same child, keeping the data clean and actionable.

**Live system:** https://mcrs-frontend.onrender.com

---

## Features

| Feature | Description |
|---|---|
| Report submission | Authenticated users submit reports with name, age, gender, description, location, date and photo |
| Cloudinary image storage | Photos uploaded permanently to Cloudinary — no data loss on restart |
| AI duplicate detection | Python NLP service (TF-IDF + cosine similarity) flags likely duplicates for admin review |
| Community alerts | In-app and email notifications sent to all members on every new report |
| Social sharing | One-tap sharing to WhatsApp, Facebook, X, Telegram and email |
| "I Found This Child" | Marks a case as found, notifies the community, and guides the finder to contact SAPS 10111 |
| Admin panel | Administrators review AI-flagged duplicates and manage case statuses |
| Analytics dashboard | Reporting trends by location, time period and status |
| Forgot password | Email-based one-time reset code flow |
| PWA | Installable on desktop and mobile from the browser |

---

## Architecture

Four independently deployed components communicating over HTTPS REST/JSON:

```
React Frontend  ──HTTPS──►  Spring Boot Backend  ──JDBC──►  PostgreSQL
                                     │
                              HTTPS REST/JSON
                                     │
                              Python AI Service
```

| Component | Technology | Hosting |
|---|---|---|
| Frontend | React + Vite | Render Static Site |
| Backend | Java 21, Spring Boot 3, Spring Security (JWT) | Render Web Service (Docker) |
| AI Service | Python 3.11, FastAPI, scikit-learn (TF-IDF) | Render Web Service |
| Database | PostgreSQL 16 | Render Managed PostgreSQL |
| Image Storage | Cloudinary | Cloudinary free tier |
| Email | Gmail SMTP via Spring Mail | mcrs.alerts@gmail.com |

---

## Live URLs

| Service | URL |
|---|---|
| Web application | https://mcrs-frontend.onrender.com |
| Backend API | https://mcrs-backend.onrender.com |
| AI service | https://mcrs-ai.onrender.com |

> **Note:** Services are hosted on Render's free tier and may take ~30–50 seconds to wake after inactivity. Open them a few minutes before a demo.

---

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Administrator | masingitamathebula89@gmail.com | `contact owner` |
| Community member | hluri05m@gmail.com | `contact owner` |
| Community member | ntwano14@gmail.com | `contact owner` |

> Credentials are available on request for assessment purposes.

---

## Running Locally

### Prerequisites
- Java JDK 21
- Maven 3.9+
- PostgreSQL 16
- Python 3.11
- Node.js 20

### 1. Database
```sql
CREATE DATABASE child_tracking_db;
```

### 2. Backend
```bash
cd child-tracking-backend
# Create src/main/resources/application-local.properties with your secrets (see below)
mvn spring-boot:run
# Runs on http://localhost:8080
```

`application-local.properties` (git-ignored — never commit this):
```properties
spring.mail.username=your@gmail.com
spring.mail.password=your-app-password
app.email.enabled=true
cloudinary.api-key=your-key
cloudinary.api-secret=your-secret
```

### 3. AI Service
```bash
cd ai-service
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

### 4. Frontend
```bash
cd frontend-react
npm install
npm run dev
# Runs on http://localhost:3000
```

The DataSeeder creates two demo users and 15 sample reports on first startup if the database is empty.

---

## Project Structure

```
child-tracking-ai-platform/
├── child-tracking-backend/     # Spring Boot REST API
│   └── src/main/java/com/childtracking/
│       ├── controller/         # REST endpoints
│       ├── service/            # Business logic
│       ├── repository/         # JPA repositories
│       ├── model/              # JPA entities
│       ├── dto/                # Request/response objects
│       ├── security/           # JWT filter and utilities
│       └── config/             # Security, Cloudinary, DataSeeder
├── ai-service/                 # Python FastAPI duplicate detection
│   ├── main.py                 # TF-IDF + cosine similarity logic
│   └── requirements.txt
├── frontend-react/             # React + Vite web application
│   └── src/
│       ├── pages/              # Dashboard, ReportDetail, Admin, Analytics, etc.
│       ├── components/         # Navbar, shared components
│       ├── api/                # Axios instance with base URL helper
│       └── context/            # AuthContext (JWT + user state)
├── data/
│   └── images/                 # Sample child photos for demo seeding
├── render.yaml                 # Render deployment blueprint
└── Assignment Scripts/         # Academic assignment documents
```

---

## Security

- JWT bearer token authentication on all protected endpoints
- BCrypt password hashing
- Role-based access: `/api/admin/**` restricted to `ADMIN` role (URL + `@PreAuthorize`)
- Server-side input validation (Bean Validation) on all report fields
- Image uploads restricted to JPG/PNG, max 5 MB; path-traversal protection on file serving
- Secrets supplied via environment variables — never committed to source control

---

## AI Duplicate Detection

The Python microservice receives each new report's text fields (name, description, location), applies TF-IDF vectorisation and computes cosine similarity against all existing active reports. Reports scoring ≥ 0.25 are flagged for administrator review — a human makes the final decision.

**Empirical evaluation:** 100% precision and recall on a 20-pair test set at the 0.25 threshold. Live demo flags: 84.4% and 90.9% similarity on genuine duplicate pairs.

---

## Academic Context

- **Module:** ISJ107V — Integrated Software Project (2026)
- **Institution:** Tshwane University of Technology
- **Qualification:** Advanced Diploma in Computer Science (NQF Level 7)
- **Student:** N Mathebula

---

## License

This project was developed as an academic submission. All code is original work by the student.
