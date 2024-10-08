const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the song and clears the queue.'),
    category: 'Music',
    cooldown: 20,

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

        dispatcher.queue.clear();
        dispatcher.shoukaku.stopTrack();
        await client.util.update(dispatcher, client);

        const stoppedEmbed = new EmbedBuilder()
            .setColor(client.config.EmbedColor)
            .setDescription('Stopped the music and cleared the queue.');

        return await interaction.reply({ embeds: [stoppedEmbed], ephemeral: false });
    }
};
