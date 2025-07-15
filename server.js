const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('modules', path.join(__dirname, 'modules', '*'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

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
            return { name: manifest.name || moduleName, path: `/modules/${moduleName}`, version: manifest.version || '1.0.0' };
        }
        return { name: "Error manifest", path: `/modules/${moduleName}`, version: 'unknown' };
    });

}

app.get('/', (req, res) => {
    res.render('index', { title: "BlackBox Toolkit - Accueil", modules: getModules() });
});


// Route générique pour servir tous les modules
app.get('/modules/:moduleName', (req, res) => {
    const moduleName = req.params.moduleName;
    const modulePath = path.join(__dirname, 'modules', moduleName, 'index.html');

    // Vérifier si le fichier existe
    const fs = require('fs');
    if (fs.existsSync(modulePath)) {
        res.sendFile(modulePath);
    } else {
        res.status(404).send(`Module ${moduleName} non trouvé`);
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`[Express] Running on http://localhost:${PORT}`));
