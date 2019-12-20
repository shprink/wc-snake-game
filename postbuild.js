#!/usr/bin/env node

const path = require("path"),
  minimist = require("minimist"),
  fs = require("fs-extra");

const options = minimist(process.argv.slice(2));
const PACKAGE_ROOT = __dirname;
const DIST_PATH = path.join(PACKAGE_ROOT, "dist");

async function run() {
  try {
    const patch = options.patch || 0;
    const { version, license, name, description } = await fs.readJson(
      path.join(__dirname, "package.json")
    );

    await fs.outputJson(path.join(DIST_PATH, "package.json"), {
      version: version.slice(0, -1) + patch,
      license,
      name,
      description
    });
    await fs.copy(
      path.join(PACKAGE_ROOT, "LICENSE"),
      path.join(DIST_PATH, "LICENSE")
    );
    await fs.copy(
      path.join(PACKAGE_ROOT, "readme.md"),
      path.join(DIST_PATH, "readme.md")
    );

    console.info("package.json and License updated");
  } catch (error) {
    console.error(error);
  }
}

run();
