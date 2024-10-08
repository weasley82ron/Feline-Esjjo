module.exports = new Object({
    name: 'ready',
    /**
     * @param {import("../../Main")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, name) {
        client.console.log(`${name}: Ready!`, 'node');
    },
});