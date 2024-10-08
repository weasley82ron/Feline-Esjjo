const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the server song queue.'),

    async execute(interaction, client) {
        let dispatcher = client.dispatcher.players.get(interaction.guild.id);

        if (!dispatcher || !dispatcher.queue.length) {
            return interaction.reply({
                embeds: [
                    client.embed()
                        .setColor(client.config.redColor || "#faeb27") // Default to red if no color is set
                        .setDescription(`Now Playing - [${dispatcher.queue.current.title}](${dispatcher.queue.current.uri})`),
                ],
                ephemeral: true
            });
        }

        const queuedSongs = dispatcher.queue.map((track, i) => 
            `\`${i + 1}.\` [${track.title.length > 64 ? track.title.substring(0, 64) + '...' : track.title}](${track.uri}) | (${track.isStream ? 'LIVE' : client.util.duration(track.length)}) | ${track.requester}\n`
        );

        const mapping = client.util.chunk(queuedSongs, 10);
        const pages = mapping.map((s) => s.join('\n'));
        let page = 0;

        if (queuedSongs.length <= 10) {
            return interaction.reply({
                embeds: [
                    client.embed()
                        .setColor(client.config.embedColor || "#faeb27") // Default color if not set
                        .setAuthor({ name: 'Queue', url: client.config.links.support, iconURL: client.user.displayAvatarURL() })
                        .setDescription(`**Queued Songs**\n\n${pages[page]}`),
                ],
            });
        } else {
            const but1 = new ButtonBuilder()
                .setCustomId('queue_cmd_but_1')
                .setLabel('Next')
                .setStyle(ButtonStyle.Secondary);

            const but2 = new ButtonBuilder()
                .setCustomId('queue_cmd_but_2')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Secondary);

            const but3 = new ButtonBuilder()
                .setCustomId('queue_cmd_but_3')
                .setLabel(`${page + 1}/${pages.length}`)
                .setStyle(ButtonStyle.Success)
                .setDisabled(true);

            const but4 = new ButtonBuilder()
                .setCustomId('queue_cmd_but_4')
                .setLabel('Last')
                .setStyle(ButtonStyle.Secondary);

            const but5 = new ButtonBuilder()
                .setCustomId('queue_cmd_but_5')
                .setLabel('First')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder()
                .addComponents([but5.setDisabled(true), but2, but3, but1, but4]);

            const msg = await interaction.reply({
                embeds: [
                    client.embed()
                        .setColor(client.config.embedColor || "#faeb27") // Default color if not set
                        .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                        .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.user.displayAvatarURL() })
                        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                ],
                components: [row],
                fetchReply: true
            });

            const collector = msg.createMessageComponentCollector({
                filter: (btn) => btn.user.id === interaction.user.id,
                time: 60000 * 5,
                idle: 30000
            });

            collector.on('collect', async (btn) => {
                if (!btn.replied) btn.deferUpdate().catch(() => {});

                if (btn.customId === 'queue_cmd_but_1') {
                    page = page + 1 < pages.length ? ++page : 0;
                    const d_but4 = page === pages.length - 1;
                    const d_but5 = page === 0;

                    await msg.edit({
                        embeds: [
                            client.embed()
                                .setColor(client.config.embedColor || "#faeb27") // Default color if not set
                                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                                .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.user.displayAvatarURL() })
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                        ],
                        components: [new ActionRowBuilder()
                            .addComponents([
                                but5.setDisabled(d_but5),
                                but2,
                                but3.setLabel(`Page ${page + 1}/${pages.length}`),
                                but1,
                                but4.setDisabled(d_but4)
                            ])
                        ],
                    });
                } else if (btn.customId === 'queue_cmd_but_2') {
                    page = page > 0 ? --page : pages.length - 1;
                    const d_but4 = page === pages.length - 1;
                    const d_but5 = page === 0;

                    await msg.edit({
                        embeds: [
                            client.embed()
                                .setColor(client.config.embedColor || "#faeb27") // Default color if not set
                                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                                .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.user.displayAvatarURL() })
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                        ],
                        components: [new ActionRowBuilder()
                            .addComponents([
                                but5.setDisabled(d_but5),
                                but2,
                                but3.setLabel(`Page ${page + 1}/${pages.length}`),
                                but1,
                                but4.setDisabled(d_but4)
                            ])
                        ],
                    });
                } else if (btn.customId === 'queue_cmd_but_4') {
                    page = pages.length - 1;
                    const d_but4 = page === pages.length - 1;
                    const d_but5 = page === 0;

                    await msg.edit({
                        embeds: [
                            client.embed()
                                .setColor(client.config.embedColor || "#faeb27") // Default color if not set
                                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                                .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.user.displayAvatarURL() })
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                        ],
                        components: [new ActionRowBuilder()
                            .addComponents([
                                but5.setDisabled(d_but5),
                                but2,
                                but3.setLabel(`Page ${page + 1}/${pages.length}`),
                                but1,
                                but4.setDisabled(d_but4)
                            ])
                        ],
                    });
                } else if (btn.customId === 'queue_cmd_but_5') {
                    page = 0;
                    const d_but4 = page === pages.length - 1;
                    const d_but5 = page === 0;

                    await msg.edit({
                        embeds: [
                            client.embed()
                                .setColor(client.config.embedColor || "#faeb27") // Default color if not set
                                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                                .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.user.displayAvatarURL() })
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                        ],
                        components: [new ActionRowBuilder()
                            .addComponents([
                                but5.setDisabled(d_but5),
                                but2,
                                but3.setLabel(`Page ${page + 1}/${pages.length}`),
                                but1,
                                but4.setDisabled(d_but4)
                            ])
                        ],
                    });
                }
            });

            collector.on('end', async () => {
                if (msg) {
                    await msg.edit({ components: [new ActionRowBuilder()
                        .addComponents([
                            but5.setDisabled(true),
                            but2.setDisabled(true),
                            but3,
                            but1.setDisabled(true),
                            but4.setDisabled(true)
                        ])
                    ]});
                }
            });
        }
    }
};
