import fs from "fs";
import {app, BrowserWindow, ipcMain, WebContentsView} from 'electron';
import * as path from "node:path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow: BrowserWindow;
let webView: WebContentsView;

const createWindow = (): void => {

    mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });
    webView = new WebContentsView({
        webPreferences: {
            preload: (path.join(__dirname, '../../src/selectListener.js'))
        }
    })
    webView.setVisible(false);
    webView.webContents.loadURL('https://google.com')
    webView.setBounds({x: 602, y: 104, width: 400, height: 600})
    mainWindow.contentView.addChildView(webView);

    webView.webContents.setWindowOpenHandler(({ url }) => {
        webView.webContents.loadURL(url);
        return { action: 'deny' };
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

};

app.on('ready', createWindow);

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

ipcMain.on('toggle:web-view', (event, message) => {
    webView.setVisible(true);
    webView.webContents.loadURL(`https://${message}`)
})

ipcMain.on('text:selected', (_, data) => {
    mainWindow.webContents.send('text:selected', data);
})

ipcMain.on('highlight:add-direct', (_, data) => {
    mainWindow.webContents.send('highlight:add-direct', data);
})

ipcMain.on('save:selected', (_, message) => {
    let savedHighlights = [];
    try {
        savedHighlights = JSON.parse(fs.readFileSync(path.join(__dirname, '../../stored/highlights.json'), 'utf8'));
    } catch (error) {
        console.error(error);
    }
    savedHighlights.push(message)
    const jsonData = JSON.stringify(savedHighlights)
    try {
        fs.writeFileSync(path.join(__dirname, '../../stored/highlights.json'), jsonData);
        mainWindow.webContents.send('text:saved');
    } catch (error) {
        console.log(error);
    }
})