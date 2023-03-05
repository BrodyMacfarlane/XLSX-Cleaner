import prompt from 'prompt'
import colors from '@colors/colors/safe'

prompt.message = ""
prompt.delimiter = colors.green("\n >")

export type PromptParams = {
  text: string,
  variable: string,
  stringResponseOptions: (string: string) => string
}

export default class Prompt {
  text
  variable
  stringResponseOptions

  constructor(promptParams: PromptParams) {
    this.text = promptParams.text
    this.variable = promptParams.variable
    this.stringResponseOptions = promptParams.stringResponseOptions
  }

  public async prompt(): Promise<string> {
    prompt.start()
    const result = await prompt.get({
      properties: {
        [this.variable]: {
          description: colors.white(this.text)
        }
      }
    })
    return result[this.variable].toString()
  }
}