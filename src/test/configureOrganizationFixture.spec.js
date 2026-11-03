describe('configureOrganizationFixture', () => {
  const originalEmailDomain = process.env.ORGANIZATION_EMAIL_DOMAIN
  const originalSourceDomains = process.env.ORGANIZATION_EMAIL_SOURCE_DOMAINS

  afterEach(() => {
    if (originalEmailDomain === undefined) {
      delete process.env.ORGANIZATION_EMAIL_DOMAIN
    } else {
      process.env.ORGANIZATION_EMAIL_DOMAIN = originalEmailDomain
    }

    if (originalSourceDomains === undefined) {
      delete process.env.ORGANIZATION_EMAIL_SOURCE_DOMAINS
    } else {
      process.env.ORGANIZATION_EMAIL_SOURCE_DOMAINS = originalSourceDomains
    }
  })

  test('rewrites configured organization domains in nested fixture data', () => {
    process.env.ORGANIZATION_EMAIL_DOMAIN = 'atlas.example'
    process.env.ORGANIZATION_EMAIL_SOURCE_DOMAINS =
      'legacy.example,legacy-marketing.test'

    let configureOrganizationFixture
    jest.isolateModules(() => {
      configureOrganizationFixture =
        require('../utils/configureOrganizationFixture').default
    })

    const input = {
      owner: { email: 'owner@legacy.example' },
      reports: [{ reporting_mail: 'report@legacy-marketing.test' }],
      external: 'person@gmail.com',
    }

    expect(configureOrganizationFixture(input)).toEqual({
      owner: { email: 'owner@atlas.example' },
      reports: [{ reporting_mail: 'report@atlas.example' }],
      external: 'person@gmail.com',
    })
    expect(input.owner.email).toBe('owner@legacy.example')
  })
})
