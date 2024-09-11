import time
from binance.client import Client
from binance.exceptions import BinanceAPIException
from dotenv import load_dotenv
import os
import numpy as np

# Load environment variables
load_dotenv()

# Initialize Binance client
api_key = os.getenv('BINANCE_API_KEY')
api_secret = os.getenv('BINANCE_API_SECRET')
client = Client(api_key, api_secret)

# Parameters
symbol = 'BTCUSDT'  # Symbol to trade
total_volume = 0.01  # Example total volume to trade in BTC (for Binance)
execution_time = 3600  # Total time for trade execution in seconds (e.g., 1 hour)
num_intervals = 12  # Number of intervals (e.g., 12 trades, one every 5 minutes)
slippage_tolerance = 0.01  # Maximum allowed slippage in percentage

# Define volume per interval
volume_per_interval = total_volume / num_intervals

# Function to get the current market price from Binance
def get_market_price(symbol):
    try:
        ticker = client.get_symbol_ticker(symbol=symbol)
        return float(ticker['price'])
    except BinanceAPIException as e:
        print(f"Error fetching market price: {e}")
        return None

# Function to calculate slippage
def calculate_slippage(market_price, execution_price):
    # Slippage formula
    return abs((execution_price - market_price) / market_price)

# Function to execute the trade
def execute_trade(symbol, volume):
    try:
        print(f"Placing order to buy {volume} {symbol}")
        order = client.order_market_buy(
            symbol=symbol,
            quantity=volume
        )
        executed_price = float(order['fills'][0]['price'])  # Get executed price
        return executed_price
    except BinanceAPIException as e:
        print(f"Error executing trade: {e}")
        return None

# TWAP strategy
def twap_strategy():
    for i in range(num_intervals):
        # Get the current market price
        market_price = get_market_price(symbol)

        if market_price is None:
            print(f"Skipping interval {i+1} due to price fetching error")
            continue

        # Execute trade
        execution_price = execute_trade(symbol, volume_per_interval)

        if execution_price is None:
            print(f"Skipping interval {i+1} due to trade execution error")
            continue

        # Calculate slippage
        slippage = calculate_slippage(market_price, execution_price)
        print(f"Slippage: {slippage * 100:.2f}%")

        # Adjust the volume if slippage exceeds tolerance
        if slippage > slippage_tolerance:
            adjusted_volume = volume_per_interval * (1 - slippage)
            print(f"Adjusting trade volume to: {adjusted_volume} due to slippage")
            execute_trade(symbol, adjusted_volume)

        # Wait until the next interval
        time.sleep(execution_time / num_intervals)

if __name__ == "__main__":
    twap_strategy()
