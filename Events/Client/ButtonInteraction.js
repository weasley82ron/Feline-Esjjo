const { PermissionsBitField, Collection } = require('discord.js');
const DjSchema = require('../../Models/Dj');

module.exports = new Object({
    name: "ButtonInteraction",
    /**
     * @param {import("../../Main")} client 
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    async execute(client, interaction) {
        const button = client.ButtonInt.get(interaction.customId);
        if (!button) return;
        const color = client.color;
        if (!client.ButCooldown.has(button.id)) client.ButCooldown.set(button.id, new Collection());
        const cooldown = client.ButCooldown.get(button.id);
        const cooldownAmount = button.cooldown && button.cooldown > 0 ? button.cooldown * 1000 : 3000;
        if (cooldown.has(interaction.member.user.id) && !client.owners.includes(interaction.member.user.id)) {
            const expiretime = cooldown.get(interaction.member.user.id);
            const timeleft = cooldownAmount - (Date.now() - expiretime);
            if (timeleft > 0) return await interaction.reply({
                content: `Please wait for \`[ ${client.util.msToTime(timeleft)} ]\` before reusing the \`${button.name}\` button!`,
                ephemeral: true
            });
        } else {
            cooldown.set(interaction.member.user.id, Date.now());
        }
        setTimeout(() => { if (cooldown.has(interaction.member.user.id)) return cooldown.delete(interaction.member.user.id); }, cooldownAmount);
        if (button.permissions) {
            if (button.permissions.client) {
                if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.resolve(button.permissions.client) || []))
                    return await interaction.reply({ content: `I don't have \`${button.permissions.client}\` permission to execute this button.`, ephemeral: true });
            }
            if (button.permissions.user) {
                if (!interaction.guild.members.cache.get(interaction.member.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.resolve(button.permissions.user) || []))
                    return await interaction.reply({ content: `You don't have \`${button.permissions.user}\` permission to use this button.`, ephemeral: true });
            }
            if (button.permissions.dev) {
                if (client.owners) {
                    const findDev = client.owners.find((x) => x === interaction.member.user.id);
                    if (!findDev) return interaction.reply({ content: `Sorry! This is a owner based command you cant use it.`, ephemeral: true });
                };
            };
            if (button.permissions.voteRequired) {
                let voted = await client.Topgg.hasVoted(interaction.member.user.id);
                if (!voted && !client.owners.includes(interaction.member.user.id)) {
                    return interaction.reply({
                        embeds: [client.embed().setColor(client.color).setDescription(`You Need To [Vote](https://top.gg/bot/1280309734926450761/vote) For Me To Use This Command!`),],
                        components: [client.row().addComponents(client.button().setStyle(client.config.button.link).setLabel("Vote").setURL("https://top.gg/bot/1280309734926450761/vote"))],
                        ephemeral: true
                    });
                }
            }
        }
        const dispatcher = client.dispatcher.players.get(interaction.guildId);

        if (button.player) {
            if (button.player.voice) {
                if (!interaction.member.voice.channel) return await interaction.reply({ content: `You must be connected to a voice channel to use this \`${button.name}\` button.`, ephemeral: true });
                if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Connect))
                    return await interaction.reply({ content: `I don't have \`CONNECT\` permissions to execute this \`${button.name}\` button.`, ephemeral: true, });
                if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Speak))
                    return await interaction.reply({ content: `I don't have \`SPEAK\` permissions to execute this \`${button.name}\` button.`, ephemeral: true });
                if (interaction.guild.members.cache.get(client.user.id).voice.channel) {
                    if (interaction.guild.members.cache.get(client.user.id).voice.channel !== interaction.member.voice.channel)
                        return await interaction.reply({
                            content: `You are not connected to ${interaction.guild.members.cache.get(client.user.id).voice.channel} to use this \`${button.name}\` button.`,
                            ephemeral: true,
                        });
                }
            }
            if (button.player.active) {
                const playerInstance = client.dispatcher.players.get(interaction.guildId);
                if (!playerInstance || !playerInstance.queue || !playerInstance.queue.current)
                    return await interaction.reply({
                        content: 'Nothing is playing right now!',
                        ephemeral: true,
                    });
            }
            if (button.player.dj) {
                const data = await DjSchema.findOne({ _id: interaction.guildId });
                let perm = PermissionsBitField.Flags.MuteMembers || PermissionsBitField.Flags.ManageGuild || PermissionsBitField.Flags.Administrator;
                if (button.player.djPerm) perm = button.permissions.user;
                if (!data) {
                    if (!interaction.guild.members.cache.get(interaction.member.user.id).permissionsIn(interaction.channel).has(perm)) return await client.util.intOops(interaction, 'You don\'t have enough permissions or the dj role to use this command.',);
                } else if (data.mode) {
                    let pass = false;
                    if (data.roles.length > 0) {
                        interaction.member.roles.cache.forEach(x => {
                            const role = data.roles.find(r => r === x.id);
                            if (role) pass = true;
                        });
                    }
                    if (!pass && interaction.guild.members.cache.get(interaction.member.user.id).permissionsIn(interaction.channel).has(perm))
                        return await client.util.intOops(interaction, 'You don\'t have enough permissions or the dj role to use this command.', color);
                }
            }
        }

        try { await button.execute(client, interaction, color, dispatcher); } catch (error) { console.error(error); }
    }
})