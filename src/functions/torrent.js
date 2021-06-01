import ReactDOMServer from "react-dom/server";
import React from "react";
import { newNotification } from "../components/navbar/notification-listener";
import Style from "../components/navbar/navbar.module.css";
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
        <textarea style={{ display: "none" }} defaultValue={text}></textarea>
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
    newNotification({
      text: "Link copied",
      timeout: 3000,
      key: "copy",
    });
  } else {
    return newNotification({
      text: "Can't copy link",
      timeout: 7000,
      key: "copy",
      desc: (
        <div className={Style.copy_bx_line}>Something wrong with browser</div>
      ),
      expandable: true,
    });
  }
}
