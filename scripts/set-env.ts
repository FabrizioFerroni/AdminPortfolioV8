import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicKeyB64 = process.env.PUBLIC_KEY;

if (!publicKeyB64) {
  console.error('❌ Falta PUBLIC_KEY en las variables de entorno');
  process.exit(1);
}

const validEnvs = ['production', 'development'];
if (!validEnvs.includes(process.env.NODE_ENV ?? '')) {
  console.error(
    `❌ NODE_ENV inválido: "${process.env.NODE_ENV}". Se esperaba uno de: ${validEnvs.join(', ')}`
  );
  process.exit(1);
}

const publicKey = Buffer.from(publicKeyB64, 'base64').toString('utf-8');

const isProduction = process.env.NODE_ENV === 'production';
const targetFile = isProduction
  ? path.join(__dirname, '../src/environments/environment.prod.ts')
  : path.join(__dirname, '../src/environments/environment.dev.ts');

const content = `export const environment = {
  production: ${isProduction},
  pathCert: \`${publicKey}\`,
};
`;

fs.writeFileSync(targetFile, content);
console.log(`✅ ${targetFile} generado`);
