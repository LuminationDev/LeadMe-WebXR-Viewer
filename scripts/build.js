import nwbuild from "nw-builder";

nwbuild({
    mode: "build",
    outDir: "./build",
    managedManifest: { name: "leadme-webxr-player", "main": "inline-session.html" }
});