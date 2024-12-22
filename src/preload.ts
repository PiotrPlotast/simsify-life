import { contextBridge, ipcRenderer } from "electron";

interface IpcRenderer {
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
  send: (channel: string, ...args: unknown[]) => void;
  on: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
  ) => IpcRenderer;
}

interface ElectronAPI {
  ipcRenderer: IpcRenderer;
}

contextBridge.exposeInMainWorld("Electron", {
  ipcRenderer: {
    invoke: (channel: string, ...args: unknown[]): Promise<unknown> =>
      ipcRenderer.invoke(channel, ...args),
    send: (channel: string, ...args: unknown[]): void =>
      ipcRenderer.send(channel, ...args),
    on: (
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
    ): IpcRenderer => ipcRenderer.on(channel, listener),
  },
} as ElectronAPI);
