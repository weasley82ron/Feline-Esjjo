const { PermissionsBitField, ChannelType } = require('discord.js');
const DjSchema = require('../../Models/Dj');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {import("../../Main")} client
     * @param {import('discord.js').Interaction} interaction
     */
    async execute(client, interaction) {
        if (interaction.isButton()) {
            client.emit('ButtonInteraction', interaction)
        }
        // Check if interaction is a command or context menu command
        if (!interaction.isCommand() && !interaction.isContextMenuCommand()) return;

        // Get the command from the client
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            // Player checks before executing the command
            if (command.player) {
                const color = client.color;
                const dispatcher = client.dispatcher.players.get(interaction.guildId);

                if (command.player.voice) {
                    if (!interaction.member.voice.channel) {
                        return await interaction.reply({
                            content: `You must be connected to a voice channel to use this \`${command.name}\` command.`,
                            ephemeral: true,
                        });
                    }
                    if (
                        !interaction.guild.members.cache
                            .get(client.user.id)
                            .permissionsIn(interaction.member.voice.channel)
                            .has(PermissionsBitField.Flags.Connect)
                    ) {
                        return await interaction.reply({
                            content: `I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`,
                            ephemeral: true,
                        });
                    }
                    if (
                        !interaction.guild.members.cache
                            .get(client.user.id)
                            .permissionsIn(interaction.member.voice.channel)
                            .has(PermissionsBitField.Flags.Speak)
                    ) {
                        return await interaction.reply({
                            content: `I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`,
                            ephemeral: true,
                        });
                    }
                    if (
                        interaction.member.voice.channel.type ===
                            ChannelType.GuildStageVoice &&
                        !interaction.guild.members.cache
                            .get(client.user.id)
                            .permissionsIn(interaction.member.voice.channel)
                            .has(PermissionsBitField.Flags.RequestToSpeak)
                    ) {
                        return await interaction.reply({
                            content: `I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`,
                            ephemeral: true,
                        });
                    }
                    if (
                        interaction.guild.members.cache.get(client.user.id)
                            .voice.channel
                    ) {
                        if (
                            interaction.guild.members.cache.get(client.user.id)
                                .voice.channel !==
                            interaction.member.voice.channel
                        ) {
                            return await interaction.reply({
                                content: `You are not connected to ${interaction.guild.members.cache.get(client.user.id).voice.channel} to use this \`${command.name}\` command.`,
                                ephemeral: true,
                            });
                        }
                    }
                }

                if (command.player.active) {
                    if (
                        !dispatcher ||
                        !dispatcher.queue ||
                        !dispatcher.queue.current
                    ) {
                        return await interaction.reply({
                            content: `Nothing is playing right now!`,
                            ephemeral: true,
                        });
                    }
                }

                if (command.player.dj) {
                    const data = await DjSchema.findOne({
                        _id: interaction.guildId,
                    });
                    let perm =
                        PermissionsBitField.Flags.MuteMembers ||
                        PermissionsBitField.Flags.ManageGuild ||
                        PermissionsBitField.Flags.Administrator;
                    if (command.djPerm) perm = command.djPerm;

                    if (!data) {
                        if (!interaction.member.permissions.has(perm)) {
                            return await interaction.reply({
                                content: `You don't have enough permissions or the DJ role to use this command.`,
                                ephemeral: true,
                            });
                        }
                    } else if (data.mode) {
                        let pass = false;
                        if (data.roles.length > 0) {
                            interaction.member.roles.cache.forEach((x) => {
                                const role = data.roles.find((r) => r === x.id);
                                if (role) pass = true;
                            });
                        }
                        if (
                            !pass &&
                            !interaction.member.permissions.has(perm)
                        ) {
                            return await interaction.reply({
                                content: `You don't have enough permissions or the DJ role to use this command.`,
                                ephemeral: true,
                            });
                        }
                    }
                }
            }

            // Execute the command
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    },
};
