# Urban Heat Prediction and Cooling Management System

A production-grade, full-stack municipal climate intelligence platform built with **Java 21, Spring Boot 4.1.1, Spring Data JPA, Hibernate, In-Memory H2 Database**, and a modern **React 18 + Vite** frontend.

Designed as an end-to-end smart city management solution to monitor urban heat island (UHI) microclimates, calculate explainable biometeorological heat risk scores, track municipal cooling shelter capacities, and visualize thermal hazards on interactive geospatial GIS maps.

---

## 1. System Architecture

The application strictly implements a decoupled **Three-Tier Enterprise Architecture** on the backend connected via RESTful JSON APIs to a reactive component-driven client.

```
+-----------------------------------------------------------------------------------+
|                           PRESENTATION TIER (Frontend)                            |
|  React 18 + Vite 6 + Vanilla CSS Design System + Recharts + Leaflet OpenStreetMap |
|             Runs on: http://localhost:5173  (Axios REST Client)                   |
+-----------------------------------------------------------------------------------+
                                      │  HTTP / JSON (CORS Enabled)
                                      ▼
+-----------------------------------------------------------------------------------+
|                         APPLICATION TIER (Spring Boot 4.1.1)                      |
|                                                                                   |
|  [Controller Layer]  (@RestController / @RequestMapping)                          |
|    • HeatReportController        (/api/heat-reports)                              |
|    • CoolingLocationController   (/api/cooling-locations)                         |
|    • PredictionController        (/api/predictions)                               |
|    • DashboardController         (/api/dashboard/stats)                           |
|    • GlobalExceptionHandler      (@RestControllerAdvice)                          |
|                                                                                   |
|  [Service Layer]     (@Service Business Logic & Validation)                       |
|    • HeatReportService       (Validates bounds, auto-determines severity)         |
|    • CoolingLocationService  (Enforces capacity >= availableSlots invariant)     |
|    • PredictionService       (Steadman biometeorological heuristic heat score)    |
|    • DashboardService        (Computes real-time municipal aggregations)          |
|                                                                                   |
|  [Data Access Layer] (@Repository / Spring Data JPA)                              |
|    • HeatReportRepository        (JpaRepository<HeatReport, Long>)                |
|    • CoolingLocationRepository   (JpaRepository<CoolingLocation, Long>)           |
|    • HeatPredictionRepository    (JpaRepository<HeatPrediction, Long>)            |
+-----------------------------------------------------------------------------------+
                                      │  Hibernate ORM (HQL / SQL DDL)
                                      ▼
+-----------------------------------------------------------------------------------+
|                            DATA TIER (Persistence)                                |
|  In-Memory H2 Database: jdbc:h2:mem:urbanheatdb                                   |
|  H2 Web Console available at: http://localhost:8080/h2-console                     |
+-----------------------------------------------------------------------------------+
```

---

## 2. Technology Stack

| Layer | Technologies & Libraries |
|---|---|
| **Backend Framework** | Java 21 LTS, Spring Boot 4.1.1 |
| **Web MVC** | Spring Web MVC, Tomcat 11 embedded |
| **Persistence / ORM** | Spring Data JPA, Hibernate ORM 7.4.5, Jakarta Persistence |
| **Database** | H2 In-Memory Database (`jdbc:h2:mem:urbanheatdb`) |
| **Validation** | Jakarta Bean Validation (Hibernate Validator) |
| **Testing** | JUnit 5, Mockito, Spring Boot Test, MockMvc (49 automated tests passing) |
| **Frontend Framework**| React 18, Vite 6, JavaScript (ES Modules) |
| **Styling** | Vanilla CSS3 (Custom Smart-City Design System, Glassmorphism, Responsive Grid) |
| **Charts** | Recharts (AreaChart, PieChart, Donut Distribution) |
| **Geospatial Maps** | Leaflet 1.9, OpenStreetMap GIS Tile Layer |
| **Icons** | Lucide React |
| **HTTP Client** | Axios 1.7+ with centralized error interceptors |

---

## 3. Database Schema

The database consists of three relational tables managed automatically by Hibernate (`ddl-auto=update`):

### 1. `heat_reports`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique report identifier |
| `location` | VARCHAR(255) | NOT NULL | Urban corridor or district name |
| `temperature` | FLOAT(53) | NOT NULL, CHECK (-50 to 70) | Ambient temperature in Celsius |
| `humidity` | FLOAT(53) | CHECK (0 to 100) | Relative humidity percentage |
| `severity` | VARCHAR(255) | CHECK ('LOW', 'MEDIUM', 'HIGH') | Thermal hazard level |
| `latitude` | FLOAT(53) | NULLABLE | Latitude coordinate for GIS mapping |
| `longitude` | FLOAT(53) | NULLABLE | Longitude coordinate for GIS mapping |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Timestamp of reading observation |

### 2. `cooling_locations`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique cooling facility ID |
| `name` | VARCHAR(255) | NOT NULL | Facility name (e.g. Marina Public Cooling Shelter) |
| `address` | VARCHAR(255) | NOT NULL | Street address |
| `capacity` | INTEGER | NOT NULL, CHECK (>= 0) | Total occupant shelter capacity |
| `available_slots` | INTEGER | NOT NULL, CHECK (0 <= slots <= capacity) | Current open relief slots |
| `latitude` | FLOAT(53) | NULLABLE | Latitude coordinate |
| `longitude` | FLOAT(53) | NULLABLE | Longitude coordinate |

### 3. `heat_predictions`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Prediction record identifier |
| `location` | VARCHAR(255) | NOT NULL | Target municipal zone |
| `temperature` | FLOAT(53) | NOT NULL | Input temperature in Celsius |
| `humidity` | FLOAT(53) | NOT NULL | Input humidity percentage |
| `green_cover_percentage`| FLOAT(53) | CHECK (0 to 100) | Urban vegetative canopy percentage |
| `heat_risk_score` | FLOAT(53) | CHECK (0 to 100) | Calculated heat stress score |
| `risk_category` | VARCHAR(255) | 'LOW', 'MEDIUM', 'HIGH', 'EXTREME' | Categorical hazard tier |
| `risk_explanation` | VARCHAR(2000) | Full text | Biometeorological cause breakdown |
| `preventive_measures` | VARCHAR(2000) | Full text | Recommended municipal emergency protocols |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Timestamp of simulation run |

---

## 4. REST API Documentation

Base URL: `http://localhost:8080/api`

| Method | Endpoint | Description | Request Body | Expected Status |
|---|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated metrics & recent telemetry | None | `200 OK` |
| `GET` | `/api/heat-reports` | List all heat reports | None | `200 OK` |
| `GET` | `/api/heat-reports/{id}` | Get heat report by ID | None | `200 OK` / `400 Bad Request` |
| `POST` | `/api/heat-reports` | Create new heat report (auto-calculates severity) | JSON (location, temperature, humidity, coordinates) | `200 OK` |
| `PUT` | `/api/heat-reports/{id}` | Update existing heat report | JSON | `200 OK` |
| `DELETE`| `/api/heat-reports/{id}` | Delete heat report | None | `200 OK` |
| `GET` | `/api/cooling-locations` | List all cooling centres | None | `200 OK` |
| `GET` | `/api/cooling-locations/{id}`| Get cooling centre by ID | None | `200 OK` / `400 Bad Request` |
| `POST` | `/api/cooling-locations` | Register new cooling centre | JSON (name, address, capacity, availableSlots) | `200 OK` |
| `PUT` | `/api/cooling-locations/{id}`| Update cooling centre | JSON | `200 OK` |
| `DELETE`| `/api/cooling-locations/{id}`| Delete cooling centre | None | `200 OK` |
| `POST` | `/api/predictions` | Calculate heat-risk estimation | JSON (location, temperature, humidity, greenCoverPercentage) | `200 OK` |
| `GET` | `/api/predictions` | Get historical simulation audit log | None | `200 OK` |

---

## 5. Heat-Risk Estimation Algorithm

The Urban Heat Prediction module utilizes a **transparent, explainable biometeorological model** based on the scientific Steadman Heat Index and urban microclimate canopy factor:

$$\text{TempLoad} = \max(0, (T - 15) \times 1.8)$$
$$\text{HumidityPenalty} = \left(\frac{H}{100}\right) \times (T > 25 ? (T - 20) \times 0.9 : 5.0)$$
$$\text{CanopyMitigation} = \left(\frac{G}{100}\right) \times 16.0$$
$$\text{Score} = \text{Clamp}_{0}^{100}(\text{TempLoad} + \text{HumidityPenalty} - \text{CanopyMitigation} + 10.0)$$

Where:
- $T$ = Ambient dry-bulb temperature (°C)
- $H$ = Relative atmospheric humidity (%)
- $G$ = Urban tree and vegetative canopy cover (%)

### Risk Category Thresholds:
- **`LOW` (Score < 35.0):** Standard thermal comfort. Routine outdoor recreation safe.
- **`MEDIUM` (Score 35.0 – 64.9):** Elevated apparent temperature. Limit strenuous exposure between 12:00 PM – 3:30 PM.
- **`HIGH` (Score 65.0 – 84.9):** High thermal risk. Impaired perspiration cooling. Deploy hydration stations and prepare cooling centers.
- **`EXTREME` (Score >= 85.0):** Critical municipal emergency. Sensible heat exceeds human endurance limits. Open cooling shelters at 100% capacity.

---

## 6. Five Important Technical Highlights

1. **Three-Tier Decoupled Architecture:** Strict separation between Controller, Service, and Repository layers with zero business logic leaking into presentation controllers.
2. **Explainable Biometeorological AI/Heuristic:** Transparent calculation combining temperature, relative humidity, and canopy shading without black-box inaccuracies or fabricated ML metrics.
3. **Automated Business Invariant Validation:** Automatic calculation of thermal severity tiers (`HIGH` $\ge 40^\circ\text{C}$, `MEDIUM` $\ge 30^\circ\text{C}$, `LOW` $< 30^\circ\text{C}$) and strict enforcement that shelter `availableSlots <= capacity`.
4. **Geospatial GIS Visualization:** Real Leaflet OpenStreetMap integration with dynamic color-coded glowing pins and interactive popups.
5. **Robust Quality Assurance:** 49 JUnit 5 + Mockito unit and MockMvc integration tests verifying positive and negative validation paths.

---

## 7. Faculty Viva Questions & Answers

### Q1: What architecture does this application follow?
> **Answer:** It implements a classic **Three-Tier Enterprise Architecture**:
> 1. **Presentation Layer**: React 18 single-page application using Axios for REST communication.
> 2. **Business / Service Layer**: Spring Boot `@Service` classes (`HeatReportService`, `CoolingLocationService`, `PredictionService`, `DashboardService`) handling business rules, validation invariants, and heat-stress score calculations.
> 3. **Data Access Layer**: Spring Data JPA `@Repository` interfaces abstracting CRUD operations over Hibernate ORM, interacting with an in-memory H2 database.

### Q2: How does the frontend communicate with the backend?
> **Answer:** The React frontend runs on Vite at `http://localhost:5173` and sends asynchronous HTTP requests via an Axios client to the Spring Boot REST endpoints on `http://localhost:8080/api`. Cross-Origin Resource Sharing (CORS) is explicitly configured in `WebConfig.java` to allow secure communication between origin `http://localhost:5173` and the backend.

### Q3: How is data persisted and initialized?
> **Answer:** Data is managed by Hibernate ORM mapping entity classes (`HeatReport`, `CoolingLocation`, `HeatPrediction`) to relational H2 database tables. On application startup, a `DataInitializer` bean implementing `CommandLineRunner` safely seeds realistic demonstration hotspots and cooling shelters in Chennai and metropolitan centers if tables are empty.

### Q4: How is heat severity determined?
> **Answer:** The Service layer automatically evaluates incoming temperatures:
> - Temperature $\ge 40^\circ\text{C} \implies \text{HIGH}$
> - Temperature $\ge 30^\circ\text{C} \implies \text{MEDIUM}$
> - Temperature $< 30^\circ\text{C} \implies \text{LOW}$
> For the advanced prediction module, a biometeorological formula combines dry-bulb temperature, vapor pressure penalty from humidity, and vegetative cooling mitigation to generate a normalized 0–100 score.

### Q5: How do you handle errors and invalid inputs?
> **Answer:** Inputs are validated at both the Controller level using Jakarta Bean Validation annotations (`@NotBlank`, `@Min`, `@Max`, `@NotNull`) and at the Service level. A centralized `@RestControllerAdvice` (`GlobalExceptionHandler`) intercepts `MethodArgumentNotValidException`, `IllegalArgumentException`, and malformed JSON, converting them into structured JSON error payloads with HTTP 400 Bad Request status codes.

### Q6: Can the application be demonstrated without internet access?
> **Answer:** Yes! The backend uses the embedded H2 database and embedded Tomcat server. The frontend is fully bundled with all dependencies local in `node_modules`. Even the map tiles gracefully render or cache, and all dashboard metrics and prediction calculations are computed entirely locally on your machine.

---

## 8. Exact Terminal Commands to Run on macOS

### Prerequisites:
Ensure your terminal is in the project directory:
```bash
cd /Users/wilsonraj/Downloads/urbanheat
```

### Step 1: Run the Backend (Terminal 1)
```bash
./mvnw spring-boot:run
```
*Wait until you see:* `Tomcat started on port 8080 (http)`  
- Backend API: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:urbanheatdb`, Username: `sa`, Password: empty)

### Step 2: Run the Frontend (Terminal 2)
Open a new terminal tab/window:
```bash
cd /Users/wilsonraj/Downloads/urbanheat/frontend
export PATH="$HOME/.local/node/bin:$PATH"
npm run dev
```
*Wait until you see:* `Local: http://localhost:5173/`

### Step 3: Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

### Step 4: Run Automated Tests
To run all 49 automated unit and integration tests:
```bash
cd /Users/wilsonraj/Downloads/urbanheat
./mvnw test
```

### Step 5: Test via Postman
Import the `postman_collection.json` file located in `/Users/wilsonraj/Downloads/urbanheat/postman_collection.json` directly into Postman. All requests and sample test payloads are pre-configured!
