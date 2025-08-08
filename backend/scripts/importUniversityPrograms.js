// const fs = require('fs');
// const pool = require('../db');

// const universities = JSON.parse(fs.readFileSync('./files/world_universities_and_domains.json'))

// //console.log(universities[0])

// async function importData() {
//     const client = await pool.connect()

//     try {

//         await client.query('BkkkkEGIN')

//         for(const uni of universities){
//             await client.query(
//                 `INSERT INTO universities
//                 (name, domains, web_pages, country, alpha_two_code, state_province)
//                 values($1, $2, $3, $4, $5, $6)`,
//                 [
//                     uni.name,
//                     uni.domains,
//                     uni.web_pages,
//                     uni.country,
//                     uni.alpha_two_code,
//                     uni['state_province']||null
//                 ]
//             )

//             console.log(`Imported: ${uni.name}`)
//         }

//        await client.query('COMMIT')
//         console.log('all universities imported successfully!')
//     } catch (err) {
//         client.query('ROLLBACK')
//         console.log('error importing:'+ err)
//     }
//     finally{
//         client.release()

//         await pool.end()
//     }
// }

// importData()