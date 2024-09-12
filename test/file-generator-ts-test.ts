import FileGenerator from '@slowpoison/file-generator'
import { describe, it } from "mocha"

// only used for compilation check, and not anything else
// Run tsc and ensure it compiles. Don't try to run it. You'll get module not found error.
describe('FileGenerator', () => {
  it('complies when used in TS', async () => {
    const fileGenerator = new FileGenerator('test/lines.txt', {
      includeNewLines: true,
      initialBufferLength: 1024,
    })

    await fileGenerator.genLines()
  })
})
