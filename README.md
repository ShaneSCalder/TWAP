

### TWAP 


# TWAP (Time-Weighted Average Price) Strategy

This project implements a dynamic Time-Weighted Average Price (TWAP) strategy for executing trades on Binance. The strategy splits a large trade into smaller, evenly sized portions executed over time, adjusting for slippage dynamically.

## Features
- TWAP Strategy: Executes trades in intervals to minimize market impact and reduce slippage.
- Dynamic Volume Adjustment: Automatically adjusts trade volume if slippage exceeds a specified tolerance.
- Binance API Integration: Uses the Binance API to fetch live market prices and execute trades.
- Supports Python and Node.js: Two implementations are provided: one in Python and one in Node.js.

## Requirements

1. API Keys: You will need a Binance account and API keys to execute trades.
2. Python: Python 3.x with the required libraries.
3. Node.js: Node.js with the required packages installed.

## Setup

### 1. Create `.env` File

Create a `.env` file in the root directory to store your Binance API keys. These keys are used to authenticate API requests. The `.env` file should look like this:

```
BINANCE_API_KEY=your_api_key
BINANCE_API_SECRET=your_api_secret
```

Replace `your_api_key` and `your_api_secret` with your actual Binance API key and secret.

### 2. Python Setup

#### Install Python Dependencies

First, ensure you have Python 3.x installed. Then, install the required packages using `pip`:

```bash
pip install python-binance python-dotenv
```

#### Running the Python TWAP Strategy

1. Update the parameters in `twap.py` as necessary (e.g., symbol, total volume, execution time, slippage tolerance).
2. Run the script:

```bash
python twap.py
```

#### Python Script (`twap.py`) Overview
- Fetches live market data using Binance API.
- Executes trades at regular intervals, adjusting for slippage dynamically.
- Stores sensitive API keys in the `.env` file.

### 3. Node.js Setup

#### Install Node.js Dependencies

Ensure you have Node.js installed, then install the required packages using `npm`:

```bash
npm install binance-api-node dotenv
```

#### **Running the Node.js TWAP Strategy**

1. Update the parameters in `twap.js` as necessary (e.g., symbol, total volume, execution time, slippage tolerance).
2. Run the script:

```bash
node twap.js
```

#### Node.js Script (`twap.js`) Overview
- Fetches live market data using Binance API.
- Executes trades at regular intervals, adjusting for slippage dynamically.
- Stores sensitive API keys in the `.env` file.

## Parameters

Both the Python and Node.js implementations include the following parameters:

- symbol: The trading pair symbol (e.g., `BTCUSDT`).
- totalVolume: The total amount of the asset to trade.
- executionTime: The total time over which the trades will be executed (in seconds).
- **numIntervals: The number of intervals (i.e., the number of trades to execute).
- slippageTolerance: The maximum allowed slippage in percentage (e.g., `0.01` for 1%).

## Example

If you want to execute a TWAP strategy for `BTCUSDT` over 1 hour, with a total trade volume of `0.01 BTC`, split into 12 intervals (1 trade every 5 minutes), and a slippage tolerance of `1%`, the settings would be:

- totalVolume: `0.01`
- executionTime: `3600` (1 hour in seconds)
- numIntervals: `12`
- slippageTolerance: `0.01`

## License

This project is open-source and available for modification and distribution under the MIT License.


