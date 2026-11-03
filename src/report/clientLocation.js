import clientRecords from './clients'

export default clientRecords.map((client) => ({
  ...client,
  location_id: client.id,
  website: `https://practice-${client.id}.example.com`,
  city: ['Portland', 'Austin', 'Denver', 'Raleigh'][client.id % 4],
  state: ['OR', 'TX', 'CO', 'NC'][client.id % 4],
  zip_code: String(90000 + client.id * 17),
  monthly_fee: 2400 + client.id * 30,
  adwords_budget: 3900 + client.id * 50,
  facebook_budget: 1200 + client.id * 20,
  apexchat_id: `DEMO-${client.id}-CHAT`,
  adwords_id: `DEMO-${client.id}-ADS`,
  facebook_id: `DEMO-${client.id}-SOCIAL`,
  account_manager: client.account_manager,
}))
