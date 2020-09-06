export const AuthSchema = {
  name: 'user',
  primaryKey: 'userId',
  properties: {
    userId: 'string',
    username: 'string',
    email: 'string',
    isActive: 'bool',
    role: 'int',
    token: 'string?',
    organization: 'account',
  }
};
