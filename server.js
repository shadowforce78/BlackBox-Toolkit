const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('modules', path.join(__dirname, 'modules', '*'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

function getModules() {
    return [
        { name: "Notification Maker", path: "/modules/notifmaker" }
    ];
}

app.get('/', (req, res) => {
    res.render('index', { title: "BlackBox Toolkit - Accueil", modules: getModules() });
});

// app.get('/modules/notifmaker', (req, res) => {
//     res.sendFile(path.join(__dirname, 'modules', 'notifmaker', 'index.html'));
// });

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
