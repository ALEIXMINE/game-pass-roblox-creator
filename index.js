const noblox = require('noblox.js')
const fs = require('fs')
const data = require("./data.json")
const passes = data.passes

function waitKeyPressed() {
    return new Promise(resolve => {
        const wasRaw = process.stdin.isRaw;
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once("data", (data) => {
            process.stdin.pause();
            process.stdin.setRawMode(wasRaw);
            resolve(data.toString());
        });
    });
}

async function startApp() {
    const currentUser = await noblox.setCookie(data.cookie)
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
    const gamePasses = await noblox.getGamePasses(data.UniverseId)
    if(gamePasses.length < passes.length) {
        console.log(`[WARN] The number of passes created is less than the passes you want to configure.`)
        console.log(`[WARN] Passes in game: ${gamePasses.length}`)
        console.log(`[WARN] Passes to modify: ${passes.length}`)
        console.log("Continue? (n / y)")
        var op = await waitKeyPressed();
        if (op!=="y") return;
    }
    for(let n in gamePasses) {
        await noblox.configureGamePass(gamePasses[n].id, passes[n].name, passes[n].descriptions, passes[n].price, fs.createReadStream(passes[n].file));
        console.log("Configured game pass "+passes[n].name+" ("+gamePasses[n].id+")")
    }
}
startApp()