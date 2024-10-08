module.exports = new Object({
    name: "play",
    description: "Plays a song from given query/link.",
    category: "Music",
    cooldown: 5,
    usage: "<query>",
    aliases: ["p"],
    examples: ["play ncs"],
    sub_commands: [],
    args: true,
    permissions: {
        isPremium: false,
        client: [],
        user: [],
        dev: false,
        voteRequired: false,
    },
    player: { voice: true, active: false, dj: false, djPerm: true },

    async execute(client, message, args, prefix, color, dispatcher) {
        if (
            /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(
                args.join(" "),
            )
        ) {
            return message.reply({
                embeds: [
                    client
                        .embed()
                        .setColor(color)
                        .setDescription(
                            "As of recent events we've removed YouTube as a supported platform from Main.",
                        ),
                ],
            });
        }
        const query = args.join(" ");
        if (!dispatcher)
            dispatcher = await client.dispatcher.createPlayer({
                guildId: message.guild.id,
                voiceId: message.member.voice.channel.id,
                textId: message.channel.id,
                deaf: true,
            });
        if (!dispatcher.textId) dispatcher.setTextChannel(message.channel.id);
        const { tracks, type, playlistName } = await dispatcher.search(query, {
            requester: message.author,
        });
        if (!tracks.length) {
            return message.reply({
                embeds: [
                    client
                        .embed()
                        .setColor(color)
                        .setDescription("No songs found."),
                ],
            });
        }
        if (type === "PLAYLIST") {
            for (const track of tracks) {
                dispatcher.queue.add(track);
                client.util.update(dispatcher, client);
            }
            if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
            return message.reply({
                embeds: [
                    client
                        .embed()
                        .setColor(color)
                        .setDescription(
                            `Queued **${tracks.length}** tracks from [${playlistName.length > 64 ? playlistName.substring(0, 64) + "..." : playlistName}](${query}) [${message.member}]`,
                        ),
                ],
            });
        } else {
            dispatcher.queue.add(tracks[0]);
            client.util.update(dispatcher, client);
            if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();

            return message.reply({
                embeds: [
                    client
                        .embed()
                        .setColor(color)
                        .setDescription(
                            `Queued [${tracks[0].title.length > 64 ? tracks[0].title.substring(0, 64) + "..." : tracks[0].title}](${tracks[0].uri}) [${message.author}]`,
                        ),
                ],
            });
        }
    },
});
