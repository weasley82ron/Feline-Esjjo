module.exports = new Object({
    name: "move",
    description: "Moves the track to a position.",
    category: "Music",
    cooldown: 10,
    usage: '<sub_command>',
    aliases: [],
    examples: ["move track 4 1"],
    sub_commands: ["track <number> <position>",],
    args: true,
    permissions: {
        isPremium: false,
        client: ['MoveMembers'],
        user: ['MoveMembers'],
        dev: false,
        voteRequired: false
    },
    player: { voice: true, active: false, dj: false, djPerm: null },

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
        if (["track", "t", "song", "s"].includes(args[0])) {
            let trackNumber = parseInt(args[1]);
            let toPosition = parseInt(args[2]);
            if (trackNumber <= 0 || trackNumber > dispatcher.queue.size) return await client.util.msgReply(message, 'You\'ve provided an invalid track position to move.', color);
            if (toPosition <= 0 || toPosition > dispatcher.queue.size) return await client.util.msgReply(message, 'You\'ve provided an invalid position to move the track.', color);
            if (trackNumber === toPosition) return await client.util.msgReply(message, `This track is already at the position \`[ ${toPosition} ]\``, color);
            trackNumber = trackNumber - 1;
            toPosition = toPosition - 1;
            const movedQueue = client.util.moveArray(dispatcher.queue, trackNumber, toPosition);
            dispatcher.queue.clear();
            dispatcher.queue.add(movedQueue);
            await client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `Moved track number \`[ ${trackNumber + 1} ]\` to \`[ ${toPosition + 1} ]\` in the queue.`, color);
        } else return await client.util.invalidArgs("move", message, "Please provide a valid sub command.", client);
    },
});