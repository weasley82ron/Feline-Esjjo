const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seeks the current playing track to a specified time.')
        .addStringOption(option => 
            option.setName('time')
                .setDescription('The time to seek to (e.g. 1:34).')
                .setRequired(true)
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
                content: 'This track isn\'t seekable.',
                ephemeral: true
            });
        }

        const time = interaction.options.getString('time');
        
        // Validate the time format
        if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(time)) {
            return interaction.reply({
                content: 'You provided an invalid duration. Valid duration e.g. `1:34`.',
                ephemeral: true
            });
        }

        // Convert time to milliseconds
        let ms = time.split(':').map(Number).reverse().reduce((acc, val, idx) => acc + val * Math.pow(60, idx) * 1000, 0);
        
        if (ms > dispatcher.queue.current.length) {
            return interaction.reply({
                content: 'The duration you provided exceeds the duration of the current track.',
                ephemeral: true
            });
        }

        dispatcher.shoukaku.seekTo(ms);
        
        return interaction.reply({
            content: `Seeked to \`${time}\`.`,
            ephemeral: true
        });
    }
};
