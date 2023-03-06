import prompt from 'prompt'
import colors from '@colors/colors/safe'
import Exception from '../exceptions/Exception'

prompt.message = ""
prompt.delimiter = colors.green("\n >")

export type PromptParams = {
  text: string,
  variable: string,
  stringResponseOptions: (string: string) => string,
  validationFunction?: (value: any) => boolean,
  asyncValidation?: (v: string) => ({
    fn: (v: string) => Promise<boolean>,
    msg: string
  }),
  syncValidation?: (v: string) => ({
    fn: (v: string) => boolean,
    msg: string
  }),
}

export default class Prompt {
  text
  variable
  stringResponseOptions
  validationFunction
  asyncValidation
  syncValidation

  constructor(promptParams: PromptParams) {
    this.text = promptParams.text
    this.variable = promptParams.variable
    this.stringResponseOptions = promptParams.stringResponseOptions
    this.validationFunction = promptParams.validationFunction ? promptParams.validationFunction : null
    this.asyncValidation = promptParams.asyncValidation ? promptParams.asyncValidation : null
    this.syncValidation = promptParams.syncValidation ? promptParams.syncValidation : null
  }

  public async asyncValidate(userInput: string): Promise<boolean> {
    const validation = this.asyncValidation(userInput)

    const isValid = await validation.fn(userInput)
    if (!isValid) Exception.warn(validation.msg)
    return isValid
  }

  public syncValidate(userInput: string): boolean {
    const validation = this.syncValidation(userInput)

    const isValid = validation.fn(userInput)
    if (!isValid) Exception.warn(validation.msg)
    return isValid
  }

  public async prompt(): Promise<string> {
    prompt.start()
    try {
      const result = await prompt.get({
        properties: {
          [this.variable]: {
            description: colors.white(this.text),
            before: (value) => this.stringResponseOptions(value),
            required: true,
            conform: (value) => this.validationFunction ? this.validationFunction(value) : true
          }
        }
      })

      const userInput = result[this.variable].toString()

      if (this.asyncValidation) {
        const valid = await this.asyncValidate(userInput)
        if (!valid) return await this.prompt()
      }

      if (this.syncValidation) {
        const valid = this.syncValidate(userInput)
        if (!valid) return await this.prompt()
      }

      return userInput
    }
    catch (err) {
      if (err.message === 'canceled') Exception.gracefullyShutdown()
      Exception.throw(err.message)
    }
  }
}

export const promptHistory = (v) => prompt.history(v).value