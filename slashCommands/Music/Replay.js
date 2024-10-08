const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replays the current playing track.'),

    async execute(interaction, client) {
        const dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher || !dispatcher.queue.current) {
            return interaction.reply({
                content: 'No track is currently playing.',
                ephemeral: true
            });
        }

        try {
            // Search for the current track again
            const { tracks } = await dispatcher.search(dispatcher.queue.current.title, { requester: interaction.user });

            if (!tracks.length) {
                return interaction.reply({
                    content: 'Could not find the track to replay.',
                    ephemeral: true
                });
            }

            // Add the track to the queue and stop the current track
            dispatcher.queue.add(tracks[0]);
            dispatcher.shoukaku.stopTrack();

            // Update the dispatcher
            await client.util.update(dispatcher, client);

            return interaction.reply({
                content: 'Replaying the current song.',
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'An error occurred while trying to replay the track.',
                ephemeral: true
            });
        }
    }
};
