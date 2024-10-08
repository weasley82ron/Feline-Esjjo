module.exports = new Object({
    name: "radio",
    description: "Toggles Radio filter.",
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
        if (dispatcher.radio) {
            dispatcher.setRadio(false);
            return await client.util.msgReply(message, 'Radio filter/effect is now disabled.', color);
        } else {
            dispatcher.setRadio(true);
            return await client.util.msgReply(message, 'Radio filter/effect is now enabled.', color);
        }
    },
});