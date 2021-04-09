
import pandas as pd
import streamlit as st
import time
import os
import json
import numpy as np

"""
# Whale Alert
"""




# data = pd.read_json(f"data.json")

os.system('node archiver.js')
data = pd.read_json(f"data.json")


if st.button('fetch'):
    os.system('node archiver.js')
    data = pd.read_json(f"data.json")

b = data[data['from_owner'] != 'binance'][['timestamp', 'amount_usd']]

b = b[b['timestamp'] > np.datetime64('2021-04-01T00:00:00+07:00')]
# b = b[b['amount_usd'] < 400000000]


b

b = b.set_index('timestamp')

st.line_chart(b)