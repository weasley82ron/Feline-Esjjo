const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the currently paused track.'),
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
            dispatcher.pause(false);
            await client.util.update(dispatcher, client);

            const resumedEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription('Resumed the song.');

            return await interaction.reply({ embeds: [resumedEmbed], ephemeral: false });
        } else {
            const notPausedEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription('The song is not paused.');

            return await interaction.reply({ embeds: [notPausedEmbed], ephemeral: true });
        }
    }
};
