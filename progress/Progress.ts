import colors from '@colors/colors/safe'

export default class Progress {
  message

  constructor(message: string) {
    this.message = message
  }

  static statement(message: string) {
    console.log(colors.green(message))
  }

  static success(message: string) {
    console.log(colors.green(colors.bold('Success\n')), colors.green(message))
  }
}