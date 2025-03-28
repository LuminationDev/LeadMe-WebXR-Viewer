var robot = require('robotjs')
const fs = require('fs')
const Sentry = require("@sentry/node");
Sentry.init({
    dsn: "https://14a93fe946924c759f2b63361110fae0@o1294571.ingest.sentry.io/4506713471516672",
});

const LeadMeLabsPlugin = require('@luminationdev/leadmelabs-plugin-javascript')

const leadMeLabsConnection = new LeadMeLabsPlugin.LeadMeLabsConnection();
async function shutdownApp(reason) {
    await closeLegacyMirror()
    try {
        leadMeLabsConnection.send("appClosed," + reason)
        leadMeLabsConnection.disconnect()
    } catch (e) {
        Sentry.captureException(e)
    }
    setTimeout(async () => {
        nw.App.closeAllWindows()
        nw.App.quit()
    }, 1000)
}
leadMeLabsConnection.setShutdownCallback(() => { shutdownApp("") })
try {
    leadMeLabsConnection.connect()
} catch (e) {
    Sentry.captureException(e)
}

function enableVrInPreferences(recursive = true) {
    if (!fs.existsSync(process.env.LOCALAPPDATA + "\\leadme-webxr-viewer\\User Data\\Default\\Preferences")) {
        if (recursive) {
            setTimeout(() => { enableVrInPreferences(false) }, 10000) // on first init, need to wait for file creation
        }
        return
    }
    var jsonString = fs.readFileSync(process.env.LOCALAPPDATA + "\\leadme-webxr-viewer\\User Data\\Default\\Preferences")
    var parsedJson = JSON.parse(jsonString)
    if (
        parsedJson &&
        parsedJson.profile &&
        parsedJson.profile.content_settings &&
        parsedJson.profile.content_settings.exceptions
    ) {
        parsedJson.profile.content_settings.exceptions.vr = {
            "https://edu.cospaces.io:443,*": {
                "last_modified": "17125548413807062",
                "last_visit": "17125548410000000",
                "setting": 1
            },
            "https://immersive-web.github.io:443,*": {
                "last_modified": "17125548410180728",
                "last_visit": "17125548410000000",
                "setting": 1
            },
            "https://www.thinglink.com:443,*": {
                "last_modified": "17125548413705202",
                "last_visit": "17125548410000000",
                "setting": 1
            }
        }
        fs.writeFileSync(
            process.env.LOCALAPPDATA + "\\leadme-webxr-viewer\\User Data\\Default\\Preferences",
            JSON.stringify(parsedJson)
        )
    } else {
        if (recursive) {
            setTimeout(() => { enableVrInPreferences(false) }, 10000) // on first init, need to wait for file creation
        }
    }
}
try {
    enableVrInPreferences()
} catch (e) {
    Sentry.captureException(e)
}

function getCoordinatesOfElement(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
    };
}

async function automationLoop() {
    let win = nw.Window.get()
    if (win) {
        switch (win.window.location.hostname) {
            case "www.thinglink.com":
                win.setAlwaysOnTop(true)
                startThinglink()
                return;
            case "edu.cospaces.io":
                win.setAlwaysOnTop(true)
                startCospaces()
                return;
            default:
                break;
        }
    }
    setTimeout(automationLoop, 2000)
}

function clickOnElement(element) {
    let win = nw.Window.get()
    const coordinates = getCoordinatesOfElement(element)
    const xOffset = win.width - win.window.innerWidth
    const yOffset = win.height - win.window.innerHeight

    robot.moveMouse(coordinates.x + win.x + xOffset, coordinates.y + win.y + yOffset)
    robot.mouseClick()
}

function startThinglink() {
    let win = nw.Window.get()
    win.window.document.getElementsByTagName("html")[0].style.cursor = "none"
    thinglinkLoop()
}

async function thinglinkLoop() {
    let win = nw.Window.get()
    const xOffset = win.x
    const yOffset = win.y

    var el = win.window.document.getElementById("startBtn")
    if (el) {
        clickOnElement(el)
    }

    var errorCode = win.window.document.getElementsByClassName("has-error")
    if (errorCode.length > 0) {
        // invalid share code
        setTimeout(async () => {
            shutdownApp("invalid share code")
        }, 5000)
        return
    }

    var els = win.window.document.getElementsByClassName("first-continue btn")
    if (els.length >= 1 && els[0].getAttribute("style").indexOf("display") === -1) {
        clickOnElement(els[0])

        // accept the vr permission
        setTimeout(() => {
            robot.moveMouse(xOffset + 230, yOffset + 120)
            robot.mouseToggle("down")
        },1000)
        setTimeout(() => {
            robot.mouseToggle("up")
        }, 1200)
        setTimeout(() => {
            maximizeLegacyMirror()
            win.setAlwaysOnTop(false)
            win.minimize()
            win.window.document.getElementsByTagName("html")[0].style.cursor = ""
        }, 2500)
        win.on('close', async () => {
            nw.Window.get().hide()
            shutdownApp("user closed")
        })
        return
    }
    setTimeout(thinglinkLoop, 2000)
}

var clickedFirstCospacesButton = false;
var clickedSecondCospacesButton = false;
var clickedThirdCospacesButton = false;
var loopFlip = false;

function startCospaces() {
    let win = nw.Window.get()
    win.window.document.getElementsByTagName("html")[0].style.cursor = "none"
    setTimeout(() => {
        cospacesLoop()
    }, 1000)
}

var cospacesSecondButtonLoopCount = 0
var cospacesFirstButtonLoopCount = 0
async function cospacesLoop() {
    let win = nw.Window.get()
    const xOffset = win.x
    const yOffset = win.y
    loopFlip = !loopFlip

    if (!clickedFirstCospacesButton) {
        cospacesFirstButtonLoopCount++
        if (win.window.innerWidth >= 792) {
            robot.moveMouse((108 + ((win.window.innerWidth - 792)/2) + 16) + xOffset + (loopFlip ? 1 : 0), (win.window.innerHeight * 0.6) + 52 + yOffset)
        } else {
            robot.moveMouse(32 + xOffset + (loopFlip ? 1 : 0), (win.window.innerHeight * 0.6) + 52 + yOffset)
        }
        //the canvas adds a cursor pointer element when hovering over a button
        var canvases = win.window.document.getElementsByTagName("canvas")
        if (canvases.length > 0) {
            var canvas = canvases[0]
            if (canvas.style.cursor === "pointer") {
                robot.mouseClick()
                clickedFirstCospacesButton = true
            } else if (cospacesFirstButtonLoopCount > 40) { // need a bit of time to load
                // the play button can't be found, it's probably an invalid share code
                shutdownApp("invalid share code")
            }
        }
        setTimeout(cospacesLoop, 1000)
        return;
    }
    if (!clickedSecondCospacesButton) {
        cospacesSecondButtonLoopCount++
        robot.moveMouse(xOffset + win.window.innerWidth - 16, yOffset + win.window.innerHeight - 16)
        var canvases = win.window.document.getElementsByTagName("canvas")
        if (canvases.length > 0) {
            var canvas = canvases[0]
            if (canvas.style.cursor === "pointer") {
                robot.mouseClick()
                clickedSecondCospacesButton = true
            } else if (cospacesSecondButtonLoopCount > 5) {
                // this experience doesn't support VR, it's probably a merge cube experience
                shutdownApp("non vr experience")
            }
        }
        setTimeout(cospacesLoop, 1000)
        return;
    }
    if (!clickedThirdCospacesButton) {
        robot.moveMouse(xOffset + win.window.innerWidth - 58, yOffset + win.window.innerHeight - 32)
        robot.mouseClick()
        clickedThirdCospacesButton = true

        // accept the vr permission
        setTimeout(() => {
            robot.moveMouse(xOffset + 230, yOffset + 120)
            robot.mouseToggle("down")
        },1000)
        setTimeout(() => {
            robot.mouseToggle("up")
        }, 1200)

        setTimeout(() => {
            maximizeLegacyMirror()
            win.setAlwaysOnTop(false)
            win.minimize()
            win.window.document.getElementsByTagName("html")[0].style.cursor = ""
            win.on('close', async () => {
                nw.Window.get().hide()
                shutdownApp("user closed")
            })
        }, 2500)
        return;
    }
}

async function webXrSampleLoop() {
    let win = nw.Window.get()
    var els = win.window.document.getElementsByClassName("webvr-ui-button")
    if (els.length >= 1) {
        clickOnElement(els[0])
        return
    }
    setTimeout(webXrSampleLoop, 1000)
}

function maximizeLegacyMirror() {
    var spawn = require("child_process").spawn,child;
    var open = false
    child = spawn("powershell.exe",["Get-Process | Where {$_.MainWindowTitle -eq \"Legacy Mirror\"}"]);
    child.stdout.on("data",function(data){
        if (data) {
            open = true
            return;
        }
        return;
    });
    child.stderr.on("data",function(data){
    });
    child.on("exit",function(){
        if (!open) {
            return;
        }

        var spawn2 = require("child_process").spawn,child2;
        child2 = spawn2("powershell.exe",[
            "$sig = '[DllImport(\"user32.dll\")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);';" +
            "Add-Type -MemberDefinition $sig -name NativeMethods -namespace Win32;" +
            "$handle = (Get-Process | Where {$_.MainWindowTitle -eq \"Legacy Mirror\"} | Select MainWindowHandle)[0].MainWindowHandle;" +
            "[Win32.NativeMethods]::ShowWindowAsync($handle, 3)"]);
        child2.stdout.on("data",function(data){
        });
        child2.stderr.on("data",function(data){
        });
        child2.on("exit",function(){
        });
        child2.stdin.end(); //end input
    });
    child.stdin.end(); //end input
}

async function closeLegacyMirror() {
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

setTimeout(automationLoop, 2000)
let win = nw.Window.get()
win.maximize()