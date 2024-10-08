const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Plays the previous song from the queue or adds it to the queue."),
    
    async execute(interaction, client) {
        const color = client.config.EmbedColor || "#faeb27"; // Default color if not set

        let dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher || !dispatcher.queue.previous) {
            return interaction.reply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27") // Default to red if no color is set
                        .setDescription("There is no previous track played."),
                ],
                ephemeral: true // Use ephemeral to only show to the user who invoked the command
            });
        }

        const but1 = client.button().setCustomId("addprevious").setLabel("Add Previous").setStyle(client.config.button.grey);
        const but2 = client.button().setCustomId("playprevious").setLabel("Play Previous").setStyle(client.config.button.grey);
        const embed = client.embed()
            .setColor(color)
            .setDescription('Previous, what previous?');
        
        const m = await interaction.reply({
            embeds: [embed],
            components: [client.row().addComponents([but1, but2])],
            fetchReply: true // Ensure the message object is returned
        });

        const collector = m.createMessageComponentCollector({
            filter: (button) => button.user.id === interaction.user.id,
            max: 1,
            time: 60000,
            idle: 30000
        });

        collector.on('end', async (collected) => {
            if (m) {
                await m.edit({ components: [client.row().addComponents(but1.setDisabled(true), but2.setDisabled(true))] }).catch(() => {});
            }
        });

        collector.on('collect', async (button) => {
            if (button.customId === 'addprevious') {
                await button.deferUpdate().catch(() => {});
                dispatcher.queue.unshift(dispatcher.queue.previous);
                await client.util.update(dispatcher, client);
                return await m.edit({
                    embeds: [embed.setDescription(`Added - \`${dispatcher.queue.previous.title}\` to the queue.`)],
                    components: [client.row().addComponents([but1.setDisabled(true), but2.setDisabled(true)])]
                }).catch(() => {});
            } else if (button.customId === 'playprevious') {
                await button.deferUpdate().catch(() => {});
                dispatcher.queue.unshift(dispatcher.queue.previous);
                dispatcher.skip();
                await client.util.update(dispatcher, client);
                return await m.edit({
                    embeds: [embed.setDescription(`Added - \`${dispatcher.queue.previous.title}\` to the queue and skipped to it.`)],
                    components: [client.row().addComponents([but1.setDisabled(true), but2.setDisabled(true)])]
                }).catch(() => {});
            }
        });
    }
};
