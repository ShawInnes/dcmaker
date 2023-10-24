import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'dcmaker',
  run: async (toolbox) => {
    const { print } = toolbox

    print.info('Generate Docker Compose files')
  },
}

module.exports = command
