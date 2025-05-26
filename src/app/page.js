'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [formData, setFormData] = useState({
    destination: '',
    adults: 1,
    children: 0,
    childrenAges: [],
    days: 7,
    transport: 'plane',
    luxury: 'standard',
    email: '',
    terms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentMonth] = useState(new Date().getMonth());
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'children') {
      const numChildren = parseInt(value);
      const newChildrenAges = Array(numChildren).fill(0);
      
      // Behoud bestaande leeftijden waar mogelijk
      formData.childrenAges.forEach((age, index) => {
        if (index < numChildren) {
          newChildrenAges[index] = age;
        }
      });
      
      setFormData({ 
        ...formData, 
        [name]: numChildren,
        childrenAges: newChildrenAges
      });
    } else if (name.startsWith('childAge')) {
      const index = parseInt(name.replace('childAge', ''));
      const newChildrenAges = [...formData.childrenAges];
      newChildrenAges[index] = parseInt(value);
      setFormData({ ...formData, childrenAges: newChildrenAges });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Bereid data voor om naar API te sturen
      const requestData = {
        destination: formData.destination,
        adults: formData.adults,
        children: formData.children,
        days: formData.days,
        transport: formData.transport,
        luxury: formData.luxury,
        month: currentMonth,
        email: formData.email
      };
      
      // Voeg leeftijden van kinderen toe
      formData.childrenAges.forEach((age, index) => {
        requestData[`childAge${index}`] = age;
      });
      
      // Stuur data naar API
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error('Er is een fout opgetreden bij het berekenen van het budget');
      }
      
      const data = await response.json();
      setResult(data.budget);
      
      // In een echte implementatie zou hier de Google Forms / Zapier integratie komen
      console.log('E-mail zou worden verzonden naar:', formData.email);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-NL', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>ELFIN</div>
        <nav className={styles.nav}>
          {/* Placeholder voor navigatie */}
        </nav>
      </header>

      <div className={styles.intro}>
        <h1>Bereken je Droomreis Budget</h1>
        <p>Financieel voorbereid op je volgende avontuur</p>
        <p>Vul het formulier in en ontdek hoeveel je moet sparen voor jouw perfecte reis.</p>
      </div>

      <div className={styles.formContainer}>
        <form id="budget-calculator-form" onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3>Bestemming</h3>
            <div className={styles.formGroup}>
              <label htmlFor="destination">Waar wil je naartoe?</label>
              <input 
                type="text" 
                id="destination" 
                name="destination" 
                placeholder="Bijv. Parijs, Bali, New York..." 
                value={formData.destination}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Reisgezelschap</h3>
            <div className={styles.formGroup}>
              <label htmlFor="adults">Aantal volwassenen</label>
              <input 
                type="number" 
                id="adults" 
                name="adults" 
                min="1" 
                value={formData.adults}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="children">Aantal kinderen</label>
              <input 
                type="number" 
                id="children" 
                name="children" 
                min="0" 
                value={formData.children}
                onChange={handleInputChange}
              />
            </div>
            {formData.children > 0 && (
              <div className={styles.formGroup}>
                <label>Leeftijden van de kinderen</label>
                <div className={styles.ageInputs}>
                  {formData.childrenAges.map((age, index) => (
                    <div key={index} className={styles.formGroup}>
                      <label htmlFor={`childAge${index}`}>Kind {index + 1}</label>
                      <input 
                        type="number" 
                        id={`childAge${index}`} 
                        name={`childAge${index}`} 
                        min="0" 
                        max="17" 
                        value={age}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <h3>Reisdetails</h3>
            <div className={styles.formGroup}>
              <label htmlFor="days">Aantal dagen</label>
              <input 
                type="number" 
                id="days" 
                name="days" 
                min="1" 
                value={formData.days}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Vervoersmiddel</label>
              <div className={styles.radioGroup}>
                <div className={styles.radioOption}>
                  <input 
                    type="radio" 
                    id="transport-plane" 
                    name="transport" 
                    value="plane"
                    checked={formData.transport === 'plane'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="transport-plane">Vliegtuig</label>
                </div>
                <div className={styles.radioOption}>
                  <input 
                    type="radio" 
                    id="transport-train" 
                    name="transport" 
                    value="train"
                    checked={formData.transport === 'train'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="transport-train">Trein</label>
                </div>
                <div className={styles.radioOption}>
                  <input 
                    type="radio" 
                    id="transport-car" 
                    name="transport" 
                    value="car"
                    checked={formData.transport === 'car'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="transport-car">Auto</label>
                </div>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Luxeniveau</label>
              <div className={styles.radioGroup}>
                <div className={styles.radioOption}>
                  <input 
                    type="radio" 
                    id="luxury-budget" 
                    name="luxury" 
                    value="budget"
                    checked={formData.luxury === 'budget'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="luxury-budget">Budget</label>
                </div>
                <div className={styles.radioOption}>
                  <input 
                    type="radio" 
                    id="luxury-standard" 
                    name="luxury" 
                    value="standard"
                    checked={formData.luxury === 'standard'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="luxury-standard">Standaard</label>
                </div>
                <div className={styles.radioOption}>
                  <input 
                    type="radio" 
                    id="luxury-luxury" 
                    name="luxury" 
                    value="luxury"
                    checked={formData.luxury === 'luxury'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="luxury-luxury">Luxe</label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Jouw gegevens</h3>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mailadres</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="jouw@email.nl"
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              <small>We sturen je reisbudget naar dit e-mailadres</small>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.radioOption}>
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required 
                />
                <label htmlFor="terms">Ik ga akkoord met de voorwaarden en privacy policy</label>
              </div>
            </div>
          </div>

          <div className={styles.btnContainer}>
            <button 
              type="submit" 
              className={styles.btn}
              disabled={loading}
            >
              {loading ? 'Berekenen...' : 'Bereken Mijn Reisbudget'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={styles.resultsContainer} id="results">
          <h2>Jouw Reisbudget</h2>
          <div className={styles.totalBudget}>{formatCurrency(result.totalCost)}</div>
          <p>Hieronder vind je een uitsplitsing van de geschatte kosten voor jouw reis naar {result.destination.name}:</p>
          
          <div className={styles.budgetBreakdown}>
            <div className={styles.budgetItem}>
              <h4>Vervoer</h4>
              <p>{formatCurrency(result.breakdown.transport)}</p>
            </div>
            <div className={styles.budgetItem}>
              <h4>Accommodatie</h4>
              <p>{formatCurrency(result.breakdown.accommodation)}</p>
            </div>
            <div className={styles.budgetItem}>
              <h4>Eten</h4>
              <p>{formatCurrency(result.breakdown.food)}</p>
            </div>
            <div className={styles.budgetItem}>
              <h4>Excursies</h4>
              <p>{formatCurrency(result.breakdown.activities)}</p>
            </div>
          </div>

          {result.seasonalInfo.isSignificant && (
            <div className={styles.seasonalInfo}>
              <h4>Seizoensinformatie</h4>
              {result.seasonalInfo.currentSeason === 'hoog' && (
                <p>Je reist in het hoogseizoen. In het laagseizoen ({result.seasonalInfo.lowSeasonMonths}) kunnen de prijzen tot {result.seasonalInfo.lowSeasonDiff}% lager liggen.</p>
              )}
              {result.seasonalInfo.currentSeason === 'laag' && (
                <p>Je reist in het laagseizoen. In het hoogseizoen ({result.seasonalInfo.highSeasonMonths}) kunnen de prijzen tot {result.seasonalInfo.highSeasonDiff}% hoger liggen.</p>
              )}
              {result.seasonalInfo.currentSeason === 'normaal' && (
                <p>In het hoogseizoen ({result.seasonalInfo.highSeasonMonths}) kunnen de prijzen tot {result.seasonalInfo.highSeasonDiff}% hoger liggen. In het laagseizoen ({result.seasonalInfo.lowSeasonMonths}) kunnen de prijzen tot {result.seasonalInfo.lowSeasonDiff}% lager liggen.</p>
              )}
            </div>
          )}

          <div className={styles.luxuryInfo}>
            <h4>Jouw gekozen luxeniveau: {formData.luxury}</h4>
            <p>{result.luxuryLevel.description}</p>
          </div>

          <div className={styles.ctaContainer}>
            <a href="https://thisiselfin.com/nl/shop" className={styles.btn}>Ontdek hoe je kunt sparen voor je reis</a>
          </div>
        </div>
       )}

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2025 Elfin - Het grootste financiële platform voor vrouwen in Nederland en België</p>
          <p>Op missie om 1 miljoen vrouwen te helpen financieel onafhankelijk te worden</p>
        </div>
      </footer>
    </main>
  );
}
