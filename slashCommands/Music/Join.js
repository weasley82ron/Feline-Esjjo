const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Make the bot join a voice channel.'),
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

        if (dispatcher && interaction.guild.members.me.voice.channel) {
            const alreadyConnectedEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription(`I'm already connected in ${interaction.guild.channels.cache.has(dispatcher.voiceId) ? `<#${dispatcher.voiceId}>` : '`Unknown Channel`'}`);

            return await interaction.reply({ embeds: [alreadyConnectedEmbed], ephemeral: true });
        }

        if (!interaction.guild.members.me.voice.channel && !interaction.member.voice.channel.joinable) {
            const cannotJoinEmbed = new EmbedBuilder()
                .setColor(client.config.EmbedColor)
                .setDescription("I can't join your voice channel because it's full.");

            return await interaction.reply({ embeds: [cannotJoinEmbed], ephemeral: true });
        }

        if (!dispatcher) {
            dispatcher = await client.dispatcher.createPlayer({
                guildId: interaction.guild.id,
                voiceId: interaction.member.voice.channelId,
                textId: interaction.channel.id,
                deaf: true,
                shardId: interaction.guild.shardId,
            });
        }

        if (!dispatcher.textId) {
            dispatcher.setTextChannel(interaction.channel.id);
        }

        const joinedChannelEmbed = new EmbedBuilder()
            .setColor(client.config.EmbedColor)
            .setDescription(`Joined ${interaction.member.voice.channel}`);

        return await interaction.reply({ embeds: [joinedChannelEmbed], ephemeral: false });
    }
};
