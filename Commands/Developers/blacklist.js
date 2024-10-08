const mongoose = require("mongoose");
const Blacklist = require("../../Models/black.js");

module.exports = new Object({
    name: "blacklist",
    description: "Manage the bot's blacklist.",
    category: "Developer",
    usage: "<add/remove/list> <user_id>",
    aliases: [],
    examples: ["blacklist add 5241", "blacklist remove 5854", "blacklist list"],
    args: true,
    permissions: {
        dev: true,
    },

    async execute(client, message, args, prefix, color) {
        const subCommand = args[0]?.toLowerCase();
        const userId = args[1]?.replace(/[<@!>]/g, "");

        if (!subCommand || !["add", "remove", "list"].includes(subCommand)) {
            return client.util.msgReply(
                message,
                `Usage: \`${prefix}blacklist <add/remove/list> <user_id>\``,
                color,
            );
        }

        if (
            (subCommand === "add" || subCommand === "remove") &&
            (!userId || isNaN(userId))
        ) {
            return client.util.msgReply(
                message,
                `Please provide a valid user ID.`,
                color,
            );
        }

        try {
            switch (subCommand) {
                case "add": {
                    const existingEntry = await Blacklist.findOne({ userId });

                    if (existingEntry) {
                        return client.util.msgReply(
                            message,
                            `This user is already blacklisted.`,
                            color,
                        );
                    }

                    const newBlacklistEntry = new Blacklist({ userId });
                    await newBlacklistEntry.save();
                    return client.util.msgReply(
                        message,
                        `Blacklisted the user: <@${userId}>.`,
                        color,
                    );
                }

                case "remove": {
                    const existingEntry = await Blacklist.findOne({ userId });

                    if (!existingEntry) {
                        return client.util.msgReply(
                            message,
                            `This user is not blacklisted.`,
                            color,
                        );
                    }

                    await Blacklist.deleteOne({ userId });
                    return client.util.msgReply(
                        message,
                        `Removed <@${userId}> from the blacklist.`,
                        color,
                    );
                }

                case "list": {
                    const blacklistEntries = await Blacklist.find();
                    if (blacklistEntries.length === 0) {
                        return client.util.msgReply(
                            message,
                            `No blacklisted users found.`,
                            color,
                        );
                    }

                    const blacklistedUsers = blacklistEntries
                        .map((entry) => `<@${entry.userId}>`)
                        .join("\n");
                    return client.util.msgReply(
                        message,
                        `Blacklisted Users:\n${blacklistedUsers}`,
                        color,
                    );
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
            return client.util.msgReply(
                message,
                "An error occurred while processing your request.",
                color,
            );
        }
    },
});
