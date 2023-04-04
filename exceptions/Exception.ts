import colors from '@colors/colors/safe'

export default class Exception {
  message

  constructor(message: string) {
    this.message = message
  }

  static throw(message: string) {
    console.error(`${colors.underline(colors.red('\n\nError\n'))}${colors.red(message)}`)
    process.exit(0)
  }

  static warn(message: string) {
    console.warn(`${colors.underline(colors.red('\n\nError\n'))}${colors.red(message)}`)
  }

  static gracefullyShutdown() {
    console.log(colors.bold(colors.white('\n\nAborted')))
    process.exit(0)
  }
}