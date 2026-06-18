import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const port = 5173;
const racine = process.cwd();

const typesDeContenu = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

const serveur = createServer(async (requete, reponse) => {
  const cheminDemande = requete.url === '/' ? '/index.html' : requete.url;
  const cheminFichier = join(racine, cheminDemande);

  try {
    const contenu = await readFile(cheminFichier);
    const extension = extname(cheminFichier);

    reponse.writeHead(200, {
      'Content-Type': typesDeContenu[extension] || 'text/plain; charset=utf-8'
    });

    reponse.end(contenu);
  } catch {
    reponse.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8'
    });

    reponse.end('Fichier introuvable.');
  }
});

serveur.listen(port, () => {
  console.log(`Serveur de développement disponible sur http://localhost:${port}`);
});
