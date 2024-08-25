let ipcRenderer;
({ipcRenderer} = require('electron'));

document.addEventListener('selectionchange', () => {
    ipcRenderer.send('text:selected', document.getSelection()?.toString())
});