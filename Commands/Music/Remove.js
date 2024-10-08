const { PermissionsBitField } = require("discord.js");

module.exports = new Object({
    name: "remove",
    description: "Removes a track from the queue.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['rem'],
    examples: ["remove track 5", "remove t 10", "remove song 5", "remove s 10", "remove user @CPTN", "remove u @AkAbhijit", "remove dupes", "remove d"],
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
        if (["track", "t", "song", "s"].includes(args[0])) {

            if (!dispatcher.queue.size) return await client.util.oops(message.channel, `Don't have enough tracks left in the queue to remove.`, color);
            if (!args[1]) return await client.util.oops(message.channel, `Please provide the track number to remove.`, color);
            let trackNumber = parseInt(args[1]);
            if (isNaN(trackNumber)) return await client.util.oops(message.channel, `Please provide a valid track number to remove.`, color);
            if (trackNumber <= 0) return await client.util.oops(message.channel, `Track number shouldn't be lower than or equal to 0.`, color);
            if (trackNumber > dispatcher.queue.size) return await client.util.oops(message.channel, `Track shouldn't be higher than the queue's total tracks.`, color);
            dispatcher.queue.splice(trackNumber - 1, 1);
            await client.util.update(dispatcher, client);
            return await client.util.good(message.channel, `Removed track number \`[ ${trackNumber} ]\` from the queue.`, color);

        } else if (["dupes", "dupe", "d"].includes(args[0])) {

            if (!dispatcher.queue.size) return await client.util.oops(message.channel, `Don't have enough tracks left in the queue to remove.`, color);
            const notDuplicatedTracks = [];
            let duplicatedTracksCount = 0;
            for (let i of dispatcher.queue) {
                if (notDuplicatedTracks.length <= 0) notDuplicatedTracks.push(i);
                else {
                    let j = notDuplicatedTracks.find((x) => x.title === i.title || x.uri === i.uri);
                    if (!j) notDuplicatedTracks.push(i);
                    else ++duplicatedTracksCount;
                };
            };
            if (duplicatedTracksCount <= 0) return await client.util.oops(message.channel, `Didn't find any duplicated tracks in the queue to remove.`, color);
            dispatcher.queue.clear();
            dispatcher.queue.add(notDuplicatedTracks);
            await client.util.update(dispatcher, client);
            return await client.util.good(message.channel, `Removed \`[ ${duplicatedTracksCount} ]\` duplicated tracks from the queue.`, color);

        } else if (["user", "u", "user_tracks", "ut"].includes(args[0])) {

            if (!dispatcher.queue.size) return await client.util.oops(message.channel, `Don't have enough tracks left in the queue to remove.`, color);
            if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return await client.util.replyOops(message, `You don't have enough permissions to use this command.`, color);
            if (!args[1]) return await client.util.replyOops(message, `Please provide a user to remove the tracks from the queue that he requested.`, color);
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let count = 0;
            let queue = [];
            for (const track of dispatcher.queue) {
                if (track.requester && track.requester.id !== member.user.id) {
                    queue.push(track);
                } else {
                    ++count;
                };
            };
            if (count <= 0) return await client.util.replyOops(message, `Couldn't find any tracks requested by <@${member.user.id}> in the queue.`, color);
            dispatcher.queue.clear();
            dispatcher.queue.add(queue);
            await client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `Removed \`[ ${count} ]\` track(s) requested by <@${member.user.id}> from the queue.`, color);

        } else return await client.util.invalidArgs("remove", message, "Please provide a valid sub command.", client);
    }
})