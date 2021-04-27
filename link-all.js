/* eslint-disable @typescript-eslint/no-var-requires */
const {spawn} = require("child_process");
const path = require("path");
const fs = require("fs");
const colors = require("./lib/console");

const [packagesDirectory, command = "link", projectDirectory = undefined] = process.argv.slice(2);

if (!packagesDirectory)
  throw new Error("Missing packages directory (arg 1)");

const allowedCommands = ["link", "unlink"];
if (!allowedCommands.includes(command))
  throw new Error(`Invalid command (arg 2) - expected: ${allowedCommands.join(", ")}`);

const yarnApp =/^win/.test(process.platform) ? "yarn.cmd" : "yarn";

(async () => {
  const subDirs = fs.readdirSync(packagesDirectory, {withFileTypes: true})
    .filter(dirEnt => dirEnt.isDirectory())
    .map(dirEnt => dirEnt.name);

  const promises = subDirs.map(dir => new Promise((resolve, reject) => {
    const directory = path.resolve(packagesDirectory, dir);
    const packageJsonFile = path.resolve(directory, "package.json");

    fs.readFile(packageJsonFile, async (readErr, json) => {
      if (readErr) {
        reject(readErr);
        return;
      }

      const data = JSON.parse(json.toString());
      if (!data) {
        reject(`Invalid package.json file: ${packageJsonFile}`);
        return;
      }

      const packageName = data.name;
      if (!packageName || packageName.includes("REPLACE_ME")) {
        reject(`Invalid package name: ${packageName}`);
        return;
      }

      try {
        await executeCommand(yarnApp, [command], directory);
        if (projectDirectory && command === "link")
          await executeCommand(yarnApp, [command, packageName], projectDirectory);

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }));

  try {
    await Promise.allSettled(promises);
  } catch (err) {
    logError(err);
  }

  if (projectDirectory && command === "unlink")
    await executeCommand(yarnApp, ["install", "--check-files"], projectDirectory);
})();

const executeCommand = async (app, args = [], cwd) => {
  return new Promise((resolve, reject) => {
    try {

      const process = spawn(app, args, {cwd});

      process.stdout.on("data", (data) => {
        logInfo(data.toString().trim());
      });

      process.stderr.on("data", (data) => {
        logWarn(data.toString().trim());
      });

      process.once("exit", (code) => {
        if (code === 0) resolve();
        else reject();
      });

      process.on("closed", (code) => {
        resolve();
      });

      process.on("error", (error) => {
        logError(error.message);
        reject(error.message);
      });
    } catch (error) {
      logError(error.message);
      reject(error.message);
    }
  });
};

const logWarn = (...args) => console.warn(colors.bg.yellow, colors.fg.white, "i ", colors.bg.black, colors.fg.yellow, ...args);
const logError = (...args) => console.warn(colors.bg.red, colors.fg.white, " ! ",colors.bg.black, colors.fg.red, ...args);
const logInfo = (...args) => console.warn(colors.bg.black, colors.fg.white, ...args);
