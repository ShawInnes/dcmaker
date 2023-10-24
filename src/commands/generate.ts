import { prompt, GluegunToolbox } from 'gluegun'

const source = [
  { name: 'postgres', source: '' },
  { name: 'postgis', source: '' },
  { name: 'redis', source: '' },
  { name: 'seq', source: '' },
  { name: 'minio', source: '' },
]

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      print,
      template: { generate },
    } = toolbox

    const { services, exposePorts } = await prompt.ask([
      {
        type: 'multiselect',
        name: 'services',
        message: 'Which services do you want to include?',
        choices: source.map((p) => p.name),
      },
      {
        type: 'confirm',
        name: 'exposePorts',
        message: 'Do you want to expose ports externally?',
      },
    ])

    const svc: string[] = services as any
    let postgresUser, postgresPassword, postgresDatabase
    if (svc.includes('postgres')) {
      print.info(`${print.checkmark} Postgres`)

      const response = await prompt.ask([
        {
          type: 'input',
          name: 'postgresUser',
          message: 'Default postgres user?',
          initial: 'admin',
        },
        {
          type: 'input',
          name: 'postgresPassword',
          message: 'Default postgres password?',
          initial: 'admin',
        },
        {
          type: 'input',
          name: 'postgresDatabase',
          message: 'Default postgres database?',
          initial: 'admin',
        },
      ])

      postgresUser = response.postgresUser
      postgresPassword = response.postgresPassword
      postgresDatabase = response.postgresDatabase
    }

    print.debug(exposePorts)

    if (svc.length > 0) {
      const generated = await generate({
        template: 'docker-compose.yml.ejs',
        props: {
          services: svc,
          exposePorts,
          postgresUser,
          postgresPassword,
          postgresDatabase,
        },
      })

      print.debug(generated)
    }
  },
}
