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

// Include libraries
const express = require("express");

// Constants
const port = 3000;
const source = "./build";
const jsSource = "./js";

const app = express();

app.use("/js", express.static(jsSource));
app.use(express.static(source));

app.listen(port);
console.log(`listening to http://localhost:${port}`);
