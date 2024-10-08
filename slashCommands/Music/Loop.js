const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Toggle track/queue loop.")
        .addStringOption(option =>
            option
                .setName("mode")
                .setDescription("Select the loop mode.")
                .addChoices(
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue' },
                    { name: 'Off', value: 'off' }
                )
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const mode = interaction.options.getString("mode");
        const color = client.config.EmbedColor || "#faeb27"; // Default color if not set
        const enable = ['enabled', 'activated'];
        const disable = ['disabled', 'deactivated'];

        // Defer reply to handle long processing times
        await interaction.deferReply();

        let dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher) {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27") // Default to red if no color is set
                        .setDescription("No player found for this guild."),
                ],
            });
        }

        if (mode === 'track') {
            if (dispatcher.loop !== 'track') {
                dispatcher.setLoop('track');
                await client.util.update(dispatcher, client);
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(color)
                            .setDescription(`Looping the current song **${enable[Math.floor(Math.random() * enable.length)]}**.`),
                    ],
                });
            } else {
                dispatcher.setLoop('none');
                await client.util.update(dispatcher, client);
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(color)
                            .setDescription(`Looping the current song **${disable[Math.floor(Math.random() * disable.length)]}**.`),
                    ],
                });
            }
        } else if (mode === 'queue') {
            if (dispatcher.loop !== 'queue') {
                dispatcher.setLoop('queue');
                await client.util.update(dispatcher, client);
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(color)
                            .setDescription(`Looping the queue **${enable[Math.floor(Math.random() * enable.length)]}**.`),
                    ],
                });
            } else {
                dispatcher.setLoop('none');
                await client.util.update(dispatcher, client);
                return interaction.editReply({
                    embeds: [
                        client.embed()
                            .setColor(color)
                            .setDescription(`Looping the queue **${disable[Math.floor(Math.random() * disable.length)]}**.`),
                    ],
                });
            }
        } else if (mode === 'off') {
            dispatcher.setLoop('none');
            await client.util.update(dispatcher, client);
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription(`Looping is now **${disable[Math.floor(Math.random() * disable.length)]}**.`),
                ],
            });
        } else {
            return interaction.editReply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27")
                        .setDescription("Please provide a valid mode (`track`, `queue`, or `off`)."),
                ],
            });
        }
    },
};
