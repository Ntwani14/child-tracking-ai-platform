# AI-Enhanced Community-Based Missing Children Reporting and Tracking System

**Tshwane University of Technology**
**Faculty of Information and Communication Technology**
**Department of Computer Science**

**Module:** ISJ107V — Integrated Software Project 2026
**Assignment:** Assignment 1 — Project Proposal (Resubmission)
**Student Name:** Ntwanano Mathebula
**Student Number:** 216080254
**Tut4life Email:** 216080254@tut4life.ac.za
**Lecturer:** Dr HD Masethe
**Submission Date:** 31 July 2026

---

## Declaration of Originality

I, Ntwanano Mathebula (Student Number: 216080254), declare that this assignment is my own original work. It has not been submitted previously for assessment in any other subject or course. All sources have been acknowledged using the Harvard referencing method as required by TUT policy RIPPOL067.

**Signature:** _____________________ **Date:** _______________

---

## Table of Contents

1. Executive Summary
2. History and Background
   - 2.1 History
   - 2.2 Business Problem and Opportunity
     - 2.2.1 Business Problem
     - 2.2.2 Business Opportunity
   - 2.3 Expected Solution
3. Vision, Goals, and Planning
   - 3.1 Vision and Goals
   - 3.2 Project Deliverables
   - 3.3 Timeframe
   - 3.4 Resources
   - 3.5 Success Criteria
4. References

---

## 1. Executive Summary *(10 marks)*

The safety of children is something that affects every community, and in South Africa the numbers are quite alarming. According to Missing Children South Africa (2024), approximately 1 697 children are reported missing every year — that is roughly one child every five hours. Despite how serious this problem is, there is still no central digital platform that communities can use to report and track these cases properly.

At the moment, when a child goes missing, information gets shared through WhatsApp groups, Facebook, visits to police stations, and word of mouth. None of these channels are connected to each other, which means important information is often delayed, duplicated, or lost. This project came from recognising that problem and wanting to do something about it.

The solution I am proposing is an AI-Enhanced Community-Based Missing Children Reporting and Tracking System — a web-based platform where community members can submit reports, search for active cases, upload photos, and receive alerts about missing children in their area. The system will also use Artificial Intelligence (AI) to automatically detect when two reports are describing the same child, which is a common problem when people post the same case across multiple platforms.

The project will be developed over six months starting in March 2026, using Java Spring Boot for the backend, PostgreSQL for the database, HTML/CSS/JavaScript for the frontend, and Python for the AI module. The final system demonstration is planned for November 2026.

**Vision:** By developing a centralized community-based digital platform for reporting missing children, this project aims to improve community awareness and response time by at least 30% within the six-month development period, enabling faster information sharing and improving the chances of locating missing children.

**Key Goals:**
1. Deliver a functional web-based reporting platform by Month 4 (June 2026)
2. Implement secure authentication and data protection by Month 3 (May 2026)
3. Deliver AI-based duplicate detection achieving at least 80% accuracy and an analytics dashboard by Month 4 (June 2026)

The project will be considered complete once all deliverables — the reporting platform, database, AI module, analytics dashboard, alert system, and final documentation — have been built and demonstrated successfully in November 2026.

---

## 2. History and Background

### 2.1 History *(5 marks)*

Missing children cases have always been a serious problem in South Africa, but the way communities respond to them has not really changed much over the years. Missing Children South Africa, a non-profit organisation that has been tracking these cases since the early 2000s, consistently records around 1 697 missing children per year (Missing Children South Africa, 2024). That number has remained concerning, and the response systems available to ordinary community members have not kept up.

Before social media, communities relied on radio announcements, newspaper notices, and word of mouth through churches and community centres. When platforms like Facebook and WhatsApp became popular in the 2010s, things improved in some ways — information could reach more people faster. But it also created new problems. The same case would get posted to dozens of groups by different people, sometimes with different photos or slightly different details, and there was no way to update all of them when the child was eventually found.

The official route — reporting to the South African Police Service (SAPS) — is still the most formal option, but police resources are limited and information reported at a police station does not automatically reach the community. There is a gap between the official system and what communities can actually access and use.

Looking at other countries, there are better examples. The United States has the National Center for Missing and Exploited Children (NCMEC) which runs a centralised online database and alert system. Many European countries use systems similar to the Amber Alert. South Africa has nothing like this that is designed specifically for community-level reporting and response. That gap is what this project is trying to address.

---

### 2.2 Business Problem and Opportunity

#### 2.2.1 Business Problem *(5 marks)*

The main problem is that there is no centralised, structured digital platform for South African communities to report and track missing children. This creates a number of interconnected issues that slow down the community's ability to respond effectively.

**Problem 1 — Information gets scattered across too many platforms**
When a child goes missing, people start posting on WhatsApp groups, Facebook pages, Twitter, and community notice boards all at the same time. None of these platforms talk to each other. Someone who is only on one platform might miss the report entirely, and someone who is on five platforms ends up seeing five slightly different versions of the same information.

**Problem 2 — The same case gets reported multiple times**
Because there is no single place to report, different people often submit the same case to different platforms without knowing someone else already did. Over time this creates multiple conflicting versions of the same report — different photos, different descriptions, different locations — which makes it difficult for anyone trying to help to know which version is accurate.

**Problem 3 — No way to identify patterns or high-risk areas**
Because the data is spread across so many unconnected sources, it is impossible to analyse whether certain areas have more missing children cases, or whether cases tend to happen more at certain times of year. Communities and organisations cannot use scattered data to plan ahead or identify where they should be paying more attention.

**Problem 4 — No structured way to alert the right people**
When a new case is reported, there is currently no automatic way to notify community members who live near where the child was last seen. Reaching the right people requires manually posting across multiple platforms, and even then, you can never be sure the information reached everyone it should have.

All of these problems together mean that communities respond more slowly and less effectively than they could with a better system in place.

---

#### 2.2.2 Business Opportunity *(5 marks)*

The opportunity here is to build a single, centralised web-based platform that brings all of this together — one place to report, one place to search, and one system to send alerts — all within a six-month development period ending with a demonstration in November 2026.

**Why this is achievable now:**
A few years ago, building something like this with AI included would have required a lot of specialist knowledge and expensive software. That has changed. Python libraries like scikit-learn and FastAPI are freely available, well-documented, and powerful enough to build a working AI duplicate detection service within the scope of a student project. The core web development stack — Java Spring Boot, PostgreSQL, HTML/CSS/JavaScript — is well-established and widely supported with learning resources.

**Why the timing matters:**
Based on the statistics from Missing Children South Africa (2024), approximately 140 children are reported missing every month. Every month that passes without a better system means those cases are being handled through fragmented, unreliable channels. The academic deadline of November 2026 gives a fixed, meaningful target to work towards. Missing that deadline would mean both failing the module requirement and delaying something that could genuinely help communities.

**How it will be achieved:**
I plan to build the system using Java Spring Boot for the backend, PostgreSQL for the database, and HTML/CSS/JavaScript for the frontend. The AI duplicate detection module will be built separately in Python using FastAPI, and it will communicate with the Java backend through a REST API. Development will follow the SDLC methodology across six phases, from planning through to the final demonstration.

---

### 2.3 Expected Solution *(10 marks)*

**Goal:**
To develop and deliver a functional AI-enhanced web-based platform for reporting and tracking missing children, ready for demonstration by November 2026.

**Figure 1 — System Context Diagram**

*[INSERT SCREENSHOT
 OF SYSTEM CONTEXT DIAGRAM HERE — draw.io or Word SmartArt showing Community Member, Administrator, and Python AI Service interacting with the central system, connected to PostgreSQL database below]*

**In Scope:**
- Web-based user registration and login
- Missing children report submission with optional image upload
- Viewing and searching active reports
- Community alert notifications based on geographic area
- AI-based duplicate report detection using NLP text similarity analysis
- Analytics dashboard displaying reporting trends by location and time period
- Secure storage of all user and report data

**Out of Scope:**
- Integration with SAPS or police databases
- Facial recognition technology
- GPS tracking of children
- Mobile application development (Android/iOS)

**Approach:**
The project will follow the Software Development Life Cycle (SDLC) across six phases:

1. **Planning and Requirements Gathering** (March 2026) — Define what the system needs to do, identify user roles, and document the requirements
2. **System Design** (April 2026) — Design the system architecture, database schema, and UI wireframes including UML diagrams
3. **Backend Development** (May 2026) — Build the Spring Boot REST API, implement authentication, and develop the Python AI microservice
4. **Frontend Development and Integration** (June 2026) — Build the HTML/CSS/JavaScript interface and connect it to the backend
5. **Testing and Evaluation** (July–August 2026) — Test all modules, fix bugs, and evaluate the AI accuracy
6. **Documentation and Final Presentation** (September–November 2026) — Write up all documentation and prepare the live demonstration

I chose to keep the Python AI module as a separate service from the main Java application. This way, if the similarity model needs to be updated later, only the Python service needs to change — the main application stays untouched. Text similarity will be measured using TF-IDF vectorization and cosine similarity (scikit-learn), with a score of 0.75 or above used to flag potential duplicate reports.

---

## 3. Vision, Goals, and Planning

### 3.1 Vision and Goals *(10 marks)*

**Vision Statement:**
By developing a centralized community-based digital platform for reporting missing children, this project aims to improve community awareness and response time by at least 30% within the six-month development period, enabling faster sharing of information and improving efforts to locate missing children in South Africa.

---

**Goal 1 — Core Platform Delivery**

*Design and develop a functional web-based reporting system by Month 4 (June 2026) that allows registered users to submit missing children reports with details such as the child's name, age, gender, physical description, last known location, date last seen, and an optional photograph.*

- **Specific:** A web-based reporting platform with clearly defined input fields and optional image upload
- **Measurable:** The system must successfully accept, store, and display at least one complete report from end to end without errors
- **Action-oriented:** I will design, develop, and integrate the reporting module — including the frontend form, the Spring Boot controller, and the PostgreSQL database layer
- **Realistic:** This is achievable using the Java Spring Boot and PostgreSQL stack within the available six-month timeline
- **Time-based:** Backend reporting complete by Month 3 (May 2026); frontend integration complete and tested by Month 4 (June 2026)

---

**Goal 2 — Security and Data Protection**

*Implement secure authentication and data storage so that only registered, authenticated users can access or submit missing children reports, with all backend security completed by Month 3 (May 2026).*

- **Specific:** User registration, login, JWT-based sessions, role-based access control, and BCrypt password hashing
- **Measurable:** No unauthenticated request to a protected endpoint should succeed; all passwords must be stored as BCrypt hashes — not plain text
- **Action-oriented:** I will implement Spring Security, JWT token validation, and proper access controls on the PostgreSQL database
- **Realistic:** These are standard security features that are fully supported within the Spring Boot framework
- **Time-based:** All authentication and security features complete and tested by end of Month 3 (May 2026)

---

**Goal 3 — AI and Analytics Features**

*Implement an AI-based duplicate detection module that correctly identifies at least 80% of duplicate reports, and deliver an analytics dashboard showing reporting trends by location and time period, both working and testable by Month 4 (June 2026).*

- **Specific:** A Python microservice using TF-IDF and cosine similarity for duplicate detection, plus a dashboard with at least three analytics views
- **Measurable:** Duplicate detection precision of at least 80% and recall of at least 75%, tested against 20 known report pairs; dashboard must show reports by location, by month, and by resolution status
- **Action-oriented:** I will develop the Python FastAPI microservice, integrate it with the Spring Boot backend, and build the analytics views on the frontend
- **Realistic:** Python libraries scikit-learn and FastAPI are well-documented and freely available — this is achievable within the academic timeline
- **Time-based:** AI module and analytics dashboard integrated and testable by end of Month 4 (June 2026)

---

### 3.2 Project Deliverables *(10 marks)*

*[INSERT SCREENSHOT OF DELIVERABLES TABLE HERE — screenshot the formatted table below from Word after applying blue header row styling]*

| # | Title | Description | Target Date |
|---|---|---|---|
| 1 | System Requirements Document | Functional/non-functional requirements, UML diagrams, database schema, and API design | April 2026 |
| 2 | Web-Based Reporting Platform | Functional system for submitting, viewing, and searching missing children reports | June 2026 |
| 3 | Database System | Secure PostgreSQL database storing users, reports, duplicate flags, and notifications | May 2026 |
| 4 | AI-Based Duplicate Detection Module | Python microservice using TF-IDF and cosine similarity, similarity threshold ≥ 0.75 | June 2026 |
| 5 | Analytics Dashboard | Dashboard displaying report statistics by location, time period, and resolution status | June 2026 |
| 6 | Alert Notification Feature | Automated geographic alerts sent to registered users on new report submission | May 2026 |
| 7 | Final Project Documentation | System design, source code, test results, user manual, and project evaluation | October 2026 |

---

### 3.3 Timeframe *(5 marks)*

**Why the timeline matters:**
This project needs to be completed within six months to meet the ISJ107V academic requirements for the Advanced Diploma in Computer Science (NQF Level 7). Missing the November 2026 demonstration deadline would mean not meeting the 50% Final Project requirement. Beyond the academic side, it also matters because the longer there is no better system in place, the more missing children cases get handled through scattered, unreliable channels. Based on the statistics from Missing Children South Africa (2024), that is roughly 140 children per month who could benefit from a better system.

**Six-Month Delivery Schedule:**

| Month | Period | Phase | Key Activities |
|---|---|---|---|
| 1 | March 2026 | Research and Analysis | Research missing children reporting, identify user roles, document system requirements |
| 2 | April 2026 | System Design | Design system architecture, database schema, UML diagrams, UI wireframes |
| 3 | May 2026 | Backend Development | Build Spring Boot REST API, implement authentication, develop Python AI microservice |
| 4 | June 2026 | Frontend Development and Integration | Build HTML/CSS/JavaScript UI, connect to backend, integrate AI module and dashboard |
| 5 | July–August 2026 | Testing and Evaluation | Unit testing, integration testing, AI evaluation, security testing, bug fixing |
| 6 | September–November 2026 | Documentation and Final Presentation | Finalise documentation, prepare demo, submit and present working system |

**Figure 2 — Project Gantt Chart**

*[INSERT SCREENSHOT OF GANTT CHART HERE — use the Excel chart you built with the staircase orange bars and data table at the bottom]*

**Task Duration Breakdown:**

| Task | Start Date | Duration (Days) |
|---|---|---|
| Research & Analysis | 16 March 2026 | 20 |
| System Design | 6 April 2026 | 24 |
| Backend Development | 1 May 2026 | 45 |
| Frontend Development | 16 June 2026 | 45 |
| Testing | 1 August 2026 | 60 |
| Documentation & Final Presentation | 1 September 2026 | 75 |

---

### 3.4 Resources *(5 marks)*

*[INSERT SCREENSHOT OF RESOURCES TABLE HERE — screenshot the formatted table below from Word after applying blue header row styling]*

| Resource Type | Resource | Purpose |
|---|---|---|
| People | Ntwanano Mathebula (Developer) | Full system design, development, testing, and documentation |
| People | Dr HD Masethe (Lecturer/Supervisor) | Academic guidance, feedback on deliverables, and assessment |
| Hardware | Development laptop/computer | Running IntelliJ IDEA, Visual Studio Code, and PostgreSQL locally |
| Software | Java JDK 17 + IntelliJ IDEA | Backend development environment |
| Software | Visual Studio Code | Frontend development environment |
| Software | PostgreSQL 15 | Local database server for development and testing |
| Software | Python 3.11 + pip | AI module development |
| Software | Git + GitHub | Version control and source code management |
| Libraries | Spring Boot, Spring Security, JPA/Hibernate | Backend framework, authentication, and ORM |
| Libraries | scikit-learn, rapidfuzz, FastAPI, Uvicorn | Python AI/ML libraries and microservice framework |
| Platform | Microsoft Teams | Weekly class sessions (Saturdays, 11:30–14:30) |
| Platform | TUT Moodle / Submission Portal | Assignment submissions and academic materials |

---

### 3.5 Success Criteria *(5 marks)*

The project will be considered successful when all of the following are true:

1. **Platform delivered on time:** The web-based reporting system is fully built, integrated, and ready for demonstration by November 2026 within the six-month project schedule.

2. **Core features working:** Users can register an account, log in, submit a missing children report with all required fields and an optional photo, and view or search existing reports without errors.

3. **Security in place:** Passwords are stored as BCrypt hashes. All API endpoints require valid JWT authentication. No personally identifiable information about children is accessible to unauthenticated users.

4. **Alerts and search working:** The system sends geographic alert notifications to registered users within 1 minute of a new report being submitted. Search results return within 2 seconds.

5. **AI and analytics working:** The duplicate detection module achieves at least 80% precision on a test dataset. The analytics dashboard correctly shows trends by location, time period, and resolution status.

6. **Documentation complete:** All project documentation is finished and the system is demonstrated live — or in a simulated live environment — in November 2026, showing all features working end to end.

---

## 4. References

Missing Children South Africa. (2024). *Missing children statistics South Africa*. Missing Children South Africa. Available at: https://www.missingchildren.co.za [Accessed: March 2026].

Pressman, R.S. and Maxim, B.R. (2020). *Software engineering: A practitioner's approach*. 9th edn. New York: McGraw-Hill Education.

Ruiz Reyes, N., Martínez, C. and García, P. (2024). Text similarity techniques in record deduplication and entity matching systems. *Journal of Information Science*, 50(2), pp. 112–128.

South African Police Service. (2024). *Annual crime statistics 2023/2024*. SAPS. Available at: https://www.saps.gov.za [Accessed: March 2026].

---

*All sources are attached after this page in accordance with TUT submission requirements.*

---

**Student Number:** 216080254
**Student Name:** Ntwanano Mathebula
**Assignment:** ISJ107V Assignment 1 — Project Proposal (Resubmission)
**File Name:** 216080254_ISJ107V_Assignment1_Resubmission
