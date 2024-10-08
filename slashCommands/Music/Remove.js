const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes a track from the queue.')
        .addSubcommand(subcommand => 
            subcommand
                .setName('track')
                .setDescription('Remove a specific track from the queue.')
                .addIntegerOption(option => 
                    option
                        .setName('number')
                        .setDescription('The track number to remove.')
                        .setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('dupes')
                .setDescription('Remove duplicate tracks from the queue.')
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('user')
                .setDescription('Remove tracks requested by a specific user.')
                .addUserOption(option => 
                    option
                        .setName('user')
                        .setDescription('The user whose tracks should be removed.')
                        .setRequired(true))
        ),

    async execute(interaction, client) {
        const { options } = interaction;
        const dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher || !dispatcher.queue.length) {
            return interaction.reply({
                content: `There are no tracks in the queue.`,
                ephemeral: true
            });
        }

        const subCommand = options.getSubcommand();

        if (subCommand === 'track') {
            const trackNumber = options.getInteger('number');
            if (trackNumber <= 0 || trackNumber > dispatcher.queue.length) {
                return interaction.reply({
                    content: `Please provide a valid track number between 1 and ${dispatcher.queue.length}.`,
                    ephemeral: true
                });
            }
            dispatcher.queue.splice(trackNumber - 1, 1);
            await client.util.update(dispatcher, client);
            return interaction.reply({
                content: `Removed track number \`[${trackNumber}]\` from the queue.`,
                ephemeral: true
            });

        } else if (subCommand === 'dupes') {
            const notDuplicatedTracks = [];
            let duplicatedTracksCount = 0;
            for (let i of dispatcher.queue) {
                if (notDuplicatedTracks.length <= 0) notDuplicatedTracks.push(i);
                else {
                    let j = notDuplicatedTracks.find((x) => x.title === i.title || x.uri === i.uri);
                    if (!j) notDuplicatedTracks.push(i);
                    else ++duplicatedTracksCount;
                }
            }
            if (duplicatedTracksCount <= 0) {
                return interaction.reply({
                    content: `No duplicated tracks found to remove.`,
                    ephemeral: true
                });
            }
            dispatcher.queue.clear();
            dispatcher.queue.add(notDuplicatedTracks);
            await client.util.update(dispatcher, client);
            return interaction.reply({
                content: `Removed \`${duplicatedTracksCount}\` duplicated tracks from the queue.`,
                ephemeral: true
            });

        } else if (subCommand === 'user') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
                return interaction.reply({
                    content: `You don't have the required permissions to use this command.`,
                    ephemeral: true
                });
            }
            const user = options.getUser('user');
            let count = 0;
            let queue = [];
            for (const track of dispatcher.queue) {
                if (track.requester && track.requester.id !== user.id) {
                    queue.push(track);
                } else {
                    ++count;
                }
            }
            if (count <= 0) {
                return interaction.reply({
                    content: `Couldn't find any tracks requested by ${user.tag} in the queue.`,
                    ephemeral: true
                });
            }
            dispatcher.queue.clear();
            dispatcher.queue.add(queue);
            await client.util.update(dispatcher, client);
            return interaction.reply({
                content: `Removed \`${count}\` track(s) requested by ${user.tag} from the queue.`,
                ephemeral: true
            });
        }
    }
};
