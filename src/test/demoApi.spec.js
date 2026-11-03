import { handleDemoRequest } from '../utils/demoApi'

describe('demo API adapter', () => {
  test('returns a user in the API response shape expected by pages', async () => {
    const response = await handleDemoRequest({
      method: 'get',
      url: '/user',
      baseURL: 'https://api.example.com/api/v1',
    })

    expect(response.status).toBe(200)
    expect(response.data.data).toMatchObject({
      role: 'admin',
      full_name: 'Jahid Khan Tuhin',
      scope: expect.arrayContaining(['clients', 'reports']),
    })
  })

  test('filters and paginates synthetic client records', async () => {
    const response = await handleDemoRequest({
      method: 'get',
      url: '/clients',
      baseURL: 'https://api.example.com/api/v1',
      params: {
        search: 'Northstar',
        status: 'active',
        page: 1,
        limit: 1,
      },
    })

    expect(response.data.data.result).toHaveLength(1)
    expect(response.data.data.result[0].name).toBe('Northstar Dental Studio')
    expect(response.data.data.pagination).toMatchObject({
      total: 1,
      page: 1,
      limit: 1,
      last_page: 1,
    })
  })

  test('persists create and delete operations for the current app session', async () => {
    const created = await handleDemoRequest({
      method: 'post',
      url: '/users',
      data: { first_name: 'Demo', last_name: 'Teammate', email: 'demo@example.com' },
    })
    const id = created.data.data.id

    expect(created.data.data).toMatchObject({
      first_name: 'Demo',
      last_name: 'Teammate',
      full_name: 'Demo Teammate',
      status: 'active',
    })

    const deleted = await handleDemoRequest({
      method: 'delete',
      url: `/users/${id}`,
    })
    const fetched = await handleDemoRequest({
      method: 'get',
      url: `/users/${id}`,
    })

    expect(deleted.data.data.deleted).toBe(true)
    expect(fetched.data.data).toEqual({})
  })
})
