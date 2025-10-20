const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const path = require('path'); // Path module ko require karein
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore, DisconnectReason } = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    // Path ko standardize karein
    const sessionDir = path.join(__dirname, 'temp', id);

    async function GIFTED_MD_PAIR_CODE() {
        // Path ko standardize karein
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        try {
            var items = ["Safari"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                
                if (connection === "open") {
                    await delay(5000);
                    
                    try {
                        // === YAHAN SE FIX SHURU HUA ===
                        // Poora session folder read karein
                        let sessionObject = {};
                        const files = fs.readdirSync(sessionDir);
                        
                        for (const file of files) {
                            const filePath = path.join(sessionDir, file);
                            const fileData = fs.readFileSync(filePath, 'base64'); // File data ko Base64 mein read karein
                            sessionObject[file] = fileData; // {"creds.json": "...", "pre-key-1.json": "..."}
                        }
  
                        // Is object ko JSON string mein convert karein
                        const sessionString = JSON.stringify(sessionObject);
                        
                        // Is poori string ko Base64 encode karein
                        const base64Encoded = Buffer.from(sessionString).toString('base64');
                        // === YAHAN TAK FIX HUA ===

                        // Prefix add karein
                        const prefixedSession = "Qadeer~" + base64Encoded;
                        
                        // Send the prefixed Base64 session string to the user
                        let message = `*✅ APKA MULTI-FILE SESSION ID TAYAR HAI ✅*\n\nNeechay diye gaye code ko copy karke apne bot ke SESSION_ID mein paste kar dein.\n\n*Developer: Qadeer Khan*`;
                        await sock.sendMessage(sock.user.id, { text: message });
                        await sock.sendMessage(sock.user.id, { text: prefixedSession });

                        let desc = `*┏━━━━━━━━━━━━━━*
*┃QADEER-AI SESSION IS*
*┃SUCCESSFULLY*
*┃CONNECTED ✅🔥*
*┗━━━━━━━━━━━━━━━*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❶ || Creator = *QADEER KHAN*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❷ || WhatsApp Channel =* https://whatsapp.com/channel/0029VajWxSZ96H4SyQLurV1H
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❸ || Owner =* https://wa.me/message/3XUP6XZN34PAN1
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❹ || Repo =* https://github.com/Qadeer-Xtech/QADEER-AI
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*💙𝙲𝚁𝙴𝙰𝚃𝙴𝙳 B𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽💛*`; 
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "QADEER KHAN👨🏻‍💻",
                                    thumbnailUrl: "https://files.catbox.moe/3tihge.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029VajWxSZ96H4SyQLurV1H",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        });
                        await sock.newsletterFollow("120363299692857279@newsletter");
                        
                    } catch (e) {
                        console.error("Session banane mein galti hui:", e);
                        await sock.sendMessage(sock.user.id, { text: "❌ Session banane mein koi error aagaya." });
                    }

                    await delay(1000);
                    await sock.ws.close();
                    // Path ko standardize karein
                    await removeFile(sessionDir); 
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶נג 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            // Path ko standardize karein
            await removeFile(sessionDir);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;
