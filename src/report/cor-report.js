import clientRecords from './clients'

export default clientRecords.map((client) => ({
  client_id: client.id,
  location_id: client.id,
  total_leads: client.total_leads,
  total_trends: Math.round(client.total_leads * 1.18),
  total_calls: client.total_calls,
  total_forms: client.total_forms,
  total_chats: client.total_chats,
  total_aggregate_cost: client.total_aggregate_cost,
  total_budget: 9200,
  predicted_spend: Math.round(client.total_aggregate_cost * 1.08),
  percentageOf_budget_spent: Math.round((client.total_aggregate_cost / 9200) * 100),
  total_cpl: client.total_cpl,
  total_adwords_leads: Math.round(client.total_leads * 0.58),
  total_adwords_spend: Math.round(client.total_aggregate_cost * 0.62),
  location: {
    id: client.id,
    name: client.name,
    account_manager: `${client.account_manager.first_name} ${client.account_manager.last_name}`,
  },
}))
