const accountManagers = [
  { id: 2, first_name: 'Morgan', last_name: 'Reed', role: 'account manager', status: 'active' },
  { id: 3, first_name: 'Taylor', last_name: 'Brooks', role: 'account manager', status: 'active' },
  { id: 4, first_name: 'Jordan', last_name: 'Parker', role: 'account manager', status: 'active' },
]

const userRecords = [
  { id: 1, first_name: 'Jahid Khan', last_name: 'Tuhin', role: 'admin', status: 'active' },
  ...accountManagers,
  { id: 5, first_name: 'Casey', last_name: 'Lane', role: 'call scorer', status: 'active' },
  { id: 6, first_name: 'Riley', last_name: 'Hayes', role: 'user', status: 'active' },
  { id: 7, first_name: 'Avery', last_name: 'Stone', role: 'user', status: 'inactive' },
].map((user) => ({
  ...user,
  full_name: `${user.first_name} ${user.last_name}`,
}))

const practiceSeeds = [
  ['Northstar Dental Studio', 'Mia', 'Chen', 'Portland', 'OR', 148, 6320, 76],
  ['Willow Creek Dentistry', 'Ethan', 'Brooks', 'Austin', 'TX', 126, 5480, 68],
  ['Juniper Family Dental', 'Sofia', 'Patel', 'Denver', 'CO', 112, 4890, 72],
  ['Cedar Grove Smiles', 'Noah', 'Reed', 'Raleigh', 'NC', 98, 4210, 64],
  ['Brightline Dental Care', 'Olivia', 'Hayes', 'Nashville', 'TN', 91, 3960, 81],
  ['Harborview Dental Group', 'Lucas', 'Rivera', 'Tampa', 'FL', 84, 3675, 59],
  ['Evergreen Dental House', 'Amara', 'Brooks', 'Seattle', 'WA', 76, 3290, 66],
  ['Sage & Stone Dentistry', 'Liam', 'Parker', 'Phoenix', 'AZ', 69, 2980, 74],
  ['Bluebird Dental Co.', 'Isla', 'Reed', 'Madison', 'WI', 57, 2450, 61],
  ['Golden Hour Dentistry', 'Mason', 'Cole', 'Charlotte', 'NC', 44, 1890, 70],
  ['Westlake Dental Arts', 'Zoe', 'Bennett', 'San Diego', 'CA', 38, 1640, 56],
  ['The Modern Molar', 'Elijah', 'Price', 'Columbus', 'OH', 31, 1380, 63],
]

const locations = practiceSeeds.map((seed, index) => {
  const [name, firstName, lastName, city, state, leads, spend, conversion] = seed
  const id = 100 + index
  const manager = accountManagers[index % accountManagers.length]
  return {
    id,
    client_id: 200 + index,
    name,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    status: index === 9 ? 'inactive' : 'active',
    phone_number: `+1 (555) ${String(210 + index).padStart(3, '0')}-${String(4100 + index).padStart(4, '0')}`,
    personal_website: `https://practice-${id}.example.com`,
    website: `https://practice-${id}.example.com`,
    city,
    state,
    zip_code: String(90000 + index * 137),
    monthly_fee: 2400 + index * 125,
    adwords_budget: 3900 + index * 175,
    facebook_budget: 1200 + index * 90,
    adwords_id: `DEMO-${id}-ADS`,
    facebook_id: `DEMO-${id}-SOCIAL`,
    apexchat_id: `DEMO-${id}-CHAT`,
    name,
    account_manager: {
      id: manager.id,
      first_name: manager.first_name,
      last_name: manager.last_name,
      full_name: `${manager.first_name} ${manager.last_name}`,
    },
    account_manager_id: manager.id,
    num_of_locations: 1,
    num_of_staff: 6 + (index % 8),
    total_leads: leads,
    total_calls: Math.round(leads * 0.61),
    total_forms: Math.round(leads * 0.26),
    total_chats: Math.round(leads * 0.13),
    total_trends: Math.round(leads * (1 + index / 30)),
    total_aggregate_cost: spend,
    total_budget: 9200 + index * 300,
    predicted_spend: spend * 1.08,
    percentageOf_budget_spent: Math.round((spend / (9200 + index * 300)) * 100),
    total_cpl: Math.round(spend / leads),
    total_adwords_leads: Math.round(leads * 0.58),
    total_adwords_spend: Math.round(spend * 0.62),
    total_facebook_leads: Math.round(leads * 0.29),
    total_facebook_spend: Math.round(spend * 0.28),
    conversion_rate: conversion,
    created_at: new Date(Date.UTC(2025, 0, index + 2)).toISOString(),
    updated_at: new Date(Date.UTC(2026, 9, 25 - index)).toISOString(),
    locations: [
      {
        id,
        name,
        status: index === 9 ? 'inactive' : 'active',
        city,
        state,
        zip_code: String(90000 + index * 137),
        website: `https://practice-${id}.example.com`,
        account_manager: `${manager.first_name} ${manager.last_name}`,
        account_manager_id: manager.id,
        monthly_fee: 2400 + index * 125,
        adwords_budget: 3900 + index * 175,
        facebook_budget: 1200 + index * 90,
        adwords_id: `DEMO-${id}-ADS`,
        facebook_id: `DEMO-${id}-SOCIAL`,
        apexchat_id: `DEMO-${id}-CHAT`,
        total_leads: leads,
        total_calls: Math.round(leads * 0.61),
        total_forms: Math.round(leads * 0.26),
        total_chats: Math.round(leads * 0.13),
        created_at: new Date(Date.UTC(2025, 0, index + 2)).toISOString(),
        updated_at: new Date(Date.UTC(2026, 9, 25 - index)).toISOString(),
      },
    ],
  }
})

const demoUser = {
  ...userRecords[0],
  full_name: 'Jahid Khan Tuhin',
  email: 'owner@example.com',
  scope: ['users', 'clients', 'reports', 'locations'],
}

const roleRecords = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'account manager' },
  { id: 3, name: 'call scorer' },
  { id: 4, name: 'user' },
]

const reportRecords = locations.map((location) => ({
  client_id: location.client_id,
  location_id: location.id,
  total_leads: location.total_leads,
  total_trends: location.total_trends,
  total_calls: location.total_calls,
  total_forms: location.total_forms,
  total_chats: location.total_chats,
  total_aggregate_cost: location.total_aggregate_cost,
  total_budget: location.total_budget,
  predicted_spend: location.predicted_spend,
  percentageOf_budget_spent: location.percentageOf_budget_spent,
  total_cpl: location.total_cpl,
  total_adwords_leads: location.total_adwords_leads,
  total_adwords_spend: location.total_adwords_spend,
  location: {
    id: location.id,
    name: location.name,
    account_manager: location.account_manager,
  },
}))

function responseData(value) {
  return { data: value }
}

function parseBody(config) {
  if (!config.data) return {}
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data)
    } catch (error) {
      return {}
    }
  }
  return config.data
}

function listResponse(records, params) {
  const query = params || {}
  const search = String(query.search || '').trim().toLowerCase()
  const status = query.status
  const role = query.role
  let result = records.filter((record) => {
    const matchesSearch =
      !search ||
      `${record.first_name || ''} ${record.last_name || ''} ${record.name || ''} ${record.full_name || ''} ${record.email || ''}`
        .toLowerCase()
        .includes(search)
    const matchesStatus = !status || record.status === status
    const matchesRole =
      !role ||
      String(
        record.role ||
          (record.account_manager && record.account_manager.full_name) ||
          record.account_manager ||
          ''
      ).toLowerCase() === String(role).toLowerCase()
    return matchesSearch && matchesStatus && matchesRole
  })

  const sortParts = String(query.sort_by || 'first_name:asc').split(':')
  const sortKey = sortParts[0] || 'first_name'
  const descending = sortParts[1] === 'desc'
  result = result.slice().sort((left, right) => {
    const a = String(left[sortKey] || left.full_name || left.name || '')
    const b = String(right[sortKey] || right.full_name || right.name || '')
    return a.localeCompare(b) * (descending ? -1 : 1)
  })

  const total = result.length
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Number(query.limit) || 20)
  const start = (page - 1) * limit
  return {
    result: result.slice(start, start + limit),
    pagination: { total, page, limit, last_page: Math.max(1, Math.ceil(total / limit)) },
  }
}

function normalizePath(config) {
  const url = new URL(config.url, config.baseURL || 'http://demo.local')
  const basePath = new URL(config.baseURL || 'http://demo.local').pathname.replace(/\/+$/, '')
  let pathname = decodeURIComponent(url.pathname)
  if (basePath && basePath !== '/' && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length)
  }
  return pathname.replace(/\/+$/, '') || '/'
}

function findClient(id) {
  return locations.find((client) => String(client.id) === String(id))
}

function findUser(id) {
  return userRecords.find((user) => String(user.id) === String(id))
}

export function handleDemoRequest(config) {
  const method = String(config.method || 'get').toLowerCase()
  const path = normalizePath(config)
  const params = config.params || {}
  const body = parseBody(config)
  let result = {}

  if (path === '/user' && method === 'get') {
    result = demoUser
  } else if (path === '/users' && method === 'get') {
    result = listResponse(userRecords, params)
  } else if (path === '/users' && method === 'post') {
    const created = {
      ...body,
      id: Math.max(...userRecords.map((user) => user.id)) + 1,
      full_name:
        body.full_name || `${body.first_name || ''} ${body.last_name || ''}`.trim(),
      status: body.status || 'active',
      role: body.role || 'account manager',
    }
    userRecords.push(created)
    result = created
  } else if (path === '/roles' && method === 'get') {
    result = roleRecords
  } else if (path === '/statuses' && method === 'get') {
    result = ['active', 'inactive']
  } else if (path === '/clients' && method === 'get') {
    result = listResponse(locations, params)
  } else if (path === '/clients' && method === 'post') {
    const id = Math.max(...locations.map((client) => client.id)) + 1
    const created = {
      ...body,
      id,
      status: body.status || 'active',
      num_of_locations: 1,
      locations: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    locations.push(created)
    result = created
  } else if (/^\/clients\/[^/]+\/change-status$/.test(path) && method === 'put') {
    const client = findClient(path.split('/')[2])
    if (client) {
      client.status = client.status === 'active' ? 'inactive' : 'active'
      result = client
    }
  } else if (/^\/clients\/[^/]+\/locations$/.test(path) && method === 'get') {
    const client = findClient(path.split('/')[2])
    result = client ? client.locations || [] : []
  } else if (/^\/clients\/[^/]+$/.test(path) && method === 'get') {
    result = findClient(path.split('/')[2]) || {}
  } else if (/^\/clients\/[^/]+$/.test(path) && method === 'put') {
    const client = findClient(path.split('/')[2])
    if (client) Object.assign(client, body, { updated_at: new Date().toISOString() })
    result = client || body
  } else if (/^\/clients\/[^/]+$/.test(path) && method === 'delete') {
    const index = locations.findIndex((client) => String(client.id) === path.split('/')[2])
    if (index >= 0) locations.splice(index, 1)
    result = { deleted: index >= 0 }
  } else if (path === '/locations' && method === 'post') {
    const created = { ...body, id: Math.max(...locations.map((client) => client.id)) + 100 }
    const parent = findClient(body.client_id)
    if (parent) parent.locations = [...(parent.locations || []), created]
    result = created
  } else if (/^\/locations\/[^/]+$/.test(path) && method === 'get') {
    const id = path.split('/')[2]
    result = locations.flatMap((client) => client.locations || []).find((location) => String(location.id) === id) || {}
  } else if (/^\/locations\/[^/]+$/.test(path) && method === 'put') {
    const id = path.split('/')[2]
    const location = locations.flatMap((client) => client.locations || []).find((item) => String(item.id) === id)
    if (location) Object.assign(location, body)
    result = location || body
  } else if (/^\/locations\/[^/]+$/.test(path) && method === 'delete') {
    const id = path.split('/')[2]
    locations.forEach((client) => {
      client.locations = (client.locations || []).filter((location) => String(location.id) !== id)
    })
    result = { deleted: true }
  } else if (/^\/users\/[^/]+\/roles$/.test(path) && method === 'put') {
    result = { updated: true }
  } else if (/^\/users\/[^/]+$/.test(path) && method === 'get') {
    result = findUser(path.split('/')[2]) || {}
  } else if (/^\/users\/[^/]+$/.test(path) && method === 'put') {
    const user = findUser(path.split('/')[2])
    if (user) {
      Object.assign(user, body)
      if (body.first_name || body.last_name) {
        user.full_name = `${user.first_name || ''} ${user.last_name || ''}`.trim()
      }
    }
    result = user || body
  } else if (/^\/users\/[^/]+$/.test(path) && method === 'delete') {
    const index = userRecords.findIndex((user) => String(user.id) === path.split('/')[2])
    if (index > 0) userRecords.splice(index, 1)
    result = { deleted: index > 0 }
  } else if (path.includes('social-login') && method === 'get') {
    result = { user: demoUser, token: 'demo-session' }
  } else if (method === 'post' || method === 'put' || method === 'delete') {
    result = { success: true, message: 'Demo action saved locally' }
  }

  return Promise.resolve({
    data: responseData(result),
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: {},
  })
}

export default function installDemoApi({ $axios, $config }) {
  if (!$config.demoMode || !$axios) return
  $axios.defaults.adapter = handleDemoRequest
}
