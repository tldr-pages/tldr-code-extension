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

module.exports = {
  getPaths,
  isInPath,
  getExecutablePath
}
