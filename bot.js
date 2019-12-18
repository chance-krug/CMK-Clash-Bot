const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('./helper/axios')
const auth = require('./auth.json');
const formatter = require('./helper/formatter')
let dict = {};
let clanTag  = "";

//Authenticate using our discord token
client.login(auth.discordToken);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
//Checks all messages to see if we have a command
client.on('message', msg => {
  //Make sure we don't respond to our own messages
  if(msg.author.bot) return;
  //Check if we are still up
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
  //Set clan tag for clan Stats
  if (msg.content.startsWith('*set ')) {
    let words = msg.content.split(' ');
    clanTag = words[1];
    msg.channel.send("Clan Tag Set: " + clanTag);
  }
  //Display a clans generic data
  if (msg.content.startsWith('*clan ')){
    let words = msg.content.split(' ');
    axios.getClan(words[1], msg);
  }
  //Display the current war stats
  if (msg.content === "*stats"){
    if(clanTag === ""){
      msg.reply("Please run Set {clantag} first.");
    } else {
      axios.getCurrentStats(clanTag, msg);
    }
  }
  // Display Stats for a given player tag
  if (msg.content.startsWith('*stats #')){
    let words = msg.content.split(' ');
    axios.getPlayerStats(words[1], msg);
  }
  //Create new command
  if (msg.content.startsWith('*add ')){
    let words = msg.content.split(' ');
    let string = "";
    for (let i = 2; i < words.length; i++){
      string += words[i] + " ";
    }
    dict["*" + words[1]] = string;
    console.log("Added Custom Command " + words[1]  + ":" + string);
    msg.channel.send("Added Custom Command " + words[1]  + ": " + string);
  }
  //Post custom command
  if (msg.content.startsWith('*')){
    if(typeof dict[msg.content] !== "undefined"){
      msg.channel.send(dict[msg.content]);
    }
  }
  //Remove command
  if (msg.content.startsWith('*remove ')){
    let words = msg.content.split(' ');
    delete dict["*" + words[1]];
    msg.channel.send("Removed Custom Command " + words[1]);
  }
  //Show Help for all commands
  if (msg.content === "*help"){
    let output = formatter.formatHelp(dict, msg);
    msg.channel.send(output);
  }
});






