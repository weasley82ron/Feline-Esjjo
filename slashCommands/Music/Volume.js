const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust or check the current volume level.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The volume level to set (1-100).')
                .setRequired(false)
        ),
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

        const amount = interaction.options.getInteger('amount');

        if (amount !== null) {
            if (amount < 10) {
                const lowVolumeEmbed = new EmbedBuilder()
                    .setColor(client.config.EmbedColor)
                    .setDescription('Volume amount shouldn\'t be less than 10.');

                return await interaction.reply({ embeds: [lowVolumeEmbed], ephemeral: true });
            }

            if (amount > 100) {
                const highVolumeEmbed = new EmbedBuilder()
                    .setColor(client.config.EmbedColor)
                    .setDescription('Volume amount shouldn\'t be more than 100.');

                return await interaction.reply({ embeds: [highVolumeEmbed], ephemeral: true });
            }

            if (dispatcher.volume === amount) {
                const alreadySetEmbed = new EmbedBuilder()
                    .setColor(client.config.EmbedColor)
                    .setDescription(`Volume amount is already at ${dispatcher.volume}%`);

                return await interaction.reply({ embeds: [alreadySetEmbed], ephemeral: true });
            }

            dispatcher.setVolume(amount);
            await client.util.update(dispatcher, client);

            const volumeSetEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription(`Volume amount set to \`${amount}%\``);

            return await interaction.reply({ embeds: [volumeSetEmbed], ephemeral: false });
        } else {
            const currentVolumeEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription(`Current player volume: \`[ ${dispatcher.volume * 100}% ]\``);

            return await interaction.reply({ embeds: [currentVolumeEmbed], ephemeral: false });
        }
    }
};
