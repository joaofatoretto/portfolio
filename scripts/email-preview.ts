/* Writes static previews of the lead confirmation email to docs/lead-email/ (run: npm run emails). Nothing is sent.
   Node 24 runs this TypeScript directly, so imports carry the .ts extension. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { receiptEmail, type EmailLocale } from '../src/lib/email.ts';

const out = new URL('../docs/lead-email/', import.meta.url);
mkdirSync(out, { recursive: true });
const write = (name: string, html: string) => writeFileSync(new URL(name, out), html);

const sample = { name: 'Tom Baker', message: 'I run a small bakery and need a site where people can order cakes online.\nRight now it all happens over messages.' };
for (const l of ['en', 'pt'] as EmailLocale[]) {
  write(`receipt.${l}.html`, receiptEmail(sample, l).html);
  write(`receipt.${l}.no-message.html`, receiptEmail({ ...sample, message: '' }, l).html);
}
console.log('Wrote 4 files to docs/lead-email/');
