import { redirectPage } from '../lib/redirect';

// Ancienne page « À propos » du site Jekyll.
export function GET() {
  return redirectPage('/');
}
