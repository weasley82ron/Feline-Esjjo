const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows the bot’s help panel.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Specify a command or category to get detailed help.')),

    async execute(interaction, client) {
        const args = interaction.options.getString('command')?.split(' ') || [];

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

                const embed = new EmbedBuilder()
                    .setColor('#0099ff') // Replace with your color
                    .setTitle(`${name} Commands`)
                    .setDescription(c.join(", "))
                    .setFooter({ text: `Total ${c.length} ${name.toLowerCase()} Commands.` });

                return interaction.reply({ embeds: [embed] });
            } else {
                const command =
                    client.Commands.get(args[0]) ||
                    client.Commands.get(client.Aliases.get(args[0]));
                if (!command)
                    return interaction.reply({
                        content: `Cannot find the command called "${args[0]}"`,
                        ephemeral: true
                    });

                let commandAliases = [];
                if (Array.isArray(command.aliases))
                    commandAliases = command.aliases.map(alias => `${alias}`);

                let commandExamples = [];
                if (Array.isArray(command.examples))
                    commandExamples = command.examples.map(example => `${example}`);

                let CommandsubCommands = [];
                if (Array.isArray(command.sub_Commands))
                    CommandsubCommands = command.sub_Commands.map(sub => `{command.name} ${sub}`);

                const fieldData = [
                    {
                        name: "・Usage",
                        value: `> ${command.usage ? `\`${command.name} ${command.usage}\`` : `\`${command.name}\``}`,
                    },
                    {
                        name: "・Cooldown",
                        value: `> ${command.cooldown ? `\`[ ${client.util.msToTime(1000 * command.cooldown)} ]\`` : "`[ 3s ]`"}`,
                    },
                    {
                        name: "・Category",
                        value: `> ${command.category ? command.category : "None"}`,
                    },
                ];

                if (commandAliases.length > 0)
                    fieldData.push({
                        name: "・Aliases",
                        value: `> ${commandAliases.map(alias => `\`${alias}\``).join(", ")}`,
                    });

                if (CommandsubCommands.length > 0 && CommandsubCommands.length < 5)
                    fieldData.push({
                        name: "Sub command(s)",
                        value: `> ${CommandsubCommands.map(sub => `\`${sub}\``).join("\n")}`,
                    });

                if (commandExamples.length > 0 && commandExamples.length < 5)
                    fieldData.push({
                        name: "・Example(s)",
                        value: `>>> ${commandExamples.map(example => `\`${example}\``).join("\n")}`,
                    });

                const embed = new EmbedBuilder()
                    .setColor('#0099ff') // Replace with your color
                    .setDescription(command.description)
                    .setTitle(`__${command.name}__ Command Help`)
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .addFields(fieldData);

                return interaction.reply({ embeds: [embed] });
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`A minimalist music bot`)
                .setDescription(
                    `
<:eg_fire:1284169309622370388> ***___Command Categories___*** - 
> <:music:1284169299870879794> - **Music**: Manage music playback in your server.
> <:filters:1284169246263218226> - **Filters**: Apply various effects to improve sound quality.
> <:settings:1284169257269203018> - **Settings**: Configure bot preferences and server settings.
> <:misc:1284169290211131432> - **Misc**: General and utility commands for various tasks.

Use \`/help [category_name]\` to get commands for a specific category or \`/help [command_name]\` to get detailed help for a specific command.
                    `
                )
                .setThumbnail(client.user.displayAvatarURL())
                .setColor('#0099ff') // Replace with your color
                .setTimestamp()
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
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

            const selectMenuRow = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('HELP_SELECT_MENU')
                        .setPlaceholder('Select a category')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(selectMenuArray),
                );

            const msg = await interaction.reply({
                embeds: [embed],
                components: [selectMenuRow],
                fetchReply: true
            });

            const collector = msg.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 30000,
                idle: 60000
            });

            collector.on('end', async () => {
                await msg.edit({ components: [] }).catch(() => {});
            });

            collector.on('collect', async (i) => {
                if (i.customId === 'HELP_SELECT_MENU') {
                    await i.deferUpdate();
                    const selected = i.values[0];
                    const categoryName = selected;
                    const cmds = client.Commands.filter(
                        (x) => x.category && x.category === categoryName,
                    ).map((x) => `\`${x.name}\``);

                    const embed1 = new EmbedBuilder()
                        .setColor('#0099ff') // Replace with your color
                        .setTitle(`${categoryName} commands`)
                        .setDescription(cmds.join(", "))
                        .setFooter({
                            text: `Total ${cmds.length} ${categoryName} commands.`,
                        });

                    await msg.edit({
                        embeds: [embed1],
                        components: [selectMenuRow]
                    });
                }
            });
        }
    },
};
