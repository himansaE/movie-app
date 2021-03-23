import React from "react";
import {
  I_facebook,
  I_Linkedin,
  I_Pinterest,
  I_Twitter,
  I_WhatsApp,
  I_GBookMark,
  I_telegram,
  I_Message,
  I_Blogger,
} from "../../data/svg/SocialIcons";
import { I_CLOSE } from "../../data/svg/svg";
import { FBAnalytics } from "../../functions/config/fbConfig";
import Styles from "./share.module.css";

function Share(props) {
  const urls = [
    {
      name: "Message",
      Icon: I_Message,
      link:
        "sms:?body=" + encodeURI(`${props.title}\n${props.text}\n${props.url}`),
    },
    {
      name: "Google BookMark",
      Icon: I_GBookMark,
      link:
        "https://www.google.com/bookmarks/mark?op=edit&bkmk=" +
        encodeURI(props.url) +
        `&title=${props.title}&annotation=${props.text}&labels="movies"`,
    },
    {
      name: "Facebook",
      Icon: I_facebook,
      link: `http://www.facebook.com/sharer.php?u=${encodeURI(props.url)}`,
    },
    {
      name: "Twitter",
      Icon: I_Twitter,
      link:
        "https://twitter.com/intent/tweet?url=" +
        encodeURIComponent(props.url) +
        `&text=%0a${encodeURIComponent(props.title)}%0a`,
    },
    {
      name: "WhatsApp",
      Icon: I_WhatsApp,
      link:
        "https://api.whatsapp.com/send?text=" +
        `${encodeURIComponent(props.url)}%0a${encodeURIComponent(
          props.title
        )}%0a${encodeURIComponent(props.text)}`,
    },
    {
      name: "Telegram",
      Icon: I_telegram,
      link:
        "https://t.me/share/url?url=" +
        `${encodeURIComponent(props.url)}%0a${encodeURIComponent(
          props.title
        )}%0a${encodeURIComponent(props.text)}`,
    },

    {
      name: "Pinterest",
      Icon: I_Pinterest,
      link:
        "http://pinterest.com/pin/create/link/?url=" +
        encodeURIComponent(props.url),
    },
    {
      name: "Linkedin",
      Icon: I_Linkedin,
      link:
        "https://www.linkedin.com/shareArticle?mini=true&url=" +
        `${encodeURIComponent(props.url)}&title=${encodeURIComponent(
          props.title
        )}&summary=${encodeURIComponent(props.text)}`,
    },
    {
      name: "Blogger",
      Icon: I_Blogger,
      link:
        "https://www.blogger.com/blog-this.g?u=" +
        encodeURIComponent(props.url) +
        "&n=" +
        encodeURIComponent(props.title) +
        "&t=" +
        encodeURI(props.text),
    },
  ];
  return (
    <div
      className={Styles.popup}
      onClick={(e) => {
        if (e.currentTarget === e.target) props.hidePopup();
      }}
    >
      <div className={Styles.con}>
        <div className={Styles.head}>
          <h2>Share</h2>
          <div className={Styles.I_CLOSE} onClick={() => props.hidePopup()}>
            <I_CLOSE />
          </div>
        </div>
        <div className={Styles.body}>
          {urls.map((i) => (
            <a
              key={i.name}
              className={Styles.item}
              href={i.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => FBAnalytics("share_click")}
            >
              <div className={Styles.icon}>
                <i.Icon />
              </div>
              <div className={Styles.name}>{i.name}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Share;
