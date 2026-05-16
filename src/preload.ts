import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron'

export type Highlight = {
    message: string
    pageTitle: string
    url: string
}

export type ContextBridgeApi = {
    openWebView: (channel: string, message: string) => void

    selectedMessage: (channel: string, listener: (event: IpcRendererEvent, message: Highlight) => void) => void

    saveSelectedNotes: (channel: string, message: Highlight[]) => void

    highlightSaved: (channel: string, listener: (event: IpcRendererEvent) => void) => void
}

const api: ContextBridgeApi = {
    openWebView: (channel, message: string) => {
        ipcRenderer.send(channel, message)
    },

    selectedMessage: (channel, listener) => {
        ipcRenderer.on(channel, listener as any)
    },

    saveSelectedNotes(channel: string, message: Highlight[]) {
        ipcRenderer.send(channel, message)
    },

    highlightSaved(channel: string, listener: (event: IpcRendererEvent) => void) {
        ipcRenderer.on(channel, listener)
    }
}

contextBridge.exposeInMainWorld("api", api);