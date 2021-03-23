import React, { Component } from "react";
import Styles from "./styles.module.css";

class Select extends Component {
  constructor() {
    super();
    this.state = {
      value: ``,
      data: [],
      pop: false,
      q: "",
      val: "",
      per_val: "",
    };
  }
  componentDidMount() {
    this.setState({ data: this.props.options });
    window.addEventListener("form_reset", this.reset, false);
  }
  static getDerivedStateFromProps(props, state) {
    if (props.val) {
      return (state = {
        val: props.val,
      });
    }
    return null;
  }
  componentDidUpdate() {
    if (
      this.state.val !== this.state.per_val &&
      this.props.options.includes(this.state.val)
    ) {
      this.setState(
        { value: this.state.val },
        this.setState({ per_val: this.state.val })
      );
    }
  }
  reset = () => {
    this.setState({ value: "", q: "" });
  };
  render() {
    return (
      <div>
        <div
          className={Styles.select_con}
          onClick={(e) => {
            this.setState({ pop: true });
          }}
        >
          <div className={Styles.SelectIcon}>
            <this.props.icon w="20" />
          </div>
          <div className={Styles.Select_value}>
            {this.state.value || "Select"}
          </div>
          <input
            aria-hidden="true"
            value={this.state.value}
            hidden={true}
            readOnly={true}
          />
        </div>
        {this.state.pop ? (
          <div
            className={Styles.Select_popup}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                this.setState({ pop: false });
              }
            }}
          >
            <div className={Styles.Select_pop}>
              <div className={Styles.pop_head}>Select Item</div>
              {this.props.search !== false ? (
                <input
                  className={Styles.Select_input}
                  value={this.state.q}
                  placeholder="Filter"
                  onChange={(e) => {
                    this.setState({
                      q: e.target.value,
                      data: this.props.options.filter((i) =>
                        i.toUpperCase().includes(e.target.value.toUpperCase())
                      ),
                    });
                  }}
                />
              ) : (
                <div></div>
              )}
              <div className={Styles.pop_data}>
                {this.state.data.map((i, n) => (
                  <div
                    className={
                      Styles.Select_item +
                      " " +
                      (this.state.value === i ? Styles.select_selected : "")
                    }
                    key={n}
                    onClick={() => {
                      this.setState({ value: i, pop: false });
                    }}
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export { Select };
