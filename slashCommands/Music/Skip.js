const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current track or the provided number of tracks.")
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('The position of the track to skip to.')
                .setRequired(false)
        ),
    category: "Music",
    cooldown: 5,

    /**
     * 
     * @param {import("../../../Main")} client 
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {import('kazagumo').KazagumoPlayer} dispatcher
     */

    async execute(interaction, client) {
        const color = client.config.EmbedColor;
        let dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher) {
            const reply = await interaction.reply({ content: 'No active player found.', ephemeral: true });
            setTimeout(() => interaction.deleteReply(), 3000); // Delete after 3 seconds
            return;
        }

        const title = dispatcher.queue.current.title;
        const trackNumber = interaction.options.getInteger('position');

        if (trackNumber) {
            if (trackNumber <= 0 || trackNumber > dispatcher.queue.size) {
                const reply = await interaction.reply({ content: 'You\'ve provided an invalid track/song number to skip to.', ephemeral: true });
                setTimeout(() => interaction.deleteReply(), 3000); // Delete after 3 seconds
                return;
            }

            dispatcher.queue.splice(0, trackNumber - 1);
            dispatcher.shoukaku.stopTrack();
            await client.util.update(dispatcher, client);

            const reply = await interaction.reply({ content: `**Skipped to track number \`[ ${trackNumber} ]\` in the queue.**`, ephemeral: false });
            setTimeout(() => reply.delete(), 3000); // Delete after 3 seconds
            return;
        }

        dispatcher.skip();
        await client.util.update(dispatcher, client);

        const reply = await interaction.reply({ content: `Skipped \`${title}\``, ephemeral: false });
        setTimeout(() => reply.delete(), 3000); // Delete after 3 seconds
    }
};
