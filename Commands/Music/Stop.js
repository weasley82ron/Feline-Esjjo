module.exports = new Object({
    name: "stop",
    description: "Stops the song and clear the queue.",
    category: "Music",
    cooldown: 20,
    usage: '',
    aliases: ['end'],
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
        dispatcher.queue.clear();
        dispatcher.shoukaku.stopTrack();
        await client.util.update(dispatcher, client);
        return await client.util.msgReply(message, `Stopped the music and cleared the queue.`, color);
    }
})