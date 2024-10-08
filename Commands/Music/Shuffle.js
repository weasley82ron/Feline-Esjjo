module.exports = new Object({
    name: "shuffle",
    description: "Toggle Shuffle/Unshuffle the queue.",
    category: "Music",
    cooldown: 15,
    usage: '',
    aliases: ['mix'],
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
        const title = dispatcher.queue.current.title;
        if (dispatcher.queue.size < 3) return await client.util.msgReply(message, `Not enough songs in the queue to shuffle.`, color);
        if (dispatcher.shuffle) {
            dispatcher.setUnshuffle();
            client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `Unshuffled the queue.`, color);
        } else {
            dispatcher.setShuffle();
            client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `Shuffled the queue.`, color);
        }
    }
})