require('dotenv').config();
const Binance = require('binance-api-node').default;
const client = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// Parameters
const symbol = 'BTCUSDT';  // Symbol to trade
const totalVolume = 0.01;  // Total volume to trade (e.g., 0.01 BTC)
const executionTime = 3600;  // Total execution time in seconds (1 hour)
const numIntervals = 12;  // Number of intervals (e.g., 12 trades)
const slippageTolerance = 0.01;  // 1% slippage tolerance

// Define volume per interval
let volumePerInterval = totalVolume / numIntervals;

// Get the market price from Binance
async function getMarketPrice(symbol) {
  try {
    const price = await client.prices({ symbol });
    return parseFloat(price[symbol]);
  } catch (error) {
    console.error('Error fetching market price:', error);
    return null;
  }
}

// Calculate slippage
function calculateSlippage(marketPrice, executionPrice) {
  return Math.abs((executionPrice - marketPrice) / marketPrice);
}

// Execute trade on Binance
async function executeTrade(symbol, volume) {
  try {
    console.log(`Placing order to buy ${volume} ${symbol}`);
    const order = await client.order({
      symbol,
      side: 'BUY',
      type: 'MARKET',
      quantity: volume,
    });
    const executedPrice = parseFloat(order.fills[0].price);
    return executedPrice;
  } catch (error) {
    console.error('Error executing trade:', error);
    return null;
  }
}

// TWAP Strategy
async function twapStrategy() {
  for (let i = 0; i < numIntervals; i++) {
    // Get the current market price
    const marketPrice = await getMarketPrice(symbol);

    if (!marketPrice) {
      console.log(`Skipping interval ${i + 1} due to market price fetch error`);
      continue;
    }

    // Execute the trade
    const executionPrice = await executeTrade(symbol, volumePerInterval);

    if (!executionPrice) {
      console.log(`Skipping interval ${i + 1} due to trade execution error`);
      continue;
    }

    // Calculate slippage
    const slippage = calculateSlippage(marketPrice, executionPrice);
    console.log(`Slippage: ${(slippage * 100).toFixed(2)}%`);

    // Adjust volume if slippage exceeds tolerance
    if (slippage > slippageTolerance) {
      volumePerInterval *= (1 - slippage);
      console.log(`Adjusting volume to ${volumePerInterval} due to slippage`);
      await executeTrade(symbol, volumePerInterval);
    }

    // Wait until the next interval (time in ms)
    await new Promise((resolve) => setTimeout(resolve, (executionTime / numIntervals) * 1000));
  }
}

// Run TWAP strategy
twapStrategy();
