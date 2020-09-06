export const AccountSchema = {
  name: 'account',
  primaryKey: 'organizationId',
  properties: {
    organizationId: 'string',
    organizationName: 'string',
    street: 'string',
    city: 'string',
    state: 'string',
    postal: 'string',
    subscriptions: 'int[]',
    customerServicePhone: 'string',
    customerServiceEmail: 'string',
  }
}
