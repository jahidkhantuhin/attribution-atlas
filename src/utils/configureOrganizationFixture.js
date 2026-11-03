const sourceDomains = (
  process.env.ORGANIZATION_EMAIL_SOURCE_DOMAINS || ''
)
  .split(',')
  .map((domain) => domain.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .filter(Boolean)

const emailDomainPattern = sourceDomains.length
  ? new RegExp(`@(?:${sourceDomains.join('|')})$`, 'i')
  : null
const organizationEmailDomain =
  process.env.ORGANIZATION_EMAIL_DOMAIN || 'example.com'

export default function configureOrganizationFixture(value) {
  if (Array.isArray(value)) {
    return value.map(configureOrganizationFixture)
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((result, key) => {
      result[key] = configureOrganizationFixture(value[key])
      return result
    }, {})
  }

  if (typeof value === 'string' && emailDomainPattern) {
    return value.replace(emailDomainPattern, `@${organizationEmailDomain}`)
  }

  return value
}
