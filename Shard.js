const { Token } = require("./Config");
const { ShardingManager } = require("discord.js");
const log = require("./Utility/Console");
const manager = new ShardingManager("./Main.js", {
    respawn: true,
    autoSpawn: true,
    token: Token,
    totalShards: 2,
    shardList: [1],
});

manager
    .spawn({ amount: manager.totalShards, delay: null, timeout: -1 })
    .then((shards) => {
        log.log(`Launched ${shards.size} shards.`, "client");
    })
    .catch((err) => {
        log.log(`Failed to launch shards.`, "error");
        log.log(err, "error");
    });

manager.on("shardCreate", (shard) => {
    shard.on("ready", () => {
        log.log(`Shard ${shard.id} is ready.`, "client");
    });
});
