import convict from 'convict'
import fs from 'fs'
import path from 'path'
const rdsCa = fs.readFileSync(path.join(__dirname, './assets/db-ca.pem'))
/**
 * To require an env var without setting a default,
 * use
 *    default: '',
 *    format: 'required-string',
 *    sensitive: true,
 */
convict.addFormats({
  'required-string': {
    validate: (val: any): void => {
      if (val === '') {
        throw new Error('Required value cannot be empty')
      }
    },
    coerce: (val: any): any => {
      if (val === null) {
        return undefined
      }
      return val
    },
  },
})

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'staging', 'development'],
    default: 'production',
    env: 'NODE_ENV',
  },
  IS_PROD: {
    default: true,
  },
  database: {
    databaseUri: {
      doc: 'URI to the postgres database',
      default: '',
      env: 'DB_URI',
      format: 'required-string',
      sensitive: true,
    },
    dialectOptions: {
      ssl: {
        require: {
          doc: 'Require SSL connection to database',
          default: true,
          env: 'DB_REQUIRE_SSL',
        },
        rejectUnauthorized: true,
        ca: {
          doc: 'SSL cert to connect to database',
          default: [rdsCa],
          format: '*',
          sensitive: true,
        },
      },
    },
    poolOptions: {
      max: {
        doc: 'Maximum number of connection in pool',
        default: 150,
        env: 'SEQUELIZE_POOL_MAX_CONNECTIONS',
        format: 'int',
      },
      min: {
        doc: 'Minimum number of connection in pool',
        default: 0,
        env: 'SEQUELIZE_POOL_MIN_CONNECTIONS',
        format: 'int',
      },
      acquire: {
        doc:
          'Number of milliseconds to try getting a connection from the pool before throwing error',
        default: 600000,
        env: 'SEQUELIZE_POOL_ACQUIRE_IN_MILLISECONDS',
        format: 'int',
      },
      connectionTimeoutMillis: {
        doc:
          'Number of milliseconds to wait before timing out when connecting a new client',
        default: 30000,
        env: 'SEQUELIZE_POOL_CONNECTION_TIMEOUT',
        format: 'int',
      },
    },
  },
})

// Only development is a non-production environment
// Override with local config
if (config.get('env') === 'development') {
  config.load({
    IS_PROD: false,
    database: {
      dialectOptions: {
        ssl: {
          require: false, // No ssl connection needed
          rejectUnauthorized: true,
          ca: false,
        },
      },
    },
  })
}

export default config
