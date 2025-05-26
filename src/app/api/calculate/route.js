import { NextResponse } from 'next/server';
import { calculateTravelBudget } from '../../../lib/budgetCalculator';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Valideer de invoer
    if (!data.destination || !data.adults || !data.days || !data.transport || !data.luxury) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400 }
      );
    }
    
    // Verwerk de leeftijden van kinderen
    const childrenAges = [];
    if (data.children && data.children > 0) {
      for (let i = 0; i < data.children; i++) {
        const ageKey = `childAge${i}`;
        if (data[ageKey]) {
          childrenAges.push(parseInt(data[ageKey]));
        }
      }
    }
    
    // Bereken het reisbudget
    const budget = calculateTravelBudget({
      destination: data.destination,
      adults: parseInt(data.adults),
      childrenAges,
      days: parseInt(data.days),
      transport: data.transport,
      luxury: data.luxury,
      month: data.month !== undefined ? parseInt(data.month) : new Date().getMonth()
    });
    
    return NextResponse.json({ budget });
  } catch (error) {
    console.error('Error calculating budget:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het berekenen van het budget' },
      { status: 500 }
    );
  }
}
