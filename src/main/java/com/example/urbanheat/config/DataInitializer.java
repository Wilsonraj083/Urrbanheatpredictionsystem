package com.example.urbanheat.config;

import com.example.urbanheat.model.CoolingLocation;
import com.example.urbanheat.model.HeatPrediction;
import com.example.urbanheat.model.HeatReport;
import com.example.urbanheat.repository.CoolingLocationRepository;
import com.example.urbanheat.repository.HeatPredictionRepository;
import com.example.urbanheat.repository.HeatReportRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final HeatReportRepository heatReportRepository;
    private final CoolingLocationRepository coolingLocationRepository;
    private final HeatPredictionRepository heatPredictionRepository;

    public DataInitializer(HeatReportRepository heatReportRepository,
                           CoolingLocationRepository coolingLocationRepository,
                           HeatPredictionRepository heatPredictionRepository) {
        this.heatReportRepository = heatReportRepository;
        this.coolingLocationRepository = coolingLocationRepository;
        this.heatPredictionRepository = heatPredictionRepository;
    }

    @Override
    public void run(String... args) {
        if (heatReportRepository.count() == 0) {
            // Chennai Hotspots
            heatReportRepository.save(new HeatReport(null, "Marina Beach Coastal Hub, Chennai", 42.5, "HIGH", 72.0, 13.0500, 80.2824));
            heatReportRepository.save(new HeatReport(null, "T. Nagar Commercial Core, Chennai", 41.8, "HIGH", 64.0, 13.0418, 80.2341));
            heatReportRepository.save(new HeatReport(null, "Guindy Industrial Corridor, Chennai", 40.2, "HIGH", 58.0, 13.0067, 80.2026));
            heatReportRepository.save(new HeatReport(null, "Anna Nagar Commercial Square, Chennai", 36.8, "MEDIUM", 55.0, 13.0850, 80.2100));
            heatReportRepository.save(new HeatReport(null, "Adyar River Greenbelt, Chennai", 28.5, "LOW", 50.0, 13.0012, 80.2565));

            // Delhi NCR Hotspots
            heatReportRepository.save(new HeatReport(null, "Connaught Place Asphalt Hub, Delhi", 44.5, "HIGH", 35.0, 28.6304, 77.2177));
            heatReportRepository.save(new HeatReport(null, "Chandni Chowk Market Core, Delhi", 43.8, "HIGH", 38.0, 28.6506, 77.2303));
            heatReportRepository.save(new HeatReport(null, "Okhla Industrial Sector, Delhi", 42.6, "HIGH", 32.0, 28.5355, 77.2732));
            heatReportRepository.save(new HeatReport(null, "Lodi Gardens Canopy Oasis, Delhi", 33.2, "MEDIUM", 42.0, 28.5933, 77.2197));

            // Mumbai Hotspots
            heatReportRepository.save(new HeatReport(null, "Bandra Kurla Complex (BKC), Mumbai", 39.2, "MEDIUM", 82.0, 19.0657, 72.8687));
            heatReportRepository.save(new HeatReport(null, "Dharavi Dense Urban Core, Mumbai", 40.4, "HIGH", 79.0, 19.0400, 72.8500));
            heatReportRepository.save(new HeatReport(null, "Marine Drive Coastal Stretch, Mumbai", 34.5, "MEDIUM", 84.0, 18.9438, 72.8234));
            heatReportRepository.save(new HeatReport(null, "Sanjay Gandhi National Park Buffer, Mumbai", 28.1, "LOW", 75.0, 19.2288, 72.9182));

            // Bengaluru Hotspots
            heatReportRepository.save(new HeatReport(null, "Whitefield Tech Corridor, Bengaluru", 35.0, "MEDIUM", 48.0, 12.9698, 77.7500));
            heatReportRepository.save(new HeatReport(null, "Electronic City Phase I, Bengaluru", 35.6, "MEDIUM", 45.0, 12.8452, 77.6602));
            heatReportRepository.save(new HeatReport(null, "Cubbon Park Green Reserve, Bengaluru", 26.2, "LOW", 54.0, 12.9763, 77.5929));

            // Hyderabad Hotspots
            heatReportRepository.save(new HeatReport(null, "HITEC City Cyber Towers, Hyderabad", 42.4, "HIGH", 40.0, 17.4504, 78.3808));
            heatReportRepository.save(new HeatReport(null, "Charminar Heritage Quarter, Hyderabad", 41.2, "HIGH", 44.0, 17.3616, 78.4747));

            // Kolkata Hotspots
            heatReportRepository.save(new HeatReport(null, "Howrah Junction Terminal, Kolkata", 40.8, "HIGH", 78.0, 22.5850, 88.3426));
            heatReportRepository.save(new HeatReport(null, "Salt Lake Sector V IT Hub, Kolkata", 38.0, "MEDIUM", 72.0, 22.5769, 88.4338));

            // Ahmedabad Hotspot
            heatReportRepository.save(new HeatReport(null, "Sabarmati Riverfront Commercial Hub, Ahmedabad", 44.0, "HIGH", 28.0, 23.0300, 72.5800));
        }

        if (coolingLocationRepository.count() == 0) {
            // Chennai Shelters
            coolingLocationRepository.save(new CoolingLocation(null, "Public Cooling Centre", "Marina Beach, Chennai", 100, 75, 13.0485, 80.2810));
            coolingLocationRepository.save(new CoolingLocation(null, "Central Civic Cooling Shelter", "Chennai Central, Station Rd", 150, 92, 13.0815, 80.2720));
            coolingLocationRepository.save(new CoolingLocation(null, "T. Nagar Municipal AC Community Center", "45 Usman Road, T. Nagar, Chennai", 120, 48, 13.0400, 80.2330));

            // Delhi Shelters
            coolingLocationRepository.save(new CoolingLocation(null, "Central Delhi Civic Heat Shelter", "Palika Kendra, Connaught Place, Delhi", 200, 135, 28.6310, 77.2190));
            coolingLocationRepository.save(new CoolingLocation(null, "Okhla Disaster Relief Pavilion", "Phase III Community Center, Delhi", 120, 60, 28.5340, 77.2710));

            // Mumbai Shelters
            coolingLocationRepository.save(new CoolingLocation(null, "BKC Municipal Air-Cooled Relief Center", "BKC City Park, Bandra East, Mumbai", 180, 115, 19.0665, 72.8695));
            coolingLocationRepository.save(new CoolingLocation(null, "Mumbai Central Relief Pavilion", "Station Square, Mumbai", 140, 70, 18.9690, 72.8190));

            // Bengaluru Shelters
            coolingLocationRepository.save(new CoolingLocation(null, "Whitefield Climate Relief Haven", "ITPL Main Road, Bengaluru", 110, 80, 12.9710, 77.7490));
            coolingLocationRepository.save(new CoolingLocation(null, "Electronic City Community Haven", "Hosur Road, Bengaluru", 130, 95, 12.8440, 77.6590));

            // Hyderabad Shelter
            coolingLocationRepository.save(new CoolingLocation(null, "Cyberabad Civic Cooling Hub", "Madhapur Ring Rd, Hyderabad", 160, 105, 17.4490, 78.3790));

            // Kolkata Shelter
            coolingLocationRepository.save(new CoolingLocation(null, "Salt Lake AC Climate Haven", "Sector V Ring Rd, Kolkata", 140, 90, 22.5780, 88.4350));
        }

        if (heatPredictionRepository.count() == 0) {
            heatPredictionRepository.save(new HeatPrediction(
                    null,
                    "Connaught Place Asphalt Hub, Delhi",
                    44.5,
                    35.0,
                    10.0,
                    86.2,
                    "EXTREME",
                    "Extreme sensible heat load in central concrete concourse. Ambient temperature of 44.5°C poses immediate risk of heat exhaustion.",
                    "• Activate emergency misting cannons.\n• Issue red alert municipal heat advisory.\n• Distribute oral rehydration solutions at metro stations."
            ));
            heatPredictionRepository.save(new HeatPrediction(
                    null,
                    "Bandra Kurla Complex (BKC), Mumbai",
                    39.2,
                    82.0,
                    14.0,
                    84.8,
                    "HIGH",
                    "High thermal stress caused by combination of 39.2°C ambient heat and 82% relative humidity, severely impairing sweat evaporation.",
                    "• Direct corporate and outdoor workers to cooled shelters.\n• Suspend strenuous midday outdoor work."
            ));
            heatPredictionRepository.save(new HeatPrediction(
                    null,
                    "Cubbon Park Green Reserve, Bengaluru",
                    26.2,
                    54.0,
                    70.0,
                    22.4,
                    "LOW",
                    "Optimal thermal comfort maintained by mature 70% tree canopy buffer and lower plateau altitude.",
                    "• Normal outdoor activities encouraged.\n• Maintain municipal preservation of urban canopy."
            ));
        }
    }
}
