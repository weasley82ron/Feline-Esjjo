const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song from the given query/link.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("The song name or link you want to play")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const query = interaction.options.getString("query");
        const color = client.config.EmbedColor || "#faeb27"; // Default to green if no color is set

        // Early return if query is a YouTube link
        if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(query)) {
            return interaction.reply({
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription("As of recent events, we've removed YouTube as a supported platform."),
                ],
                ephemeral: true // Use ephemeral to only show to the user who invoked the command
            });
        }

        // Defer reply to handle long processing times
        await interaction.deferReply();

        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27") // Default to red if no color is set
                        .setDescription("You need to join a voice channel first."),
                ],
            });
        }

        try {
            let dispatcher = client.dispatcher.players.get(interaction.guild.id);

            if (!dispatcher) {
                dispatcher = await client.dispatcher.createPlayer({
                    guildId: interaction.guild.id,
                    voiceId: interaction.member.voice.channel.id,
                    textId: interaction.channel.id,
                    deaf: true,
                });
            }

            if (!dispatcher.textId) {
                dispatcher.setTextChannel(interaction.channel.id);
            }

            const { tracks, type, playlistName } = await dispatcher.search(query, {
                requester: interaction.user,
            });

            if (!tracks.length) {
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(client.config.redColor || "#faeb27") // Default to red if no color is set
                            .setDescription("No songs found."),
                    ],
                });
            }

            if (type === "PLAYLIST") {
                for (const track of tracks) {
                    dispatcher.queue.add(track);
                }
                if (!dispatcher.playing && !dispatcher.paused) {
                    dispatcher.play();
                }
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(color)
                            .setDescription(`Queued **${tracks.length}** tracks from [${playlistName.length > 64 ? playlistName.substring(0, 64) + "..." : playlistName}](${query}) [${interaction.user}]`),
                    ],
                });
            } else {
                dispatcher.queue.add(tracks[0]);
                if (!dispatcher.playing && !dispatcher.paused) {
                    dispatcher.play();
                }
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(color)
                            .setDescription(`Queued [${tracks[0].title.length > 64 ? tracks[0].title.substring(0, 64) + "..." : tracks[0].title}](${tracks[0].uri}) [${interaction.user}]`),
                    ],
                });
            }
        } catch (error) {
            console.error("An error occurred while executing the play command:", error);
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27") // Default to red if no color is set
                        .setDescription("An error occurred while trying to play the song. Please try again later."),
                ],
            });
        }
    },
};
