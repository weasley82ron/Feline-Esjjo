module.exports = new Object({
    name: "replay",
    description: "Replays the current playing track.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['rep'],
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
        const { tracks } = await dispatcher.search(dispatcher.queue.current.title, { requester: message.author })
        dispatcher.queue.add(tracks[0])
        dispatcher.shoukaku.stopTrack()
        await client.util.update(dispatcher, client);
        return await client.util.msgReply(message, 'Replaying the Current Song');
    }
})