import React from "react";
import { ReactComponent as PlayerOffIcon } from "../img/player_off.svg";
import ListGroup from "react-bootstrap/ListGroup";

export default class Client extends React.Component {
  render() {
    return (
      <ListGroup.Item className="py-1">
        <PlayerOffIcon width="16px" height="16px" />
        <span style={{ paddingLeft: "5px" }}>{this.props.client_nickname}</span>
      </ListGroup.Item>
    );
  }
}
