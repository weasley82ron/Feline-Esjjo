module.exports = new Object({
    name: "help",
    description: "Shows bot’s help panel.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: "[command_name]",
    aliases: ["h", "commands", "cmds"],
    examples: ["help", "help play", "help p"],
    sub_Commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
        voteRequired: false,
    },
    player: { voice: false, active: false, dj: false, djPerm: null },

    async execute(client, message, args, prefix, color) {
        if (args.length) {
            let name, c;
            const categories = ["Music", "Filters", "Settings", "Misc"];
            const categoryMap = {
                music: "Music",
                filters: "Filters",
                settings: "Settings",
                config: "Settings",
                misc: "Misc",
            };

            if (Object.keys(categoryMap).includes(args[0].toLowerCase())) {
                name = categoryMap[args[0].toLowerCase()];
                c = client.Commands.filter(
                    (x) => x.category && x.category === name,
                ).map((x) => `\`${x.name}\``);

                return await message
                    .reply({
                        embeds: [
                            client
                                .embed()
                                .setColor(color)
                                .setTitle(`${name} Commands`)
                                .setDescription(c.join(", "))
                                .setFooter({
                                    text: `Total ${c.length} ${name.toLowerCase()} Commands.`,
                                }),
                        ],
                    })
                    .catch(() => {});
            } else {
                const command =
                    client.Commands.get(args[0]) ||
                    client.Commands.get(client.Aliases.get(args[0]));
                if (!command)
                    return await client.util.oops(
                        message.channel,
                        `Cannot find the command called "${args[0]}"`,
                        color,
                    );

                let commandAliases = [];
                if (Array.isArray(command.aliases))
                    for (let i of command.aliases)
                        commandAliases.push(`${prefix}${i}`);

                let commandExamples = [];
                if (Array.isArray(command.examples))
                    for (let i of command.examples)
                        commandExamples.push(`${prefix}${i}`);

                let CommandsubCommands = [];
                if (Array.isArray(command.sub_Commands))
                    for (i of command.sub_Commands)
                        CommandsubCommands.push(
                            `${prefix}${command.name} ${i}`,
                        );

                const fieldData = [
                    {
                        name: "・Usage",
                        value: `> <:dotpurple:1279760074591440999> ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\``}`,
                        inline: false,
                    },
                    {
                        name: "・Cooldown",
                        value: `> <:dotpurple:1279760074591440999> ${command.cooldown ? `\`[ ${client.util.msToTime(1000 * command.cooldown)} ]\`` : "`[ 3s ]`"}`,
                        inline: false,
                    },
                    {
                        name: "・Category",
                        value: `> <:dotpurple:1279760074591440999> ${command.category ? command.category : "None"}`,
                        inline: false,
                    },
                ];

                if (commandAliases.length > 0)
                    fieldData.push({
                        name: "・Aliases",
                        value: `> <:dotpurple:1279760074591440999> ${commandAliases.map((x) => `\`${x}\``).join(", ")}`,
                        inline: false,
                    });

                if (
                    CommandsubCommands.length > 0 &&
                    CommandsubCommands.length < 5
                )
                    fieldData.push({
                        name: "Sub command(s)",
                        value: `> <:dotpurple:1279760074591440999> ${CommandsubCommands.map((x) => `\`${x}\``).join("\n")}`,
                        inline: false,
                    });

                if (commandExamples.length > 0 && commandExamples.length < 5)
                    fieldData.push({
                        name: "・Example(s)",
                        value: `> <:dotpurple:1279760074591440999> ${commandExamples.map((x) => `\`${x}\``).join("\n")}`,
                        inline: false,
                    });

                if (
                    CommandsubCommands.length >= 5 ||
                    commandExamples.length >= 5
                ) {
                    for (let i of fieldData) i.inline = true;

                    const embed1 = client
                        .embed()
                        .setColor(color)
                        .setDescription(command.description)
                        .setTitle(`__${command.name}__ Command Help`)
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true,
                            }),
                        })
                        .addFields(fieldData);

                    const fieldData2 = [];
                    if (CommandsubCommands.length > 0)
                        fieldData2.push({
                            name: "・Sub command(s)",
                            value: `> <:dotpurple:1279760074591440999> ${CommandsubCommands.map((x) => `\`${x}\``).join("\n")}`,
                            inline: true,
                        });

                    if (commandExamples.length > 0)
                        fieldData2.push({
                            name: "・Example(s)",
                            value: `> <:dotpurple:1279760074591440999> ${commandExamples.map((x) => `\`${x}\``).join("\n")}`,
                            inline: true,
                        });

                    const embed2 = client
                        .embed()
                        .setColor(color)
                        .setDescription(command.description)
                        .setTitle(`__${command.name}__ Command Help`)
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true,
                            }),
                        })
                        .addFields(fieldData2);

                    const pages = [embed1, embed2];
                    let page = 0;

                    embed2.setFooter({
                        text: `Page ${page + 1} of ${pages.length}`,
                    });
                    embed1.setFooter({
                        text: `Page ${page + 1} of ${pages.length}`,
                    });

                    const previousbut = client
                        .button()
                        .setCustomId("previous_but_help_cmd")
                        .setEmoji("⬅️")
                        .setStyle(client.config.button.grey);
                    const nextbut = client
                        .button()
                        .setCustomId("next_but_help_cmd")
                        .setEmoji("➡️")
                        .setStyle(client.config.button.grey);

                    const m = await message.reply({
                        embeds: [pages[page]],
                        components: [
                            client.row().addComponents(previousbut, nextbut),
                        ],
                    });

                    const collector = m.createMessageComponentCollector({
                        filter: (b) =>
                            b.user.id === message.author.id
                                ? true
                                : false && b.deferUpdate().catch(() => {}),
                        time: 60000 * 2,
                        idle: 60000,
                    });

                    collector.on("end", async () => {
                        if (!m) return;
                        await m
                            .edit({
                                components: [
                                    client
                                        .row()
                                        .addComponents(
                                            previousbut.setDisabled(true),
                                            nextbut.setDisabled(true),
                                        ),
                                ],
                            })
                            .catch(() => {});
                    });

                    collector.on("collect", async (button) => {
                        if (!button.deferred)
                            await button.deferUpdate().catch(() => {});
                        if (button.customId === "previous_but_help_cmd") {
                            page = page - 1 < 0 ? pages.length - 1 : --page;
                            if (!m) return;

                            pages[page].setFooter({
                                text: `Page ${page + 1} of ${pages.length}`,
                            });
                            return await m
                                .edit({ embeds: [pages[page]] })
                                .catch(() => {});
                        } else if (button.customId === "next_but_help_cmd") {
                            page = page + 1 >= pages.length ? 0 : ++page;
                            if (!m) return;
                            pages[page].setFooter({
                                text: `Page ${page + 1} of ${pages.length}`,
                            });
                            return await m
                                .edit({ embeds: [pages[page]] })
                                .catch(() => {});
                        } else return;
                    });
                } else {
                    const embed2 = client
                        .embed()
                        .setColor(color)
                        .setDescription(command.description)
                        .setTitle(`__${command.name}__ Command Help`)
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true,
                            }),
                        })
                        .addFields(fieldData);
                    return await message
                        .reply({ embeds: [embed2] })
                        .catch(() => {});
                }
            }
        } else {
            const embed = client
                .embed()
                .setTitle(`A minimalist music bot`)
                .setDescription(
                    `
<:eg_fire:1284169309622370388> ***___Command Categories___*** - 
> <:music:1284169299870879794> - **Music**: Manage music playback in your server.
> <:filters:1284169246263218226> - **Filters**: Apply various effects to improve sound quality.
> <:settings:1284169257269203018> - **Settings**: Configure bot preferences and server settings.
> <:misc:1284169290211131432> - **Misc**: General and utility commands for various tasks.

Use \`${prefix}help [category_name]\` to get commands for a specific category or \`${prefix}help [command_name]\` to get detailed help for a specific command.
                    `
                )
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(client.color)
                .setTimestamp()
                .setFooter({
                    text: `Requested by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                });

            const emojis = {
                Music: `<:music:1284169299870879794>`,
                Filters: `<:filters:1284169246263218226>`,
                Settings: `<:settings:1284169257269203018>`,
                Misc: `<:misc:1284169290211131432>`,
                Premium: `<:premium:1284169236901789799>`,
            };
            const selectMenuArray = [];

            for (const category of client.Commands.map(
                (x) => x.category,
            ).filter((x, i, a) => a.indexOf(x) === i)) {
                if (category === "Developers") continue;
                selectMenuArray.push({
                    label: category,
                    value: category,
                    description: `View ${category} commands`,
                    emoji: emojis[category],
                });
            }
            const selectMenuRow = client
                .row()
                .addComponents(
                    client
                        .menu()
                        .setCustomId("HELP_SELECT_MENU")
                        .setPlaceholder("Nothing selected")
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(selectMenuArray),
                );
            const m = await message.reply({
                embeds: [embed],
                components: [selectMenuRow],
            });

            const collector = m.createMessageComponentCollector({
                filter: (b) => {
                    if (b.user.id === message.author.id) return true;
                    else {
                        b.reply({
                            ephemeral: true,
                            content: `Only **${message.author.tag}** can use this button, if you want then you've to run the command again.`,
                        });
                        return false;
                    }
                },
                time: 30000,
                idle: 60000,
            });
            collector.on("end", async () => {
                if (!m) return;
                return m.edit({ components: [] }).catch(() => {});
            });

            collector.on("collect", async (interaction) => {
                if (interaction.customId != "HELP_SELECT_MENU") return;
                interaction.deferUpdate();
                const selected = interaction.values[0];
                const categoryName = selected;
                const cmds = client.Commands.filter(
                    (x) => x.category && x.category === categoryName,
                ).map((x) => `\`${x.name}\``);
                const embed1 = client
                    .embed()
                    .setColor(client.color)
                    .setTitle(
                        `${categoryName} commands`,
                    )
                    .setDescription(cmds.join(", "))
                    .setFooter({
                        text: `Total ${cmds.length} ${categoryName} commands.`,
                    });
                if (m)
                    await m.edit({
                        embeds: [embed1],
                        components: [selectMenuRow],
                    });
            });
        }
    },
});
