import React from "react";
import { ReactComponent as PlayerOffIcon } from "../img/player_off.svg";

export default class Client extends React.Component {
  render() {
    return (
      <li className="list-group-item">
        <PlayerOffIcon width="16px" height="16px" />
        {this.props.client_nickname}
      </li>
    );
  }
}
