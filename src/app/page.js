'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [formData, setFormData] = useState({
    destination: '',
    adults: 2,
    children: 0,
    childrenAges: [],
    days: 7,
    transport: 'plane',
    luxury: 'standard',
    email: '',
    firstName: '',
    lastName: ''
  });
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [showChildrenAges, setShowChildrenAges] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Update children ages array when children count changes
    if (formData.children > formData.childrenAges.length) {
      // Add new child ages with default value of 10
      const newAges = [...formData.childrenAges];
      for (let i = formData.childrenAges.length; i < formData.children; i++) {
        newAges.push(10);
      }
      setFormData({
        ...formData,
        childrenAges: newAges
      });
    } else if (formData.children < formData.childrenAges.length) {
      // Remove excess child ages
      setFormData({
        ...formData,
        childrenAges: formData.childrenAges.slice(0, formData.children)
      });
    }
    
    setShowChildrenAges(formData.children > 0);
  }, [formData.children]);
  
  // Algemene handler voor niet-numerieke velden
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      // Voor numerieke velden gebruiken we nu handleNumericInputChange
      handleNumericInputChange(e);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Nieuwe handler voor numerieke velden die het wissen van '0' toestaat
  const handleNumericInputChange = (e) => {
    const { name, value } = e.target;
    
    // Sta lege waarde toe (voor het wissen van '0')
    if (value === '') {
      setFormData({
        ...formData,
        [name]: ''
      });
    } else {
      // Anders normaal verwerken als getal
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    }
  };
  
  // Aangepaste handler voor kinderleeftijden
  const handleChildAgeChange = (index, value) => {
    const newAges = [...formData.childrenAges];
    
    // Sta lege waarde toe (voor het wissen van '0')
    if (value === '') {
      newAges[index] = '';
    } else {
      // Anders normaal verwerken als getal
      newAges[index] = parseInt(value, 10) || 0;
    }
    
    setFormData({
      ...formData,
      childrenAges: newAges
    });
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
      
      // Stuur data naar Active Campaign en verstuur e-mail
      const subscribeResponse = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          destination: formData.destination,
          totalBudget: data.budget.totalCost,
          breakdown: data.budget.breakdown,
          seasonalInfo: data.budget.seasonalInfo,
          luxuryLevel: data.budget.luxuryLevel
        }),
      });
      
      if (!subscribeResponse.ok) {
        console.error('Fout bij verzenden naar Active Campaign of versturen van e-mail');
      } else {
        // Toon een melding dat de e-mail is verzonden
        alert('Je reisbudget is berekend en naar je e-mailadres verzonden!');
      }
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/elfin-logo.png" alt="Elfin Logo" height="40" />
        </div>
        <nav className={styles.nav}>
          {/* Navigatie-items indien nodig */}
        </nav>
      </header>
      
      <section className={styles.intro}>
        <h1>Bereken het Budget voor je Droomreis</h1>
        <p>Vul je reisgegevens in en ontdek hoeveel je moet sparen voor je volgende avontuur!</p>
      </section>
      
      {!result ? (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3>Bestemming</h3>
            <div className={styles.formGroup}>
              <label htmlFor="destination">Waar wil je naartoe?</label>
              <input 
                type="text" 
                id="destination" 
                name="destination" 
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="Bijv. Parijs, Italië, Thailand" 
                required 
              />
              <small>Voer een stad, land of regio in</small>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Reisgezelschap</h3>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">Voornaam</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                value={formData.firstName}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Achternaam</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                value={formData.lastName}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="adults">Aantal volwassenen</label>
              <input 
                type="number" 
                id="adults" 
                name="adults" 
                min="1" 
                max="10"
                value={formData.adults}
                onChange={handleNumericInputChange}
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="children">Aantal kinderen (0-17 jaar)</label>
              <input 
                type="number" 
                id="children" 
                name="children" 
                min="0" 
                max="10"
                value={formData.children}
                onChange={handleNumericInputChange}
              />
            </div>
            
            {showChildrenAges && (
              <div className={styles.formGroup}>
                <label>Leeftijden van de kinderen</label>
                <div className={styles.ageInputs}>
                  {formData.childrenAges.map((age, index) => (
                    <input 
                      key={index}
                      type="number" 
                      min="0" 
                      max="17"
                      value={age}
                      onChange={(e) => handleChildAgeChange(index, e.target.value)}
                      placeholder={`Kind ${index + 1}`}
                      required 
                    />
                  ))}
                </div>
                <small>De leeftijd van kinderen beïnvloedt het reisbudget</small>
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
                max="90"
                value={formData.days}
                onChange={handleNumericInputChange}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Vervoersmiddel</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="transport" 
                    value="plane"
                    checked={formData.transport === 'plane'}
                    onChange={handleInputChange}
                  />
                  <span>Vliegtuig</span>
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="transport" 
                    value="train"
                    checked={formData.transport === 'train'}
                    onChange={handleInputChange}
                  />
                  <span>Trein</span>
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="transport" 
                    value="car"
                    checked={formData.transport === 'car'}
                    onChange={handleInputChange}
                  />
                  <span>Auto</span>
                </label>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Luxeniveau</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="luxury" 
                    value="budget"
                    checked={formData.luxury === 'budget'}
                    onChange={handleInputChange}
                  />
                  <span>Budget</span>
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="luxury" 
                    value="standard"
                    checked={formData.luxury === 'standard'}
                    onChange={handleInputChange}
                  />
                  <span>Standaard</span>
                </label>
                <label className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="luxury" 
                    value="luxury"
                    checked={formData.luxury === 'luxury'}
                    onChange={handleInputChange}
                  />
                  <span>Luxe</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h3>Ontvang je reisbudget per e-mail</h3>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mailadres</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
              <small>We sturen je reisbudget naar dit e-mailadres</small>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Berekenen...' : 'Bereken Mijn Reisbudget'}
          </button>
        </form>
      ) : (
        <div className={styles.resultContainer}>
          <h2>Jouw Reisbudget voor {formData.destination}</h2>
          
          <div className={styles.totalBudget}>
            €{result.totalCost}
          </div>
          
          <div className={styles.budgetBreakdown}>
            <div className={styles.budgetItem}>
              <h4>Vervoer</h4>
              <p>€{result.breakdown.transport}</p>
            </div>
            <div className={styles.budgetItem}>
              <h4>Accommodatie</h4>
              <p>€{result.breakdown.accommodation}</p>
            </div>
            <div className={styles.budgetItem}>
              <h4>Eten</h4>
              <p>€{result.breakdown.food}</p>
            </div>
            <div className={styles.budgetItem}>
              <h4>Excursies</h4>
              <p>€{result.breakdown.activities}</p>
            </div>
          </div>
          
          {result.seasonalInfo.isSignificant && (
            <div className={styles.seasonalInfo}>
              <h4>Seizoensinformatie</h4>
              {result.seasonalInfo.currentSeason === 'hoog' ? (
                <p>Je reist in het hoogseizoen. In het laagseizoen ({result.seasonalInfo.lowSeasonMonths}) kunnen de prijzen tot {result.seasonalInfo.lowSeasonDiff}% lager liggen.</p>
              ) : result.seasonalInfo.currentSeason === 'laag' ? (
                <p>Je reist in het laagseizoen. In het hoogseizoen ({result.seasonalInfo.highSeasonMonths}) kunnen de prijzen tot {result.seasonalInfo.highSeasonDiff}% hoger liggen.</p>
              ) : (
                <p>In het hoogseizoen ({result.seasonalInfo.highSeasonMonths}) kunnen de prijzen tot {result.seasonalInfo.highSeasonDiff}% hoger liggen. In het laagseizoen ({result.seasonalInfo.lowSeasonMonths}) kunnen de prijzen tot {result.seasonalInfo.lowSeasonDiff}% lager liggen.</p>
              )}
            </div>
          )}
          
          <div className={styles.luxuryInfo}>
            <h4>Luxeniveau: {result.luxuryLevel.name}</h4>
            <p>{result.luxuryLevel.description}</p>
          </div>
          
          <div className={styles.ctaContainer}>
            <p>We hebben je reisbudget ook naar je e-mailadres gestuurd!</p>
            <a 
              href="https://thisiselfin.com/nl/shop" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Ontdek hoe je kunt sparen voor je reis
            </a>
          </div>
          
          <button 
            onClick={( ) => setResult(null)} 
            className={styles.backButton}
          >
            Terug naar calculator
          </button>
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)} 
            className={styles.closeButton}
          >
            Sluiten
          </button>
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
