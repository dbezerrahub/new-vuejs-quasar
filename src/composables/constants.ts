export const ENVIRONMENT = 'dev'
export const VERSION = '1.0.0'
export const COLORS = {
  primary: '#57879E',
  green: '#3BAB80',
  grey: '#223B49',
}
export const DBTESTE = {
  exists: true,
  user: {
    values: [
      {
        id: 1,
        name: 'diogo',
      },
    ],
  },
  companies: {
    values: [
      {
        id: 1,
        name: 'Neo Energia',
        cnpj: '083593200010',
        registration_link: 'www.reg.com',
        logo: 'logo01.png',
      },
    ],
  },
  invoices: {
    values: [
      {
        id: 1,
        id_company: 1,
        due_date: '25/03/2025',
        ref_date: '03/2025',
        payment_value: '25,05',
        payment_state: 0,
        file: 'conta.pdf',
        pixcode: '',
        barcode: '34191093966196792293385834530009810310000002371',
      },
    ],
  },
}
