const Redeem = require('../../Models/Reedem.js');
const Premium = require('../../Models/Premium.js');
const moment = require('moment')
var voucher_codes = require('voucher-code-generator');

module.exports = new Object({
    name: 'redeem',
    description: 'Redeem a premium code',
    category: 'Premium',
    usage: '[code]',
    cooldown: 10,
    aliases: ['re'],
    examples: ['re', 're 1234-1234-1234-1234'],
    sub_Commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
        voteRequired: false
    },
    player: { voice: false, active: false, dj: false, djPerm: null },

    async execute(client, message, args, prefix, color) {
        let member = await Premium.findOne({ Id: message.author.id });
        let code = args[0];
        if (!code) return client.util.replyOops(message, 'Please provide a code to redeem.', color);

        if (member && member.isPremium) return client.util.replyOops(message, 'You already have a premium plan.', color);

        const premium = await Redeem.findOne({ code: code.toLocaleUpperCase() });
        if (premium) {
            const expiresAt = moment(premium.expiresAt).format('dddd, MMMM Do YYYY HH:mm:ss');
            member = new Premium({
                Id: message.author.id,
                isPremium: true,
                premium: {
                    redeemedBy: [message.author.id],
                    redeemedAt: Date.now(),
                    expiresAt: premium.expiresAt,
                    plan: premium.plan
                }
            })
            member = await member.save({ new: true }).catch(() => { })
            client.premiums.set(message.author.id, member)

            const embed = client.embed()
                .setTitle('Premium Redeemed')
                .setDescription(`**•** You have redeemed a premium code for the \`${premium.plan}\` plan.\n\n**•** Your premium will expire on \`${expiresAt}\`.`)
                .setColor(color)
                .setTimestamp()

            return await message.reply({ embeds: [embed]});
        } else {
            return client.util.replyOops(message, 'This code is invalid or has already been redeemed.', color);
        }
    }
})