"use strict";const e=require("electron"),t="liteloader-napcatcore-template",c={configUpdate(n){e.ipcRenderer.send(`${t}:update`,n)}};e.contextBridge.exposeInMainWorld(t,c);
