const Discord = require("discord.js")
const data = require("./vars.json")
const KeepAlive = require("./server")

const client = new Discord.Client();
const prefix = data.PREFIX

let logs = "true"; //I swear this is not a mistake. I know it's a string
let timeServer = {};

let channels = []
let emoji = ":gem:"
let ad_frequency = 3
let coins;
let already_started = false
let timeouts = {}
let ad = (`

${(":rocket:").repeat(20)}

Want faster and even more new cryptos:thinking:?
There is a way:bangbang:
Head over to #how-to-upgrade to find out how:dolphin:!

${(":rocket:").repeat(20)}

`)

const ethers = require('ethers');
const { setTimeout } = require("timers");
const addresses = {
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
}
//Ankr url
const provider = new ethers.providers.WebSocketProvider('wss://apis.ankr.com/wss/85053699fe0d4f38a89283ed9b103def/64c2969dbc3ef004404d5a54b72e3431/binance/full/main');
const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    provider
);

function toClock(time) {   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}



function Looper() {
    timeCheck()
  if (already_started) {
      setTimeout(Looper, 1000*1);
  }
}

async function sendMessage(channel, boolean){
  
  const p1 = channel.send("Starting Timer...be patient")
  p1.then(function (message) {
    //console.log("weenus", message);
    timeServer[message.channel] = [message, boolean]
  });
}

async function unbreak() {

  let timeChannel = [];
  //$include discord channels
    const p1 = client.channels.fetch(data.freeID)
    const p2 = client.channels.fetch(data.regularID)
    const p3 = client.channels.fetch(data.premiumID)
  const p4 = client.channels.fetch(data.timeID)
  const outChannel = client.channels.fetch(data.outages)
  

  Promise.all([p1, p2, p3, p4, outChannel]).then((messages) => {
    addChannel(messages[0], 120)
    addChannel(messages[1], 30)
    addChannel(messages[2], 0)
    timeouts[messages[2].name] = 0
    messages[4].send(`Program Restarted at ${require('util').inspect(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))}`)
    //get message from ID
    //sendMessage(messages[3], true)
    const p5 = messages[3].messages.fetch(data.timeMsgID)
   //$time true formatted as: timeServer[message.channel] = [message, bool]
    p5.then((output) => {
      timeServer[output.channel] = [output, true]
    })

    
    
  }).finally(() => {

  //$start
  already_started = true
  Looper()
  //console.log("test", timeServer, timeChannel)
  })



}

function addChannel(channel, delay) {
  let temp = new Object();
  temp.channel = channel
  temp.name = channel.name
  temp.delay = delay
  temp.date = Date.now();
  temp.go = false;
  channels.push(temp)
}


function timeCheck() {
for (x=0;x<channels.length;x++){
  let current = channels[x]
  if (current.delay == 0){
    current.go = true
  }
  else{
  let diff = ((current.date + (1000*60*current.delay))-Date.now())
  timeouts[current.name] = toClock(Math.floor(diff/1000))
  if ( diff <= 0){
    console.log("time passed for:", current.name)
  current.go = true;
  current.date = Date.now();
  }
  }
}

if (logs === "true" || logs){
console.log(timeouts, new Date().toLocaleTimeString())
}
  for (let key in timeServer) {
 if (timeServer[key][1]|| timeServer[key][1] == "true"){

let temp =timeServer[key][0]
temp.edit(`Time left until next alerts:
${require('util').inspect(timeouts)}
Last updated at ${(new Date().toLocaleTimeString())} (GMT) ${(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }))} (EST)
(Only updates every 5 seconds due to Discord API throttling)`)

 }}
}





client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`)
  if (already_started == false) { await unbreak();}

})

client.on("message", msg => {
  if (msg.author.bot) return
  if (msg.content.startsWith(prefix)){
    const [CMD, ...args] = msg.content
    .trim()
    .substring(prefix.length)
    .split(/\s+/);

  switch (CMD){
    case "ping":
      msg.reply(`Latency is ${Date.now() - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
      break;
    case "include":
      if (args.length === 0) return msg.reply("Please provide refresh time");

      addChannel(msg.channel, args[0])
      if (args[0] == 0) timeouts[msg.channel.name] = 0 ;
      msg.reply("channel added to alerts list")
      break;

    case "start":
    if (already_started === true){
      msg.reply("Bot was already started before and is still on")
    }
    else{
      msg.reply("Starting crypto bot...")
      already_started = true;
      Looper()
     
      
    }
      break;
    
    //only stops current channel from getting alerts
    case "stop":
      for (j=0; j<channels.length;j++){
        if (channels[j].channel == msg.channel)
        {
          channels.splice(j,1)
          delete timeouts[msg.channel.name]
          msg.reply("Stopping crypto bot...")
          break;
        }
      }
      msg.reply("There's no bot running on this channel")
      break;
      
    case "channels":
      console.log(channels)
      break;

    case "emoji":
      emoji = args[0];
      break;
    
    case "ad":
      ad_frequency = args[0];
      msg.reply(ad)
      break;
    
    case "logs":
      console.log(args[0])
      if (args[0] != "true" && args[0] != "false"){
        msg.reply(`you didn't make logs true or false. Next time try saying something like "$logs true"`)
      }
      else{
        logs = args[0]
        msg.reply("got it")
      }

      break;

    case "time":
      if (args[0] != "true" && args[0] != "false"){
        msg.reply(`you didn't make logs true or false. Next time try saying something like "$time true"`)
      }
      else if (msg.channel in timeServer){
        timeServer[msg.channel][1] = args[0]

      }
      else {
        //the ID of the message keeping track of times

      sendMessage(msg.channel, args[0])


      //Default Layout is timeServer{ channel: [mesage, bool] }

      }

    break;

    case "test":
      console.log(timeServer)
      break;

    case "fart":
      msg.reply("PFFT :peach: :dash: :poop: ")
      break;


    case "help":
    
    (msg.channel).send(
      `
      Commands             Output

      $ping                Pings bot and returns bot's latency
      $include [delay]     Adds current text channel to bot alerts
      $start               Starts bot alerts
      $stop                Stops current channel from getting alerts
      $time [true/false]   Outputs time until alert of each channel here
      $help                Displays this message
      
      Debug Commands       Terminal Output (so you can't see these)

      $channels            Displays channels subscribed to alerts
      $emoji [emoji]       Changes emoji for the alerts
      $ad [frequency]      Changes probability of ad appearing to 1/[frequency]
      $logs [true/false]   Outputs time until alert of each channel to terminal
      $fart                Nothing. Why would you even want this?
                           
      `
      )
    break;
  }
  }
})

factory.on('PairCreated', async (token0, token1, pairAddress) => {
          try{

            let tradeTo, tradeFrom;
          if (token0 == addresses.wbnb){
            console.log("1")
              tradeTo = token1
              tradeFrom = token0
          }
          else if (token1 == addresses.wbnb){
            console.log("2")
            tradeTo = token0
            tradeFrom = token1
          }
          else{
            console.log(`
            ${token0}
            ${token1}
            ${pairAddress}`)
            //Called fake function to skip rest of try block
            nonExistentFunction();
          }

          coins = (`
          ${emoji.repeat(20)}
          New pair detected
          =================
          Time: ${(new Date().toLocaleTimeString())} (GMT) ${(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }))} (EST)
          WBNB: ${tradeFrom}
          New Coin: ${tradeTo}
          pairAddress: ${pairAddress}

          Graph :chart_with_upwards_trend: : 
          https://poocoin.app/tokens/${tradeTo} 

          Buy Link :moneybag: :
          <https://exchange.pancakeswap.finance/#/swap?outputCurrency=${pairAddress}>`);

          for (let i=0; i<channels.length;i++){
            let temp = channels[i];
              if (temp.go == true){
              console.log("listings sent to", temp.name)
              temp.channel.send(coins)
              if ((temp.delay != 0) && (0 === (Math.floor(Math.random() * ad_frequency)))){
                console.log("ad sent")
                temp.channel.send(ad)
              }
              temp.go = false

              }
              else{console.log("NOT to:", temp.name)}
          }
          }
          catch(error){
            console.log("coin detected but withheld at", (new Date().toLocaleTimeString()));
          }
});

KeepAlive()
client.login(data.DISCORD_TOKEN)