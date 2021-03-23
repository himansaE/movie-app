import ReactDOMServer from "react-dom/server";
import React from "react";

const trackerList = [
  "udp://open.demonii.com:1337/announce",
  "udp://tracker.openbittorrent.com:80",
  "udp://tracker.coppersurfer.tk:6969",
  "udp://glotorrents.pw:6969/announce",
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://torrent.gresille.org:80/announce",
  "udp://p4p.arenabg.com:1337",
  "udp://tracker.leechers-paradise.org:6969",
];
export function hashToMagnet(hash, name) {
  if (!(hash && name)) throw Error("Two  Parameters Required.");
  isStrings(hash, name);
  let mag_str = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(
    name
  )}&tr=${encodeURIComponent(trackerList.join("&tr="))}`;
  return mag_str;
}
function isStrings(...val) {
  val.forEach((i) => {
    if (!(typeof i === "string")) throw Error("Type error");
  });
}
export function copy(text) {
  var done = false;
  try {
    navigator.clipboard.writeText(text);
    done = true;
  } catch {
    try {
      var elem = ReactDOMServer.renderToStaticMarkup(
        <textarea style={{ display: "none" }}>{text}</textarea>
      );
      document.body.appendChild(elem);
      elem.focus();
      elem.select();
      document.execCommand("copy");
      document.body.remove(elem);
      done = true;
    } catch {
      console.error("Can't copy text");
    }
  }
  if (done) {
    snackbar("Copied url Successful.");
  } else {
    snackbar("Can't copy url");
  }
}
export function snackbar(text) {
  var elem = ReactDOMServer.renderToStaticMarkup(
    <div className="snackbar_con">{text}</div>
  );
  var old = document.getElementById("snackbar");
  if (old) old.remove();
  var con = document.createElement("div");
  con.id = "snackbar";
  con.style.display = "flex";
  con.style.placeContent = "center";
  con.innerHTML = elem;
  document.body.appendChild(con);
  con.querySelector(".snackbar_con").addEventListener("animationend", () => {
    document.body.removeChild(con);
  });
}
