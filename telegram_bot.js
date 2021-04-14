const axios = require('axios')
const { utcToZonedTime, format } = require('date-fns-tz')

const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY
const WHALE_ALERT_API_KEY = process.env.WHALE_ALERT_API_KEY
// == me only
// const secret_chat = 1255970858

// == group
const secret_chat = -340519440

const now = () => Math.floor(Date.now() / 1000)
const min = 100000000
const currencies = ['btc', 'eth']

const window_m = 10

const whales = (currency) => axios.get(
    `https://api.whale-alert.io/v1/transactions?` +
    `api_key=${WHALE_ALERT_API_KEY}&` +
    `min_value=${min}&` +
    `currency=${currency}&` +
    `parse_mode=Markdown&` +
    `start=${now() - (window_m * 60)}`
)

const usd = amount => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
}).format(amount);

const formatCurrency = (amount, currency) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
}).format(amount);

const telegram = (text) => 
    axios.post(`https://api.telegram.org/bot1713462605:${TELEGRAM_API_KEY}/sendMessage`, {
        chat_id: secret_chat, text
    })
const formatTime = (time) => {
    const date = new Date(time * 1000)
    const timeZone = 'Asia/Bangkok'
    const zonedDate = utcToZonedTime(date, timeZone)
    const pattern = 'HH:mm:ss | d.M.yyyy'
    return format(zonedDate, pattern, { timeZone })
}


;(async () => {
    let txns = []
    try {
        for (let i in currencies) {
            const c = currencies[i] 
            txns = txns.concat(((await whales(c)).data.transactions || [])
            .filter(t => t.from.owner_type !== 'exchange' && t.to.owner_type === 'exchange'))
        }
    }catch (e) {
        throw e
    }

    console.log(txns)

    const msg = txns.map(({symbol, from, to, timestamp, amount, amount_usd}) => {
        const rep = Math.floor(amount_usd / 1000000)
        return `
=====
${ formatCurrency(amount, symbol.toUpperCase())}
(${usd(amount_usd)})
=====
${'🚨'.repeat(rep)}
has been transfered
${from.owner_type} => ${to.owner_type} (${to.owner})
[@ ${formatTime(timestamp)}]
`
    }).join(`

🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧

`)
    if (txns.length > 0) {
        telegram(msg)
        .catch(err => {
            console.error(err)
            process.exit(1)
        })
    } else {
        console.info('quiet times...')
    }
})()


