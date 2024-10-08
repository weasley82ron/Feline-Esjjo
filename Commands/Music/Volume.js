module.exports = new Object({
    name: "volume",
    description: "Toggle Shuffle/Unshuffle the queue.",
    category: "Music",
    cooldown: 20,
    usage: '',
    aliases: ['sound', 'vol'],
    examples: ['volume', 'volume 50'],
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
        const amount = args[0];
        if (amount) {
            if (amount <= 9) return await client.util.msgReply(message, `Volume amount shouldn't be less than 10.`, color);
            if (amount >= 101) return await client.util.msgReply(message, `Volume amount shouldn't be more than 100.`, color);
            if (dispatcher.volume === amount) return await client.util.msgReply(message, `Volume amount is already at ${dispatcher.volume * 100}`, color);
            dispatcher.setVolume(amount);
            await client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `Volume amount set to \`[ ${dispatcher.volume * 100}% ]\``, color);
        } else {
            return await client.util.msgReply(message, `Current player volume: \`[ ${dispatcher.volume * 100}% ]\``, color);
        }
    }
})