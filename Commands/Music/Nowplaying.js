module.exports = new Object({
    name: "nowplaying",
    description: "Shows the info related to the current playing track.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['np'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        isPremium: false,
        client: [],
        user: [],
        dev: false,
        voteRequired: false
    },
    player: { voice: true, active: true, dj: false, djPerm: null },

    /**
     * 
     * @param {import("../../Main")} client 
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     * @param {String} color
     * @param {import('kazagumo').KazagumoPlayer} dispatcher
     */

    async execute(client, message, args, prefix, color, dispatcher) {
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
                value: track.author,
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

        return message.reply({ embeds: [embed] });
    }
});
