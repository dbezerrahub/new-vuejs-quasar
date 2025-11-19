import { SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { CapacitorSQLite } from '@capacitor-community/sqlite'
import Helpers from 'src/composables/Helpers'
import { Capacitor } from '@capacitor/core'

const DB_NAME = 'callauth'
let dbConn: SQLiteDBConnection | null = null
let sqlite: SQLiteConnection | null = null

export default class DatabaseController {
  static async initializeDatabase() {
    try {
      // Criando banco sqlite nativo (Android/IOS)
      // Verifica se o banco já existe
      const exists = await CapacitorSQLite.isDatabase({ database: DB_NAME })
      if (exists.result) {
        console.log('##Banco de dados ' + DB_NAME + ' já existe...')
      } else {
        console.log('##Banco não existe, criando...')
        const conn = await this.getDatabaseConnection()

        await conn.execute(
          'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, app_token TEXT NOT NULL, auth_token TEXT NOT NULL);',
        )
        await conn.execute(
          'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone_number TEXT NOT NULL, authorized INTEGER NOT NULL);',
        )
        await conn.execute(
          'CREATE TABLE IF NOT EXISTS action (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, execute INTEGER, data_1 TEXT, data_2 TEXT, data_3 TEXT, data_4 TEXT);',
        )
        await conn.execute(
          "INSERT INTO action (id, name, execute, data_1, data_2, data_3, data_4) VALUES (1, 'none', 0, 'x', 'x', 'x', 'x');",
        )
        console.log('Banco de dados criado com sucesso!')
        await conn.close()
      }
    } catch (error) {
      // console.error('##Erro ao inicializar o banco de dados:', error);
    }
  }

  /**
   * Obtém a conexão com o banco de dados SQLite.
   * @returns Uma conexão ativa com o banco de dados.
   */
  static async getDatabaseConnection(): Promise<SQLiteDBConnection> {
    const sqlite = new SQLiteConnection(CapacitorSQLite)

    // Verifica se a conexão já existe
    if (!dbConn) {
      try {
        dbConn = await sqlite.retrieveConnection(DB_NAME, false)
      } catch (error) {
        // Se não existir, cria uma nova
        dbConn = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false)
      }
    }

    const isOpen = await dbConn.isDBOpen()
    if (!isOpen.result) {
      console.log('Abrindo banco de dados...')
      await dbConn.open()
    } else {
      console.log('Banco já está aberto.')
    }

    return dbConn
  }

  static async closeConnection(): Promise<void> {
    if (sqlite && dbConn) {
      const isOpen = await dbConn.isDBOpen()
      if (isOpen.result) {
        await dbConn.close() // Isso já basta nas versões novas
      }
      dbConn = null
    }
  }

  /**
   * Executa uma consulta de leitura (DQL) no banco de dados.
   * @param entity Nome da entidade (tabela).
   * @param operation Tipo da operação (por exemplo, "get").
   * @param params Parâmetros da consulta.
   * @returns O resultado da consulta ou `false` caso não haja resultados.
   */
  static async DQLQuery(
    entity: string,
    operation: string,
    params: any[] = [],
  ): Promise<any | false> {
    const conn = await this.getDatabaseConnection()
    const queries: Record<string, Record<string, string>> = {
      user: {
        get: 'SELECT * FROM user WHERE id = ?',
      },
    }

    if (queries[entity] && queries[entity][operation]) {
      const query = queries[entity][operation]
      try {
        const result = await conn.query(query, params)
        await this.closeConnection()

        // console.log("Query Executada:", query);
        return result.values!.length > 0 ? result : false
      } catch (error) {
        console.error('Erro ao executar query:', error)
        return false
      }
    } else {
      throw new Error('Entidade ou operação inválida')
    }
  }

  /**
   * Executa uma operação de manipulação de dados (DML) no banco de dados.
   * @param entity Nome da entidade (tabela).
   * @param operation Tipo da operação (insert, delete, update).
   * @param params Parâmetros da consulta.
   */
  static async DMLQuery(
    entity: string,
    operation: string,
    params: any[] = [],
  ): Promise<void | Error | Object> {
    const conn = await this.getDatabaseConnection()
    const queries: Record<string, Record<string, string>> = {
      user: {
        insert: 'INSERT INTO user (name, app_token, auth_token) VALUES (?,?,?)',
        delete: 'DELETE FROM user WHERE id = ?',
        update: 'UPDATE user SET name = ?, app_token = ?, auth_token = ? WHERE id = ?',
      },
      contacts: {
        insert: 'INSERT INTO user (name, app_token, auth_token) VALUES (?,?,?)',
        delete: 'DELETE FROM user WHERE id = ?',
        update: 'UPDATE user SET name = ?, app_token = ?, auth_token = ? WHERE id = ?',
      },
      action: {
        update: 'UPDATE action SET name = ?, app_token = ?, auth_token = ? WHERE id = ?',
      },
    }

    if (queries[entity] && queries[entity][operation]) {
      const query = queries[entity][operation]
      try {
        await conn.run(query, params)
        // console.log("Query Executada:", query);
      } catch (error) {
        console.error('Erro ao executar query:', error)
        return error as Error
      }
    } else {
      throw new Error('Entidade ou operação inválida')
    }
  }
}
