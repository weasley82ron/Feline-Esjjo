const { WebhookClient } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    /**
     * @param {import("../../Main")} client
     * @param {import("discord.js").Guild} guild
     */
    async execute(client, guild) {
        // Create a new WebhookClient instance
        const hook = new WebhookClient({ url: client.config.hooks.guildAdd });

        // Prepare the embed message for the server
        const embed = client.embed()
            .setColor(client.color)
            .setAuthor({ 
                name: `${client.user.username} has been added to a guild.`, 
                iconURL: guild.iconURL({ dynamic: true }), 
                url: client.config.links.support 
            })
            .setTitle(`${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields([
                {
                    name: 'Created On',
                    value: `<t:${Math.round(guild.createdTimestamp / 1000)}>`,
                    inline: false,
                },
                {
                    name: 'Added On',
                    value: `<t:${Math.round(Date.now() / 1000)}>`,
                    inline: false,
                },
                {
                    name: 'Guild Id',
                    value: `\`${guild.id}\``,
                    inline: false,
                },
                {
                    name: 'Owner',
                    value: `<@${guild.ownerId}> (\`id: ${guild.ownerId}\`)`,
                    inline: false,
                },
                {
                    name: 'Total Members Count',
                    value: `\`[ ${guild.memberCount} ]\``,
                    inline: false,
                },
            ]);

        // Send the embed to the webhook
        if (hook) {
            await hook.send({ embeds: [embed] }).catch(() => { });
        }

        // Send a thank-you message to the guild owner
        try {
            const owner = await client.users.fetch(guild.ownerId);
            const thankYouEmbed = client.embed()
                .setColor(client.color)
                .setTitle('Thank You for Adding Me!')
                .setDescription(`Hi ${owner.username},\n\nThank you for adding me to **${guild.name}**! I'm here to assist you and your server. If you need any help or have any questions, feel free to ask.\n\nBest regards,\n**${client.user.username}**`)
                .setThumbnail(client.user.displayAvatarURL());

            await owner.send({ embeds: [thankYouEmbed] });
        } catch (error) {
            console.error('Failed to send a thank-you message to the guild owner:', error);
        }
    },
};
