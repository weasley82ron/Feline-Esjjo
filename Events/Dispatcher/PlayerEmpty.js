const db = require("../../Models/247"),
    setupdb = require("../../Models/Setup");
module.exports = new Object({
    name: "playerEmpty",
    /**
     *
     * @param {import("../../Main")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, dispatcher) {
        const color = client.color ? client.color : "#f50a83";
        const guild = client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;
        const channel = guild.channels.cache.get(dispatcher.textId);
        if (!channel) return;

        if (dispatcher.data.get("autoplay")) {
            const { tracks } = await dispatcher.search(
                `${dispatcher.queue.previous.author}`,
                { requester: client.user },
            );
            dispatcher.queue.add(tracks[~~(Math.random() * tracks.length)]);
            if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
            this.update(dispatcher, client);
        }

        const d2 = await setupdb.findOne({ _id: dispatcher.guildId });
        if (!d2) return;
        const chn = guild.channels.cache.get(d2.channel);
        if (!chn) return;
        let me;
        try {
            me = await chn.messages.fetch(d2.message, { cache: true });
        } catch (e) {}
        if (me) {
            const pausebut = client
                .button()
                .setCustomId("pause_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const lowvolumebut = client
                .button()
                .setCustomId("lowvolume_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const highvolumebut = client
                .button()
                .setCustomId("highvolume_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const previousbut = client
                .button()
                .setCustomId("previous_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const skipbut = client
                .button()
                .setCustomId("skipbut_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const rewindbut = client
                .button()
                .setCustomId("rewindbut_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const forwardbut = client
                .button()
                .setCustomId("forward_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const toggleautoplaybut = client
                .button()
                .setCustomId("autoplay_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const loopmodesbut = client
                .button()
                .setCustomId("loopmodesbut_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
            const stopbut = client
                .button()
                .setCustomId("stop_but")
                .setEmoji("<:topggModerator:1264268470070280346>")
                .setStyle(client.config.button.grey)
                .setDisabled(true);
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
            await me.edit({
                content:
                    "__**Join a voice channel and queue songs by name/url**__\n\n",
                embeds: [embed1],
                components: [row1, row2],
            });

            setTimeout(async () => {
                if (dispatcher && true) {
                    const e = await channel.send({
                        embeds: [
                            client
                                .embed()
                                .setColor(color)
                                .setAuthor({
                                    name: "Queue Concluded",
                                    iconURL: client.user.displayAvatarURL(),
                                    url: client.config.links.support,
                                })
                                .setDescription(
                                    `Enjoying music with me? Consider me by **[Inviting](${client.config.links.invite})**`,
                                ),
                        ],
                    });
                    if (dispatcher.state === "CONNECTED") dispatcher.destroy();
                    setTimeout(
                        async () => await e.delete().catch(() => {}),
                        5000,
                    );
                }
            }, 60000);
        }
    },
});
