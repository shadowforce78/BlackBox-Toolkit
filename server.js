const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

// Système de logging pour l'injection
const logPath = path.join(__dirname, 'injection.log');

function logInjection(moduleName, userAgent) {
    const logEntry = `[${new Date().toISOString()}] Module: ${moduleName} | User-Agent: ${userAgent}\n`;
    fs.appendFileSync(logPath, logEntry);
    console.log(`[INJECTION] Module ${moduleName} chargé`);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('modules', path.join(__dirname, 'modules', '*'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/modules', express.static(path.join(__dirname, 'modules'))); // Commenté pour permettre l'injection

function getModules() {
    // Get folders in the modules directory, each folder represents a module
    const modulesDir = path.join(__dirname, 'modules');
    const modules = fs.readdirSync(modulesDir, { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dir.name);
    // Read manifest for each module to get its name and path
    return modules.map(moduleName => {
        const manifestPath = path.join(modulesDir, moduleName, 'manifest.json');
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            return { name: manifest.name || moduleName, path: `/modules/${moduleName}`, version: manifest.version || '1.0.0', description: manifest.description || 'No description available' };
        }
        return { name: "Error manifest", path: `/modules/${moduleName}`, version: 'unknown', description: 'No manifest found' };
    });

}

app.get('/', (req, res) => {
    res.render('index', { title: "BlackBox Toolkit - Accueil", modules: getModules() });
});


// Fonction d'injection pour modifier le contenu HTML
function injectContent(htmlContent, moduleName) {
    const injectionComment = `
<!-- BlackBox Toolkit - Module: ${moduleName} -->
<!-- Chargé le: ${new Date().toISOString()} -->
<!-- Système d'injection actif -->`;

    // Script d'injection pour ajouter des fonctionnalités
    const injectionScript = `
<script>
    // BlackBox Toolkit - Injection automatique
    console.log('BlackBox Toolkit - Module ${moduleName} chargé');
    console.log('Timestamp: ${new Date().toISOString()}');
    
    // Ajouter un bouton de retour automatique
    window.addEventListener('DOMContentLoaded', function() {
        const backButton = document.createElement('div');
        backButton.innerHTML = '<a href="/" style="position: fixed; top: 10px; left: 10px; background: #0f0; color: #111; padding: 10px; text-decoration: none; border-radius: 5px; font-family: monospace; font-weight: bold; z-index: 9999;">← Retour</a>';
        document.body.appendChild(backButton);
        
        // Ajouter des informations de débogage
        const debugInfo = document.createElement('div');
        debugInfo.innerHTML = 'Module: ${moduleName} | Chargé: ${new Date().toLocaleString()}';
        debugInfo.style.cssText = 'position: fixed; bottom: 10px; right: 10px; background: rgba(0,255,0,0.8); color: #111; padding: 5px; font-size: 12px; font-family: monospace; border-radius: 3px; z-index: 9999;';
        document.body.appendChild(debugInfo);
    });
</script>`;

    // Ajouter le commentaire et le script juste avant la balise </body>
    const injectedContent = htmlContent.replace(
        /<\/body>/i,
        `${injectionComment}\n${injectionScript}\n</body>`
    );

    return injectedContent;
}

// Route générique pour servir tous les modules avec injection
app.get('/modules/:moduleName', (req, res) => {
    const moduleName = req.params.moduleName;
    const modulePath = path.join(__dirname, 'modules', moduleName, 'index.html');

    // Vérifier si le fichier existe
    if (fs.existsSync(modulePath)) {
        // Lire le fichier HTML
        fs.readFile(modulePath, 'utf8', (err, htmlContent) => {
            if (err) {
                res.status(500).send(`Erreur lors de la lecture du module ${moduleName}`);
                return;
            }

            // Injecter le contenu
            const injectedContent = injectContent(htmlContent, moduleName);

            // Log de l'injection
            logInjection(moduleName, req.headers['user-agent']);

            // Envoyer le contenu modifié
            res.send(injectedContent);
        });
    } else {
        res.status(404).send(`Module ${moduleName} non trouvé`);
    }
});

// Route pour servir les ressources statiques des modules (CSS, JS, images)
app.get('/modules/:moduleName/:resource', (req, res) => {
    const moduleName = req.params.moduleName;
    const resource = req.params.resource;
    const resourcePath = path.join(__dirname, 'modules', moduleName, resource);

    if (fs.existsSync(resourcePath)) {
        res.sendFile(resourcePath);
    } else {
        res.status(404).send(`Resource ${resource} non trouvée dans le module ${moduleName}`);
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`[Express] Running on http://localhost:${PORT}`));
