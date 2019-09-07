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

import {
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync
} from "fs";
import { join, sep, resolve, dirname } from "path";
import Underscore from "underscore";
const { reduce } = Underscore;

export const pathExists = path => {
  try {
    statSync(path);
    return true;
  } catch (e) {
    return false;
  }
};

export const createFolders = path =>
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

export const getFilenamesInFolder = path => readdirSync(path);

export const getFileContent = path => readFileSync(path, "utf-8");

export const getJSONFileContent = path => JSON.parse(getFileContent(path));

export const writeFile = (path, content) => {
  const outputFolder = dirname(path);
  createFolders(outputFolder);
  writeFileSync(path, content);
};
