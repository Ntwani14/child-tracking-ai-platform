# Assignment 4 Presentation
## ISJ107V | N Mathebula (216080254)
## AI-Enhanced Community-Based Missing Children Reporting and Tracking System

10 slides | 5-minute talk + 10-minute live demo. One idea per slide, large readable text.

---

### Slide 1 - Title
AI-Enhanced Community-Based Missing Children Reporting and Tracking System

N Mathebula - 216080254
ISJ107V Integrated Software Project - 2026
Tshwane University of Technology

Speaker notes: "Good day. My name is N Mathebula. My project is an AI-enhanced platform that helps South African communities report and track missing children, with artificial intelligence that automatically detects duplicate reports."

---

### Slide 2 - The Problem
In South Africa, about 1 697 children are reported missing every year - roughly one child every five hours.

Today, reports are scattered across social media, WhatsApp groups and word of mouth.

This fragmentation causes:
- Slow spread of critical information
- The same child reported many times in different words
- No central place to see or analyse cases

Speaker notes: "The stakes are high and the current process is broken - information is scattered, response is slow, and the same child gets reported several times, wasting responders' effort."

---

### Slide 3 - The Solution
A single, secure, community-based web platform that lets members:
- Report a missing child, with a photo and full description
- Alert every registered member instantly
- Search, filter and share active cases
- Automatically detect duplicate reports using AI
- Mark a child as found and close the case safely

Speaker notes: "My solution replaces those fragmented channels with one platform. Everyone reports to the same place, everyone is alerted, and the system keeps the data clean using AI."

---

### Slide 4 - System Architecture
Four independent components, each hosted separately, communicating over secure HTTPS:
- React frontend - the web app, also installable on phones as a Progressive Web App
- Java Spring Boot backend - REST API, business logic and security
- Python AI service - duplicate detection
- PostgreSQL database - secure storage

The Java backend and the Python AI service communicate over a REST (HTTP/JSON) interface, demonstrating interoperability between two different technologies.

Speaker notes: "The system is built as four separate services on different machines that talk to each other over the internet. This satisfies the integrated, multi-component requirement and shows interoperability between Java and Python." [Show the deployment diagram on this slide.]

---

### Slide 5 - Emerging Technology: AI Duplicate Detection
The emerging technology is Artificial Intelligence using Natural Language Processing.

How it works:
- Each report's text is converted into numbers using TF-IDF vectorisation
- Cosine similarity measures how alike two reports are
- It runs automatically on every new report
- Reports scoring 0.25 or higher are flagged as possible duplicates for an administrator to review - a human makes the final decision

Why not simple keyword matching? Because people describe the same child in different words, and exact matching would miss those near-duplicates.

Speaker notes: "This is the heart of the project. Standard keyword search can't catch 'blue shirt' versus 'wearing blue'. NLP text similarity can. The AI only suggests; a human admin confirms."

---

### Slide 6 - Key Features
- Secure registration and login (JWT tokens, BCrypt password hashing)
- Role-based access: separate community-member and administrator roles
- Report submission with input validation and photo upload
- Community-wide alerts (in-app and email)
- AI duplicate detection with an administrator review panel
- "I Found This Child" with safety guidance to contact SAPS on 10111
- One-tap social sharing (WhatsApp, Facebook, X, Telegram, email)
- Analytics dashboard showing trends by location, time and status

Speaker notes: "Here is the full feature set. I will demonstrate the main ones live in a moment, so I will move quickly here."

---

### Slide 7 - Results and Evidence
- AI accuracy: 100% precision and 100% recall on a 20-pair test set at the 0.25 threshold
- Live duplicate flags produced on the deployed system: 84.4% and 90.9% similarity on genuine duplicate pairs
- A non-duplicate correctly scored only 14.6% (below the threshold, so not flagged)
- Engineering decision: the similarity threshold was tuned from the planned 0.75 down to 0.25 after testing showed short report texts score low - an evidence-based refinement
- Deployed live on the cloud as four separate services

Speaker notes: "My numbers: perfect precision and recall on the test set, and real flags of 84 and 90 percent on the live system. I also want to be honest that I changed the threshold from 0.75 to 0.25 based on my own testing - that is a real engineering decision, not guesswork."

---

### Slide 8 - Live Demonstration
Now moving to the live system.

Demonstration sequence:
1. Dashboard of active reports with photos
2. Submit a new report - including showing input validation
3. Submit a matching report to trigger the AI
4. Administrator reviews and confirms the AI-flagged duplicate
5. Mark a child as found, with the safety confirmation
6. Analytics dashboard

Fallback: identical system also runs locally on this laptop if the cloud is slow.

Speaker notes: "I will now switch to the live application." [Switch to https://mcrs-frontend.onrender.com - this is the 10-minute demo.]

---

### Slide 9 - Limitations and Next Steps
- Free hosting tier stores uploaded images temporarily -> move to persistent cloud object storage in the final system
- Text-only matching can miss duplicates worded very differently -> add fuzzy name/location and lightweight image matching; keep the admin review
- Free-tier services sleep when idle (slow first request) -> use a paid always-on instance for the final live environment

Speaker notes: "No prototype is perfect. These are my three honest limitations and exactly how I would fix them for the final system."

---

### Slide 10 - Thank You
Thank you. I welcome your questions.

Live application: https://mcrs-frontend.onrender.com
Source code: github.com/Ntwani14/child-tracking-ai-platform

Speaker notes: "Thank you. I am happy to answer technical questions about the design, implementation or testing decisions." Be ready to explain: why Spring Boot + a separate Python service, why JWT and BCrypt, why the threshold changed from 0.75 to 0.25, why alerts go to all users, and why a human reviews duplicates instead of auto-deleting them.