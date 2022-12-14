const path = require("path");
const fs = require("fs");

function getPaths() {
  return [...new Set((process.env.PATH || '').split(path.delimiter))].map(currentPath => {
    currentPath = path.normalize(currentPath);
    currentPath = currentPath.endsWith(path.sep) ? currentPath.slice(0, -path.sep.length) : currentPath;
    return currentPath;
  });
}

function isInPath(executableName) {
  return getPaths().map(currentPath => fs.existsSync(`${currentPath}${path.sep}${executableName}`)).reduce((previous, current) => {
    return previous || current;
  }, false);
}

function getExecutablePath(executableName) {
  let matches = getPaths().map(currentPath => {
    return {
      path: currentPath,
      isExist: fs.existsSync(`${currentPath}${path.sep}${executableName}`)
    }
  }).filter(obj => obj.isExist);

  if (matches.length == 1)
    return matches[0].path;
  throw new Error(`Several path contain '${executableName}'`);
}

function parseLinterOutput(output) {
  let lines = output.split(/\r?\n/);
  return lines.map(currentLine => {
    let items = currentLine.split(":");
    let errorLineNumber = items[1];
    let errorId = currentLine.match(/TLDR(\d{3})/)[1];
    let errorDescription = items[2].replace(/\s+TLDR\d{3}\s+/, "");

    return {
      line: errorLineNumber,
      id: errorId,
      description: errorDescription
    }
  });
}

module.exports = {
  isInPath,
  getExecutablePath,
  parseLinterOutput
}
