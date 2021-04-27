/* eslint-disable @typescript-eslint/no-var-requires */
const {exec} = require("child_process");
const path = require("path");
const fs = require("fs");

const [command = "link", packagesDirectory = __dirname, projectDirectory] = process.argv.slice(2);

const subDirs = fs.readdirSync(packagesDirectory, {withFileTypes: true})
  .filter(dirEnt => dirEnt.isDirectory())
  .map(dirEnt => dirEnt.name);

subDirs.forEach(dir => {
  const directory = path.resolve(packagesDirectory, dir);
  const packageJsonFile = path.resolve(directory, "package.json");

  fs.readFile(packageJsonFile, (readErr, json) => {
    if (readErr)
      return;

    const data = JSON.parse(json);
    if (!data)
      return;

    const packageName = data.name;
    if (!packageName || packageName.includes("REPLACE_ME"))
      return;

    exec(`yarn ${command}`, {cwd: directory}, (err, stdout, stderr) => {
      if (err) console.log(`Error: ${err}`);
      if (stdout) console.log(`Output: ${stdout}`);
      if (stderr) console.log(`Std Error: ${stderr}`);
    });

    if (projectDirectory) {
      exec(`yarn ${command} ${packageName}`, {cwd: projectDirectory}, (err, stdout, stderr) => {
        if (err) console.log(`Error: ${err}`);
        if (stdout) console.log(`Output: ${stdout}`);
        if (stderr) console.log(`Std Error: ${stderr}`);
      });
    }
  });
});
