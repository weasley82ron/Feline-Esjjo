const {
    ChannelType,
    PermissionsBitField,
    Collection,
    ButtonStyle,
} = require("discord.js");
const db = require("../../Models/Setup");
const DjSchema = require("../../Models/Dj");
const Premium = require("../../Models/Premium");

module.exports = new Object({
    name: "messageCreate",
    /**
     * @param {import("../../Main")} client
     * @param {import("discord.js").Message} message
     */
    async execute(client, message) {
        if (
            message.author.bot ||
            message.webhookId ||
            !message.guild ||
            !message.channel
        )
            return;
        if (
            message.channel.type == ChannelType.DM ||
            message.channel.type == ChannelType.GuildForum
        )
            return;
        if (message.partial) await message.fetch();

        const data = await db.findOne({ _id: message.guildId });
        if (data && data.channel && message.channelId === data.channel)
            return client.emit("requestChannel", message);
        let prefix = await client.util.getPrefix(message.guildId, client);
        const color = client.color;
        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            if (
                message.guild.members.cache
                    .get(client.user.id)
                    .permissionsIn(message.channel)
                    .has(PermissionsBitField.Flags.SendMessages)
            ) {
                return await message
                    .reply({
                        embeds: [
                            client
                                .embed()
                                .setDescription(
                                    `<:hellouser:1284171282807783566> [**Heyoo .. !!・**](https://discord.gg/mizubee) ${message.author}, \n <a:flower:1279759891119996959> [**Prefix・**](https://discord.gg/mizubee) \`${prefix}help\`\n\n [**Try・**](https://discord.gg/mizubee)\`${prefix}help\` [**To Get The Command List.**](https://discord.gg/mizubee)`
                                )
                                .setColor(color)
                                .setFooter({ 
                                    text: `made with love for ya'll ~ Kevin`, 
                                    iconURL: 'https://images-ext-1.discordapp.net/external/mNTh62uLF4PsthwSTx3PRYWVDSU-2dyp0KJ3MTNO82I/%3Fsize%3D96%26quality%3Dlossless/https/cdn.discordapp.com/emojis/1131909990630834217.webp'
                                })
                                .setImage('https://cdn.discordapp.com/attachments/1276707204585492501/1284121468422062121/Mizu.png?ex=66e57acf&is=66e4294f&hm=f614caf5760ee98cd678715e1d1460c1263515b8fc082861ea197061cac8de6c&'),
                        ],
                        components: [
                            client
                                .row()
                                .addComponents(
                                    client
                                        .button()
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel("Support Server")
                                        .setURL(client.config.links.support),
                                ),
                        ],
                    })
                    .catch(() => {});
            }
        }
        if (
            client.np.includes(message.member.id) &&
            !message.content.startsWith(prefix)
        )
            prefix = "";
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(
            `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`,
        );
        if (!prefixRegex.test(message.content)) return;
        const [matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content
            .slice(matchedPrefix.length)
            .trim()
            .split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command =
            client.Commands.get(commandName) ||
            client.Commands.get(client.Aliases.get(commandName));
        if (!command) return;
        //Auto Permission Return
        if (
            !message.guild.members.cache
                .get(client.user.id)
                .permissionsIn(message.channel)
                .has(PermissionsBitField.Flags.SendMessages)
        )
            return await message.author
                .send({
                    content: `I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
                })
                .catch(() => {});
        if (
            !message.guild.members.cache
                .get(client.user.id)
                .permissionsIn(message.channel)
                .has(PermissionsBitField.Flags.ViewChannel)
        )
            return;
        if (
            !message.guild.members.cache
                .get(client.user.id)
                .permissionsIn(message.channel)
                .has(PermissionsBitField.Flags.EmbedLinks)
        )
            return await message
                .reply({
                    content: `I don't have **\`EMBED_LINKS\`** permission to execute this **\`${command.name}\`** command.`,
                })
                .catch(() => {});
        // Permission for handler
        if (command.permissions) {
            if (command.permissions.client) {
                if (
                    !message.guild.members.cache
                        .get(client.user.id)
                        .permissionsIn(message.channel)
                        .has(
                            PermissionsBitField.resolve(
                                command.permissions.client,
                            ) || [],
                        )
                )
                    return await client.util.oops(
                        message.channel,
                        `I don't have \`${command.permissions.client.join(", ")}\` permission(s) to execute this command.`,
                        color,
                    );
            }
            if (command.permissions.user) {
                if (
                    !message.guild.members.cache
                        .get(message.author.id)
                        .permissionsIn(message.channel)
                        .has(
                            PermissionsBitField.resolve(
                                command.permissions.user,
                            ) || [],
                        )
                )
                    return await client.util.oops(
                        message.channel,
                        `You don't have \`${command.permissions.user.join(", ")}\` permissions to use this command.`,
                        color,
                    );
            }
            if (command.permissions.dev) {
                if (client.owners) {
                    const findDev = client.owners.find(
                        (x) => x === message.author.id,
                    );
                    if (!findDev)
                        return message.reply({
                            content: `Sorry! This is a owner based command you cant use it.`,
                        });
                }
            }
            if (
                command.permissions.voteRequired &&
                !client.owners.includes(message.author.id)
            ) {
                let voted = await client.Topgg.hasVoted(message.author.id);
                if (!voted) {
                    return message.reply({
                        embeds: [
                            client
                                .embed()
                                .setColor(client.color)
                                .setDescription(
                                    `You Need To [Vote](https://top.gg/bot/1280309734926450761/vote) For Me To Use This Command!`,
                                ),
                        ],
                        components: [
                            client
                                .row()
                                .addComponents(
                                    client
                                        .button()
                                        .setStyle(client.config.button.link)
                                        .setLabel("Vote")
                                        .setURL(
                                            "https://top.gg/bot/1280309734926450761/vote",
                                        ),
                                ),
                        ],
                    });
                }
            }
        }
        const dispatcher = client.dispatcher.players.get(message.guildId);
        // const dispatcher = client
        if (command.player) {
            if (command.player.voice) {
                if (!message.member.voice.channel)
                    return await client.util.oops(
                        message.channel,
                        `You must be connected to a voice channel to use this \`${command.name}\` command.`,
                        color,
                    );
                if (
                    !message.guild.members.cache
                        .get(client.user.id)
                        .permissionsIn(message.channel)
                        .has(PermissionsBitField.Flags.Connect)
                )
                    return await client.util.oops(
                        message.channel,
                        `I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`,
                        color,
                    );
                if (
                    !message.guild.members.cache
                        .get(client.user.id)
                        .permissionsIn(message.channel)
                        .has(PermissionsBitField.Flags.Speak)
                )
                    return await client.util.oops(
                        message.channel,
                        `I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`,
                        color,
                    );
                if (
                    message.member.voice.channel.type ==
                        ChannelType.GuildStageVoice &&
                    !message.guild.members.cache
                        .get(client.user.id)
                        .permissionsIn(message.channel)
                        .has(PermissionsBitField.Flags.RequestToSpeak)
                )
                    return await client.util.oops(
                        message.channel,
                        `I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`,
                        color,
                    );
                if (
                    message.guild.members.cache.get(client.user.id).voice
                        .channel
                ) {
                    if (
                        message.guild.members.cache.get(client.user.id).voice
                            .channel !== message.member.voice.channel
                    )
                        return await client.util.oops(
                            message.channel,
                            `You are not connected to ${message.guild.members.cache.get(client.user.id).voice.channel} to use this \`${command.name}\` command.`,
                            color,
                        );
                }
            }
            if (command.player.active) {
                const playerInstance = client.dispatcher.players.get(
                    message.guildId,
                );
                if (
                    !playerInstance ||
                    !playerInstance.queue ||
                    !playerInstance.queue.current
                )
                    return client.util.oops(
                        message.channel,
                        `Nothing is playing right now!`,
                        color,
                    );
            }
            if (command.player.dj) {
                let data = await DjSchema.findOne({ _id: message.guildId });
                let perm =
                    PermissionsBitField.Flags.MuteMembers ||
                    PermissionsBitField.Flags.ManageGuild ||
                    PermissionsBitField.Flags.Administrator;
                if (command.djPerm) perm = command.djPerm;
                if (!data) {
                    if (!message.member.permissions.has(perm))
                        return await client.util.oops(
                            message.channel,
                            `You don't have enough permissions or the dj role to use this command.`,
                            color,
                        );
                } else {
                    if (data.mode) {
                        let pass = false;
                        if (data.roles.length > 0) {
                            message.member.roles.cache.forEach((x) => {
                                let role = data.roles.find((r) => r === x.id);
                                if (role) pass = true;
                            });
                        }
                        if (!pass && !message.member.permissions.has(perm))
                            return await client.util.oops(
                                message.channel,
                                `You don't have enough permissions or the dj role to use this command.`,
                                color,
                            );
                    }
                }
            }
        }

        if (command.permissions.isPremium) {
            let premium = await client.util.getPremiumUser(message);
            if (!premium)
                return await client.util.replyOops(
                    message,
                    `This command is only available for premium users.`,
                    color,
                );
        }

        if (command.args) {
            if (!args.length)
                return await client.util.invalidArgs(
                    command.name,
                    message,
                    "Please provide the required arguments.",
                    client,
                );
        }
        if (!client.Cooldown.has(command.name)) {
            client.Cooldown.set(command.name, new Collection());
        }
        const cooldown = client.Cooldown.get(command.name);
        let cooldownAmount =
            command.cooldown && command.cooldown > 0
                ? command.cooldown * 1000
                : 3000;
        if (
            cooldown.has(message.author.id) &&
            !client.owners.includes(message.member.id)
        ) {
            let expiretime = cooldown.get(message.author.id);
            let timeleft = cooldownAmount - (Date.now() - expiretime);

            if (timeleft > 0)
                return await client.util.oops(
                    message.channel,
                    `Please wait for \`[ ${client.util.msToTime(timeleft)} ]\` before reusing the \`${command.name}\` command!`,
                    color,
                );
        } else {
            cooldown.set(message.author.id, Date.now());
        }

        setTimeout(() => {
            if (cooldown.has(message.author.id))
                return cooldown.delete(message.author.id);
        }, cooldownAmount);
        try {
            return await command.execute(
                client,
                message,
                args,
                prefix,
                color,
                dispatcher,
            );
        } catch (error) {
            const errorEmbed = client.embed()
            .setTitle("Error")
            .setDescription("An unexpected error occurred, the developers have been notified!")
            .setColor(color); // You can use any color you prefer
    
        await message.reply({ embeds: [errorEmbed] }).catch(() => {});
        console.error(error);
    }
    },
});
