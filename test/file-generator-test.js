'use strict';
const fsp = require('fs').promises;
const assert = require('assert');

const FileGenerator = require('../file-generator');
describe('FileGenerator', function() {
      it('should generate lines given an initial buffer length', async function() {

        let fileContent = await fsp.open('test/lines.txt', 'r')
          .then(async fh => {
              await fh.readFile()
                .then(buf => buf.toString());
              await fh.close();
          })

        let bufferLengths = [1, 2, 1024];
        bufferLengths.map(async bufferLength => {
          let fileGen = new FileGenerator(
              'test/lines.txt', {initialBufferLength: bufferLength});
          let lines = [];
          for await (let line of fileGen.genLines()) {
            lines.push(line);
          }
          assert.equal(fileContent, lines.join(''), 'buffer size ' + bufferLength);

          });
        });

      it('should generate lines without trailing newline when configured so', async function() {
        let fileGen = new FileGenerator('test/lines.txt', {includeNewlines: false});
        let lines = [];
        for await (let line of fileGen.genLines()) {
          lines.push(line);
        }

        await fsp.open('test/lines.txt', 'r')
          .then(async fh => {
            await fh
              .readFile()
              .then(fileLines =>
                  assert.equal(fileLines.toString(), lines.join("\n") + "\n"));
            await fh.close();
            })
        });

      it('should process a large file correctly', async function() {
          let fileGen = new FileGenerator('test/big-file.txt');
          let lines = 0;
          let s = null;
          for await (let line of fileGen.genLines()) {
            ++lines;
            s = line;
          }
          assert.equal(20000, lines);
          });

      it('should clean up file handles', async function() {
          let fileGen = new FileGenerator('test/lines.txt');
          // read one line
          let lineGen = await fileGen.genLines();
          let str1 = await lineGen.next().then(res => res.value);
          assert.equal('1\n', str1);

          // do clean-up
          assert.notEqual(null, fileGen.fileHandle());
          await lineGen.return();
          assert.equal(null, fileGen.fileHandle());

          // try reading more
          let str2 = await lineGen.next().then(res => res.value);
          assert.equal(undefined, str2);
          });
    });
