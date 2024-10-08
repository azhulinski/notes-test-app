import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron'

export type ContextBridgeApi = {

    openWebView: (channel: string, message: string) => void

    selectedMessage: (chanel: string, listener: (event: IpcRendererEvent, message: string) => void) => void

    saveSelectedNotes(channel: string, message: string[]): void

    highlightSaved(channel: string, listener: (event: IpcRendererEvent, message: string) => void): void

}

const api: ContextBridgeApi = {
    openWebView: (channel, message: string) => {
        ipcRenderer.send(channel, message)
    },

    selectedMessage: (chanel, listener) => {
        ipcRenderer.on(chanel, listener)
    },

    saveSelectedNotes(channel: string, message: string[]) {
        ipcRenderer.send(channel, message)
    },

    highlightSaved(channel: string, listener: (event: IpcRendererEvent, message: string) => void) {
        ipcRenderer.on(channel, listener)
    }
}

contextBridge.exposeInMainWorld("api", api);