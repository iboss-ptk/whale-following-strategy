
import pandas as pd
import streamlit as st
import time
import os
import json
import numpy as np
import altair as alt

"""
# Whale Alert
"""




# data = pd.read_json(f"data.json")

# os.system('node archiver.js')
data = pd.read_json(f"data.json")


if st.button('fetch'):
    os.system('node archiver.js')
    data = pd.read_json(f"data.json")

exhange = [
    'bitfinex',
    'binance',
    'poloniex',
    'okex',
    'coinbase',
    'bitstamp',
    'bittrex',
    'huobi',
    'bitmex',
    'korbit.co.kr'
]

b = data[~data['from_owner'].isin(exhange) & data['to_owner'].isin(exhange)][
    ['timestamp', 'from_owner', 'to_owner', 'amount_usd']
]

b = b[b['timestamp'] > np.datetime64('2021-02-01T00:00:00+07:00')]
b = b[b['amount_usd'] < 1000000000]
b = b[b['amount_usd'] > 40000000]


c = alt.Chart(b).mark_circle(size=60).encode(
    x='timestamp',
    y='amount_usd',
    color='to_owner',
    tooltip=[alt.Tooltip('timestamp:T', format='%A, %B %e @ %H:%M'), 'from_owner', 'to_owner', 'amount_usd']
).interactive()

st.altair_chart(c, use_container_width=True)

b