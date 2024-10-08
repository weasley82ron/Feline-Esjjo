const Premium = require('../../Models/Premium.js');
const moment = require('moment')
var voucher_codes = require('voucher-code-generator')

module.exports = new Object({
    name: 'removepremium',
    description: 'Remove premium from a user',
    category: 'Premium',
    usage: '[user]',
    cooldown: 10,
    aliases: ['removeprem', 'remove-prem', 'remove-premium', 'rp'],
    examples: ['removepremium @user', 'removepremium 123456789012345678'],
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
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) return client.util.replyOops(message, 'Please provide a user to remove premium from.', color);

        const db = await Premium.findOne({ Id: user.id });
        if (db.isPremium) {
            db.isPremium = false
            db.premium.redeemedBy = []
            db.premium.redeemedAt = null
            db.premium.expiresAt = null
            db.premium.plan = null
            await db.save({ new: true }).catch(() => { })
            client.premiums.set(db.Id, db)
            return message.reply({ content: `Successfully removed premium from \`${user.tag}\`.` });
        } else {
            return client.util.replyOops(message, 'This user does not have premium.', color);
        }
    }
})