const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Modules/modulename/

function getModules() {
    return [
        { name: "Notification Maker", path: "/modules/notifmaker" }
    ];
}

app.get('/', (req, res) => {
    res.render('index', { title: "BlackBox Toolkit - Accueil", modules: getModules() });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`[Express] Running on http://localhost:${PORT}`));
