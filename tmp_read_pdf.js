const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('GL58 Sanal Pos İş Yerleri İçin Entegrasyon Güvenliği Kılavuzu.pdf');
pdf(dataBuffer).then(function(data) {
  fs.writeFileSync('tmp_pdf_out.txt', data.text);
}).catch(console.error);
