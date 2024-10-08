module.exports = new Object({
    name: "skip",
    description: "Skips the current track or the provided number of tracks.",
    category: "Music",
    cooldown: 5,
    usage: '<position>',
    aliases: ['s'],
    examples: ['skip', 'skip 3'],
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
        const title = dispatcher.queue.current.title;
        if (args.length) {
            const trackNumber = args[0];
            if (trackNumber <= 0) return await client.util.msgReply(message, 'You\'ve provided an invalid track/song number to skipto.', color);
            if (trackNumber > dispatcher.queue.size) return await client.util.msgReply(message, 'You\'ve provided an invalid track/song number to skipto.', color);
            dispatcher.queue.splice(0, trackNumber - 1);
            dispatcher.shoukaku.stopTrack();
            await client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `**Skipped to track number \`[ ${trackNumber} ]\` in the queue.**`, color);
        }
        dispatcher.skip();
        await client.util.update(dispatcher, client);
        return await client.util.msgReply(message, `Skiped \`${title}\``, color);
    }
})