const { readdirSync } = require('node:fs');
const { join } = require('path');
/**
 * @param {import('../Main')} client 
 */
module.exports = (client) => {
    let count = 0
    const eventFiles = readdirSync(join(__dirname, "..", "Events", "Dispatcher")).filter((files) => files.endsWith(".js"));
    for (const files of eventFiles) {
        const event = require(`../Events/Dispatcher/${files}`);
        client.dispatcher.on(event.name, (...args) => event.execute(client, ...args))
        count++
    };
    client.console.log(`Loaded: ${count} Player`, "client");
}