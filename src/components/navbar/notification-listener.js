import React from "react";
import { Component } from "react";
import { I_CLOSE, I_DOWN } from "../../data/svg/svg";
import cssClass from "../../functions/extra/cssClass";
import Style from "./navbar.module.css";

export default class NotificationListener extends Component {
  constructor() {
    super();
    this.timeoutSpeed = 100;
    this.state = {
      notifications: [],
    };
  }
  componentDidMount() {
    window.addEventListener("new-app-notification", (e) => {
      const close_func = () => {
        if (e.detail.timeout === Infinity) return undefined;
        const t = setInterval(() => {
          try {
            if (e.detail.timeout === Infinity) return clearInterval(t);

            let arr = setNfVal(
              this.state.notifications,
              nfElements.time,
              (e) => e - this.timeoutSpeed,
              e.detail.key
            );
            arr = setNfVal(
              this.state.notifications,
              nfElements.IntervalID,
              t,
              e.detail.key
            );
            this.setState({ notifications: arr });

            if (
              this.state.notifications[
                findInArray(this.state.notifications, e.detail.key)
              ].time <= 0
            ) {
              const arr = this.state.notifications;
              arr.splice(
                findInArray(this.state.notifications, e.detail.key),
                1
              );
              this.setState({ notifications: arr });
              clearInterval(t);
            }
          } catch (_) {}
        }, this.timeoutSpeed);
      };
      if (findInArray(this.state.notifications, e.detail.key) === -1) {
        this.setState(
          {
            notifications: [
              ...this.state.notifications,
              Object.assign(
                {
                  expanded: false,
                  time: e.detail.timeout,
                },
                e.detail
              ),
            ],
          },
          close_func()
        );
      } else {
        if (
          this.state.notifications[
            findInArray(this.state.notifications, e.detail.key)
          ].timeout === Infinity &&
          e.detail.timeout !== Infinity
        )
          close_func();
        setNfVal(
          this.state.notifications,
          nfElements.time,
          e.detail.timeout,
          e.detail.key
        );
      }
    });
  }
  render() {
    return (
      <div className={Style.nf_con}>
        {this.state.notifications.map((i, n) => {
          return (
            <div
              key={i.key}
              className={cssClass(
                Style.notification,
                i.expandable && i.expanded ? Style.nf_expand : ""
              )}
            >
              <div className={Style.nf_content}>
                <div className={Style.nf_title}>{i.text}</div>
                {i.expandable && i.expanded ? (
                  <div className={Style.nf_desc}> {i.desc}</div>
                ) : (
                  <></>
                )}
              </div>
              <div className={Style.nf_control}>
                {i.expandable ? (
                  <>
                    <div
                      className={cssClass(
                        Style.nf_btn,
                        Style.nf_btn_expand,
                        i.expanded ? Style.nf_btn_expanded : ""
                      )}
                      onClick={() => {
                        this.setState({
                          notification: setNfVal(
                            this.state.notifications,
                            nfElements.expanded,

                            (e) => !e,
                            i.key
                          ),
                        });
                      }}
                    >
                      <I_DOWN />
                    </div>
                    <div className={Style.nf_btn_fake}></div>
                  </>
                ) : (
                  <></>
                )}
                <div
                  className={Style.nf_btn}
                  onClick={() => {
                    clearInterval(
                      this.state.notifications[
                        findInArray(this.state.notifications, i.key)
                      ].IntervalID
                    );
                    const arr = this.state.notifications;
                    arr.splice(findInArray(this.state.notifications, i.key), 1);
                    this.setState({ notifications: arr });
                  }}
                >
                  <I_CLOSE />
                </div>
                <div className={Style.nf_btn_fake}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export function newNotification({ text, desc, timeout, expandable, key }) {
  var event = new CustomEvent("new-app-notification", {
    detail: {
      text: text,
      desc: desc || "",
      timeout: timeout || 2000,
      expandable: expandable || false,
      key: key,
    },
    cancelable: false,
  });
  window.dispatchEvent(event);
}

function findInArray(_array, key) {
  return _array.findIndex((obj) => obj.key === key);
}
function setNfVal(arr, element, val, key) {
  let index = findInArray(arr, key);
  if (typeof val === "function") arr[index][element] = val(arr[index][element]);
  else arr[index][element] = val;
  return arr;
}
class nfElements {
  static text = "text";
  static desc = "desc";
  static timeout = "timeout";
  static expandable = "expandable";
  static expanded = "expanded";
  static time = "time";
  static key = "key";
  static IntervalID = "IntervalID";
}
