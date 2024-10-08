const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    Collection,
} = require("discord.js");
const setupSchema = require("../Models/Setup");

async function trackStartHandler(
    msgId,
    channel,
    dispatcher,
    track,
    client,
    color,
) {
    try {
        let message;
        try {
            message = await channel.messages.fetch(msgId, { cache: true });
        } catch (error) {}
        if (!message) {
            let sourceicon = client.user.displayAvatarURL();
            if (dispatcher.queue.current.sourceName === "Spotify") {
                sourceicon = client.config.links.spotify;
            } else if (dispatcher.queue.current.sourceName === "soundcloud") {
                sourceicon = client.config.links.soundcloud;
            }
            const icon = client.config.links.bg;
            const embed2 = new EmbedBuilder()
                .setColor(color)
                .setTitle("Now Playing")
                .setDescription(`**[${track.title}](${track.uri})**`)
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
                    text: `Volume: ${dispatcher.volume * 100}%  •  Autoplay: ${dispatcher.data.get("autoplay") ? "enabled" : "disabled"}  •  Loop: ${dispatcher.loop !== "none" ? (dispatcher.loop === "track" ? "track" : "queue") : "disabled"}${dispatcher.paused ? "  •  Song: paused" : ""}`,
                    iconURL:
                        dispatcher.queue.current.requester.displayAvatarURL({
                            dynamic: true,
                        }),
                });

            const embed1 = new EmbedBuilder()
                .setColor(color)
                .setDescription(
                    `**__Queue List:__**\n\n${client.util.trimArray(dispatcher.queue.map((track, i) => `\`${++i}.\` ${track.title} (${client.util.duration(track.length)}) - ${track.requester}`))}`,
                )
                .setFooter({
                    text: `${dispatcher.queue.current ? `Powered by ${track.sourceName}` : ""}`,
                    iconURL: sourceicon,
                });

            const pausebut = new ButtonBuilder()
                .setCustomId("pause_but")
                .setEmoji("<:supremepause:960583476812341268>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const lowvolumebut = new ButtonBuilder()
                .setCustomId("lowvolume_but")
                .setEmoji("<:stolen_emoji:1099216134319919126>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const highvolumebut = new ButtonBuilder()
                .setCustomId("highvolume_but")
                .setEmoji("<:stolen_emoji:1099216455758774364>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const previousbut = new ButtonBuilder()
                .setCustomId("previous_but")
                .setEmoji("<:supremeback:960586658179346512>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const skipbut = new ButtonBuilder()
                .setCustomId("skipbut_but")
                .setEmoji("<:stolen_emoji:1099217061814751352>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const rewindbut = new ButtonBuilder()
                .setCustomId("rewindbut_but")
                .setEmoji("<:supremereplay:960594429914275931>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const forwardbut = new ButtonBuilder()
                .setCustomId("forward_but")
                .setEmoji("<:supremenext:960586821614583842>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const autoplaybut = new ButtonBuilder()
                .setCustomId("autoplay_but")
                .setEmoji("<:stolen_emoji:1099208341647015947>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const loopmodesbut = new ButtonBuilder()
                .setCustomId("loopmodesbut_but")
                .setEmoji("<:supremeloop:960606169968295946>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);
            const stopbut = new ButtonBuilder()
                .setCustomId("stop_but")
                .setEmoji("<:stolen_emoji:1099215378195943425>")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false);

            const row1 = new ActionRowBuilder().addComponents(
                lowvolumebut,
                previousbut,
                pausebut,
                skipbut,
                highvolumebut,
            );
            const row2 = new ActionRowBuilder().addComponents(
                rewindbut,
                autoplaybut,
                stopbut,
                loopmodesbut,
                forwardbut,
            );
            let m;
            if (dispatcher.queue?.length)
                m = await channel.send({ embeds: [embed1, embed2] });
            else
                m = await channel.send({
                    content:
                        "__**Join a voice channel and queue songs by name/url**__\n\n",
                    embeds: [embed2],
                    components: [row1, row2],
                });

            return await setupSchema.findOneAndUpdate(
                { _id: channel.guildId },
                { message: m.id },
            );
        } else {
            let sourceicon = client.user.displayAvatarURL();
            if (dispatcher.queue.current.sourceName === "Spotify") {
                sourceicon = client.config.links.spotify;
            } else if (dispatcher.queue.current.sourceName === "soundcloud") {
                sourceicon = client.config.links.soundcloud;
            }

            const icon = client.config.links.bg;
            const embed1 = new EmbedBuilder()
                .setColor(color)
                .setDescription(
                    `**__Queue List:__**\n\n${client.util.trimArray(dispatcher.queue.map((track, i) => `\`${++i}.\` ${track.title} (${client.util.duration(track.length)}) - ${track.requester}`))}`,
                )
                .setFooter({
                    text: `${dispatcher.queue.current ? `Powered by ${track.sourceName}` : ""}`,
                    iconURL: sourceicon,
                });

            const embed2 = new EmbedBuilder()
                .setColor(color)
                .setTitle("Now Playing")
                .setDescription(`**[${track.title}](${track.uri})**`)
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
                    text: `Volume: ${dispatcher.volume * 100}%  •  Autoplay: ${dispatcher.data.get("autoplay") ? "enabled" : "disabled"}  •  Loop: ${dispatcher.loop !== "none" ? (dispatcher.loop === "track" ? "track" : "queue") : "disabled"}${dispatcher.paused ? "  •  Song: paused" : ""}`,
                    iconURL:
                        dispatcher.queue.current.requester.displayAvatarURL({
                            dynamic: true,
                        }),
                });
            if (dispatcher.queue?.length)
                await message.edit({ embeds: [embed1, embed2] });
            else
                await message.edit({
                    content:
                        "__**Join a voice channel and queue songs by name/url**__\n\n",
                    embeds: [embed2],
                });
        }
    } catch (error) {
        return console.error(error);
    }
}

/**
 *
 * @param {TextChannel} channel
 * @param {String} args
 * @param {String} color
 */

async function oops(channel, args, color) {
    try {
        const embed1 = new EmbedBuilder()
            .setColor(color ? color : "#f50a83")
            .setDescription(`${args}`);
        const m = await channel.send({ embeds: [embed1] });

        setTimeout(async () => await m.delete().catch(() => {}), 12000);
    } catch (e) {
        return console.error(e);
    }
}

/**
 *
 * @param {String} query
 * @param {import("kazagumo").KazagumoPlayer} dispatcher
 * @param {import("discord.js").Message} message
 * @param {String} color
 * @param {import('../Main')} client
 */

async function playerhandler(query, dispatcher, message, color, client) {
    if (!client.ChannelCoolDown.has(message.channel.id)) {
        client.ChannelCoolDown.set(message.channel.id, new Collection());
    }
    const cooldown = client.ChannelCoolDown.get(message.channel.id);
    let cooldownAmount = 2500;
    if (
        cooldown.has(message.channel.id) &&
        !client.owners.includes(message.member.id)
    ) {
        let expiretime = cooldown.get(message.channel.id);
        let timeleft = cooldownAmount - (Date.now() - expiretime);

        if (timeleft > 0)
            return await client.util.oops(
                message.channel,
                `Please wait for \`[ ${client.util.msToTime(timeleft)} ]\` before reusing the  command!`,
                color,
            );
    } else {
        cooldown.set(message.channel.id, Date.now());
    }

    setTimeout(() => {
        if (cooldown.has(message.channel.id))
            return cooldown.delete(message.channel.id);
    }, cooldownAmount);
    if (
        /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(
            query,
        )
    ) {
        return await oops(
            message.channel,
            "As of recent events we've removed YouTube as a supported platform from Main.",
            color,
        );
    }
    const d = await setupSchema.findOne({ _id: message.guildId });
    try {
        if (d)
            m = await message.channel.messages.fetch(d.message, {
                cache: true,
            });
    } catch (e) {}
    if (dispatcher && dispatcher.state !== "CONNECTED")
        dispatcher = await message.client.dispatcher.createPlayer({
            guildId: message.guildId,
            voiceId: message.member.voice.channelId,
            textId: message.channelId,
            shardId: message.guild.shardId,
            deaf: true,
        });
    const { tracks, type, playlistName } = await dispatcher.search(query, {
        requester: message.author,
    });
    if (!tracks.length) {
        return client.util.oops(message.channel, "No songs found.", color);
    }
    if (type === "PLAYLIST") {
        for (const track of tracks) {
            dispatcher.queue.add(track);
            await client.util.update(dispatcher, client);
        }
        if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
        await message.channel
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription(
                            `Added **${tracks.length}** tracks from [${playlistName.length > 64 ? playlistName.substring(0, 64) + "..." : playlistName}](${query}) to the queue.`,
                        ),
                ],
            })
            .then((a) =>
                setTimeout(async () => await a.delete().catch(() => {}), 3000),
            )
            .catch(() => {});
    } else {
        dispatcher.queue.add(tracks[0]);
        await client.util.update(dispatcher, client);
        if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
    }
}

function duration(milliseconds) {
    const hours = milliseconds / (1000 * 60 * 60),
        absoluteHours = Math.floor(hours),
        h = absoluteHours > 9 ? absoluteHours : "0" + absoluteHours,
        minutes = (hours - absoluteHours) * 60,
        absoluteMinutes = Math.floor(minutes),
        m = absoluteMinutes > 9 ? absoluteMinutes : "0" + absoluteMinutes,
        seconds = (minutes - absoluteMinutes) * 60,
        absoluteSeconds = Math.floor(seconds),
        s = absoluteSeconds > 9 ? absoluteSeconds : "0" + absoluteSeconds;
    return h == 0 && m == 0
        ? "00:" + s
        : h == 0
          ? m + ":" + s
          : h + ":" + m + ":" + s;
}

function trimArray(array, maxLen = 5) {
    if (array.length > maxLen) {
        const len = array.length - maxLen;
        array = array.slice(0, maxLen);
        array.push(`\nAnd **${len}** more...`);
    }
    return array.join("\n");
}

module.exports = {
    oops,
    trackStartHandler,
    playerhandler,
    duration,
    trimArray,
};
