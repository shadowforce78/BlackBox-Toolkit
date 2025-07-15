const { app, BrowserWindow, Notification } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'public', 'icon.jpg'),
    });

    // Lancer le serveur Express (localhost:3000)
    const server = spawn("node", ["server.js"]);
    server.stdout.on("data", (data) => console.log(`[Server] ${data}`));

    // Attendre un peu avant de charger
    setTimeout(() => {
        win.loadURL("http://localhost:3000");
    }, 1000);
}


app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})