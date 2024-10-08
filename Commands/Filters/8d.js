module.exports = new Object({
    name: "8d",
    description: "Toggles 8D filter.",
    category: "Filters",
    cooldown: 20,
    usage: '',
    aliases: [],
    examples: [""],
    sub_commands: [""],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
        voteRequired: false
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
        if (dispatcher._8d) {
            dispatcher.set8D(false);
            return await client.util.msgReply(message, 'Nightcore filter/effect is now disabled.', color);
        } else {
            dispatcher.set8D(true);
            return await client.util.msgReply(message, 'Nightcore filter/effect is now enabled.', color);
        }
    },
});