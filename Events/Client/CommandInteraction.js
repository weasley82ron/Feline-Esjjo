const { Permissions, ChannelType, Collection } = require('discord.js');
const DjSchema = require('../../Models/Dj');

module.exports = {
    name: "ButtonInteraction",
    /**
     * @param {import("../../Main")} client 
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(client, interaction) {
        let prefix = '` / `';
        if (interaction.webhook || interaction.member.user.bot || !interaction.channel || !interaction.guild) return;
        if (interaction.channel.type === ChannelType.DM || interaction.channel.type === ChannelType.GuildForum) return;
        const color = client.color;
        const command = client.applicationCommands.get(interaction.commandName);
        if (!command) return;

        try {
            console.log('Starting permission checks...');

            // Auto Permission Return
            const permissions = interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel);
            if (!permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
                console.log(`Missing SEND_MESSAGES permission for command: ${command.name}`);
                return await interaction.reply({ content: `I don't have **\`SEND_MESSAGES\`** permission to execute this **\`${command.name}\`** command.`, ephemeral: true });
            }
            if (!permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) {
                console.log(`Missing VIEW_CHANNEL permission for command: ${command.name}`);
                return await interaction.reply({ content: `I don't have **\`VIEW_CHANNEL\`** permission to execute this **\`${command.name}\`** command.`, ephemeral: true });
            }
            if (!permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
                console.log(`Missing EMBED_LINKS permission for command: ${command.name}`);
                return await interaction.reply({ content: `I don't have **\`EMBED_LINKS\`** permission to execute this **\`${command.name}\`** command.`, ephemeral: true });
            }

            console.log('Permission checks passed.');

            // Permission for handler
            if (command.permissions) {
                console.log('Checking command permissions...');

                if (command.permissions.client) {
                    if (!permissions.has(Permissions.FLAGS.resolve(command.permissions.client) || [])) {
                        console.log(`Missing client permission ${command.permissions.client} for command: ${command.name}`);
                        return await interaction.reply({ content: `I don't have \`${command.permissions.client}\` permission to execute this command.`, ephemeral: true });
                    }
                }
                if (command.permissions.user) {
                    const userPermissions = interaction.guild.members.cache.get(interaction.member.user.id).permissionsIn(interaction.channel);
                    if (!userPermissions.has(Permissions.FLAGS.resolve(command.permissions.user) || [])) {
                        console.log(`Missing user permission ${command.permissions.user} for command: ${command.name}`);
                        return await interaction.reply({ content: `You don't have \`${command.permissions.user}\` permission to use this command.`, ephemeral: true });
                    }
                }
                if (command.permissions.dev) {
                    if (client.owners && !client.owners.includes(interaction.member.user.id)) {
                        console.log(`User ${interaction.member.user.id} is not an owner for command: ${command.name}`);
                        return await interaction.reply({ content: `Sorry! This is an owner-based command you can't use it.`, ephemeral: true });
                    }
                }
                if (command.permissions.voteRequired) {
                    try {
                        let voted = await client.Topgg.hasVoted(interaction.member.user.id);
                        if (!voted && !client.owners.includes(interaction.member.user.id)) {
                            console.log(`User ${interaction.member.user.id} has not voted for command: ${command.name}`);
                            return await interaction.reply({
                                embeds: [client.embed().setColor(client.color).setDescription(`You Need To [Vote](https://top.gg/bot/1280309734926450761/vote) For Me To Use This Command!`)],
                                components: [client.row().addComponents(client.button().setStyle(client.config.button.link).setLabel("Vote").setURL("https://top.gg/bot/1280309734926450761/vote"))],
                                ephemeral: true
                            });
                        }
                    } catch (error) {
                        console.error(`Error checking vote status for user ${interaction.member.user.id}:`, error);
                    }
                }
            }

            console.log('Command permissions check passed.');

            const dispatcher = client.dispatcher.players.get(interaction.guildId);

            if (command.player) {
                console.log('Checking player-related permissions...');

                if (command.player.voice) {
                    if (!interaction.member.voice.channel) {
                        console.log(`User ${interaction.member.user.id} is not in a voice channel for command: ${command.name}`);
                        return await interaction.reply({ content: `You must be connected to a voice channel to use this \`${command.name}\` command.`, ephemeral: true });
                    }
                    if (!permissions.has(Permissions.FLAGS.CONNECT)) {
                        console.log(`Missing CONNECT permission for command: ${command.name}`);
                        return await interaction.reply({ content: `I don't have \`CONNECT\` permission to execute this \`${command.name}\` command.`, ephemeral: true });
                    }
                    if (!permissions.has(Permissions.FLAGS.SPEAK)) {
                        console.log(`Missing SPEAK permission for command: ${command.name}`);
                        return await interaction.reply({ content: `I don't have \`SPEAK\` permission to execute this \`${command.name}\` command.`, ephemeral: true });
                    }
                    if (interaction.guild.members.cache.get(client.user.id).voice.channel) {
                        if (interaction.guild.members.cache.get(client.user.id).voice.channel !== interaction.member.voice.channel) {
                            console.log(`User ${interaction.member.user.id} is not in the same voice channel as the bot for command: ${command.name}`);
                            return await interaction.reply({
                                content: `You are not connected to ${interaction.guild.members.cache.get(client.user.id).voice.channel} to use this \`${command.name}\` command.`,
                                ephemeral: true,
                            });
                        }
                    }
                }
                if (command.player.active) {
                    try {
                        const playerInstance = client.dispatcher.players.get(interaction.guildId);
                        if (!playerInstance || !playerInstance.queue || !playerInstance.queue.current) {
                            console.log(`No music is playing for command: ${command.name}`);
                            return await interaction.reply({ content: 'Nothing is playing right now!', ephemeral: true });
                        }
                    } catch (error) {
                        console.error(`Error checking player instance for command ${command.name}:`, error);
                    }
                }
                if (command.player.dj) {
                    try {
                        const data = await DjSchema.findOne({ _id: interaction.guildId });
                        let perm = Permissions.FLAGS.MUTE_MEMBERS || Permissions.FLAGS.MANAGE_GUILD || Permissions.FLAGS.ADMINISTRATOR;
                        if (command.djPerm) perm = command.djPerm;
                        if (!data) {
                            if (!interaction.guild.members.cache.get(interaction.member.user.id).permissionsIn(interaction.channel).has(perm)) {
                                console.log(`User ${interaction.member.user.id} does not have required DJ permissions for command: ${command.name}`);
                                return await client.util.intOops(interaction, 'You don\'t have enough permissions or the DJ role to use this command.');
                            }
                        } else if (data.mode) {
                            let pass = false;
                            if (data.roles.length > 0) {
                                interaction.member.roles.cache.forEach(x => {
                                    if (data.roles.includes(x.id)) pass = true;
                                });
                            }
                            if (!pass && interaction.guild.members.cache.get(interaction.member.user.id).permissionsIn(interaction.channel).has(perm)) {
                                console.log(`User ${interaction.member.user.id} does not have required DJ role for command: ${command.name}`);
                                return await client.util.intOops(interaction, 'You don\'t have enough permissions or the DJ role to use this command.');
                            }
                        }
                    } catch (error) {
                        console.error(`Error checking DJ role permissions for command ${command.name}:`, error);
                    }
                }
            }

            console.log('Player-related permissions check passed.');

            if (!client.Cooldown.has(command.name)) client.Cooldown.set(command.name, new Collection());
            const cooldown = client.Cooldown.get(command.name);
            const cooldownAmount = command.cooldown && command.cooldown > 0 ? command.cooldown * 1000 : 3000;
            if (cooldown.has(interaction.member.user.id) && !client.owners.includes(interaction.member.user.id)) {
                const expiretime = cooldown.get(interaction.member.user.id);
                const timeleft = cooldownAmount - (Date.now() - expiretime);
                if (timeleft > 0) {
                    console.log(`Cooldown active for user ${interaction.member.user.id} on command: ${command.name}`);
                    return await interaction.reply({ content: `Please wait for \`[ ${client.util.msToTime(timeleft)} ]\` before reusing the \`${command.name}\` command!`, ephemeral: true });
                }
            } else {
                cooldown.set(interaction.member.user.id, Date.now());
            }
            setTimeout(() => { cooldown.delete(interaction.member.user.id); }, cooldownAmount);

            console.log('Cooldown management completed.');

            try {
                await command.execute(client, interaction, color, dispatcher);
                console.log(`Successfully executed command: ${command.name}`);
            } catch (error) {
                console.error(`Error executing command ${command.name}:`, error);
                await interaction.reply({ content: `There was an error while executing this command.`, ephemeral: true });
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: `An error occurred while processing your request.`, ephemeral: true });
            } else {
                await interaction.reply({ content: `An error occurred while processing your request.`, ephemeral: true });
            }
        }
    }
}