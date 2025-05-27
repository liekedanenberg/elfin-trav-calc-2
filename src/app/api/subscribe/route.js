import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received data:', JSON.stringify(data));
    
    // Active Campaign API configuratie
    const AC_API_URL = process.env.AC_API_URL; // bijv. 'https://youraccountname.api-us1.com/api/3'
    const AC_API_KEY = process.env.AC_API_KEY;
    
    console.log('Starting Active Campaign integration' );
    let contactId = null; // Definieer contactId hier zodat het in de hele functie beschikbaar is
    
    try {
      // Bereid contact data voor
      const contactData = {
        contact: {
          email: data.email,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
        },
        fieldValues: [
          {
            field: "Bestemming", // Gebruik de exacte naam van het veld zoals in Active Campaign
            value: data.destination
          },
          {
            field: "Totaal Budget",
            value: data.totalBudget.toString()
          },
          {
            field: "Transport Kosten",
            value: data.breakdown.transport.toString()
          },
          {
            field: "Accommodatie Kosten",
            value: data.breakdown.accommodation.toString()
          },
          {
            field: "Eten Kosten",
            value: data.breakdown.food.toString()
          },
          {
            field: "Excursies Kosten",
            value: data.breakdown.activities.toString()
          }
        ]
      };
      
      console.log('Sending data to Active Campaign');
      // Stuur data naar Active Campaign
      const acResponse = await fetch(`${AC_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': AC_API_KEY
        },
        body: JSON.stringify(contactData)
      });
      
      // Log de volledige respons voor debugging
      const acResponseText = await acResponse.text();
      console.log('Active Campaign API Response:', acResponseText);
      
      // Probeer de JSON te parsen als het een geldige JSON is
      try {
        const acData = JSON.parse(acResponseText);
        console.log('Parsed AC Data:', JSON.stringify(acData));
        
        // Haal contactId op uit de response
        contactId = acData.contact?.id;
        console.log('Contact ID:', contactId);
        
        // Voeg contact toe aan de 'Prospects' lijst
        if (contactId) {
          console.log('Adding contact to Prospects list');
          const listId = 1; // Dit is correct, het lijst-ID van 'Prospects' is 1
          
          const listData = {
            contactList: {
              list: listId,
              contact: contactId,
              status: 1 // 1 = geabonneerd
            }
          };
          
          const listResponse = await fetch(`${AC_API_URL}/contactLists`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Api-Token': AC_API_KEY
            },
            body: JSON.stringify(listData)
          });
          
          const listResponseText = await listResponse.text();
          console.log('List API Response:', listResponseText);
        }
      } catch (parseError) {
        console.error('Error parsing Active Campaign response:', parseError);
        // Ga door met e-mail versturen, zelfs als er een fout is bij het parsen
      }
    } catch (acError) {
      console.error('Active Campaign error:', acError);
      // Ga door met e-mail versturen, zelfs als er een fout is bij Active Campaign
    }
    
    console.log('Starting email sending process');
    // Configureer e-mail transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Log de e-mailconfiguratie (zonder wachtwoord)
    console.log('Email configuration:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM
    });
    
    // Formateer valuta
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('nl-NL', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    // Bereid seizoensinformatie voor
    let seasonalText = '';
    if (data.seasonalInfo.isSignificant) {
      if (data.seasonalInfo.currentSeason === 'hoog') {
        seasonalText = `Je reist in het hoogseizoen. In het laagseizoen (${data.seasonalInfo.lowSeasonMonths}) kunnen de prijzen tot ${data.seasonalInfo.lowSeasonDiff}% lager liggen.`;
      } else if (data.seasonalInfo.currentSeason === 'laag') {
        seasonalText = `Je reist in het laagseizoen. In het hoogseizoen (${data.seasonalInfo.highSeasonMonths}) kunnen de prijzen tot ${data.seasonalInfo.highSeasonDiff}% hoger liggen.`;
      } else {
        seasonalText = `In het hoogseizoen (${data.seasonalInfo.highSeasonMonths}) kunnen de prijzen tot ${data.seasonalInfo.highSeasonDiff}% hoger liggen. In het laagseizoen (${data.seasonalInfo.lowSeasonMonths}) kunnen de prijzen tot ${data.seasonalInfo.lowSeasonDiff}% lager liggen.`;
      }
    }
    
    // Maak e-mail inhoud
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: rgb(210, 111, 28); padding: 20px; text-align: center; color: white;">
          <h1>Jouw Reisbudget van Elfin</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f7f4;">
          <h2>Hallo!</h2>
          <p>Bedankt voor het gebruiken van de Elfin reisbudget-calculator. Hier is een overzicht van je geschatte reisbudget:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Reisbudget voor ${data.destination}</h3>
            <h2 style="color: rgb(210, 111, 28); text-align: center; font-size: 28px;">${formatCurrency(data.totalBudget)}</h2>
            
            <h4>Uitsplitsing:</h4>
            <ul>
              <li><strong>Vervoer:</strong> ${formatCurrency(data.breakdown.transport)}</li>
              <li><strong>Accommodatie:</strong> ${formatCurrency(data.breakdown.accommodation)}</li>
              <li><strong>Eten:</strong> ${formatCurrency(data.breakdown.food)}</li>
              <li><strong>Excursies:</strong> ${formatCurrency(data.breakdown.activities)}</li>
            </ul>
            
            ${seasonalText ? `<p style="background-color: #fff3e0; padding: 10px; border-left: 4px solid rgb(210, 111, 28);">${seasonalText}</p>` : ''}
            
            <p style="margin-top: 20px;">Luxeniveau: <strong>${data.luxuryLevel.name}</strong></p>
            <p>${data.luxuryLevel.description}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://thisiselfin.com/nl/shop" style="background-color: rgb(210, 111, 28  ); color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ontdek hoe je kunt sparen voor je reis</a>
          </div>
          
          <p>Heb je vragen over je reisbudget of wil je meer weten over hoe je financieel onafhankelijk kunt worden? Bezoek <a href="https://thisiselfin.com" style="color: rgb(210, 111, 28  );">thisiselfin.com</a>.</p>
        </div>
        
        <div style="background-color: rgb(210, 111, 28); padding: 15px; text-align: center; color: white; font-size: 12px;">
          <p>© 2025 Elfin - Het grootste financiële platform voor vrouwen in Nederland en België</p>
          <p>Op missie om 1 miljoen vrouwen te helpen financieel onafhankelijk te worden</p>
        </div>
      </div>
    `;
    
    // Verstuur e-mail
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: 'Jouw Reisbudget van Elfin',
      html: emailHtml
    };
    
    console.log('Sending email to:', data.email);
    const emailResult = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', emailResult.messageId);
    
    return NextResponse.json({ success: true, emailSent: true, contactId: contactId });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwerken van je aanvraag', details: error.message },
      { status: 500 }
    );
  }
}
