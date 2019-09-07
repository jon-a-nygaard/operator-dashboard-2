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
import Underscore from "underscore";
import {
  getFileContent,
  getFilenamesInFolder,
  getJSONFileContent,
  writeFile
} from "../fs.js";
import { join } from "path";

const { each, filter } = Underscore;

const isHandlebarsFile = filename => filename.endsWith(".handlebars");

const getHandlebarsFilesInFolder = path =>
  filter(getFilenamesInFolder(path), isHandlebarsFile);

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
  const template = getFileContent(filepath, "utf-8");
  const context = getJSONFileContent(filepath.replace(".handlebars", ".json"));
  const html = Handlebars.compile(template)(context);
  writeFile(outputPath, html);
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
