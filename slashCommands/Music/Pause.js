const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current track.'),
    category: 'Music',
    cooldown: 10,

    /**
     * 
     * @param {import("../../../Main")} client 
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {import('kazagumo').KazagumoPlayer} dispatcher
     */

    async execute(interaction, client) {
        let dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher) {
            const noPlayerEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription('No active player found.');

            return await interaction.reply({ embeds: [noPlayerEmbed], ephemeral: true });
        }

        if (dispatcher.paused) {
            const alreadyPausedEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription('The song is already paused.');

            return await interaction.reply({ embeds: [alreadyPausedEmbed], ephemeral: true });
        } else {
            dispatcher.pause(true);
            await client.util.update(dispatcher, client);

            const pausedEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription('Paused the song.');

            return await interaction.reply({ embeds: [pausedEmbed], ephemeral: false });
        }
    }
};
