/**
 * Travel Budget Calculator Data
 * 
 * Dit bestand bevat de gegevens voor reiskosten per regio, vervoersmiddel,
 * luxeniveau en seizoen voor de reisbudget-calculator.
 */

// Regio's met landen, steden en kostenfactoren
export const regions = {
  europa: {
    countries: ["nederland", "belgië", "duitsland", "frankrijk", "italië", "spanje", "portugal", "griekenland", "oostenrijk", "zwitserland", "verenigd koninkrijk", "ierland", "zweden", "noorwegen", "denemarken", "finland"],
    cities: {
      "amsterdam": { costFactor: 1.2 },
      "parijs": { costFactor: 1.3 },
      "londen": { costFactor: 1.4 },
      "berlijn": { costFactor: 1.0 },
      "rome": { costFactor: 1.1 },
      "barcelona": { costFactor: 1.1 },
      "madrid": { costFactor: 1.0 },
      "wenen": { costFactor: 1.1 },
      "zürich": { costFactor: 1.5 },
      "stockholm": { costFactor: 1.3 },
      "oslo": { costFactor: 1.4 },
      "kopenhagen": { costFactor: 1.3 },
      "helsinki": { costFactor: 1.2 },
      "brussel": { costFactor: 1.1 },
      "lissabon": { costFactor: 0.9 },
      "athene": { costFactor: 0.9 },
      "dublin": { costFactor: 1.2 }
    },
    baseAccommodation: 80, // Euro per nacht
    baseFood: 35, // Euro per dag
    baseActivities: 25, // Euro per dag
    flightCostFactor: 1.0,
    trainCostFactor: 1.0,
    carCostFactor: 1.0
  },
  
  azië: {
    countries: ["japan", "china", "thailand", "vietnam", "indonesië", "maleisië", "singapore", "zuid-korea", "india", "sri lanka", "nepal", "cambodja", "laos", "filipijnen"],
    cities: {
      "tokyo": { costFactor: 1.4 },
      "kyoto": { costFactor: 1.2 },
      "bangkok": { costFactor: 0.8 },
      "shanghai": { costFactor: 1.1 },
      "beijing": { costFactor: 1.0 },
      "hong kong": { costFactor: 1.3 },
      "singapore": { costFactor: 1.3 },
      "seoul": { costFactor: 1.1 },
      "delhi": { costFactor: 0.7 },
      "mumbai": { costFactor: 0.8 },
      "bali": { costFactor: 0.8 },
      "hanoi": { costFactor: 0.6 },
      "ho chi minh": { costFactor: 0.7 },
      "kuala lumpur": { costFactor: 0.8 },
      "manila": { costFactor: 0.7 }
    },
    baseAccommodation: 60, // Euro per nacht
    baseFood: 20, // Euro per dag
    baseActivities: 20, // Euro per dag
    flightCostFactor: 2.0,
    trainCostFactor: 0.7,
    carCostFactor: 0.8
  },
  
  noord_amerika: {
    countries: ["verenigde staten", "canada", "mexico"],
    cities: {
      "new york": { costFactor: 1.6 },
      "los angeles": { costFactor: 1.4 },
      "san francisco": { costFactor: 1.5 },
      "chicago": { costFactor: 1.3 },
      "miami": { costFactor: 1.3 },
      "las vegas": { costFactor: 1.2 },
      "toronto": { costFactor: 1.2 },
      "vancouver": { costFactor: 1.3 },
      "montreal": { costFactor: 1.1 },
      "mexico-stad": { costFactor: 0.8 },
      "cancun": { costFactor: 1.0 },
      "washington dc": { costFactor: 1.3 },
      "boston": { costFactor: 1.3 },
      "seattle": { costFactor: 1.3 },
      "orlando": { costFactor: 1.2 }
    },
    baseAccommodation: 100, // Euro per nacht
    baseFood: 40, // Euro per dag
    baseActivities: 35, // Euro per dag
    flightCostFactor: 1.8,
    trainCostFactor: 1.2,
    carCostFactor: 1.0
  },
  
  zuid_amerika: {
    countries: ["brazilië", "argentinië", "colombia", "peru", "chili", "ecuador", "bolivia", "venezuela", "uruguay"],
    cities: {
      "rio de janeiro": { costFactor: 1.0 },
      "são paulo": { costFactor: 1.0 },
      "buenos aires": { costFactor: 0.9 },
      "lima": { costFactor: 0.8 },
      "bogotá": { costFactor: 0.8 },
      "santiago": { costFactor: 0.9 },
      "quito": { costFactor: 0.7 },
      "la paz": { costFactor: 0.6 },
      "caracas": { costFactor: 0.7 },
      "montevideo": { costFactor: 0.9 },
      "cusco": { costFactor: 0.8 }
    },
    baseAccommodation: 60, // Euro per nacht
    baseFood: 25, // Euro per dag
    baseActivities: 20, // Euro per dag
    flightCostFactor: 2.0,
    trainCostFactor: 0.8,
    carCostFactor: 0.9
  },
  
  afrika: {
    countries: ["egypte", "marokko", "zuid-afrika", "kenia", "tanzania", "namibië", "botswana", "ghana", "nigeria", "ethiopië", "tunesië"],
    cities: {
      "caïro": { costFactor: 0.8 },
      "marrakech": { costFactor: 0.9 },
      "casablanca": { costFactor: 0.9 },
      "kaapstad": { costFactor: 1.0 },
      "johannesburg": { costFactor: 0.9 },
      "nairobi": { costFactor: 0.8 },
      "dar es salaam": { costFactor: 0.8 },
      "windhoek": { costFactor: 0.9 },
      "gaborone": { costFactor: 0.9 },
      "accra": { costFactor: 0.8 },
      "lagos": { costFactor: 0.9 },
      "addis abeba": { costFactor: 0.7 },
      "tunis": { costFactor: 0.8 }
    },
    baseAccommodation: 70, // Euro per nacht
    baseFood: 25, // Euro per dag
    baseActivities: 30, // Euro per dag
    flightCostFactor: 1.8,
    trainCostFactor: 0.7,
    carCostFactor: 0.8
  },
  
  oceanië: {
    countries: ["australië", "nieuw-zeeland", "fiji", "papoea-nieuw-guinea", "samoa"],
    cities: {
      "sydney": { costFactor: 1.3 },
      "melbourne": { costFactor: 1.2 },
      "brisbane": { costFactor: 1.1 },
      "perth": { costFactor: 1.2 },
      "auckland": { costFactor: 1.2 },
      "wellington": { costFactor: 1.1 },
      "christchurch": { costFactor: 1.0 },
      "queenstown": { costFactor: 1.2 },
      "suva": { costFactor: 0.9 },
      "port moresby": { costFactor: 1.0 },
      "apia": { costFactor: 0.9 }
    },
    baseAccommodation: 90, // Euro per nacht
    baseFood: 35, // Euro per dag
    baseActivities: 40, // Euro per dag
    flightCostFactor: 2.5,
    trainCostFactor: 1.1,
    carCostFactor: 1.0
  },
  
  midden_oosten: {
    countries: ["verenigde arabische emiraten", "qatar", "saudi-arabië", "israël", "jordanië", "libanon", "oman", "turkije"],
    cities: {
      "dubai": { costFactor: 1.4 },
      "abu dhabi": { costFactor: 1.3 },
      "doha": { costFactor: 1.3 },
      "riyad": { costFactor: 1.2 },
      "tel aviv": { costFactor: 1.3 },
      "jeruzalem": { costFactor: 1.2 },
      "amman": { costFactor: 0.9 },
      "beiroet": { costFactor: 1.0 },
      "muscat": { costFactor: 1.1 },
      "istanbul": { costFactor: 0.9 },
      "ankara": { costFactor: 0.8 }
    },
    baseAccommodation: 85, // Euro per nacht
    baseFood: 30, // Euro per dag
    baseActivities: 35, // Euro per dag
    flightCostFactor: 1.7,
    trainCostFactor: 0.9,
    carCostFactor: 0.9
  }
};

// Luxeniveaus met kostenfactoren
export const luxuryLevels = {
  budget: {
    accommodationFactor: 0.7,
    foodFactor: 0.6,
    activitiesFactor: 0.5,
    description: "Eenvoudige accommodaties zoals hostels of budget hotels, eten bij lokale eetgelegenheden of zelf koken, en gratis of goedkope activiteiten."
  },
  standard: {
    accommodationFactor: 1.0,
    foodFactor: 1.0,
    activitiesFactor: 1.0,
    description: "Middenklasse hotels of appartementen, een mix van uit eten en zelf koken, en een gevarieerd aanbod van activiteiten en excursies."
  },
  luxury: {
    accommodationFactor: 1.8,
    foodFactor: 1.5,
    activitiesFactor: 1.8,
    description: "Luxe hotels of resorts, regelmatig dineren in goede restaurants, en premium activiteiten en excursies met gidsen."
  }
};

// Seizoenen per regio met kostenfactoren
export const seasons = {
  europa: {
    highSeason: [5, 6, 7, 8], // juni t/m september
    lowSeason: [0, 1, 10, 11], // januari, februari, november, december
    highSeasonFactor: 1.3,
    shoulderSeasonFactor: 1.0,
    lowSeasonFactor: 0.8
  },
  azië: {
    highSeason: [0, 1, 11], // december t/m februari
    lowSeason: [5, 6, 7, 8], // juni t/m september
    highSeasonFactor: 1.25,
    shoulderSeasonFactor: 1.0,
    lowSeasonFactor: 0.85
  },
  noord_amerika: {
    highSeason: [5, 6, 7, 8], // juni t/m september
    lowSeason: [0, 1, 2, 10, 11], // januari t/m maart, november, december
    highSeasonFactor: 1.3,
    shoulderSeasonFactor: 1.0,
    lowSeasonFactor: 0.8
  },
  zuid_amerika: {
    highSeason: [11, 0, 1], // december t/m februari
    lowSeason: [5, 6, 7, 8], // juni t/m september
    highSeasonFactor: 1.25,
    shoulderSeasonFactor: 1.0,
    lowSeasonFactor: 0.85
  },
  afrika: {
    highSeason: [11, 0, 1, 6, 7], // december t/m februari, juli, augustus
    lowSeason: [3, 4, 9, 10], // april, mei, oktober, november
    highSeasonFactor: 1.3,
    shoulderSeasonFactor: 1.0,
    lowSeasonFactor: 0.8
  },
  oceanië: {
    highSeason: [11, 0, 1], // december t/m februari
    lowSeason: [5, 6, 7, 8], // juni t/m september
    highSeasonFactor: 1.3,
    shoulderSeasonFactor: 1.0,
    lowSeasonFactor: 0.8
  },
  midden_oosten: {
    highSeason: [9, 10, 2, 3], // oktober, november, maart, april
    lowSeason: [5, 6, 7, 8], // juni t/m september
    highSeasonFactor: 1.25,
    shoulderSeasonFactor: 1.0,
    lowSeasonFactor: 0.85
  }
};

// Transportkosten per regio en vervoersmiddel
export const transportCosts = {
  europa: {
    plane: {
      base: 200, // Euro per persoon
      perDay: 0
    },
    train: {
      base: 150, // Euro per persoon
      perDay: 0
    },
    car: {
      base: 100, // Euro voor autohuur
      perDay: 30 // Euro per dag voor benzine, tol, etc.
    }
  },
  azië: {
    plane: {
      base: 800,
      perDay: 0
    },
    train: {
      base: 100,
      perDay: 0
    },
    car: {
      base: 80,
      perDay: 20
    }
  },
  noord_amerika: {
    plane: {
      base: 700,
      perDay: 0
    },
    train: {
      base: 200,
      perDay: 0
    },
    car: {
      base: 150,
      perDay: 40
    }
  },
  zuid_amerika: {
    plane: {
      base: 900,
      perDay: 0
    },
    train: {
      base: 120,
      perDay: 0
    },
    car: {
      base: 100,
      perDay: 25
    }
  },
  afrika: {
    plane: {
      base: 700,
      perDay: 0
    },
    train: {
      base: 100,
      perDay: 0
    },
    car: {
      base: 120,
      perDay: 30
    }
  },
  oceanië: {
    plane: {
      base: 1200,
      perDay: 0
    },
    train: {
      base: 150,
      perDay: 0
    },
    car: {
      base: 130,
      perDay: 35
    }
  },
  midden_oosten: {
    plane: {
      base: 500,
      perDay: 0
    },
    train: {
      base: 120,
      perDay: 0
    },
    car: {
      base: 100,
      perDay: 25
    }
  }
};

// Functie om kostenfactor voor kinderen te berekenen op basis van leeftijd
export function childAgeFactor(age) {
  if (age <= 2) {
    return 0.1; // Baby's kosten ongeveer 10% van een volwassene
  } else if (age <= 12) {
    return 0.6; // Kinderen kosten ongeveer 60% van een volwassene
  } else {
    return 0.8; // Tieners kosten ongeveer 80% van een volwassene
  }
}
