"use strict";const e=require("electron"),t="liteloader-star-wand",r={configUpdate(n){e.ipcRenderer.send(`${t}:update`,n)}};e.contextBridge.exposeInMainWorld(t,r);
