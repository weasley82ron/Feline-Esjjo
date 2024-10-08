const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rewind')
        .setDescription('Rewinds the track to a given position.')
        .addIntegerOption(option => 
            option.setName('position')
                .setDescription('The position in seconds to rewind to. Defaults to 10 seconds.')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher || !dispatcher.queue.current) {
            return interaction.reply({
                content: 'No track is currently playing.',
                ephemeral: true
            });
        }

        if (!dispatcher.queue.current.isSeekable) {
            return interaction.reply({
                content: 'Unable to rewind this track.',
                ephemeral: true
            });
        }

        let position = 10; // Default rewind position in seconds
        if (interaction.options.getInteger('position')) {
            position = interaction.options.getInteger('position');
        }

        let seekPosition = dispatcher.shoukaku.position - (position * 1000);

        if (seekPosition < 0) {
            seekPosition = 0; // Ensure position does not go below 0
        }

        dispatcher.shoukaku.seekTo(seekPosition);

        return interaction.reply({
            content: `Rewinded \`${position} seconds\` to \`${client.util.msToTime(dispatcher.shoukaku.position)} / ${client.util.msToTime(dispatcher.queue.current.length)}\``,
            ephemeral: true
        });
    }
};
