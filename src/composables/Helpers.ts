import { QVueGlobals } from 'quasar'
import { DBTESTE } from 'src/composables/constants'
import logo from 'src/assets/images/logo.png'
import { CapacitorSQLite } from '@capacitor-community/sqlite'

type LogType = 'log' | 'warn' | 'error' | 'info' | 'debug'

export default class Helpers {
  static async formatISODateToBr(isoDate: string): Promise<string> {
    const [year, month, day] = isoDate.split('-')
    return `${day}/${month}/${year}`
  }

  static async formatDateToISO(dateStr: string): Promise<string> {
    if (!dateStr || typeof dateStr !== 'string') return dateStr
    const parts = dateStr.split('/')
    if (parts.length !== 3) return dateStr

    const [day, month, year] = parts

    if (!day || !month || !year) return dateStr

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // Obtem data YYYY-MM-DD
  static async formatDateSQL(date: Date): Promise<string> {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }
  static async getYearNow(): Promise<number> {
    const date = new Date()
    const year = date.getFullYear()
    return year
  }

  static async getMonthNow(): Promise<[string, number]> {
    const date = new Date()
    const mes_str = String(date.getMonth() + 1).padStart(2, '0')
    const mes_number = date.getMonth() + 1
    return [mes_str, mes_number]
  }

  static async getMonthName(mes: number) {
    const monthPTBR = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]
    return monthPTBR[mes - 1]
  }

  static async getDateRangeFromNow(
    monthBefore: number,
    monthAfter: number,
  ): Promise<{ start: Date; end: Date }> {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - monthBefore, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + monthAfter + 1, 0)
    return { start, end }
  }

  /**
   * Exibe um log formatado no console.
   * @param obj Objeto ou string a ser exibido no console.
   */

  static async log(msg: string, obj: unknown, type_log: LogType = 'log'): Promise<false | string> {
    const logMethods: Record<string, (...args: any[]) => void> = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
    }

    const logFn = logMethods[type_log]

    if (typeof obj === 'string') {
      logFn(msg, obj)
    } else {
      try {
        const json = JSON.stringify(obj, null, 2)
        logFn(msg, json)
        return json
      } catch (error) {
        console.error('Erro ao converter objeto para JSON:', error)
      }
    }
    return false
  }

  /**
   * Verifica se a plataforma é um ambiente web.
   * @returns Retorna uma string identificadora se for web, ou false se não for.
   */
  static async isWeb(): Promise<boolean> {
    let web = false
    const DB_NAME = 'paynbox'
    // return !Platform.is.mobile;
    try {
      await CapacitorSQLite.isDatabase({ database: DB_NAME })
    } catch (error) {
      web = true
      console.info('##:', 'Web2')
    } finally {
      console.info('##return:', web)
      return web
    }
  }

  /**
   * Simula um retorno de banco de dados para testes na web.
   * @param caseId ID do caso de teste.
   * @returns O valor do banco de dados simulado ou false.
   */
  static simulateWebDB(caseId: number): object {
    switch (caseId) {
      case 1:
        return DBTESTE.user
      default:
        return {}
    }
  }

  /**
   * Exibe um alerta usando o Quasar Dialog.
   * @param $q Instância do Quasar para exibir o diálogo.
   * @param title Título do alerta.
   * @param message Mensagem do alerta.
   * @param dark Define se o alerta deve usar o tema escuro.
   */
  static showAlert(
    $q: QVueGlobals,
    title: string,
    message: string,
    dark: boolean = false,
    withCancel: boolean = false,
    onOkCallback?: () => void,
    onCancelCallback?: () => void,
    bt_text1: String = 'Ok',
    color_bt1: String = 'negative',
    bt_text2: String = 'Cancelar',
    color_bt2: String = 'primary',
    fontFamily: string = 'hiruko', // fonte padrão
  ): void {
    $q.dialog({
      dark: dark,
      html: true, // permite usar HTML no title/message
      title: `<img class="logo" alt="Paynbox logo" style="width:100px"
            src="${logo}" /><br><span style="font-family: ${fontFamily};">${title}</span>`,
      message: `<span style="font-family: ${fontFamily};">${message}</span>`,
      ok: {
        label: bt_text1,
        color: color_bt1,
      },
      cancel: withCancel ? { label: bt_text2, color: color_bt2 } : undefined,
      persistent: true,
    })
      .onOk(() => {
        if (onOkCallback) {
          onOkCallback()
        }
      })
      .onCancel(() => {
        if (onCancelCallback) {
          onCancelCallback()
        }
      })
  }

  static async showLoadingDialog(
    $q: QVueGlobals,
    title: string,
    loadingMessage: string = 'Por favor, aguarde...',
    callback: () => Promise<void>,
  ): Promise<void> {
    const loadingDialog = $q.dialog({
      title,
      message: loadingMessage,
      progress: true,
      persistent: true,
    })

    try {
      await callback()
    } catch (error) {
      $q.dialog({
        title: 'Erro',
        message: 'Algo deu errado',
        ok: true,
      })
    } finally {
      loadingDialog.hide()
    }
  }

  static async showPromptDialog(
    $q: QVueGlobals,
    title: string,
    label: string,
    loadingMessage: string = 'Verificando, por favor aguarde...',
    callback: (inputText: string) => Promise<boolean>,
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      $q.dialog({
        title,
        message: label,
        prompt: {
          model: '',
          type: 'text',
        },
        cancel: true,
        ok: {
          label: 'OK',
          color: 'primary',
        },
        persistent: true,
      })
        .onOk(async (data) => {
          const inputText = data

          const loadingDialog = $q.dialog({
            title,
            message: loadingMessage,
            progress: true,
            persistent: true,
          })

          try {
            const result = await callback(inputText)
            loadingDialog.hide()

            if (!result) {
              // Se callback retornar false, chama de novo
              const retryResult = await this.showPromptDialog(
                $q,
                title,
                label,
                loadingMessage,
                callback,
              )
              resolve(retryResult)
            } else {
              resolve(true)
            }
          } catch (err) {
            loadingDialog.hide()
            $q.dialog({
              title: 'Erro',
              message: 'Algo deu errado',
              ok: true,
            })
            resolve(false)
          }
        })
        .onCancel(() => {
          resolve(false)
        })
    })
  }
  static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
