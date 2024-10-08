module.exports = new Object({
    name: "vaporwave",
    description: "Toggles Vaporwave filter.",
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
        if (dispatcher.vaporwave) {
            dispatcher.setVaporwave(false);
            return await client.util.msgReply(message, 'Vaporwave filter/effect is now disabled.', color);
        } else {
            dispatcher.setVaporwave(true);
            return await client.util.msgReply(message, 'Vaporwave filter/effect is now enabled.', color);
        }
    },
});