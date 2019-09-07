/*******************************************************************************
 *
 * operator-dashboard
 *
 * Copyright (c) 2019 Jon Arild Nygård
 * All rights reserved.
 *
 * For license information, see bundled LICENSE file.
 *
 ******************************************************************************/

import Handlebars from "handlebars";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync
} from "fs";
import { join, sep, resolve } from "path";
import Underscore from "underscore";
const { each, filter, reduce } = Underscore;

const isHandlebarsFile = filename => filename.endsWith(".handlebars");

const getFilenamesInFolder = path => readdirSync(path);
const getHandlebarsFilesInFolder = path =>
  filter(getFilenamesInFolder(path), isHandlebarsFile);
const getFileContent = path => readFileSync(path, "utf-8");
const pathExists = path => {
  try {
    statSync(path);
    return true;
  } catch (e) {
    return false;
  }
};

const createFolders = path =>
  reduce(
    resolve(path).split(sep),
    (partialPath, folder, _, list) => {
      const folderPath = partialPath ? join(partialPath, folder) : folder;
      if (!pathExists(folderPath)) {
        mkdirSync(folderPath);
      }
      return folderPath;
    },
    ""
  );

const addPartialsFromFolder = path => {
  const partials = getHandlebarsFilesInFolder(path);
  each(partials, filename => {
    const name = filename.replace(".handlebars", "");
    const filepath = join(path, filename);
    const partial = getFileContent(filepath);
    Handlebars.registerPartial(name, partial);
  });
};

const compileHandlebarsFile = (filename, inputFolder, outputFolder) => {
  const filepath = join(inputFolder, filename);
  const outputPath = join(
    outputFolder,
    filename.replace(".handlebars", ".html")
  );
  const template = readFileSync(filepath, "utf-8");
  const context = JSON.parse(
    readFileSync(filepath.replace(".handlebars", ".json"))
  );
  const html = Handlebars.compile(template)(context);
  createFolders(outputFolder);
  writeFileSync(outputPath, html);
};

const compileHandlebarsFilesInFolder = (inputFolder, outputFolder) =>
  each(getHandlebarsFilesInFolder(inputFolder), filename =>
    compileHandlebarsFile(filename, inputFolder, outputFolder)
  );

const partialsPath = "./templates/partials";
const appPath = "./templates/app";
const outputPath = "./build";

addPartialsFromFolder(partialsPath);
compileHandlebarsFilesInFolder(appPath, outputPath);
