const axios = require('axios')
const fs = require('fs');

Object.prototype.inspect = function() {
    console.info(this)
    return this
}

const toStringParams = o => 
    Object
        .keys(o)
        .map(k => `${k}=${o[k]}`)
        .join('&')

        
const whaleTxns = async (from) => await axios
    .get(`https://api.clankapp.com/v2/explorer/tx?${toStringParams({
        s_date: 'desc',
        size: 10000,
        '>_amount_usd': 20000000,
        t_symbol: 'btc',
        // t_to_owner: 'binance',
        t_transaction_type: 'transfer',
        api_key: '6f3f704d1795d33254082deec8b4302e'
    })}`)

;(async () => {
    const res = await whaleTxns()
    const { context, data } = res.data
    fs.writeFileSync(`data.json`, JSON.stringify(data));
    console.log(context)
})()
