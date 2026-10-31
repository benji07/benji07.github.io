// Page de redirection pour les anciennes URL du site Jekyll.
// GitHub Pages ne gère pas les redirections serveur : on sert une page HTML
// avec meta refresh + lien canonique, que les moteurs traitent comme un 301.
export function redirectPage(to: string): Response {
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Redirection</title>
<meta http-equiv="refresh" content="0; url=${to}">
<link rel="canonical" href="https://benjamin.leveque.me${to}">
<meta name="robots" content="noindex">
</head>
<body><p>Cette page a déménagé : <a href="${to}">${to}</a>.</p></body>
</html>
`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
