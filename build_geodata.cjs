const https = require('https');
const fs = require('fs');

async function downloadJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'CyberIntel-Theme' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch(e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function buildGeodata() {
    console.log("[*] Fetching Global Countries & Capitals...");
    let db = {};
    
    try {
        const countries = await downloadJSON('https://restcountries.com/v3.1/all?fields=name,latlng,cca2,cca3,capital,capitalInfo');
        countries.forEach(c => {
            // Country Names (Common and Official)
            if (c.latlng && c.latlng.length === 2) {
                if(c.name.common) db[c.name.common.toLowerCase().replace(/[^a-z0-9]/g, '')] = { lat: c.latlng[0], lng: c.latlng[1] };
                if(c.cca2) db[c.cca2.toLowerCase()] = { lat: c.latlng[0], lng: c.latlng[1] };
                if(c.cca3) db[c.cca3.toLowerCase()] = { lat: c.latlng[0], lng: c.latlng[1] };
            }
            // Capitals
            if (c.capital && c.capitalInfo && c.capitalInfo.latlng) {
                c.capital.forEach(cap => {
                    db[cap.toLowerCase().replace(/[^a-z0-9]/g, '')] = { lat: c.capitalInfo.latlng[0], lng: c.capitalInfo.latlng[1] };
                });
            }
        });
        
        console.log(`[+] Loaded ${Object.keys(db).length} Country & Capital combinations.`);
        
        // Manual Critical Hotspots (OSINT targets usually requested)
        const hotspots = {
            'usa': {lat: 37.0902, lng: -95.7129},
            'uk': {lat: 55.3781, lng: -3.4360},
            'uae': {lat: 23.4241, lng: 53.8478},
            'tehran': {lat: 35.6892, lng: 51.3890},
            'moscow': {lat: 55.7558, lng: 37.6173},
            'kyiv': {lat: 50.4501, lng: 30.5234},
            'istanbul': {lat: 41.0082, lng: 28.9784},
            'ankara': {lat: 39.9334, lng: 32.8597},
            'izmir': {lat: 38.4192, lng: 27.1287},
            'washington': {lat: 38.9072, lng: -77.0369},
            'london': {lat: 51.5074, lng: -0.1278},
            'paris': {lat: 48.8566, lng: 2.3522},
            'telaviv': {lat: 32.0853, lng: 34.7818},
            'jerusalem': {lat: 31.7683, lng: 35.2137},
            'gaza': {lat: 31.5, lng: 34.4666},
            'beirut': {lat: 33.8938, lng: 35.5018},
            'damascus': {lat: 33.5138, lng: 36.2765},
            'baghdad': {lat: 33.3152, lng: 44.3661},
            'sanaa': {lat: 15.3694, lng: 44.1910},
            'kabul': {lat: 34.5553, lng: 69.2075},
            'taipei': {lat: 25.0329, lng: 121.5654},
            'beijing': {lat: 39.9042, lng: 116.4073},
            'seoul': {lat: 37.5665, lng: 126.9780},
            'pyongyang': {lat: 39.0392, lng: 125.7625}
        };

        Object.assign(db, hotspots);

        // Fetch World Cities DB (Top ~40k cities JSON from datahub)
        console.log("[*] Downloading major World Cities database...");
        try {
            const cities = await downloadJSON('https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json');
            let added = 0;
            cities.forEach(city => {
                let cname = city.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                // Basic filtering logic (avoid overwriting countries)
                if (cname && !db[cname]) {
                    db[cname] = { lat: parseFloat(city.lat), lng: parseFloat(city.lng) };
                    added++;
                }
            });
            console.log(`[+] Added ${added} cities database. Total Geotags: ${Object.keys(db).length}`);
        } catch (e) {
            console.warn("[-] Could not fetch extra cities DB, falling back to basic DB & hotspots. " + e.message);
        }

        const outFile = './assets/js/geodata.js';
        const fileContent = `window.GHOST_GEO_DICT = ${JSON.stringify(db)};`;
        fs.writeFileSync(outFile, fileContent);
        
        console.log(`[!] Generated ${outFile} successfully!`);
    } catch (err) {
        console.error("Fatal Error:", err);
    }
}

buildGeodata();
