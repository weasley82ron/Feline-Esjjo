module.exports = new Object({
    name: "party",
    description: "Toggles party filter.",
    category: "Filters",
    cooldown: 20,
    usage: "",
    aliases: [],
    examples: [""],
    sub_commands: [""],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
        voteRequired: false,
    },
    player: { voice: true, active: true, dj: false, djPerm: null },

    /**
     *
     * @param {import("../../../Main")} client
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     * @param {String} color
     * @param {import('kazagumo').KazagumoPlayer} dispatcher
     */

    async execute(client, message, args, prefix, color, dispatcher) {
        if (dispatcher.radio) {
            dispatcher.setParty(false);
            return await client.util.msgReply(
                message,
                "Party filter/effect is now disabled.",
                color,
            );
        } else {
            dispatcher.setParty(true);
            return await client.util.msgReply(
                message,
                "Party filter/effect is now enabled.",
                color,
            );
        }
    },
});
