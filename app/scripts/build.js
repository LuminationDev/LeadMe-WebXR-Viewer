import nwbuild from "nw-builder";

nwbuild({
    mode: "build",
    outDir: "../build",
    cacheDir: "../cache",
    flavour: "sdk",
    version: "0.82.0",
    managedManifest: { name: "leadme-webxr-viewer", "main": "index.html" }
});