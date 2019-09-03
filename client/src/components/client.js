import React from "react";
import { ReactComponent as PlayerOffIcon } from "../img/player_off.svg";
import { ReactComponent as ClientInputMuted } from "../img/input_muted.svg";
import { ReactComponent as ClientOutputMuted } from "../img/output_muted.svg";
import ListGroup from "react-bootstrap/ListGroup";

export default class Client extends React.Component {
  getStatusIcon(clientData) {
    const { client_input_muted, client_output_muted } = clientData;

    if (client_output_muted) {
      return <ClientOutputMuted width="16px" height="16px" />;
    }

    if (client_input_muted) {
      return <ClientInputMuted width="16px" height="16px" />;
    }

    return <PlayerOffIcon width="16px" height="16px" />;
  }

  render() {
    return (
      <ListGroup.Item className="py-1">
        {this.getStatusIcon(this.props)}
        <span style={{ paddingLeft: "5px" }}>{this.props.client_nickname}</span>
      </ListGroup.Item>
    );
  }
}
