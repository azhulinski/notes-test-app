let ipcRenderer;
({ipcRenderer} = require('electron'));

const createPopup = (selectedText) => {
    const existingPopup = document.getElementById('highlight-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 'highlight-popup';
    popup.style.cssText = `
        position: absolute;
        background: white;
        border: 2px solid #333;
        border-radius: 4px;
        padding: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 4px;
        right: 6px;
        background: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
    `;
    closeBtn.onclick = () => {
        popup.remove();
    };

    const textPreview = document.createElement('div');
    textPreview.style.cssText = `
        max-height: 60px;
        overflow-y: auto;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ddd;
        color: #333;
    `;
    textPreview.textContent = selectedText;

    const button = document.createElement('button');
    button.textContent = 'Save highlight';
    button.style.cssText = `
        width: 100%;
        padding: 8px;
        background: #f0f0f0;
        border: 1px solid #999;
        border-radius: 2px;
        cursor: pointer;
        font-size: 14px;
    `;
    button.onclick = () => {
        ipcRenderer.send('highlight:add-direct', {
            message: selectedText,
            pageTitle: document.title,
            url: window.location.href
        });
        popup.remove();
    };

    popup.appendChild(closeBtn);
    popup.appendChild(textPreview);
    popup.appendChild(button);
    document.body.appendChild(popup);

    try {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            let left = rect.left + window.scrollX;
            const maxLeft = window.scrollX + document.documentElement.clientWidth - 320; // popup width + margin
            if (left > maxLeft) left = maxLeft;
            if (left < window.scrollX + 8) left = window.scrollX + 8;
            popup.style.left = left + 'px';
            popup.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        } else {
            popup.style.left = (window.scrollX + 20) + 'px';
            popup.style.top = (window.scrollY + 20) + 'px';
        }
    } catch (e) {
        popup.style.left = (window.scrollX + 20) + 'px';
        popup.style.top = (window.scrollY + 20) + 'px';
    }

    return popup;
};

const showPopupForSelection = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim().length > 0) {
        createPopup(selectedText);
    }
};

document.addEventListener('mouseup', () => {
    setTimeout(() => showPopupForSelection(), 0);
});

document.addEventListener('mousedown', (e) => {
    const popup = document.getElementById('highlight-popup');
    if (popup && !e.target.closest('#highlight-popup')) {
        popup.remove();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const popup = document.getElementById('highlight-popup');
        if (popup) popup.remove();
    }
});