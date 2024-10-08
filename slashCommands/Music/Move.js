const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Moves the track to a specified position.")
        .addStringOption(option =>
            option
                .setName("sub_command")
                .setDescription("The action to perform (e.g., 'track').")
                .addChoices(
                    { name: 'Track', value: 'track' }
                )
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("track_number")
                .setDescription("The current position of the track in the queue.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("to_position")
                .setDescription("The new position for the track in the queue.")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const subCommand = interaction.options.getString("sub_command");
        const trackNumber = interaction.options.getInteger("track_number");
        const toPosition = interaction.options.getInteger("to_position");
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

        if (subCommand === 'track') {
            if (trackNumber <= 0 || trackNumber > dispatcher.queue.size) {
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(client.config.redColor || "#faeb27")
                            .setDescription('You\'ve provided an invalid track position to move.'),
                    ],
                });
            }
            if (toPosition <= 0 || toPosition > dispatcher.queue.size) {
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(client.config.redColor || "#faeb27")
                            .setDescription('You\'ve provided an invalid position to move the track.'),
                    ],
                });
            }
            if (trackNumber === toPosition) {
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(client.config.redColor || "#faeb27")
                            .setDescription(`This track is already at the position \`[ ${toPosition} ]\``),
                    ],
                });
            }
            // Adjust track numbers for zero-based index
            const trackIndex = trackNumber - 1;
            const newPosition = toPosition - 1;
            const movedQueue = client.util.moveArray(dispatcher.queue, trackIndex, newPosition);
            dispatcher.queue.clear();
            dispatcher.queue.add(movedQueue);
            await client.util.update(dispatcher, client);
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription(`Moved track number \`[ ${trackNumber} ]\` to \`[ ${toPosition} ]\` in the queue.`),
                ],
            });
        } else {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27")
                        .setDescription("Please provide a valid sub command (`track`)."),
                ],
            });
        }
    },
};
