const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Shows the info related to the current playing track."),

    async execute(interaction, client) {
        const color = client.config.EmbedColor || "#faeb27"; // Default color if not set

        let dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher || !dispatcher.queue.current) {
            return interaction.reply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27") // Default to red if no color is set
                        .setDescription("There is no track currently playing."),
                ],
                ephemeral: true // Use ephemeral to only show to the user who invoked the command
            });
        }

        const duration = dispatcher.queue.current.length; // Total track duration in milliseconds
        const currentDuration = dispatcher.shoukaku.position; // Current playback position in milliseconds
        const track = dispatcher.queue.current;
        
        const parsedCurrentDuration = client.util.duration(currentDuration || 0); // Format duration
        const parsedDuration = client.util.duration(duration); // Format total duration

        // Calculate progress bar
        const progressBarLength = 20; // Length of the progress bar in characters
        const progressRatio = currentDuration / duration;
        const filledLength = Math.round(progressBarLength * progressRatio);
        const emptyLength = progressBarLength - filledLength;
        const progressBar = `[${'▰'.repeat(filledLength)}${'▱'.repeat(emptyLength)}]`;

        // Build the embed message
        const field = [
            {
                name: 'Duration:',
                value: `\`${parsedDuration}\``,
                inline: true,
            },
            {
                name: 'Track Author(s):',
                value: track.author || 'Unknown',
                inline: true,
            },
            {
                name: 'Progress:',
                value: `${progressBar} \`${parsedCurrentDuration} / ${parsedDuration}\``,
                inline: false,
            }
        ];
        
        const embed = client.embed()
            .setTitle('Now Playing')
            .setColor(color)
            .setDescription(`[${track.title}](${track.uri})`)
            .setThumbnail(track.thumbnail)
            .addFields(field)
            .setFooter({ text: `Requested by ${track.requester.tag}`, iconURL: track.requester.displayAvatarURL() });

        return interaction.reply({ embeds: [embed] });
    }
};
