const Discord = require('discord.js');

module.exports = {
    /**
     * Formats the generic data of a clan for discord
     * @param response - The clan json received by the clash of clans api
     * @returns object - Returns the desired output in either string or embed format for discord
     */
    formatClanData: function (response) {
        if (response.reason === 'notFound') {
            return "Clan data is private. Please set war log to public."
        }
        return formatClanData(response)
    },
    /**
     * Formats the clans current war data for discord
     * @param response - The war json received from the clash of clans api
     * @returns object - Returns the desired output in either string or embed format for discord
     */
    formatCurrentStats: function (response) {
        if (response.reason === 'notFound') {
            return "Clan data is private. Please set war log to public."
        }
        return formatCurrentStats(response);
    },
    /**
     * Formats the help message for the bot. Displays all commands including user added commands
     * @param dict - The dictionary object that contains key:value pairs of user created commands
     * @returns {module:"discord.js".RichEmbed} - Returns the formatted content in a discord embed
     */
    formatHelp: function (dict) {
        //TODO: Add logic for user added commands to be displayed as well
        return new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle("CMK Clash Help")
            .addField('ping', "Checks to see if the bot is up.")
            .addField('*set {clantag}', "Sets the global clantag to use the stats command ex: *set #666666")
            .addField('*clan {clantag}', "Displays the general data about a clan. ex: *clan #666666")
            .addField('*stats', "Displays the current clans stats. Must have run *set clantag prior.")
            .addField('*add {key} {message}', "Adds a custom command to the bot. ex: *add Chance RZ's best th13.")
            .addField('*{key}', "Displays the custom command for the key provided")
            .addField('*remove {key}', "Removes the custom command for the key provided")
            .addField('*help', "Displays all commands and how to use them")
            .setTimestamp()
            .setFooter('Copyright: Chance#0187');
    },
    /**
     * Formats the stats data for a player
     * @param playerStats - The stats of the player we wish to display
     * @returns {module:"discord.js".RichEmbed} - Returns the formatted content in a discord embed
     */
    formatPlayerStats(playerStats) {
        let output = formatPlayerStats(playerStats);
        let embed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(playerStats[0].name)
            .setTimestamp()
            .setFooter('Copyright: Chance#0187');
        for (let i = 0; i < output.results.length; i++) {
            embed.addField(output.results[i].header, output.results[i].data);
        }
        return embed;
    }
};

/**
 * Formats the generic data of a clan for discord
 * @param response - The clan json received by the clash of clans api
 * @returns object - Returns the desired output in either string or embed format for discord
 */
function formatClanData(response) {
    return new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle(response.name)
        .setDescription(response.description)
        .setThumbnail(response.badgeUrls.small)
        .addField('Record', response.warWins + "-" + response.warLosses)
        .addField('Level', response.clanLevel, true)
        .addField('Win Streak', response.warWinStreak, true)
        .addField('Members: ', response.members)
        .setTimestamp()
        .setFooter('Copyright: Chance#0187');
}

function formatPlayerStats(playerStats) {
    let triples = 0;
    let tripleAttempts = 0;
    let dips = 0;
    let dipAttempts = 0;
    let hitups = 0;
    let hitupAttempts = 0;
    let doublehitups = 0;
    let doublehitupAttempts = 0;
    let triplehitups = 0;
    let triplehitupAttempts = 0;
    for (let i = 0; i < playerStats.length; i++) {
        //Checks for fair th attacks
        if (playerStats[i].thLevel === playerStats[i].enemyTHLevel && playerStats[i].stars === 3) {
            console.log("Triple Success");
            triples++;
            tripleAttempts++;
        } else if (playerStats[i].thLevel === playerStats[i].enemyTHLevel) {
            console.log("Triple Fail");
            tripleAttempts++;
        }
        //Checks for dip attacks
        if (playerStats[i].thLevel > playerStats[i].enemyTHLevel && playerStats[i].stars === 3) {
            console.log("Dip Triple");
            dips++;
            dipAttempts++;
        } else if (playerStats[i].thLevel > playerStats[i].enemyTHLevel) {
            console.log("Dip Fail");
            dipAttempts++;
        }
        //Checks for plus one attacks
        if ((playerStats[i].thLevel + 1) === playerStats[i].enemyTHLevel && playerStats[i].stars === 2) {
            console.log("Hitup Success");
            hitups++;
            hitupAttempts++;
        } else if ((playerStats[i].thLevel + 1) === playerStats[i].enemyTHLevel) {
            console.log("Hitup Fail");
            hitupAttempts++;

        }
        //Checks for plus two attacks
        if ((playerStats[i].thLevel + 2) === playerStats[i].enemyTHLevel && playerStats[i].stars === 2) {
            console.log("Double Hitup Success");
            doublehitups++;
            doublehitupAttempts++;
        } else if ((playerStats[i].thLevel + 2) === playerStats[i].enemyTHLevel) {
            console.log("Double Hitup Fail");
            doublehitupAttempts++;
        }

        //Checks for plus three attacks
        if ((playerStats[i].thLevel + 3) === playerStats[i].enemyTHLevel && playerStats[i].stars === 2) {
            console.log("Triple Hitup Success");
            triplehitups++;
            triplehitupAttempts++;
        } else if ((playerStats[i].thLevel + 2) === playerStats[i].enemyTHLevel) {
            console.log("Triple Hitup Fail");
            triplehitupAttempts++;
        }
    }
    if (playerStats[0].thLevel === 13) {
        return {
            "results": [
                {
                    "header": playerStats[0].thLevel + "v" + playerStats[0].thLevel,
                    "data": triples + "/" + tripleAttempts + " " + percentageCalc((triples / tripleAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel - 1),
                    "data": dips + "/" + dipAttempts + " " + percentageCalc((dips / dipAttempts).toFixed(2))
                }
            ]
        };
    }
    if (playerStats[0].thLevel === 12) {
        return {
            "results": [
                {
                    "header": playerStats[0].thLevel + "v" + playerStats[0].thLevel,
                    "data": triples + "/" + tripleAttempts + " " + percentageCalc((triples / tripleAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel - 1),
                    "data": dips + "/" + dipAttempts + " " + percentageCalc((dips / dipAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel + 1),
                    "data": hitups + "/" + hitupAttempts + " " + percentageCalc((hitups / hitupAttempts).toFixed(2))
                }
            ]
        };
    }

    if (playerStats[0].thLevel === 11) {
        return {
            "results": [
                {
                    "header": playerStats[0].thLevel + "v" + playerStats[0].thLevel,
                    "data": triples + "/" + tripleAttempts + " " + percentageCalc((triples / tripleAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel - 1),
                    "data": dips + "/" + dipAttempts + " " + percentageCalc((dips / dipAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel + 1),
                    "data": hitups + "/" + hitupAttempts + " " + percentageCalc((hitups / hitupAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel + 2),
                    "data": doublehitups + "/" + doublehitupAttempts + " " + percentageCalc((doublehitups / doublehitupAttempts).toFixed(2))
                }
            ]
        };
    }
    if (playerStats[0].thLevel === 10) {
        return {
            "results": [
                {
                    "header": playerStats[0].thLevel + "v" + playerStats[0].thLevel,
                    "data": triples + "/" + tripleAttempts + " " + percentageCalc((triples / tripleAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel + 1),
                    "data": hitups + "/" + hitupAttempts + " " + percentageCalc((hitups / hitupAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel + 2),
                    "data": doublehitups + "/" + doublehitupAttempts + " " + percentageCalc((doublehitups / doublehitupAttempts).toFixed(2))
                },
                {
                    "header": playerStats[0].thLevel + "v" + (playerStats[0].thLevel + 3),
                    "data": triplehitups + "/" + tripleAttempts + " " + percentageCalc((triplehitups / triplehitupAttempts).toFixed(2))
                },

            ]
        };
    }

}

/**
 * Formats the clans current war data for discord
 * @param response - The war json received from the clash of clans api
 * @returns object - Returns the desired output in either string or embed format for discord
 */
function formatCurrentStats(response) {
    console.log(response);
    let year = response.startTime.substring(0, 4);
    let month = response.startTime.substring(4, 6);
    let day = response.startTime.substring(6, 8);
    let hours = response.startTime.substring(9, 11);
    let minutes = response.startTime.substring(11, 13);
    let currentDate = new Date();
    let startDate = new Date(year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":00.000Z");
    let diff = (startDate - currentDate) / (1000 * 60 * 60);
    let timeLeft;
    if (diff > 0) {
        let array = diff.toString().split(".");
        let dec = "." + array[1];
        timeLeft = "War starts in " + array[0] + " hours and " + ((Number(dec) * 60).toFixed(0)) + " minutes";
    } else {
        let array = diff.toString().split(".");
        let dec = "." + array[1];
        console.log()
        timeLeft = "War ends in " + (23 + Number(array[0])) + " hours and " + (60 - ((Number(dec) * 60).toFixed(0))) + " minutes";
    }

    console.log(timeLeft);
    let bdString = getBDString(response);
    let th13HitrateFriendly = getHitrates(response, true, 13);
    let th13HitrateEnemy = getHitrates(response, false, 13);
    let th12HitrateFriendly = getHitrates(response, true, 12);
    let th12HitrateEnemy = getHitrates(response, false, 12);
    let th11HitrateFriendly = getHitrates(response, true, 11);
    let th11HitrateEnemy = getHitrates(response, false, 11);
    let th10HitrateFriendly = getHitrates(response, true, 10);
    let th10HitrateEnemy = getHitrates(response, false, 10);
    return new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle(response.clan.name + " vs " + response.opponent.name)
        .addField(timeLeft, "```\nStars\n   " + response.clan.stars + " - " + response.opponent.stars + "\nPercentage\n   " + response.clan.destructionPercentage.toFixed(2) + "% - " + response.opponent.destructionPercentage.toFixed(2) + "%" +
            "\nAttacks\n   " + response.clan.attacks + "/" + response.teamSize * 2 + " - " + response.opponent.attacks + "/" + response.teamSize * 2 + "\nBreakdown\n   " + bdString + "\n```")
        .addField("Hit Rates",
            "```       " + th13HitrateFriendly + "  13v13  " + th13HitrateEnemy + "       \n" +
            "       " + th12HitrateFriendly + "  12v12  " + th12HitrateEnemy + "       \n" +
            "       " + th11HitrateFriendly + "  11v11  " + th11HitrateEnemy + "       \n" +
            "       " + th10HitrateFriendly + "  10v10  " + th10HitrateEnemy + "       \n```")
        .setTimestamp()
        .setFooter('Copyright: Chance#0187');
}

/**
 * Creates the breakdown of town hall levels string that will be displayed
 * @param response - The war json received from the clash of clans api
 * @returns {string} - Returns the String equivalent of the breakdown to be displayed in the discord message
 */
function getBDString(response) {
    let th10Count = 0;
    let th11Count = 0;
    let th12Count = 0;
    let th13Count = 0;
    let enemyth10Count = 0;
    let enemyth11Count = 0;
    let enemyth12Count = 0;
    let enemyth13Count = 0;
    for (let i = 0; i < response.clan.members.length; i++) {
        let member = response.clan.members[i];
        let townHallLevel = member.townhallLevel;
        switch (townHallLevel) {
            case 10:
                th10Count++;
                break;
            case 11:
                th11Count++;
                break;
            case 12:
                th12Count++;
                break;
            case 13:
                th13Count++;
                break;
            default:

        }
    }
    for (let i = 0; i < response.opponent.members.length; i++) {
        let member = response.opponent.members[i];
        let townHallLevel = member.townhallLevel;
        switch (townHallLevel) {
            case 10:
                enemyth10Count++;
                break;
            case 11:
                enemyth11Count++;
                break;
            case 12:
                enemyth12Count++;
                break;
            case 13:
                enemyth13Count++;
                break;
            default:

        }

    }
    return th13Count + "/" + th12Count + "/" + th11Count + "/" + th10Count + " - " + enemyth13Count + "/" + enemyth12Count + "/" + enemyth11Count + "/" + enemyth10Count;
}

/**
 * Calculates the hit rate of both clans in the war and formats the data in a string for output
 * @param response - The war json received from the clash of clans api
 * @param isClan - Indicator for if this is our clan or the enemy
 * @param thLevel - The town hall level we are calculating the hit rate for
 * @returns {string} - The formatted string for the given town hall levels hit rate
 */
function getHitrates(response, isClan, thLevel) {
    let triples = 0;
    let attacks = 0;
    let members = isClan ? response.clan.members : response.opponent.members;
    for (let i = 0; i < members.length; i++) {
        let townHallLevel = members[i].townhallLevel;
        if (townHallLevel === thLevel && typeof members[i].attacks !== "undefined") {
            if (typeof members[i].attacks[0] !== "undefined" && members[i].attacks[0].stars === 3) {
                triples++;
                attacks++;
            } else if (typeof members[i].attacks[0] !== "undefined") {
                attacks++;
            }
            if (typeof members[i].attacks[1] !== "undefined" && members[i].attacks[1].stars === 3) {
                triples++;
                attacks++;
            } else if (typeof members[i].attacks[1] !== "undefined") {
                attacks++;
            }
        }
    }

    return triples + "/" + attacks;
}

function percentageCalc(decimal) {
    if (isNaN(decimal)) {
        return "0%";
    } else {
        return (decimal * 100) + "%"
    }
}
