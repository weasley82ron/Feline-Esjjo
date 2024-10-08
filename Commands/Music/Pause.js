module.exports = new Object({
    name: "pause",
    description: "Pauses the current track.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['pau'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        isPremium: false,
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
        if (dispatcher.paused) {
            return await client.util.msgReply(message, `The song is already paused.`, color);
        } else {
            dispatcher.pause(true);
            await client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `Paused the song.`, color);
        }
    }
})