# PlantUML Diagrams
## AI-Enhanced Community-Based Missing Children Reporting and Tracking System

---

## How to Render These Diagrams

1. Go to https://www.plantuml.com/plantuml/uml/
2. Copy each diagram code block below
3. Paste it into the editor
4. Click "Submit" — the diagram renders instantly
5. Right-click the diagram image → Save as PNG
6. Insert the PNG into your Word document

---

## Diagram 1 — System Architecture Diagram

```plantuml
@startuml System_Architecture

skinparam componentStyle rectangle
skinparam backgroundColor #FAFAFA
skinparam component {
  BackgroundColor #DDEEFF
  BorderColor #336699
  FontSize 13
}

title System Architecture\nAI-Enhanced Missing Children Reporting and Tracking System

actor "Community Member" as user
actor "Administrator" as admin

package "Frontend Layer" {
  [Web Browser\n(HTML/CSS/JavaScript)] as frontend
}

package "Backend Layer" {
  [Java Spring Boot\nREST API] as springboot
  [Spring Security\n(JWT Auth)] as security
}

package "Database Layer" {
  database "PostgreSQL\nDatabase" as postgres
}

package "AI/ML Microservice" {
  [Python FastAPI\nService] as python
  [scikit-learn\nTF-IDF + Cosine Similarity] as sklearn
}

package "Notification Service" {
  [Alert Notification\nModule] as alerts
}

user --> frontend : Uses browser
admin --> frontend : Uses browser
frontend --> springboot : HTTP/JSON REST API
springboot --> security : Validates JWT Token
springboot --> postgres : CRUD Operations
springboot --> python : POST /api/detect-duplicate
python --> sklearn : Text Vectorisation\n& Similarity Scoring
python --> postgres : Reads existing reports
springboot --> alerts : Triggers on new report
alerts --> user : Sends area alerts

@enduml
```

---

## Diagram 2 — Use Case Diagram (UML)

```plantuml
@startuml Use_Case_Diagram

skinparam actorStyle awesome
skinparam backgroundColor #FAFAFA
skinparam usecase {
  BackgroundColor #DDEEFF
  BorderColor #336699
}

title Use Case Diagram\nAI-Enhanced Missing Children Reporting and Tracking System

left to right direction

actor "Community Member" as member
actor "Administrator" as admin
actor "Python AI Service" as ai <<system>>

rectangle "Missing Children Reporting System" {

  usecase "Register Account" as UC1
  usecase "Login" as UC2
  usecase "Submit Missing\nChildren Report" as UC3
  usecase "Upload Child Image" as UC4
  usecase "Search Reports" as UC5
  usecase "View Report Details" as UC6
  usecase "Receive Alert\nNotification" as UC7
  usecase "View Analytics\nDashboard" as UC8
  usecase "Review Duplicate\nFlags" as UC9
  usecase "Update Report Status" as UC10
  usecase "Detect Duplicate\nReports" as UC11
  usecase "Merge/Dismiss\nDuplicates" as UC12

}

member --> UC1
member --> UC2
member --> UC3
member --> UC4
member --> UC5
member --> UC6
member --> UC7

admin --> UC2
admin --> UC8
admin --> UC9
admin --> UC10
admin --> UC12

UC3 ..> UC4 : <<include>>
UC3 ..> UC11 : <<include>>
UC11 --> ai : triggers
UC9 ..> UC12 : <<extend>>

@enduml
```

---

## Diagram 3 — Entity Relationship Diagram (ERD)

```plantuml
@startuml ERD

skinparam backgroundColor #FAFAFA
skinparam entity {
  BackgroundColor #DDEEFF
  BorderColor #336699
  FontSize 12
}

title Entity Relationship Diagram\nAI-Enhanced Missing Children Reporting and Tracking System

entity "users" as users {
  * user_id : UUID <<PK>>
  --
  full_name : VARCHAR(100)
  email : VARCHAR(150)
  password_hash : VARCHAR(255)
  role : ENUM(user, admin)
  location : VARCHAR(100)
  created_at : TIMESTAMP
}

entity "reports" as reports {
  * report_id : UUID <<PK>>
  --
  child_name : VARCHAR(100)
  age : INTEGER
  gender : VARCHAR(10)
  physical_description : TEXT
  last_seen_location : VARCHAR(200)
  date_last_seen : DATE
  image_path : VARCHAR(255)
  status : ENUM(active, found, duplicate)
  submitted_by : UUID <<FK>>
  created_at : TIMESTAMP
}

entity "duplicate_flags" as flags {
  * flag_id : UUID <<PK>>
  --
  report_id : UUID <<FK>>
  matched_report_id : UUID <<FK>>
  similarity_score : DECIMAL(4,3)
  reviewed : BOOLEAN
  created_at : TIMESTAMP
}

entity "notifications" as notifications {
  * notification_id : UUID <<PK>>
  --
  user_id : UUID <<FK>>
  report_id : UUID <<FK>>
  message : TEXT
  sent_at : TIMESTAMP
}

users ||--o{ reports : "submits"
users ||--o{ notifications : "receives"
reports ||--o{ flags : "flagged as"
reports ||--o{ flags : "matched with"
reports ||--o{ notifications : "triggers"

@enduml
```

---

## Diagram 4 — AI Duplicate Detection Flow Diagram

```plantuml
@startuml AI_Flow_Diagram

skinparam backgroundColor #FAFAFA
skinparam activity {
  BackgroundColor #DDEEFF
  BorderColor #336699
  FontSize 12
}
skinparam decision {
  BackgroundColor #FFF3CD
  BorderColor #856404
}

title AI Duplicate Detection Flow\nReport Submission Process

start

:User fills in missing children report form;
:User clicks Submit;

:Spring Boot Controller receives POST /api/reports;
:Validate JWT token and user authentication;

if (Token valid?) then (No)
  :Return 401 Unauthorized;
  stop
else (Yes)
  :Save report to PostgreSQL (status = active);
  :Combine report fields into text string\n(name + description + location);
  :Call Python AI Service\nPOST /api/detect-duplicate;

  :Python service loads all existing\nreport texts from PostgreSQL;
  :Apply TF-IDF vectorisation\nto all report texts;
  :Calculate cosine similarity\nbetween new report and all existing reports;
  :Return highest similarity score\nand matched report ID;

  if (Similarity score >= 0.75?) then (Yes)
    :Save entry to duplicate_flags table;
    :Update report status = potential_duplicate;
    :Send notification to Administrator;
    :Return response to user:\n"Report submitted — possible duplicate flagged";
  else (No)
    :Report confirmed as unique;
    :Send alert notifications\nto users in the same area;
    :Return response to user:\n"Report submitted successfully";
  endif
endif

stop

@enduml
```

---

## Diagram 5 — Sequence Diagram (UML)

```plantuml
@startuml Sequence_Diagram

skinparam backgroundColor #FAFAFA
skinparam sequence {
  ActorBackgroundColor #DDEEFF
  ActorBorderColor #336699
  ParticipantBackgroundColor #DDEEFF
  ParticipantBorderColor #336699
  LifeLineBorderColor #336699
  ArrowColor #336699
  FontSize 12
}

title Sequence Diagram\nReport Submission with AI Duplicate Detection

actor "Community Member" as user
participant "Web Browser\n(Frontend)" as browser
participant "Spring Boot\nController" as controller
participant "Spring Boot\nService" as service
participant "PostgreSQL\nDatabase" as db
participant "Python AI\nFastAPI Service" as ai

user -> browser : Fill in report form\nand click Submit

browser -> controller : POST /api/reports\n(JWT token + report data)

controller -> controller : Validate JWT token

controller -> service : processNewReport(reportData)

service -> db : INSERT INTO reports\n(status = active)
db --> service : report_id returned

service -> service : Build combined text string\n(name + description + location)

service -> ai : POST /api/detect-duplicate\n{text: combinedString}

ai -> db : SELECT physical_description,\nchild_name, last_seen_location\nFROM reports

db --> ai : Existing report texts

ai -> ai : TF-IDF vectorisation\nCosine similarity calculation

ai --> service : {similarity_score: 0.82,\nmatched_report_id: "abc-123"}

alt similarity_score >= 0.75
  service -> db : INSERT INTO duplicate_flags\n(report_id, matched_id, score)
  service -> db : UPDATE reports SET\nstatus = potential_duplicate
  service -> db : INSERT INTO notifications\n(admin notification)
  service --> controller : DuplicateDetectedResponse
  controller --> browser : 200 OK\n"Report submitted — duplicate flagged"
  browser --> user : Show warning message\n"Possible duplicate detected"

else similarity_score < 0.75
  service -> db : INSERT INTO notifications\n(area alert for community members)
  service --> controller : ReportCreatedResponse
  controller --> browser : 201 Created\n"Report submitted successfully"
  browser --> user : Show success message\n"Report submitted"
end

@enduml
```

---

## Summary of Diagrams

| # | Diagram | Section in Assignment | Tool |
|---|---|---|---|
| 1 | System Architecture | Technology Stack | PlantUML |
| 2 | Use Case Diagram | User Stories / Functional Requirements | PlantUML |
| 3 | ERD | Database Design | PlantUML |
| 4 | AI Flow Diagram | Emerging Tech Code Integration | PlantUML |
| 5 | Sequence Diagram | Emerging Tech Code Integration | PlantUML |

Render each at https://www.plantuml.com/plantuml/uml/ and save as PNG.
