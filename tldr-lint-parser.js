const path = require("path");
const fs = require("fs");

/** Message from linter */
class Message {
  #line = 0
  #id = 0
  #description = ""

  constructor(line, id, description) {
    this.#line = line
    this.#id = id
    this.#description = description
  }

  get line() {
    return this.#line;
  }

  get id() {
    return this.#id;
  }

  get description() {
    return this.#description;
  }
}

/** Linter output parser */
class Parser {
  #input = ""

  constructor(input) {
    this.#input = input
  }

  #getPaths() {
    return [...new Set((process.env.PATH || '').split(path.delimiter))].map(currentPath => {
      currentPath = path.normalize(currentPath);
      currentPath = currentPath.endsWith(path.sep) ? currentPath.slice(0, -path.sep.length) : currentPath;
      return currentPath;
    });
  }

  #isInPath(executableName) {
    return this.#getPaths().map(currentPath => fs.existsSync(`${currentPath}${path.sep}${executableName}`)).reduce((previous, current) => {
      return previous || current;
    }, false);
  }

  #getExecutablePath(executableName) {
    let matches = this.#getPaths().map(currentPath => {
      return {
        path: currentPath,
        isExist: fs.existsSync(`${currentPath}${path.sep}${executableName}`)
      }
    }).filter(obj => obj.isExist);

    if (matches.length == 1)
      return matches[0].path;
    throw new Error(`Several path contain '${executableName}'`);
  }

  parse() {
    return this.#input.split(/\r?\n/).map(currentLine => {
      let items = currentLine.split(":");

      let messageLine = items[1];
      let messageId = currentLine.match(/TLDR(\d{3})/)[1];
      let messageDescription = items[2].replace(/\s+TLDR\d{3}\s+/, "");

      return new Message(messageLine, messageId, messageDescription);
    });
  }
}

module.exports = {
  Message,
  Parser
}
