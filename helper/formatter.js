const Discord = require('discord.js');

module.exports = {
    /**
     * Formats the generic data of a clan for discord
     * @param response - The clan json received by the clash of clans api
     * @returns object - Returns the desired output in either string or embed format for discord
     */
    formatClanData: function (response) {
        if(response.reason === 'notFound'){
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
        if(response.reason === 'notFound'){
            return "Clan data is private. Please set war log to public."
        }
        return formatCurrentStats(response, opponentAttacks);
    },
    /**
     * Formats the help message for the bot. Displays all commands including user added commands
     * @param dict - The dictionary object that contains key:value pairs of user created commands
     * @returns {module:"discord.js".RichEmbed} - Returns the formatted content in a discord embed
     */
    formatHelp: function(dict){
        //TODO: Add logic for user added commands to be displayed as well
        return new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle("CMK Clash Help")
            .addField('ping', "Checks to see if the bot is up.")
            .addField('*set {clantag}',  "Sets the global clantag to use the stats command ex: *set #666666")
            .addField('*clan {clantag}', "Displays the general data about a clan. ex: *clan #666666")
            .addField('*stats', "Displays the current clans stats. Must have run *set clantag prior.")
            .addField('*add {key} {message}', "Adds a custom command to the bot. ex: *add Chance RZ's best th13.")
            .addField('*{key}', "Displays the custom command for the key provided")
            .addField('*remove {key}', "Removes the custom command for the key provided")
            .addField('*help', "Displays all commands and how to use them")
            .setTimestamp()
            .setFooter('Copyright: Chance#0187');
    }
};

/**
 * Formats the generic data of a clan for discord
 * @param response - The clan json received by the clash of clans api
 * @returns object - Returns the desired output in either string or embed format for discord
 */
function formatClanData(response){
    return new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle(response.name)
        .setDescription(response.description)
        .setThumbnail(response.badgeUrls.small)
        .addField('Record', response.warWins + "-" + response.warLosses)
        .addField('Level',  response.clanLevel, true)
        .addField('Win Streak', response.warWinStreak, true)
        .addField('Members: ', response.members)
        .setTimestamp()
        .setFooter('Copyright: Chance#0187');
}
/**
 * Formats the clans current war data for discord
 * @param response - The war json received from the clash of clans api
 * @returns object - Returns the desired output in either string or embed format for discord
 */
function formatCurrentStats(response){
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
        .setTitle(response.clan.name + " vs "  + response.opponent.name)
        .addField("Stars",response.clan.stars + " - " + response.opponent.stars, true)
        .addField("Percentage", response.clan.destructionPercentage.toFixed(2) + "% - " + response.opponent.destructionPercentage.toFixed(2) + "%", true)
        .addField("Attacks",response.clan.attacks + "/" + response.teamSize * 2 + " - " + response.opponent.attacks + "/" + response.teamSize * 2, true)
        .addField("Breakdown",bdString, true)
        .addField("Hit Rates",
            th13HitrateFriendly + "  13v13  " + th13HitrateEnemy + "\n" +
            th12HitrateFriendly + "  12v12  " + th12HitrateEnemy + "\n" +
            th11HitrateFriendly + "  11v11  " + th11HitrateEnemy + "\n" +
            th10HitrateFriendly + "  10v10  " + th10HitrateEnemy + "\n")
        .setTimestamp()
        .setFooter('Copyright: Chance#0187');
}

/**
 * Creates the breakdown of town hall levels string that will be displayed
 * @param response - The war json received from the clash of clans api
 * @returns {string} - Returns the String equivalent of the breakdown to be displayed in the discord message
 */
function getBDString(response){
    let th10Count = 0;
    let th11Count = 0;
    let th12Count = 0;
    let th13Count = 0;
    let enemyth10Count = 0;
    let enemyth11Count = 0;
    let enemyth12Count = 0;
    let enemyth13Count = 0;
    for (let i = 0; i < response.clan.members.length; i++){
        let member = response.clan.members[i];
        let townHallLevel = member.townhallLevel;
        switch(townHallLevel) {
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
        switch(townHallLevel) {
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
function getHitrates(response, isClan, thLevel){
    let triples = 0;
    let attacks = 0;
    let members = isClan ? response.clan.members : response.opponent.members;
    for (let i = 0; i < members.length; i++) {
        let townHallLevel = members[i].townhallLevel;
        if(townHallLevel === thLevel && typeof members[i].attacks !== "undefined"){
            if(typeof members[i].attacks[0] !== "undefined" && members[i].attacks[0].stars === 3){
                triples++;
                attacks++;
            }else if(typeof members[i].attacks[0] !== "undefined"){
                attacks++;
            }
            if(typeof members[i].attacks[1] !== "undefined" && members[i].attacks[1].stars === 3){
                triples++;
                attacks++;
            }else if(typeof members[i].attacks[1] !== "undefined"){
                attacks++;
            }
        }
    }

    return triples + "/" + attacks;
}
