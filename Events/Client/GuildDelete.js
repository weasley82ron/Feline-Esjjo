const { WebhookClient } = require('discord.js');
const setup = require('../../Models/Setup');
const dj = require('../../Models/Dj');
const announce = require('../../Models/Announce');
const prefix = require('../../Models/Prefix');
const _247 = require('../../Models/247');

module.exports = {
    name: 'guildDelete',
    /**
     * @param {import("../../Main")} client
     * @param {import("discord.js").Guild} guild
     */
    async execute(client, guild) {
        // Clean up database entries related to the guild
        const data1 = await setup.findOne({ _id: guild.id });
        const data3 = await dj.findOne({ _id: guild.id });
        const data4 = await announce.findOne({ _id: guild.id });
        const data5 = await _247.findOne({ _id: guild.id });
        const data6 = await prefix.findOne({ _id: guild.id });

        if (data1) await data1.delete();
        if (data3) await data3.delete();
        if (data4) await data4.delete();
        if (data5) await data5.delete();
        if (data6) await data6.delete();

        // Send a message to the guild owner
        try {
            const owner = await client.users.fetch(guild.ownerId);
            const thankYouEmbed = client.embed()
                .setColor(client.color)
                .setTitle('Oops! I Was Removed!')
                .setDescription(`Hi ${owner.username},\n\nIt looks like I was removed from **${guild.name}**. If you have any feedback or need help, feel free to let me know. I hope I was able to assist you during my time in your server.\n\nBest regards,\n**${client.user.username}**`)
                .setThumbnail(client.user.displayAvatarURL());

            await owner.send({ embeds: [thankYouEmbed] });
        } catch (error) {
            console.error('Failed to send a message to the guild owner:', error);
        }

        // Send a notification to a webhook
        const hook = new WebhookClient({ url: client.config.hooks.guildRemove });
        const embed = client.embed()
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .setTitle('📤 Left a Guild !!')
            .addFields(
                { name: 'Guild Name', value: `\`\`\`yml\n${guild.name} - ${guild.id}\`\`\``, inline: true },
                { name: 'Guild Member Count', value: `\`${guild.memberCount}\``, inline: true },
                { name: 'Guild Created At', value: `<t:${Math.round(guild.createdAt / 1000)}:f>`, inline: true },
                { name: 'Guild Joined At', value: `<t:${Math.round(guild.joinedAt / 1000)}:f>`, inline: true },
                { name: 'Guild Verification Level', value: `\`${guild.verificationLevel}\``, inline: true },
                { name: 'Guild Explicit Content Filter', value: `\`${guild.explicitContentFilter}\``, inline: true },
                { name: 'Guild Default Message Notifications', value: `\`${guild.defaultMessageNotifications}\``, inline: true },
                { name: 'Guild Count', value: `\`${client.guilds.cache.size}\``, inline: true },
            )
            .setColor(client.color);

        if (hook) {
            await hook.send({ embeds: [embed] });
        }
    },
};
