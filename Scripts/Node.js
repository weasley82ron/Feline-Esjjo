const { readdirSync } = require('node:fs');
const { join } = require('path');
/**
 * @param {import('../Main')} client 
 */
module.exports = (client) => {
    let count = 0
    const eventFiles = readdirSync(join(__dirname, "..", "Events", "Nodes")).filter((files) => files.endsWith(".js"));
    for (const files of eventFiles) {
        const event = require(`../Events/Nodes/${files}`);
        client.dispatcher.shoukaku.on(event.name, (...args) => event.execute(client, ...args))
        count++
    };
    client.console.log(`Loaded: ${count} Node`, "client");
}