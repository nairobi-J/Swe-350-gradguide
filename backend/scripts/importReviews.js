const pool = require('../db');

const fs = require('fs');


async function importCsvToPostgres(filePath) {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL database.');

    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({
        mapHeaders: ({ header }) => {
         
          if (header === 'current') return 'current_status';
          return header;
        }
      }))
      .on('data', (data) => records.push(data))
      .on('end', async () => {
        console.log(`Finished parsing CSV. Found ${records.length} records.`);
        if (records.length === 0) {
          console.log('No records to insert.');
          client.release();
          return;
        }

        let insertedCount = 0;
        for (const record of records) {
          try {
            const queryText = `
              INSERT INTO reviews (
                firm, date_review, job_title, current_status, location, overall_rating,
                work_life_balance, culture_values, diversity_inclusion, career_opp,
                comp_benefits, senior_mgmt, recommend, ceo_approv, outlook, headline,
                pros, cons
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
              ON CONFLICT DO NOTHING; -- Prevents inserting duplicate rows if run multiple times
            `;

            const values = [
              record.firm || null,
              record.date_review ? new Date(record.date_review) : null,
              record.job_title || null,
              record.current_status || null, // Use current_status
              record.location || null,
              record.overall_rating ? parseInt(record.overall_rating) : null,
              record.work_life_balance ? parseFloat(record.work_life_balance) : null,
              record.culture_values ? parseFloat(record.culture_values) : null,
              record.diversity_inclusion ? parseFloat(record.diversity_inclusion) : null, // Can be null
              record.career_opp ? parseFloat(record.career_opp) : null,
              record.comp_benefits ? parseFloat(record.comp_benefits) : null,
              record.senior_mgmt ? parseFloat(record.senior_mgmt) : null,
              record.recommend || null,
              record.ceo_approv || null,
              record.outlook || null,
              record.headline || null,
              record.pros || null,
              record.cons || null,
            ];
            await client.query(queryText, values);
            insertedCount++;
          } catch (insertError) {
            console.error('Error inserting record:', record, insertError.message);
          }
        }
        console.log(`Successfully inserted ${insertedCount} records.`);
        client.release(); 
      });
  } catch (err) {
    console.error('Database connection or import error:', err.message);
    if (client) client.release();
  }
}


importCsvToPostgres('.files/reviews.csv');