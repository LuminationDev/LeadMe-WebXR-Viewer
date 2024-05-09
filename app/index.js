// process command line args
var app = null
var code = null
const args = nw.App.argv
for (var i = 0; i < args.length; i++) {
    if (args[i] === "-app" && args.length >= i) {
        app = args[i + 1]
    }
    if (args[i] === "-code" && args.length >= i) {
        code = args[i + 1]
    }
}

const logo = document.getElementById("logo")

if (app === 'cospaces') {
    logo.src = "assets/cospaces_logo.svg"
    // initialise cospaces
} else if (app === 'thinglink') {
    logo.src = "assets/thinglink_logo.png"
} else {
    document.getElementById("loading-text").innerText = "Experience type is not supported."
}

var text = document.getElementById("loading-text")

function updateLoadingText () {
    if (text.innerText.startsWith("Connecting to headset")) {
        if (text.innerText.endsWith("...")) {
            window.location.reload()
        } else {
            text.innerText += "."
        }
        setTimeout(updateLoadingText, 700)
    }
}
updateLoadingText()

function initXR() {
    if (navigator.xr) {
        connectXR()
    } else {
        document.getElementById("loading-text").innerText = "XR is not supported"
    }
}

function connectXR() {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
            document.getElementById("loading-text").innerText = "Connected. Launching your experience!"
            launchLegacyMirror()
            setTimeout(() => {
                if (app && code) {
                    if (app === 'cospaces') {
                        window.open("https://edu.cospaces.io/" + code, "_self")
                    } else if (app === 'thinglink') {
                        window.open("https://www.thinglink.com/vr/" + code, "_self")
                    }
                } else {
                    document.getElementById("loading-text").innerText = "Launch code not provided"
                    setTimeout(() => {
                        closeLegacyMirror()
                        nw.App.closeAllWindows()
                        nw.App.quit()
                    }, 5000)
                }
            }, 2000)
        }
    });
}

function closeLegacyMirror() {
    var alreadyOpen = false;
    var spawn = require("child_process").spawn,child;
    child = spawn("powershell.exe",["Get-Process | Where {$_.MainWindowTitle -eq \"Legacy Mirror\"}"]);
    child.stdout.on("data",function(data){
        if (data) {
            alreadyOpen = true
            return;
        }
        return;
    });
    child.stderr.on("data",function(data){
    });
    child.on("exit",function(){
        if (!alreadyOpen) {
            return;
        }
        var spawn2 = require("child_process").spawn,child2;
        child2 = spawn2("powershell.exe",["Start-Process \"vrmonitor://debugcommands/legacy_mirror_view_toggle\""]);
        child2.stdout.on("data",function(data){
        });
        child2.stderr.on("data",function(data){
        });
        child2.on("exit",function(){
        });
        child2.stdin.end();
    });
    child.stdin.end();
}

function launchLegacyMirror() {
    var alreadyOpen = false;
    var spawn = require("child_process").spawn,child;
    child = spawn("powershell.exe",["Get-Process | Where {$_.MainWindowTitle -eq \"Legacy Mirror\"}"]);
    child.stdout.on("data",function(data){
        if (data) {
            alreadyOpen = true
            return;
        }
        return;
    });
    child.stderr.on("data",function(data){
    });
    child.on("exit",function(){
        if (alreadyOpen) {
            return;
        }
        var spawn2 = require("child_process").spawn,child2;
        child2 = spawn2("powershell.exe",["Start-Process \"vrmonitor://debugcommands/legacy_mirror_view_toggle\""]);
        child2.stdout.on("data",function(data){
        });
        child2.stderr.on("data",function(data){
        });
        child2.on("exit",function(){
        });
        child2.stdin.end();
    });
    child.stdin.end();
}

initXR();