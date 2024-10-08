module.exports = new Object({
    name: "forward",
    description: "Forwards the track to given position.",
    category: "Music",
    cooldown: 10,
    usage: '[position]',
    aliases: ['f'],
    examples: ["forward", "forward 3", "f", "f 10"],
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
        if (!dispatcher.queue.current.isSeekable) return await client.util.msgReply(message, 'Unable to forward this track.', color);
        let position = 10000;
        if(args[0]) position = parseInt(args[0])*1000;
        let seekPosition = dispatcher.shoukaku.position + position;
        if(seekPosition >= dispatcher.queue.current.length) return await client.util.msgReply(message.channel, `Cannot forward any futher more of this track.`, color);
        dispatcher.shoukaku.seekTo(x);
        return await client.util.msgReply(message, `Forwarded \`[ ${client.util.msToTime(Number(position))} ]\` to \`[ ${client.util.msToTime(Number(dispatcher.shoukaku.position))} / ${client.util.msToTime(Number(dispatcher.queue.current.length))} ]\``, color);
    }
})