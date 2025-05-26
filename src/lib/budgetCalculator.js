/**
 * Travel Budget Calculator Logic
 * 
 * Dit bestand bevat de logica voor het berekenen van reisbudgetten op basis van
 * gebruikersinvoer en de algemene schattingen uit travelData.js.
 */

import { regions, luxuryLevels, seasons, transportCosts, childAgeFactor } from './travelData.js';

/**
 * Bepaalt de regio en stad/land op basis van de ingevoerde bestemming
 * @param {string} destination - De ingevoerde bestemming
 * @returns {Object} - Regio, land/stad en kostenfactor
 */
function identifyDestination(destination) {
  const normalizedDestination = destination.toLowerCase().trim();
  
  // Zoek eerst naar exacte stad matches
  for (const [regionName, regionData] of Object.entries(regions)) {
    for (const [cityName, cityData] of Object.entries(regionData.cities)) {
      if (normalizedDestination.includes(cityName)) {
        return {
          region: regionName,
          regionData: regionData,
          destination: cityName,
          costFactor: cityData.costFactor,
          isCity: true
        };
      }
    }
  }
  
  // Als geen stad gevonden, zoek naar land matches
  for (const [regionName, regionData] of Object.entries(regions)) {
    for (const country of regionData.countries) {
      if (normalizedDestination.includes(country)) {
        return {
          region: regionName,
          regionData: regionData,
          destination: country,
          costFactor: 1.0, // Standaard factor voor landen
          isCity: false
        };
      }
    }
  }
  
  // Als geen specifieke match, probeer de regio te bepalen
  for (const [regionName, regionData] of Object.entries(regions)) {
    if (normalizedDestination.includes(regionName)) {
      return {
        region: regionName,
        regionData: regionData,
        destination: regionName,
        costFactor: 1.0,
        isCity: false
      };
    }
  }
  
  // Fallback naar Europa als geen match gevonden
  return {
    region: "europa",
    regionData: regions["europa"],
    destination: "onbekende bestemming in Europa",
    costFactor: 1.0,
    isCity: false
  };
}

/**
 * Berekent de transportkosten op basis van vervoersmiddel en bestemming
 * @param {Object} destinationInfo - Informatie over de bestemming
 * @param {string} transportType - Vervoersmiddel (plane, train, car)
 * @param {number} numAdults - Aantal volwassenen
 * @param {Array} childrenAges - Array met leeftijden van kinderen
 * @param {number} days - Aantal reisdagen
 * @returns {number} - Totale transportkosten
 */
function calculateTransportCosts(destinationInfo, transportType, numAdults, childrenAges, days) {
  const { region, regionData } = destinationInfo;
  const transport = transportCosts[region][transportType];
  
  let baseCost = 0;
  
  switch (transportType) {
    case 'plane':
      baseCost = transport.base * regionData.flightCostFactor;
      break;
    case 'train':
      baseCost = transport.base * regionData.trainCostFactor;
      break;
    case 'car':
      baseCost = transport.base * regionData.carCostFactor + (transport.perDay * days);
      break;
    default:
      baseCost = transport.base;
  }
  
  // Bereken kosten voor volwassenen
  let totalCost = baseCost * numAdults;
  
  // Bereken kosten voor kinderen op basis van leeftijd
  for (const age of childrenAges) {
    totalCost += baseCost * childAgeFactor(age);
  }
  
  return Math.round(totalCost);
}

/**
 * Berekent de accommodatiekosten
 * @param {Object} destinationInfo - Informatie over de bestemming
 * @param {string} luxuryLevel - Luxeniveau (budget, standard, luxury)
 * @param {number} numAdults - Aantal volwassenen
 * @param {Array} childrenAges - Array met leeftijden van kinderen
 * @param {number} days - Aantal reisdagen
 * @param {number} month - Maand van de reis (0-11)
 * @returns {number} - Totale accommodatiekosten
 */
function calculateAccommodationCosts(destinationInfo, luxuryLevel, numAdults, childrenAges, days, month) {
  const { region, regionData, costFactor } = destinationInfo;
  const baseAccommodationCost = regionData.baseAccommodation * costFactor;
  const luxuryFactor = luxuryLevels[luxuryLevel].accommodationFactor;
  const seasonFactor = getSeasonFactor(region, month);
  
  // Bereken kosten per kamer/unit (niet per persoon)
  // Aanname: 1 kamer voor 2 volwassenen, extra kamers voor grotere groepen
  const numRooms = Math.ceil(numAdults / 2) + Math.ceil(childrenAges.length / 2);
  
  // Basiskosten per kamer per nacht
  const costPerRoom = baseAccommodationCost * luxuryFactor * seasonFactor;
  
  // Totale kosten voor alle kamers voor alle nachten
  const totalCost = costPerRoom * numRooms * days;
  
  return Math.round(totalCost);
}

/**
 * Berekent de kosten voor eten
 * @param {Object} destinationInfo - Informatie over de bestemming
 * @param {string} luxuryLevel - Luxeniveau (budget, standard, luxury)
 * @param {number} numAdults - Aantal volwassenen
 * @param {Array} childrenAges - Array met leeftijden van kinderen
 * @param {number} days - Aantal reisdagen
 * @returns {number} - Totale kosten voor eten
 */
function calculateFoodCosts(destinationInfo, luxuryLevel, numAdults, childrenAges, days) {
  const { regionData, costFactor } = destinationInfo;
  const baseFoodCost = regionData.baseFood * costFactor;
  const luxuryFactor = luxuryLevels[luxuryLevel].foodFactor;
  
  // Bereken kosten voor volwassenen
  let totalCost = baseFoodCost * luxuryFactor * numAdults * days;
  
  // Bereken kosten voor kinderen op basis van leeftijd
  for (const age of childrenAges) {
    totalCost += baseFoodCost * luxuryFactor * childAgeFactor(age) * days;
  }
  
  return Math.round(totalCost);
}

/**
 * Berekent de kosten voor excursies en activiteiten
 * @param {Object} destinationInfo - Informatie over de bestemming
 * @param {string} luxuryLevel - Luxeniveau (budget, standard, luxury)
 * @param {number} numAdults - Aantal volwassenen
 * @param {Array} childrenAges - Array met leeftijden van kinderen
 * @param {number} days - Aantal reisdagen
 * @returns {number} - Totale kosten voor excursies
 */
function calculateActivitiesCosts(destinationInfo, luxuryLevel, numAdults, childrenAges, days) {
  const { regionData, costFactor } = destinationInfo;
  const baseActivitiesCost = regionData.baseActivities * costFactor;
  const luxuryFactor = luxuryLevels[luxuryLevel].activitiesFactor;
  
  // Aanname: niet elke dag excursies, afhankelijk van luxeniveau
  let activityDays;
  switch (luxuryLevel) {
    case 'budget':
      activityDays = Math.ceil(days * 0.3); // 30% van de dagen
      break;
    case 'standard':
      activityDays = Math.ceil(days * 0.5); // 50% van de dagen
      break;
    case 'luxury':
      activityDays = Math.ceil(days * 0.8); // 80% van de dagen
      break;
    default:
      activityDays = Math.ceil(days * 0.5);
  }
  
  // Minimum 1 dag activiteiten
  activityDays = Math.max(1, activityDays);
  
  // Bereken kosten voor volwassenen
  let totalCost = baseActivitiesCost * luxuryFactor * numAdults * activityDays;
  
  // Bereken kosten voor kinderen op basis van leeftijd
  for (const age of childrenAges) {
    totalCost += baseActivitiesCost * luxuryFactor * childAgeFactor(age) * activityDays;
  }
  
  return Math.round(totalCost);
}

/**
 * Bepaalt de seizoensfactor op basis van regio en maand
 * @param {string} region - De regio
 * @param {number} month - Maand van de reis (0-11)
 * @returns {number} - Seizoensfactor
 */
function getSeasonFactor(region, month) {
  const seasonData = seasons[region];
  
  if (seasonData.highSeason.includes(month)) {
    return seasonData.highSeasonFactor;
  } else if (seasonData.lowSeason.includes(month)) {
    return seasonData.lowSeasonFactor;
  } else {
    return seasonData.shoulderSeasonFactor;
  }
}

/**
 * Bepaalt of er een significant seizoenseffect is voor de gekozen bestemming en maand
 * @param {string} region - De regio
 * @param {number} month - Maand van de reis (0-11)
 * @returns {Object} - Informatie over seizoenseffect
 */
function getSeasonalInfo(region, month) {
  const seasonData = seasons[region];
  const currentFactor = getSeasonFactor(region, month);
  
  // Bepaal of huidige maand in hoog- of laagseizoen valt
  let currentSeason = "normaal";
  if (seasonData.highSeason.includes(month)) {
    currentSeason = "hoog";
  } else if (seasonData.lowSeason.includes(month)) {
    currentSeason = "laag";
  }
  
  // Bereken prijsverschil met andere seizoenen
  const highSeasonDiff = Math.round((seasonData.highSeasonFactor / currentFactor - 1) * 100);
  const lowSeasonDiff = Math.round((1 - seasonData.lowSeasonFactor / currentFactor) * 100);
  
  // Bepaal maanden voor hoog- en laagseizoen
  const highSeasonMonths = seasonData.highSeason.map(m => {
    const date = new Date(2025, m, 1);
    return date.toLocaleString('nl-NL', { month: 'long' });
  }).join(', ');
  
  const lowSeasonMonths = seasonData.lowSeason.map(m => {
    const date = new Date(2025, m, 1);
    return date.toLocaleString('nl-NL', { month: 'long' });
  }).join(', ');
  
  return {
    currentSeason,
    highSeasonDiff,
    lowSeasonDiff,
    highSeasonMonths,
    lowSeasonMonths,
    isSignificant: (highSeasonDiff > 15 || lowSeasonDiff > 15) // Significant als verschil > 15%
  };
}

/**
 * Hoofdfunctie voor het berekenen van het reisbudget
 * @param {Object} travelData - Alle reisgegevens van de gebruiker
 * @returns {Object} - Berekend budget met uitsplitsing
 */
export function calculateTravelBudget(travelData) {
  const {
    destination,
    adults,
    childrenAges = [],
    days,
    transport,
    luxury,
    month = new Date().getMonth() // Standaard huidige maand
  } = travelData;
  
  // Identificeer de bestemming
  const destinationInfo = identifyDestination(destination);
  
  // Bereken de verschillende kostencomponenten
  const transportCost = calculateTransportCosts(
    destinationInfo, 
    transport, 
    adults, 
    childrenAges, 
    days
  );
  
  const accommodationCost = calculateAccommodationCosts(
    destinationInfo, 
    luxury, 
    adults, 
    childrenAges, 
    days, 
    month
  );
  
  const foodCost = calculateFoodCosts(
    destinationInfo, 
    luxury, 
    adults, 
    childrenAges, 
    days
  );
  
  const activitiesCost = calculateActivitiesCosts(
    destinationInfo, 
    luxury, 
    adults, 
    childrenAges, 
    days
  );
  
  // Bereken totale kosten
  const totalCost = transportCost + accommodationCost + foodCost + activitiesCost;
  
  // Haal seizoensinformatie op
  const seasonalInfo = getSeasonalInfo(destinationInfo.region, month);
  
  // Return het volledige budget met uitsplitsing
  return {
    totalCost,
    breakdown: {
      transport: transportCost,
      accommodation: accommodationCost,
      food: foodCost,
      activities: activitiesCost
    },
    destination: {
      name: destinationInfo.destination,
      region: destinationInfo.region,
      isCity: destinationInfo.isCity
    },
    seasonalInfo,
    luxuryLevel: {
      name: luxury,
      description: luxuryLevels[luxury].description
    }
  };
}
