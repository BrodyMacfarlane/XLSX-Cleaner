import colors from '@colors/colors/safe'

export default class Exception {
  message

  constructor(message: string) {
    this.message = message
  }

  static throw(message: string) {
    console.error(`${colors.underline(colors.red('Error\n'))}${colors.red(message)}`)
    process.exit(1)
  }
}