const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const mime = {'.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png', '.ico':'image/x-icon', '.json':'application/json'};
http.createServer((req,res) => {
 let pathname; try {pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400);return res.end();}
 let file = path.resolve(root, '.'+pathname);
 if (file !== root && !file.startsWith(root+path.sep)) {res.writeHead(403);return res.end();}
 if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root,'index.html');
 res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
 fs.createReadStream(file).on('error',()=>{res.statusCode=500;res.end();}).pipe(res);
}).listen(8080,'0.0.0.0',()=>console.log('Aplicativo disponível em http://localhost:8080 — abra a porta 8080 no Codespaces.'));
