import { SQLiteConnection } from '@capacitor-community/sqlite'
import type { SQLiteDBConnection } from '@capacitor-community/sqlite'
import { CapacitorSQLite } from '@capacitor-community/sqlite'
import Helpers from 'src/composables/Helpers'

const DB_NAME = 'callauth.db'
let dbConn: SQLiteDBConnection | null = null
let sqlite: SQLiteConnection | null = null
type Entity = 'user' | 'invoice'
type QueryOperations = {
  user: {
    get: string
    get_for_date: string
    insert: string
    delete: string
    update: string
  }
  invoice: {
    get: string
    get_for_date: string
    insert: string
    delete: string
    update: string
  }
}

type DBExecResult = {
  changes: number
  lastId: number
  values: any[]
}

export default class DAOController {
  static async getDatabaseConnection(): Promise<SQLiteDBConnection> {
    if (!sqlite) {
      sqlite = new SQLiteConnection(CapacitorSQLite)
    }

    await sqlite.checkConnectionsConsistency()

    const isConn = await sqlite.isConnection(DB_NAME, false)

    if (isConn.result) {
      dbConn = await sqlite.retrieveConnection(DB_NAME, false)
    } else {
      dbConn = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false)
    }

    const isOpen = await dbConn.isDBOpen()
    if (!isOpen.result) {
      await dbConn.open()
    }

    return dbConn
  }

  static async execute(
    entity: string,
    operation: string,
    params: any[] = [],
  ): Promise<DBExecResult> {
    const conn = await this.getDatabaseConnection()
    let query: string | null = null
    switch (entity) {
      case 'contacts':
        query = await this.contactsQueries(operation)
        break
      case 'action':
        query = await this.actionQueries(operation)
        break

      default:
        throw new Error(`Entidade '${entity}' não reconhecida.`)
        break
    }

    if (!query) throw new Error('Operação inválida.')

    try {
      // Helpers.log("##query: ", query)
      if (query.trim().toLowerCase().startsWith('select')) {
        // console.log(await this.formatQueryWithPlaceholders(query, params));
        const result = await conn.query(query, params)
        return {
          values: result?.values ?? [],
          changes: 0,
          lastId: 0,
        }
      } else {
        // INSERT, UPDATE, DELETE => usa execute()
        const result = await conn.run(query, params)
        // Helpers.log("##execute: ", result)
        const changes = result?.changes?.changes ?? 0
        const lastId = result?.changes?.lastId ?? 0
        const values = result?.changes?.values ?? []

        return { changes, lastId, values }
      }
    } catch (error) {
      console.error('##Erro ao executar query:', error)
      return {
        values: [],
        changes: 0,
        lastId: 0,
      }
    }
  }

  static async contactsQueries(param: string): Promise<string> {
    const queries: Record<string, string> = {
      get: 'SELECT * FROM contacts WHERE id = ?',
      count_all: 'SELECT count(id) as total FROM contacts',
      insert: `INSERT INTO contacts (
                name,
                phone_number,
                authorized
            )
            SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            WHERE NOT EXISTS (
                SELECT 1 FROM contacts
                WHERE phone_number = ?
            );`,
      delete_by_phone: 'DELETE FROM contacts WHERE phone_number = ?',
      update_state: 'UPDATE invoices SET payment_state = ? WHERE id = ?',
    }

    return queries[param]
  }

  static async actionQueries(param: string): Promise<string> {
    const queries: Record<string, string> = {
      get: 'SELECT * FROM action WHERE id = ?',
      update_execute: 'UPDATE action SET execute = ? WHERE id = ?',
    }

    return queries[param]
  }

  static async formatQueryWithPlaceholders(query: string, params: any[]): Promise<string> {
    let i = 0
    return query.replace(/\?/g, () => {
      const val = params[i++]
      if (typeof val === 'string') return `'${val}'`
      if (val === null || val === undefined) return 'NULL'
      return val
    })
  }
}
