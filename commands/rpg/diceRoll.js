const rand = require('../../lib/randomSeed').randomWithLimits
module.exports = {
    name: 'roll',
    description: 'Roll dice simple as that',
    execute: async function (msg, args = []) {
        let finalmessage = {}
        let finalmessageString = ""
        let finalSum = 0
        let sum = args.includes('+')
        let private = args.includes('p')
        args = args.filter((el) => el !== "+" && el !== "p")
        args.forEach(element => {
            let data = element.split('d')
            if (data[0] === "") data[0] = 1
            finalmessage[element] = {}
            finalmessage[element].values = []
            if (sum) {
                finalmessage[element].sum = 0
            }

            for (let index = 0; index < Number.parseInt(data[0]); index++) {
                let randNmber = rand(1, Number.parseInt(data[1]) + 1)
                finalmessage[element].values.push(randNmber)
                if (sum) {
                    finalmessage[element].sum += randNmber
                    finalSum += randNmber
                }
            }

        });

        for (const key in finalmessage) {
            if (finalmessage.hasOwnProperty(key)) {
                const element = finalmessage[key];
                finalmessageString += `The ${key} rolled ${element.values} `
                if (sum) {
                    finalmessageString += `for a total of ${element.sum}`
                }

                finalmessageString += "\n"
            }
        }
        if (sum && args.length !== 1) {
            finalmessageString += `\n\n All rolls add up to ${finalSum}`
        }

        if(private){
            bot.say({
                title: "🎲 rolling dices",
                channel:  await msg.channel,
                message: "Sending roll in private mode"
            })
            bot.say({
                title: "🎲 rolling dices",
                channel:  await msg.author.createDM(),
                message: finalmessageString
            })
            return

        }
        bot.say({
            title: "🎲 rolling dices",
            channel: msg.channel,
            message: finalmessageString
        })
    }
}


