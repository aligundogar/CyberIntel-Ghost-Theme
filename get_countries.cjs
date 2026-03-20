const https = require('https');

https.get('https://restcountries.com/v3.1/all?fields=name,latlng,cca2', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      let out = "const countryCoords = {\n";
      parsed.forEach(c => {
          let name = c.name.common.toLowerCase().replace(/[^a-z0-9]/g, '');
          if(name && c.latlng && c.latlng.length === 2 && c.cca2) {
              out += `    '${name}': {lat: ${c.latlng[0]}, lng: ${c.latlng[1]}},\n`;
              out += `    '${c.cca2.toLowerCase()}': {lat: ${c.latlng[0]}, lng: ${c.latlng[1]}},\n`;
          }
      });
      // Add custom aliases for common news
      out += `    'usa': {lat: 37.0902, lng: -95.7129},\n`;
      out += `    'uk': {lat: 55.3781, lng: -3.4360},\n`;
      out += `    'uae': {lat: 23.4241, lng: 53.8478},\n`;
      out += "};";
      console.log(out);
    } catch(e) {
      console.log("Error parsing JSON");
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
