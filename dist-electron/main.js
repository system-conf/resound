import { app as i, globalShortcut as s, BrowserWindow as d, ipcMain as l, dialog as g } from "electron";
import { fileURLToPath as m } from "node:url";
import n from "node:path";
const p = n.dirname(m(import.meta.url));
process.env.DIST = n.join(p, "../dist");
process.env.VITE_PUBLIC = i.isPackaged ? process.env.DIST : n.join(process.env.DIST, "../public");
let e;
const c = process.env.VITE_DEV_SERVER_URL;
function f() {
  e = new d({
    icon: n.join(process.env.VITE_PUBLIC, "icon-512.png"),
    webPreferences: {
      preload: n.join(p, "preload.mjs"),
      webSecurity: !1
      // Allow loading local files
    },
    width: 1200,
    height: 800,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#f5f5f7",
      symbolColor: "#1d1d1f"
    }
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), c ? e.loadURL(c) : e.loadFile(n.join(process.env.DIST, "index.html"));
}
i.on("window-all-closed", () => {
  process.platform !== "darwin" && i.quit();
});
i.on("will-quit", () => {
  s.unregisterAll();
});
i.on("activate", () => {
  d.getAllWindows().length === 0 && f();
});
l.handle("dialog:openFile", async () => {
  const { canceled: r, filePaths: o } = await g.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Audio", extensions: ["mp3", "wav", "ogg"] }]
  });
  return r ? null : o[0];
});
l.on("register-shortcut", (r, { id: o, shortcut: t }) => {
  if (t)
    try {
      s.register(t, () => {
        e == null || e.webContents.send("play-sound", o);
      }) || console.log("Registration failed for", t);
    } catch (a) {
      console.error(a);
    }
});
l.on("unregister-shortcut", (r, o) => {
  o && s.unregister(o);
});
i.whenReady().then(f);
