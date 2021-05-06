const cssPath = ".\\build\\static\\css";
const fs = require("fs");
const path = require("path");

fs.readdir(cssPath, (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (file.endsWith(".css")) {
      let css_file = path.join(cssPath, file);
      fs.appendFileSync(css_file, "\n  ");
    }
  });
  console.log("postdeploy done.");
});
