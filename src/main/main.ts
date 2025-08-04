import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { writeFile, readFile, existsSync } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

function createWindow() {
  const win = new BrowserWindow({
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
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers (we'll add these in step 8)
ipcMain.handle('save-notes', async (event, notes) => {
  try {
    await writeFileAsync('notes.json', JSON.stringify(notes, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Failed to save notes:', error);
    return { success: false, error };
  }
});

ipcMain.handle('load-notes', async () => {
  try {
    if (existsSync('notes.json')) {
      const data = await readFileAsync('notes.json', 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Failed to load notes:', error);
    return [];
  }
});       
//Main process entry point
