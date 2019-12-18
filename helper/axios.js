const auth = require('../auth.json');
const formatter = require('./formatter')
const axios = require('axios');
const options = {
    headers: {
        Accept: 'application/json',
        authorization: 'Bearer ' + auth.clashToken
    }
};
module.exports = {
    /**
     * Gets the generic clan information for a given clan tag and displays it in a new discord message
     * @param tag - The tag of the clan you wish to lookup
     * @param msg - The discord message object that triggered the event
     */
    getClan: function (tag, msg) {
        console.log("Getting clan data: " + tag);
        let url = "https://api.clashofclans.com/v1/clans/" + encodeURIComponent(tag);
        axios.get(url, options)
            .then(response => {
                let output = formatter.formatClanData(response.data);
                msg.channel.send(output);
            })
            .catch(error => {
                console.log(error);
            });

    },
    /**
     * Gets the current war stats for a given clan tag and displays it in a new discord message
     * @param tag - The tag of the clan you wish to lookup
     * @param msg - The discord message object that triggered the event
     */
    getCurrentStats: function(tag, msg){
        console.log("Getting clans current stats: " + tag);
        let url = "https://api.clashofclans.com/v1/clans/" + encodeURIComponent(tag) + "/currentwar";
        axios.get(url, options)
            .then(response => {
                let output = formatter.formatCurrentStats(response.data);
                msg.channel.send(output);
            })
            .catch(error => {
                console.log(error);
            });
    },
    /**
     * Gets the players stats from the stats.json file and displays it in a new discord message
     * @param tag - The tag of the clan you wish to lookup
     * @param msg - The discord message object that triggered the event
     */
    getPlayerStats(tag, msg){
        console.log("Getting stats for player: " + tag)
        //TODO: Complete lookup logic
    }
};
