import React from "react";

export default class Client extends React.Component {
  render() {
    return <li>{this.props.client_nickname}</li>;
  }
}
