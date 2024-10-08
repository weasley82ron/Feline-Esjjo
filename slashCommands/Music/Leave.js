const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Disconnect the bot from the voice channel.'),
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
                .setDescription('There is no active player.');

            return await interaction.reply({ embeds: [noPlayerEmbed], ephemeral: true });
        }

        dispatcher.destroy();

        const disconnectedEmbed = new EmbedBuilder()
            .setColor(client.config.EmbedColor)
            .setDescription('Player is now disconnected from the voice channel.');

        return await interaction.reply({ embeds: [disconnectedEmbed], ephemeral: false });
    }
};
