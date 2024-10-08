const { Collection } = require("discord.js");
const { Main } = require("./Base/Client");
const { WebhookClient, REST } = require("discord.js");
const { Routes } = require("discord.js");
const fs = require("fs");
const config = require("./Config");

const client = new Main();
client.commands = new Collection(); // Initialize commands collection
module.exports = client;

const channel = new WebhookClient({ url: client.config.hooks.Error });
const color = client.color;

// Load and register commands
const commandFolders = fs.readdirSync("./slashCommands");

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./slashCommands/${folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./slashCommands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

// Only attempt to register commands after the bot has logged in
client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const commands = client.commands.map((command) => command.data.toJSON());
    const rest = new REST({ version: "10" }).setToken(config.Token);

    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationCommands(client.user.id), // Use Routes.applicationGuildCommands(client.user.id, 'GUILD_ID') for specific guilds
            { body: commands },
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
});

// Handle unhandled rejections
process.on("unhandledRejection", async (reason, promise) => {
    console.log(reason, promise);
    // if (channel)
    //     await channel
    //         .send({
    //             embeds: [
    //                 client
    //                     .embed()
    //                     .setColor(color)
    //                     .setDescription(
    //                         `\`\`\`js\n${reason}\n\n${promise}\n\`\`\``,
    //                     )
    //                     .setTitle("Unhandled Rejection")
    //                     .setTimestamp(),
    //             ],
    //         })
    //         .catch(() => {});
});

// Handle uncaught exceptions
process.on("uncaughtException", async (error, origin) => {
    // if (channel)
    //     await channel
    //         .send({
    //             embeds: [
    //                 client
    //                     .embed()
    //                     .setTitle("Uncaught Exception")
    //                     .setColor(color)
    //                     .setDescription(
    //                         `\`\`\`js\n${error.stack ? error.stack : error}\n\n${origin}\n\`\`\``,
    //                     ),
    //             ],
    //         })
    //         .catch(() => {});
    console.log(error);
});

client.login(config.Token);
