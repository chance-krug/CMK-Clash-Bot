const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('./helper/axios')
const auth = require('./auth.json');
const formatter = require('./helper/formatter');
const fs = require('fs');
let dict = require('C:\\Users\\chanc\\IdeaProjects\\stats-updater\\players.json');
let clanTag  = "#2R0Q8YV0";

//Authenticate using our discord token
client.login(auth.discordToken);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
//Checks all messages to see if we have a command
client.on('message', msg => {
  //Make sure we don't respond to our own messages
  if(msg.author.bot) return;

  //********************************** General Commands **********************************/
  //Check if we are still up
  if (msg.content === 'ping') {
    msg.reply('pong');
  }

  //Show Help for all commands
  if (msg.content === "/help"){
    let output = formatter.formatHelp(dict, msg);
    msg.channel.send(output);
  }

  //********************************** Clash Commands **********************************/
  //Display a clans generic data
  if (msg.content.startsWith('/clan ')){
    let words = msg.content.split(' ');
    axios.getClan(words[1], msg);
  }

  //Display the current war stats
  if (msg.content === "/stats"){
    if(clanTag === ""){
      msg.reply("Please run Set {clantag} first.");
    } else {
      axios.getCurrentStats(clanTag, msg);
    }
  }

  //Sets a user alias for stats
  if (msg.content.startsWith("/alias ")){
    let words = msg.content.split(' ');
    let added = addAlias(words[1], words[2])
    if(added){
      msg.channel.send("Alias added.");
    }else{
      msg.channel.send("Alias already exists. Please remove or use a different alias.");
    }
  }

  // Display Stats for a given player tag
  if (msg.content.startsWith('/stats ')){
    let words = msg.content.split(' ');
    getStats(words[1], words[2]);
  }

  //Remove alias
  if (msg.content.startsWith('/remove alias ')){
    let words = msg.content.split(' ');
    let removed = removeAlias(words[2]);
    if(removed){
      msg.channel.send("Removed alias " + playerObject.players[index].alias);
    }else{
      msg.channel.send("Alias doesn't exist");
    }
  }
});

/**
 * Checks if an alias exists and if not adds it
 * @param key - The alias key to try and add
 * @param tag - The tag of the person to add an alias for
 * @returns {boolean} - Was the value added
 */
function addAlias(key, tag){
  let data = fs.readFileSync('C:\\Users\\chanc\\IdeaProjects\\stats-updater\\players.json');
  let playerObject = JSON.parse(data);
  for (let i = 0; i < playerObject.players.length; i++){
    if (key === playerObject.players[i].alias){
      return false;
    }
  }
  playerObject.players.push({"alias" : key, "tag" : tag});
  data = JSON.stringify(playerObject);
  fs.writeFileSync('C:\\Users\\chanc\\IdeaProjects\\stats-updater\\players.json', data);
  return true;
}

/**
 * Removes the alias provided from the alias store
 * @param key -The alias key that needs to be deleted
 * @returns {boolean} - Was the alias removed
 */
function removeAlias(key){
  let data = fs.readFileSync('C:\\Users\\chanc\\IdeaProjects\\stats-updater\\players.json');
  let playerObject = JSON.parse(data);
  let index = -1;
  for (let i = 0; i < playerObject.players.length; i++){
    if (key == playerObject.players[i].alias){
      index = i;
    }
  }
  if(index !== -1){
    let filtered = playerObject.players.filter(function (el) {
      return el.alias != words[2];
    });
    playerObject.players = filtered;
    let data = JSON.stringify(playerObject);
    fs.writeFileSync('C:\\Users\\chanc\\IdeaProjects\\stats-updater\\players.json', data);
    return true;
  }
  return false;
}

/**
 * Gets the stats for a given tag and numAtatcks
 * @param tag - The tag or alias for the player
 * @param numAttacks - The number of attacks we want to return
 */
function getStats(tag, numAttacks){
  if(tag.startsWith("#")){
    axios.getPlayerStats(tag, msg, numAttacks);
  } else {
    let data = fs.readFileSync('C:\\Users\\chanc\\IdeaProjects\\stats-updater\\players.json');
    let playerObject = JSON.parse(data);
    for (let i = 0; i < playerObject.players.length; i++){
      if (tag == playerObject.players[i].alias){
        axios.getPlayerStats(playerObject.players[i].tag, msg, numAttacks);
      }
    }
  }
}


/*********** Muting **************/
if( msg.content.startsWith("*mute ")){
  let user = msg.guild.member(msg.mentions.users.first())
  console.log(user);
  user.addRole(msg.guild.roles.find(role => role.name === "Muted"));
}
if( msg.content.startsWith("*unmute ")){
  let user = msg.guild.member(msg.mentions.users.first())
  console.log(user);
  user.removeRole(msg.guild.roles.find(role => role.name === "Muted"));
}



