const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears filter or queue.'),
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

        // Create buttons for user to choose what to clear
        const queueButton = new ButtonBuilder()
            .setCustomId('cqueue')
            .setLabel('Queue')
            .setStyle(ButtonStyle.Primary);

        const filterButton = new ButtonBuilder()
            .setCustomId('cfilter')
            .setLabel('Filter')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(queueButton, filterButton);

        const selectEmbed = new EmbedBuilder()
            .setColor(client.config.EmbedColor)
            .setDescription('Which one do you want to clear?');

        const message = await interaction.reply({ embeds: [selectEmbed], components: [row], fetchReply: true });

        const filter = (i) => i.user.id === interaction.user.id;

        const collector = message.createMessageComponentCollector({
            filter,
            max: 1,
            time: 60000,
            idle: 30000
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                await message.edit({ components: [new ActionRowBuilder().addComponents(queueButton.setDisabled(true), filterButton.setDisabled(true))] });
                return;
            }
        });

        collector.on('collect', async (interaction) => {
            await interaction.deferUpdate();

            if (interaction.customId === 'cqueue') {
                if (!dispatcher.queue || dispatcher.queue.size === 0) {
                    const noQueueEmbed = new EmbedBuilder()
                        .setColor(client.config.EmbedColor)
                        .setDescription('There is nothing in the queue.');

                    return await interaction.editReply({ embeds: [noQueueEmbed], components: [row.setComponents(queueButton.setDisabled(true), filterButton.setDisabled(true))] });
                }
                dispatcher.queue.clear();
                await client.util.update(dispatcher, client);

                const queueClearedEmbed = new EmbedBuilder()
                    .setColor(client.config.EmbedColor)
                    .setDescription('Cleared the queue.');

                return await interaction.editReply({ embeds: [queueClearedEmbed], components: [row.setComponents(queueButton.setDisabled(true), filterButton.setDisabled(true))] });
            }

            if (interaction.customId === 'cfilter') {
                await dispatcher.clearfilter();
                await client.util.update(dispatcher, client);

                const filterClearedEmbed = new EmbedBuilder()
                    .setColor(client.config.EmbedColor)
                    .setDescription('Cleared the filter.');

                return await interaction.editReply({ embeds: [filterClearedEmbed], components: [row.setComponents(queueButton.setDisabled(true), filterButton.setDisabled(true))] });
            }
        });
    }
};
