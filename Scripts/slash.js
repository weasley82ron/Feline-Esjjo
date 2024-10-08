const { readdirSync } = require("node:fs");
const { join } = require("path");
const { Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const config = require("../Config.js");

/**
 * @param {import('../Main')} client
 */
module.exports = async (client) => {
    const slashCommandsPath = join(__dirname, "..", "SlashCommands");
    const commands = [];
    let count = 0;

    console.log(`Starting to load commands from: ${slashCommandsPath}`);

    readdirSync(slashCommandsPath).forEach((folder) => {
        console.log(`Processing folder: ${folder}`);

        const commandFiles = readdirSync(
            join(slashCommandsPath, folder),
        ).filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            try {
                const commandPath = `../SlashCommands/${folder}/${file}`;
                delete require.cache[require.resolve(commandPath)];
                const command = require(commandPath);

                console.log(`Command data exists: ${Boolean(command.data)}`);

                if (command.category && command.category !== folder) {
                    command.category = folder;
                }

                if (command.data && typeof command.data.toJSON === "function") {
                    commands.push(command.data.toJSON());
                    count++;
                    console.log(`Successfully loaded command: ${file}`);
                } else {
                    console.warn(
                        `Warning: Command in file ${file} is missing 'data' property or 'toJSON' method.`,
                    );
                }
            } catch (error) {
                console.error(
                    `Error loading command from file ${file}:`,
                    error,
                );
            }
        }
    });

    const rest = new REST({ version: "10" }).setToken(client.token);

    try {
        console.log("Started refreshing application (/) commands.");

        // First, get all existing commands
        const existingCommands = await rest.get(
            Routes.applicationCommands(config.Client.ID),
        );
        console.log(`Found ${existingCommands.length} existing command(s).`);

        // Optionally delete all existing commands if needed
        for (const command of existingCommands) {
            await rest.delete(
                Routes.applicationCommand(config.Client.ID, command.id),
            );
        }

        // Register new commands
        await rest.put(Routes.applicationCommands(config.Client.ID), {
            body: commands,
        });

        console.log(
            `Successfully registered ${count} new application (/) commands.`,
        );
    } catch (error) {
        console.error("Error refreshing application commands:", error);
    }
};
