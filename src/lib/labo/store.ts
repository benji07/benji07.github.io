// Mémorise les réglages des outils dans le navigateur. Le stockage peut être
// indisponible (navigation privée, données bloquées) : les outils
// fonctionnent alors sans, avec leurs valeurs par défaut.

const PREFIX = 'labo:';

export function load<T extends object>(key: string): Partial<T> | undefined {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as Partial<T>) : undefined;
  } catch {
    return undefined;
  }
}

export function save<T extends object>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Stockage plein ou bloqué : tant pis, rien n'est mémorisé.
  }
}
