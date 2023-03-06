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
    console.log(colors.bold(colors.green('Success -')), colors.green(message))
  }

  static title(message: string) {
    console.log(colors.underline(colors.bold((colors.white(message)))))
  }
}