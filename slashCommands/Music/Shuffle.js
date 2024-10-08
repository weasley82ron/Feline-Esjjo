const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Toggle Shuffle/Unshuffle the queue.'),

    async execute(interaction, client) {
        const dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher || !dispatcher.queue.current) {
            return interaction.reply({
                content: 'No track is currently playing.',
                ephemeral: true
            });
        }

        if (dispatcher.queue.size < 3) {
            return interaction.reply({
                content: 'Not enough songs in the queue to shuffle.',
                ephemeral: true
            });
        }

        if (dispatcher.shuffle) {
            dispatcher.setUnshuffle();
            await client.util.update(dispatcher, client);
            return interaction.reply({
                content: 'Unshuffled the queue.',
                ephemeral: true
            });
        } else {
            dispatcher.setShuffle();
            await client.util.update(dispatcher, client);
            return interaction.reply({
                content: 'Shuffled the queue.',
                ephemeral: true
            });
        }
    }
};
