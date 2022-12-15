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
