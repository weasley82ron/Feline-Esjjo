const { ChannelType, PermissionFlagsBits } = require("discord.js");
const db = require("../../Models/Setup");

module.exports = new Object({
    name: "setup",
    description: "To setup song-request-channel for the server.",
    category: "Settings",
    usage: "",
    cooldown: 10,
    usage: "",
    aliases: [],
    examples: ["setup", "setup clear", "setup info"],
    sub_commands: ["change <channel_id>", "clear"],
    args: false,
    permissions: {
        client: ["Administrator", "ManageGuild"],
        user: ["Administrator", "ManageGuild"],
        dev: false,
         isPremium: true,
        voteRequired: false,
    },
    player: { voice: false, active: false, dj: false, djPerm: null },

    async execute(client, message, args, prefix, color, dispatcher) {
        PermissionFlagsBits.Connect;
        let data = await db.findOne({ _id: message.guildId });
        if (args.length) {
            if (["clear", "delete", "reset"].includes(args[0])) {
                if (!data)
                    return await client.util.good(
                        message.channel,
                        "This server doesn't have done any setup configuration yet to use this command.",
                        color,
                    );
                await data.delete();
                return await client.util.good(
                    message.channel,
                    `Successfully deleted all the setup data.`,
                    color,
                );
            } else if (["info", "stats"].includes(args[0])) {
                if (!data)
                    return await client.util.good(
                        message.channel,
                        "This server doesn't have done any setup configuration yet to use this command.",
                        color,
                    );
                const embed003 = client
                    .embed()
                    .setColor(color)
                    .setTitle("Setup Info/Stats")
                    .setAuthor({
                        name: message.guild.name,
                        iconURL: message.guild.iconURL({ dynamic: true }),
                        url: client.config.links.support,
                    })
                    .addFields([
                        {
                            name: "Channel",
                            value: `<#${data.channel}> (\`id: ${data.channel}\`)`,
                            inline: false,
                        },
                        {
                            name: "Moderator",
                            value: `<@${data.moderator}> (\`id: ${data.moderator}\`)`,
                            inline: false,
                        },
                        {
                            name: "Last Updated",
                            value: `<t:${data.lastUpdated}>`,
                            inline: false,
                        },
                    ]);
                return await message
                    .reply({ embeds: [embed003] })
                    .catch(() => {});
            } else
                return await client.util.invalidArgs(
                    "setup",
                    message,
                    "Please provide a valid sub command.",
                    client,
                );
        } else {
            if (data)
                return await client.util.oops(
                    message.channel,
                    `Music setup is already finished in this server.`,
                    color,
                );

            const textChannel = await message.guild.channels.create({
                name: `${client.user.username}-song-requests`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        type: "member",
                        id: client.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.EmbedLinks,
                            PermissionFlagsBits.ReadMessageHistory,
                        ],
                        deny: [PermissionFlagsBits.UseApplicationCommands],
                    },
                    {
                        type: "role",
                        id: message.guild.roles.everyone.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                        ],
                        deny: [PermissionFlagsBits.UseApplicationCommands],
                    },
                ],
            });
            let disabled = true;
            const player = client.dispatcher.players.get(message.guildId);
            if (player) disabled = false;

            const pausebut = client
                .button()
                .setCustomId("pause_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const lowvolumebut = client
                .button()
                .setCustomId("lowvolume_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const highvolumebut = client
                .button()
                .setCustomId("highvolume_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const previousbut = client
                .button()
                .setCustomId("previous_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const skipbut = client
                .button()
                .setCustomId("skipbut_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const rewindbut = client
                .button()
                .setCustomId("rewindbut_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const forwardbut = client
                .button()
                .setCustomId("forward_but")
                .setEmoji("<:supremenext:960586821614583842>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const toggleautoplaybut = client
                .button()
                .setCustomId("autoplay_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const loopmodesbut = client
                .button()
                .setCustomId("loopmodesbut_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const stopbut = client
                .button()
                .setCustomId("stop_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(disabled);
            const row1 = client
                .row()
                .addComponents([
                    lowvolumebut,
                    previousbut,
                    pausebut,
                    skipbut,
                    highvolumebut,
                ]);
            const row2 = client
                .row()
                .addComponents([
                    rewindbut,
                    toggleautoplaybut,
                    stopbut,
                    loopmodesbut,
                    forwardbut,
                ]);
            const embed1 = client
                .embed()
                .setColor(color)
                .setTitle("Nothing playing right now")
                .setDescription(
                    `• [Invite](${client.config.links.invite}) • [Vote](${client.config.links.vote}) • [Support Server](${client.config.links.support})`,
                )
                .setFooter({
                    text: `Thanks for using ${client.user.username}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setImage(client.config.links.bg);

            const msg = await textChannel.send({
                content: "**Setup on progress...**",
            });

            data = new db({
                _id: message.guildId,
                channel: textChannel.id,
                setuped: true,
                message: msg.id,
                moderator: message.author.id,
                lastUpdated: Math.round(Date.now() / 1000),
            });
            await data.save();
            if (dispatcher && dispatcher.queue.current) {
                const embed1 = client
                    .embed()
                    .setColor(client.color)
                    .setDescription(
                        `**__Queue List:__**\n\n${client.util.trimArray(dispatcher.queue.map((track, i) => `\`${++i}.\` ${track.title} (${client.util.duration(track.length)}) - ${track.requester}`))}`,
                    )
                    .setFooter({
                        text: `${dispatcher.queue.current ? `Powered by ${dispatcher.queue.current.sourceName}` : ""}`,
                    });

                const spotify = "<:topggModerator:1264268470070280346>";
                const icon = client.config.links.bg;
                const embed2 = client
                    .embed()
                    .setTitle("Now Playing")
                    .setColor(client.color)
                    .setDescription(
                        `${spotify} **[${dispatcher.queue.current.title}](${dispatcher.queue.current.uri})**`,
                    )
                    .addFields(
                        {
                            name: "Duration",
                            value: dispatcher.queue.current.isStream
                                ? `\`LIVE\``
                                : `\`${client.util.duration(dispatcher.queue.current.length)}\``,
                            inline: true,
                        },
                        {
                            name: "Author",
                            value: `${dispatcher.queue.current.author}`,
                            inline: true,
                        },
                        {
                            name: "Requested By",
                            value: `${dispatcher.queue.current.requester}`,
                            inline: true,
                        },
                    )
                    .setImage(icon)
                    .setFooter({
                        text: `Volume: ${dispatcher.volume * 100}%  •  Autoplay: ${dispatcher.data.get("autoplay") ? "On" : "off"}  •  Loop: ${dispatcher.loop !== "none" ? (dispatcher.loop === "track" ? "Track" : "Queue") : "Off"}${dispatcher.paused ? "  •  Song: paused" : ""}`,
                        iconURL:
                            dispatcher.queue.current.requester.displayAvatarURL(
                                { dynamic: true },
                            ),
                    });
                if (dispatcher.queue?.length)
                    msg.edit({
                        content:
                            "__**Join a voice channel and queue songs by name/url**__\n\n",
                        embeds: [embed1, embed2],
                        components: [row1, row2],
                    });
                else
                    msg.edit({
                        content:
                            "__**Join a voice channel and queue songs by name/url**__\n\n",
                        embeds: [embed2],
                        components: [row1, row2],
                    });
            } else
                msg.edit({
                    content:
                        "__**Join a voice channel and queue songs by name/url**__\n\n",
                    embeds: [embed1],
                    components: [row1, row2],
                });

            return await message.reply({
                embeds: [
                    client
                        .embed()
                        .setColor(color)
                        .setDescription(
                            `**Song request channel has been created!**\n\nChannel: ${textChannel}\n*You can rename and move this channel if you want to*.\n\n*Note: Deleting the template embed in there may cause this setup to stop working. (Please don't delete it.)*`,
                        ),
                ],
            });
        }
    },
});
