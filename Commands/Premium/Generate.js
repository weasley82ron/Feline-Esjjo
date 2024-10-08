const Redeem = require('../../Models/Reedem.js');
const moment = require('moment')
var voucher_codes = require('voucher-code-generator')

module.exports = new Object({
    name: 'generate',
    description: 'Generate a premium code',
    category: 'Premium',
    usage: '[plan]',
    cooldown: 10,
    aliases: ['gen'],
    examples: ['gen', 'gen weekly', 'gen monthly', 'gen yearly'],
    sub_Commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: true,
        voteRequired: false
    },
    player: { voice: false, active: false, dj: false, djPerm: null },
  
    async execute(client, message, args, prefix, color) {
        let codes = new Array();
        const plan = args[0];
        const plans = ['daily', 'weekly', 'monthly', 'yearly'];
        if (!plans.includes(plan)) return client.util.replyOops(message, 'Please provide a plan to generate a code for. (daily, weekly, monthly, yearly)', color);

        let time;
        if (plan === 'daily') time = Date.now() + 86400000;
        if (plan === 'weekly') time = Date.now() + 86400000 * 7;
        if (plan === 'monthly') time = Date.now() + 86400000 * 30;
        if (plan === 'yearly') time = Date.now() + 86400000 * 365;

        let amount = args[1];
        if (!amount) amount = 1;

        for (var i = 0; i < amount; i++) {
            const codePremium = voucher_codes.generate({
                pattern: '####-####-####-####'
            })
            const code = codePremium.toString().toUpperCase()
            let find = await Redeem.findOne({ code: code })
            if (!find) {
                find = new Redeem({
                    code: code,
                    plan: plan,
                    expiresAt: time
                })
                codes.push(`${i + 1} - ${code}`)
                await find.save().catch(() => { })
            }
        }

        const embed = client.embed()
            .setAuthor({ name: 'Generated premium code', icon: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**•** *Generated* [\`${codes.length}\`]\n\`\`\`${codes.join('\n')}\`\`\`\n **•** *Plan*: \`${plan}\`\n **•** *Expires at*: \`${moment(time).format('dddd, MMMM Do YYYY')}\``)
            .setColor(color)
            .setTimestamp()

        return await message.reply({ embeds: [embed] })
    }
});