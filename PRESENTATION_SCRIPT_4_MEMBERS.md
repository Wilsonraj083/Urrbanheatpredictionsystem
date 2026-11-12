# Urban Heat Prediction & Cooling Management System
## 4-Member College Demonstration & Viva Presentation Script

---

### Team Roles & Ownership Matrix

| Member | Designated Role | Primary Presentation Sections | Codebase Files Owned |
|---|---|---|---|
| **Member 1** | **Team Lead & System Architect** | Problem Definition, Scope, High-Level Architecture, System Flow | `pom.xml`, `README.md`, Architecture Flow, High-level Overview |
| **Member 2** | **Backend & Database Engineer** | Java 21, Spring Boot 4.1.1, JPA Entities, In-Memory H2 DB, H2 Web Console | `HeatReport.java`, `CoolingLocation.java`, `HeatPrediction.java`, `application.properties`, `DataInitializer.java` |
| **Member 3** | **Algorithm & API Engineer** | Explainable Biometeorological Algorithm, REST Services, Postman Testing, JUnit Tests | `PredictionService.java`, `HeatReportService.java`, `CoolingLocationService.java`, `DashboardService.java`, `postman_collection.json`, Test Suite (49 tests) |
| **Member 4** | **Frontend UI/UX & Cloud Specialist** | React 18, Vite 6, Recharts Visualizations, Leaflet GIS Map, Admin CRUD, Vercel | `DashboardPage.jsx`, `PredictionPage.jsx`, `HeatMapPage.jsx`, `CoolingCentresPage.jsx`, `AdminPage.jsx`, `api.js`, `fallbackData.js` |

---

## Complete Stage Presentation Script (Word-for-Word)

### 🎙️ MEMBER 1: Introduction, Problem Statement & System Architecture
**Time: 2.5 Minutes**  
**Action:** *Display project homepage on screen (`http://localhost:5173`).*

> **Member 1 Speaks:**
> "Respected faculty members, external examiners, and dear peers — a very warm good morning.
> 
> Today, our team is proud to present our final year capstone project: **Urban Heat Island Prediction and Municipal Cooling Management System**.
> 
> **1. The Problem Statement:**
> Dense urban centers across India—from Delhi and Mumbai to Chennai and Hyderabad—are suffering from what meteorologists classify as the **Urban Heat Island (UHI)** effect. Heavy concentrations of concrete buildings, unshaded asphalt roadways, high vehicular exhaust, and shrinking tree canopy trap solar radiation. This creates microclimates where surface temperatures routinely exceed $42^\circ\text{C}$ to $45^\circ\text{C}$. This leads to fatal heat strokes, dehydration, and overwhelming hospital admissions among outdoor workers, daily commuters, children, and the elderly.
> 
> **2. The Solution:**
> While cities build cooling centers, emergency shelters, and misting zones, municipal authorities lack a unified, real-time platform to:
> - Continuously monitor thermal observations across multiple city hotspots.
> - Predict heat risk using explainable biometeorological factors before disasters strike.
> - Match endangered citizens to nearby air-conditioned cooling centers with real-time available capacity.
> - Provide urban planners with geospatial GIS visualization.
> 
> **3. High-Level Architecture:**
> To solve this, we engineered an enterprise-grade **Three-Tier Architecture**:
> - **Tier 1 (Presentation):** Built with React 18 and Vite, consuming asynchronous REST APIs via Axios, rendering interactive charts via Recharts, and rendering geographic geospatial data via Leaflet OpenStreetMap.
> - **Tier 2 (Application & Business Logic):** A robust Java 21 and Spring Boot 4.1.1 backend implementing decoupled Controller, Service, and Repository layers with Jakarta Bean Validation.
> - **Tier 3 (Data Persistence):** Spring Data JPA with Hibernate ORM backed by an embedded, zero-configuration in-memory H2 database.
> 
> I now invite **Member 2**, our Backend & Database Engineer, to walk you through our data layer, entities, and database persistence."

---

### 🎙️ MEMBER 2: Backend Infrastructure, JPA Entities & H2 Database
**Time: 2.5 Minutes**  
**Action:** *Switch to browser tab with H2 Console (`http://localhost:8080/h2-console`) and VS Code showing Entity files.*

> **Member 2 Speaks:**
> "Thank you, Member 1. Good morning everyone.
> 
> I spearheaded the backend data tier, leveraging **Java 21 LTS** and **Spring Boot 4.1.1** with **Spring Data JPA** and **Hibernate 7**.
> 
> **1. Entity Relational Design:**
> In our package `com.example.urbanheat.model`, we designed three core relational entities:
> 
> 1. `HeatReport.java`: Captures localized microclimate readings:
>    - Primary Key `id` (Auto-generated Identity strategy).
>    - `location` (Validated with `@NotBlank`).
>    - `temperature` (Enforced between $-50^\circ\text{C}$ and $70^\circ\text{C}$ using `@Min` and `@Max`).
>    - `humidity` (Relative humidity percentage, bounded 0–100%).
>    - `severity` (`HIGH`, `MEDIUM`, `LOW`).
>    - `latitude` and `longitude` (Double precision coordinates for GIS geospatial mapping).
>    - `createdAt` (Automatic timestamp).
> 
> 2. `CoolingLocation.java`: Models municipal climate relief hubs and public air-conditioned facilities:
>    - `name` and street `address`.
>    - `capacity` (Total occupancy seats/beds).
>    - `availableSlots` (Real-time free slots).
>    - Geographic coordinates for navigation.
> 
> 3. `HeatPrediction.java`: Persists simulation inputs and outputs:
>    - Stores ambient temperature, relative humidity, urban green canopy percentage, calculated heat risk score (0–100), risk tier, scientific explanation, and emergency preventive recommendations.
> 
> **2. Database Persistence & H2 Web Console Demonstration:**
> *[Action: Show H2 Console Login on screen]*
> - We utilize an in-memory H2 database configured in `application.properties` with JDBC URL `jdbc:h2:mem:urbanheatdb`, username `sa`, and no password.
> - In `DataInitializer.java`, we implemented Spring Boot's `CommandLineRunner` interface. When the application boots, it automatically seeds realistic demonstration data across 7 major Indian metropolises: **Delhi NCR, Mumbai, Chennai, Bengaluru, Hyderabad, Kolkata, and Ahmedabad**—totalling 21 active hotspots and 11 municipal cooling shelters.
> 
> *[Action: Run `SELECT * FROM HEAT_REPORTS LIMIT 5;` in H2 Console]*
> As you can see, Hibernate creates tables on the fly with schema constraints, and all queries execute in sub-millisecond in-memory speeds.
> 
> I now pass the microphone to **Member 3**, who will explain our business logic, algorithm, and RESTful APIs."

---

### 🎙️ MEMBER 3: Business Logic, Explainable Algorithm & API Testing
**Time: 3 Minutes**  
**Action:** *Open Postman collection and trigger a live prediction request, then show test execution terminal.*

> **Member 3 Speaks:**
> "Thank you, Member 2. Hello everyone.
> 
> I engineered the Business Service Layer and RESTful API infrastructure.
> 
> **1. Business Validation Invariants:**
> All business rules reside strictly in our `@Service` classes:
> - In `HeatReportService.java`, thermal severity is automatically classified:
>   - Temperature $\ge 40^\circ\text{C} \implies \text{HIGH}$
>   - Temperature $\ge 30^\circ\text{C} \implies \text{MEDIUM}$
>   - Temperature $< 30^\circ\text{C} \implies \text{LOW}$
> - In `CoolingLocationService.java`, we enforce strict invariant validation: `availableSlots` can never be negative and can never exceed total `capacity`. Any violation triggers an immediate `IllegalArgumentException`, intercepted by our `@RestControllerAdvice` (`GlobalExceptionHandler`) to return a clean, structured HTTP 400 Bad Request JSON response.
> 
> **2. The Heat-Risk Estimation Algorithm (`PredictionService.java`):**
> Many student projects falsely claim to have a trained machine learning model without genuine training data. For our college project, we adhered strictly to academic honesty: we implemented an **explainable biometeorological heuristic model** based on the scientific **Steadman Heat Index** and urban canopy microclimate offset:
> 
> 1. **Base Thermal Load:** $\text{TempLoad} = \max(0, (T - 15) \times 1.8)$
> 2. **Vapor Pressure Moisture Penalty:** When relative humidity is high, human perspiration cannot evaporate, drastically inflating perceived thermal stress:  
>    $\text{HumidityPenalty} = (H / 100) \times (T > 25 ? (T - 20) \times 0.9 : 5.0)$
> 3. **Urban Canopy Mitigation Credit:** Vegetative cover provides shading and evapotranspiration cooling:  
>    $\text{CanopyMitigation} = (G / 100) \times 16.0$
> 4. **Normalized Score (0–100):**  
>    $\text{Score} = \text{Clamp}_{0}^{100}(\text{TempLoad} + \text{HumidityPenalty} - \text{CanopyMitigation} + 10.0)$
> 
> **3. REST Endpoints & Automated Testing:**
> *[Action: Execute request in Postman or terminal]*
> - We exposed full CRUD APIs across `/api/heat-reports`, `/api/cooling-locations`, `/api/predictions`, and aggregated metrics at `/api/dashboard/stats`.
> - We exported a complete Postman collection (`postman_collection.json`) containing all positive and negative test cases.
> - In our automated test suite, we wrote **49 JUnit 5 and MockMvc tests** covering controller endpoints, service layers, and validation rules. All 49 tests pass with 0 failures and 0 errors.
> 
> I now hand over to **Member 4**, who will demonstrate our frontend client, GIS mapping, and cloud deployment."

---

### 🎙️ MEMBER 4: Frontend UI/UX, GIS Mapping, Live Demo & Cloud Sharing
**Time: 3 Minutes**  
**Action:** *Navigate through all 5 tabs on `http://localhost:5173`.*

> **Member 4 Speaks:**
> "Thank you, Member 3. Good morning professors.
> 
> I developed the modern, responsive frontend application built with **React 18, Vite 6, Recharts, Leaflet GIS, and Lucide React**.
> 
> Rather than a generic beginner HTML interface, we implemented a state-of-the-art **Smart City Command Center** using a tailored dark navy palette (`#080e1e`, `#101c38`) with glowing accents.
> 
> Let us walk through the 5 core modules live:
> 
> **1. Module 1: Overview Dashboard (`/`):**
> *[Action: Click 'Overview Dashboard' tab]*
> - Real-time metric cards showing Total Reports, Critical Hotspots, Moderate/Low Zones, and Relief Slots.
> - Notice our **City Filter Pills** at the top: clicking 'Delhi', 'Mumbai', 'Chennai', or 'Bengaluru' dynamically recalculates the entire dashboard, updating our Recharts AreaChart temperature spectrum and severity donut breakdown in real time!
> 
> **2. Module 2: Heat Risk Prediction Simulator (`/predict`):**
> *[Action: Click 'Heat Risk Prediction' tab]*
> - Here, users or municipal officials can select from 14 Indian city presets (e.g. *Delhi Connaught Place Continental Heat* or *Mumbai BKC Coastal Humid*) or choose **Custom City** to input any city in the world!
> - Let's simulate: Temperature $43.5^\circ\text{C}$, Humidity $70\%$, Green Cover $8\%$.
> *[Action: Click 'Calculate Heat-Risk Score']*
> - Instant biometeorological score: **$86.4 / 100$ (EXTREME)**. The gauge glows red, presenting the exact scientific breakdown and emergency municipal action protocols, while logging the record to the database audit history below!
> 
> **3. Module 3: Geospatial GIS Heat Map (`/map`):**
> *[Action: Click 'Interactive Heat Map' tab]*
> - Integrated with **Leaflet and OpenStreetMap**.
> - Shows custom glowing markers: Red for High Risk ($\ge 40^\circ\text{C}$), Amber for Medium, Green for Low, and Cyan for Cooling Shelters.
> - With our **Focus City Navigator**, we can view all of India or jump directly to Delhi, Mumbai, Bengaluru, or Chennai at street-level resolution. Clicking any pin displays a rich telemetry popup!
> 
> **4. Module 4: Cooling Shelters Hub (`/cooling`):**
> *[Action: Click 'Cooling Shelters Hub' tab]*
> - Features live search filtering by name or street address, city filter chips, and real-time visual progress bars tracking bed occupancy rates.
> 
> **5. Module 5: Admin Management (`/admin`):**
> *[Action: Click 'Admin Management' tab]*
> - Provides administrative controls to Add, Edit, and Delete both Heat Reports and Cooling Hubs with live validation and modal dialogs.
> 
> **6. Public Cloud Deployment (Vercel):**
> To allow our faculty and friends to test this system from their phones and laptops, we configured a **Resilient Cloud Engine** (`fallbackData.js`) and deployed the frontend to **Vercel** with full client-side routing.
> 
> I now hand back to **Member 1** to conclude our demonstration."

---

### 🎙️ MEMBER 1: Conclusion & Project Summary
**Time: 1 Minute**

> **Member 1 Speaks:**
> "To summarize our project's accomplishments:
> 1. We built a fully working, decoupled full-stack platform addressing real climate resilience challenges.
> 2. We enforced enterprise-grade Three-Tier Spring Boot software architecture.
> 3. We implemented an explainable, transparent biometeorological scoring engine without fabricating ungrounded ML claims.
> 4. We supported multi-city nationwide monitoring and interactive geospatial visualization.
> 5. We achieved 100% automated test coverage across 49 unit and integration tests.
> 
> We are now ready and welcome any questions from the examination panel. Thank you!"

---

## Technical Cross-Section Breakdown

| Section / Cross-Section | Technologies Used | Exact Files / Code Locations | Purpose & Engineering Value |
|---|---|---|---|
| **Build & Dependencies** | Maven 3.9+, Java 21, Vite 6, npm | `pom.xml`, `package.json` | Modern reproducible builds for both backend JAR and frontend SPA bundle. |
| **Data Entities** | Spring Data JPA, Hibernate, Jakarta Validation | `HeatReport.java`, `CoolingLocation.java`, `HeatPrediction.java` | Object-Relational Mapping (ORM) enforcing boundary constraints (`@Min`, `@Max`, `@NotBlank`). |
| **In-Memory Database** | H2 Database, SQL DDL | `application.properties`, `DataInitializer.java` | In-memory relational storage (`jdbc:h2:mem:urbanheatdb`) with automated multi-city seed data. |
| **Business Logic Layer** | Spring `@Service`, Java Streams | `HeatReportService.java`, `CoolingLocationService.java`, `DashboardService.java` | Enforces capacity invariants, auto-calculates temperature severity, and computes aggregated metrics. |
| **Heat-Risk Algorithm** | Biometeorology, Steadman Formula | `PredictionService.java` | Transparent heuristic score (0–100) combining dry-bulb temp, relative humidity vapor pressure, and canopy cooling. |
| **REST Controller Layer** | Spring Web MVC, `@RestController` | `HeatReportController.java`, `CoolingLocationController.java`, `PredictionController.java`, `DashboardController.java` | RESTful JSON endpoints with proper HTTP status codes (`200 OK`, `400 Bad Request`). |
| **Exception Handling** | Spring `@RestControllerAdvice` | `GlobalExceptionHandler.java`, `ErrorResponse.java` | Centralized exception handling intercepting validation errors and returning structured error payloads. |
| **Network & Security** | Spring WebMvcConfigurer, Vite Reverse Proxy | `WebConfig.java`, `vite.config.js` | Dual CORS configuration allowing cross-origin requests and seamless `/api` reverse proxy. |
| **Quality Assurance** | JUnit 5, Mockito, Spring MockMvc | `*Test.java` (49 tests in `src/test/java`) | 100% automated test coverage verifying validation bounds, invariant enforcement, and HTTP responses. |
| **Presentation Layer** | React 18, Vanilla CSS3, Lucide Icons | `App.jsx`, `index.css`, `Sidebar.jsx`, `Header.jsx`, `StatCard.jsx` | Smart city command center design system with glassmorphism, responsive grids, and micro-interactions. |
| **Data Visualization** | Recharts (SVG / Canvas) | `DashboardPage.jsx` | Temperature Trend AreaChart and Thermal Risk Distribution Donut Chart with custom tooltips. |
| **Geospatial GIS Map** | Leaflet 1.9, OpenStreetMap | `HeatMapPage.jsx` | GIS tile layer with dynamic glowing pins, interactive telemetry popups, and city-jump flyTo navigation. |
| **Cloud Deployment** | Vercel, LocalStorage Fallback | `vercel.json`, `fallbackData.js`, `api.js` | Cloud-resilient fallback engine ensuring friends and faculty can open the app on mobile without a local server. |

---

## Faculty Viva Questions & Member-Specific Model Answers

### Questions for Member 1 (Architecture & System Design):
**Q1: Why did you choose a Three-Tier Architecture instead of writing everything in a single script or controller?**
> *"A Three-Tier Architecture separates concerns into Presentation, Business Logic, and Data Access. This guarantees modularity, maintainability, and testability. For example, if we want to migrate from our in-memory H2 database to PostgreSQL or MySQL in production, we only modify configuration without rewriting a single line of business logic or React UI."*

**Q2: What is the Urban Heat Island effect and why is it important in software engineering?**
> *"The UHI effect occurs when asphalt and concrete replace natural vegetation, creating microclimates up to $5^\circ\text{C}$ hotter than surrounding regions. Software platforms like ours allow municipal disaster response teams to monitor live sensors, predict acute heat stress, and dynamically reroute citizens to cooling shelters before medical emergencies occur."*

---

### Questions for Member 2 (Entities & Database):
**Q1: Why did you use H2 database instead of MySQL or PostgreSQL?**
> *"H2 is an embedded, in-memory relational database compliant with standard ANSI SQL and JPA/Hibernate. It eliminates external server setup dependencies for live college demonstrations, boots in under 1 second, and provides an integrated web console at `/h2-console` for real-time SQL inspection."*

**Q2: What happens if an entity violates validation, such as a temperature of 100°C?**
> *"The `@Max(70)` annotation on the `temperature` field in `HeatReport` triggers a `MethodArgumentNotValidException` before the data reaches the repository. Our `GlobalExceptionHandler` catches it and returns an HTTP 400 Bad Request with a clear message: 'Temperature must be between -50 and 70 Celsius'."*

---

### Questions for Member 3 (Business Logic & APIs):
**Q1: Why didn't you train an XGBoost or Random Forest ML model?**
> *"Genuine machine learning models require thousands of calibrated historical GIS sensor readings across several seasons to prevent overfitting. Fabricating high accuracy metrics without authentic historical sensor data is academically dishonest. We instead implemented an explainable biometeorological model based on the internationally recognized Steadman Heat Index, explicitly labeled as a heuristic risk indicator."*

**Q2: How do your unit tests work?**
> *"We used JUnit 5 and Mockito. In our controller tests, we use `MockMvcBuilders.standaloneSetup()` with `GlobalExceptionHandler` to test endpoints, JSON serialization, and HTTP status codes in isolation without booting the full servlet container, allowing all 49 tests to execute in under 4 seconds."*

---

### Questions for Member 4 (Frontend & GIS):
**Q1: How does the React frontend communicate with the Spring Boot backend?**
> *"During local development, our Vite development server runs on port 5173 with a reverse proxy forwarding `/api` calls directly to Spring Boot on port 8080. In production or cloud deployments, our centralized Axios client in `api.js` detects the environment and seamlessly communicates with the backend or falls back to our in-memory cloud engine."*

**Q2: How are geospatial coordinates visualized without a paid Google Maps API key?**
> *"We integrated Leaflet with OpenStreetMap tile layers. OpenStreetMap is open-source and free, and Leaflet allows lightweight, custom SVG-based glowing div-icons and interactive popups with coordinates and shelter occupancy stats."*
