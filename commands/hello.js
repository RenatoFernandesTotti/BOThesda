module.exports = {
    name: 'hello',
    description: 'Hello test',
    execute(msg, args) {
        msg.channel.send(`> hallo`);
        msg.react('❤')
    }
}