import axios from 'axios'

const rechargeClient = axios.create({
  baseURL: 'https://api.rechargeapps.com/',
  timeout: 2900000,
  headers: {
    Accept: 'application/json; charset=utf-8;',
    'Content-Type': 'application/json',
    'X-Recharge-Access-Token': process.env.RECHARGE_API_KEY,
  },
})

export default rechargeClient
