// Fallback In-Memory / LocalStorage Database for Public Deployments (Vercel, Netlify)
// Ensures any friend or faculty opening the link without a local Spring Boot server gets 100% full functionality!

const INITIAL_REPORTS = [
  // Chennai
  { id: 1, location: "Marina Beach Coastal Hub, Chennai", temperature: 42.5, severity: "HIGH", humidity: 72.0, latitude: 13.0500, longitude: 80.2824 },
  { id: 2, location: "T. Nagar Commercial Core, Chennai", temperature: 41.8, severity: "HIGH", humidity: 64.0, latitude: 13.0418, longitude: 80.2341 },
  { id: 3, location: "Guindy Industrial Corridor, Chennai", temperature: 40.2, severity: "HIGH", humidity: 58.0, latitude: 13.0067, longitude: 80.2026 },
  { id: 4, location: "Anna Nagar Commercial Square, Chennai", temperature: 36.8, severity: "MEDIUM", humidity: 55.0, latitude: 13.0850, longitude: 80.2100 },
  { id: 5, location: "Adyar River Greenbelt, Chennai", temperature: 28.5, severity: "LOW", humidity: 50.0, latitude: 13.0012, longitude: 80.2565 },

  // Delhi NCR
  { id: 6, location: "Connaught Place Asphalt Hub, Delhi", temperature: 44.5, severity: "HIGH", humidity: 35.0, latitude: 28.6304, longitude: 77.2177 },
  { id: 7, location: "Chandni Chowk Market Core, Delhi", temperature: 43.8, severity: "HIGH", humidity: 38.0, latitude: 28.6506, longitude: 77.2303 },
  { id: 8, location: "Okhla Industrial Sector, Delhi", temperature: 42.6, severity: "HIGH", humidity: 32.0, latitude: 28.5355, longitude: 77.2732 },
  { id: 9, location: "Lodi Gardens Canopy Oasis, Delhi", temperature: 33.2, severity: "MEDIUM", humidity: 42.0, latitude: 28.5933, longitude: 77.2197 },

  // Mumbai
  { id: 10, location: "Bandra Kurla Complex (BKC), Mumbai", temperature: 39.2, severity: "MEDIUM", humidity: 82.0, latitude: 19.0657, longitude: 72.8687 },
  { id: 11, location: "Dharavi Dense Urban Core, Mumbai", temperature: 40.4, severity: "HIGH", humidity: 79.0, latitude: 19.0400, longitude: 72.8500 },
  { id: 12, location: "Marine Drive Coastal Stretch, Mumbai", temperature: 34.5, severity: "MEDIUM", humidity: 84.0, latitude: 18.9438, longitude: 72.8234 },
  { id: 13, location: "Sanjay Gandhi National Park Buffer, Mumbai", temperature: 28.1, severity: "LOW", humidity: 75.0, latitude: 19.2288, longitude: 72.9182 },

  // Bengaluru
  { id: 14, location: "Whitefield Tech Corridor, Bengaluru", temperature: 35.0, severity: "MEDIUM", humidity: 48.0, latitude: 12.9698, longitude: 77.7500 },
  { id: 15, location: "Electronic City Phase I, Bengaluru", temperature: 35.6, severity: "MEDIUM", humidity: 45.0, latitude: 12.8452, longitude: 77.6602 },
  { id: 16, location: "Cubbon Park Green Reserve, Bengaluru", temperature: 26.2, severity: "LOW", humidity: 54.0, latitude: 12.9763, longitude: 77.5929 },

  // Hyderabad
  { id: 17, location: "HITEC City Cyber Towers, Hyderabad", temperature: 42.4, severity: "HIGH", humidity: 40.0, latitude: 17.4504, longitude: 78.3808 },
  { id: 18, location: "Charminar Heritage Quarter, Hyderabad", temperature: 41.2, severity: "HIGH", humidity: 44.0, latitude: 17.3616, longitude: 78.4747 },

  // Kolkata
  { id: 19, location: "Howrah Junction Terminal, Kolkata", temperature: 40.8, severity: "HIGH", humidity: 78.0, latitude: 22.5850, longitude: 88.3426 },
  { id: 20, location: "Salt Lake Sector V IT Hub, Kolkata", temperature: 38.0, severity: "MEDIUM", humidity: 72.0, latitude: 22.5769, longitude: 88.4338 },

  // Ahmedabad
  { id: 21, location: "Sabarmati Riverfront Commercial Hub, Ahmedabad", temperature: 44.0, severity: "HIGH", humidity: 28.0, latitude: 23.0300, longitude: 72.5800 }
];

const INITIAL_COOLING = [
  // Chennai
  { id: 1, name: "Public Cooling Centre", address: "Marina Beach, Chennai", capacity: 100, availableSlots: 75, latitude: 13.0485, longitude: 80.2810 },
  { id: 2, name: "Central Civic Cooling Shelter", address: "Chennai Central, Station Rd", capacity: 150, availableSlots: 92, latitude: 13.0815, longitude: 80.2720 },
  { id: 3, name: "T. Nagar Municipal AC Community Center", address: "45 Usman Road, T. Nagar, Chennai", capacity: 120, availableSlots: 48, latitude: 13.0400, longitude: 80.2330 },

  // Delhi
  { id: 4, name: "Central Delhi Civic Heat Shelter", address: "Palika Kendra, Connaught Place, Delhi", capacity: 200, availableSlots: 135, latitude: 28.6310, longitude: 77.2190 },
  { id: 5, name: "Okhla Disaster Relief Pavilion", address: "Phase III Community Center, Delhi", capacity: 120, availableSlots: 60, latitude: 28.5340, longitude: 77.2710 },

  // Mumbai
  { id: 6, name: "BKC Municipal Air-Cooled Relief Center", address: "BKC City Park, Bandra East, Mumbai", capacity: 180, availableSlots: 115, latitude: 19.0665, longitude: 72.8695 },
  { id: 7, name: "Mumbai Central Relief Pavilion", address: "Station Square, Mumbai", capacity: 140, availableSlots: 70, latitude: 18.9690, longitude: 72.8190 },

  // Bengaluru
  { id: 8, name: "Whitefield Climate Relief Haven", address: "ITPL Main Road, Bengaluru", capacity: 110, availableSlots: 80, latitude: 12.9710, longitude: 77.7490 },
  { id: 9, name: "Electronic City Community Haven", address: "Hosur Road, Bengaluru", capacity: 130, availableSlots: 95, latitude: 12.8440, longitude: 77.6590 },

  // Hyderabad
  { id: 10, name: "Cyberabad Civic Cooling Hub", address: "Madhapur Ring Rd, Hyderabad", capacity: 160, availableSlots: 105, latitude: 17.4490, longitude: 78.3790 },

  // Kolkata
  { id: 11, name: "Salt Lake AC Climate Haven", address: "Sector V Ring Rd, Kolkata", capacity: 140, availableSlots: 90, latitude: 22.5780, longitude: 88.4350 }
];

const INITIAL_PREDICTIONS = [
  {
    id: 1,
    location: "Connaught Place Asphalt Hub, Delhi",
    temperature: 44.5,
    humidity: 35.0,
    greenCoverPercentage: 10.0,
    heatRiskScore: 86.2,
    riskCategory: "EXTREME",
    riskExplanation: "Extreme sensible heat load in central concrete concourse. Ambient temperature of 44.5°C poses immediate risk of heat exhaustion.",
    preventiveMeasures: "• Activate emergency misting cannons.\n• Issue red alert municipal heat advisory.\n• Distribute oral rehydration solutions at metro stations.",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    location: "Bandra Kurla Complex (BKC), Mumbai",
    temperature: 39.2,
    humidity: 82.0,
    greenCoverPercentage: 14.0,
    heatRiskScore: 84.8,
    riskCategory: "HIGH",
    riskExplanation: "High thermal stress caused by combination of 39.2°C ambient heat and 82% relative humidity, severely impairing sweat evaporation.",
    preventiveMeasures: "• Direct corporate and outdoor workers to cooled shelters.\n• Suspend strenuous midday outdoor work.",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    location: "Cubbon Park Green Reserve, Bengaluru",
    temperature: 26.2,
    humidity: 54.0,
    greenCoverPercentage: 70.0,
    heatRiskScore: 22.4,
    riskCategory: "LOW",
    riskExplanation: "Optimal thermal comfort maintained by mature 70% tree canopy buffer and lower plateau altitude.",
    preventiveMeasures: "• Normal outdoor activities encouraged.\n• Maintain municipal preservation of urban canopy.",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const fallbackStorage = {
  getReports: () => {
    const data = localStorage.getItem('urbanheat_reports');
    return data ? JSON.parse(data) : INITIAL_REPORTS;
  },
  saveReports: (reports) => {
    localStorage.setItem('urbanheat_reports', JSON.stringify(reports));
  },

  getCooling: () => {
    const data = localStorage.getItem('urbanheat_cooling');
    return data ? JSON.parse(data) : INITIAL_COOLING;
  },
  saveCooling: (cooling) => {
    localStorage.setItem('urbanheat_cooling', JSON.stringify(cooling));
  },

  getPredictions: () => {
    const data = localStorage.getItem('urbanheat_predictions');
    return data ? JSON.parse(data) : INITIAL_PREDICTIONS;
  },
  savePredictions: (preds) => {
    localStorage.setItem('urbanheat_predictions', JSON.stringify(preds));
  },

  calculatePrediction: (req) => {
    const temp = parseFloat(req.temperature);
    const humidity = parseFloat(req.humidity);
    const green = req.greenCoverPercentage != null ? parseFloat(req.greenCoverPercentage) : 15.0;

    const tempLoad = Math.max(0, (temp - 15.0) * 1.8);
    const humidityPenalty = (humidity / 100.0) * (temp > 25.0 ? (temp - 20.0) * 0.9 : 5.0);
    const greenMitigation = (green / 100.0) * 16.0;
    const score = Math.max(0, Math.min(100, Math.round((tempLoad + humidityPenalty - greenMitigation + 10.0) * 10) / 10));

    let category = "LOW";
    let explanation = `Low thermal discomfort detected for ${req.location}. Temperature of ${temp}°C and ${humidity}% humidity are within normal physiological bounds.`;
    let recommendations = "• Maintain routine outdoor activities.\n• Keep adequately hydrated.";

    if (score >= 85) {
      category = "EXTREME";
      explanation = `CRITICAL thermal emergency for ${req.location} (Score: ${score}/100). Extreme heat index of ${temp}°C and ${humidity}% humidity creates life-threatening heat stress.`;
      recommendations = "• Activate emergency cooling protocols.\n• Issue red alert advisory.\n• Direct citizens to air-conditioned cooling centres.";
    } else if (score >= 65) {
      category = "HIGH";
      explanation = `High thermal risk alert for ${req.location} (Score: ${score}/100). Ambient temperature (${temp}°C) and humidity (${humidity}%) impair natural body cooling.`;
      recommendations = "• Limit direct sun exposure.\n• Dispatch hydration kiosks.\n• Open public cooling centres.";
    } else if (score >= 35) {
      category = "MEDIUM";
      explanation = `Moderate heat stress for ${req.location} (Score: ${score}/100). Sensible heat causes noticeable thermal discomfort.`;
      recommendations = "• Stay hydrated with oral electrolytes.\n• Avoid peak sun hours between 12 PM - 3 PM.";
    }

    return {
      id: Date.now(),
      location: req.location,
      temperature: temp,
      humidity: humidity,
      greenCoverPercentage: green,
      heatRiskScore: score,
      riskCategory: category,
      riskExplanation: explanation,
      preventiveMeasures: recommendations,
      createdAt: new Date().toISOString()
    };
  }
};
