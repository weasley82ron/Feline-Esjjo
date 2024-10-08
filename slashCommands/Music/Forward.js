const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("forward")
        .setDescription("Forwards the track to the given position.")
        .addIntegerOption(option =>
            option
                .setName("position")
                .setDescription("The position in seconds to forward the track.")
                .setRequired(false) // Makes this option optional
        ),

    async execute(interaction, client) {
        const position = interaction.options.getInteger("position") || 10; // Default to 10 seconds if no position is provided
        const color = client.config.EmbedColor || "#faeb27"; // Default color if not set

        // Defer reply to handle long processing times
        await interaction.deferReply();

        let dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher) {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27") // Default to red if no color is set
                        .setDescription("No player found for this guild."),
                ],
            });
        }

        if (!dispatcher.queue.current.isSeekable) {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription("Unable to forward this track."),
                ],
            });
        }

        // Calculate the seek position
        const currentPosition = dispatcher.shoukaku.position;
        const forwardPosition = position * 1000; // Convert seconds to milliseconds
        const seekPosition = currentPosition + forwardPosition;

        if (seekPosition >= dispatcher.queue.current.length) {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription("Cannot forward any further in this track."),
                ],
            });
        }

        // Seek to the calculated position
        dispatcher.shoukaku.seekTo(seekPosition);

        return interaction.editReply({
            embeds: [
                client.embed()
                    .setColor(color)
                    .setDescription(`Forwarded \`[ ${client.util.msToTime(forwardPosition)} ]\` to \`[ ${client.util.msToTime(seekPosition)} / ${client.util.msToTime(dispatcher.queue.current.length)} ]\``),
            ],
        });
    },
};
