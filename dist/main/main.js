"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const readFileAsync = (0, util_1.promisify)(fs_1.readFile);
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    // In development, load from Vite dev server
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173'); // Change to match Vite's actual port
    }
    else {
        win.loadFile(path.join(__dirname, '../renderer/index.html'));
    }
}
// App event handlers
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// IPC handlers (we'll add these in step 8)
electron_1.ipcMain.handle('save-notes', async (event, notes) => {
    try {
        await writeFileAsync('notes.json', JSON.stringify(notes, null, 2));
        return { success: true };
    }
    catch (error) {
        console.error('Failed to save notes:', error);
        return { success: false, error };
    }
});
electron_1.ipcMain.handle('load-notes', async () => {
    try {
        if ((0, fs_1.existsSync)('notes.json')) {
            const data = await readFileAsync('notes.json', 'utf-8');
            return JSON.parse(data);
        }
        return [];
    }
    catch (error) {
        console.error('Failed to load notes:', error);
        return [];
    }
});
//Main process entry point
