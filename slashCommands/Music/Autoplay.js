const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggles Autoplay.'),
    category: 'Music',
    cooldown: 60,

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

        // Toggle autoplay
        const currentAutoplay = dispatcher.data.get('autoplay');
        const newAutoplay = !currentAutoplay;
        dispatcher.data.set('autoplay', newAutoplay);

        // Update the dispatcher
        await client.util.update(dispatcher, client);

        // Create and send the response embed
        const autoplayStatusEmbed = new EmbedBuilder()
            .setColor(client.config.EmbedColor)
            .setDescription(`<:started:1268809658127220809> Autoplay is now ${newAutoplay ? '*`enabled`*' : '*`disabled`*'}.`);

        return await interaction.reply({ embeds: [autoplayStatusEmbed], ephemeral: false });
    }
};
