# UML models - Missing Children Reporting System

Editable PlantUML sources (`.puml`) and rendered images (`.png`) for the final system (ISJ107V Assignment 5).
All class, endpoint and service names match the source code.

| File | Diagram | Rubric |
|---|---|---|
| `01-use-case.puml` | Actors and system services | Q3.1 |
| `02-class.puml` | JPA entities and workflow services | Q3.2 |
| `03-sequence-submit-report.puml` | Report submission with AI duplicate detection | Q3.3 |
| `04-activity-submit-report.puml` | Same workflow as an activity diagram, with error paths | Q3.3 |
| `05-component.puml` | Application modules, data stores, external services | Q3.4 |
| `06-deployment.puml` | Hosting on Render plus external services | Q3.4 |

## Rendering

```
java -jar plantuml.jar -tpng docs/uml/*.puml
```

PlantUML: https://plantuml.com/download

## Design versus implementation (justified deviations)

| Earlier design (Assignment 2 / 4) | Final implementation | Reason |
|---|---|---|
| Duplicate threshold 0.75 | 0.25 | Short report texts give low TF-IDF scores; 0.75 missed real duplicates in testing |
| Alerts routed by user location | Alerts sent to all registered users (except the submitter) | Simpler and more reliable for a community-wide safety alert |
| Images stored on the server disk | Images stored on Cloudinary, URL saved in `reports.image_path` | Render's disk is wiped on every redeploy |
| Backend sends email directly over SMTP | Backend calls the AI service's `/send-email`; email is sent in a background thread | Email reached users reliably this way, and the report request no longer waits for SMTP |
| Admin "confirm / dismiss" flag | `mergeFlag` / `dismissFlag` endpoints in `AdminController` | Names aligned with the code |
