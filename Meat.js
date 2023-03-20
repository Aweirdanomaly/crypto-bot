const ethers = require('ethers');

const addresses = {
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E'
}

//Ankr url
const provider = new ethers.providers.WebSocketProvider('wss://apis.ankr.com/wss/88f9bc8bf08d4b43a0033dcbf44541b9/64c2969dbc3ef004404d5a54b72e3431/binance/full/main');
const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    provider
);

factory.on('PairCreated', async (token0, token1, pairAddress) => {
    console.log(`
    New pair detected
    =================
    Time: ${new Date().toLocaleTimeString()} (GMT)
    token0: ${token0}
    token1: ${token1}
    pairAddress: ${pairAddress}
  `);
});

console.log(`
    Starting the cog...
  `);

