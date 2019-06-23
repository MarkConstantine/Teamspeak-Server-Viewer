import React from "react";
import Client from "./client";
import { ReactComponent as ChannelIcon } from "../img/channel_green_subscribed.svg";
import ListGroup from "react-bootstrap/ListGroup";

export default class Channel extends React.Component {
  render() {
    return (
      <ListGroup.Item className="py-1">
        <ChannelIcon width="16px" height="16px" />
        <span style={{ paddingLeft: "5px" }}>{this.props.channel_name}</span>
        <ListGroup variant="flush">
          {this.props.connected_clients.map(client => (
            <Client
              key={client.clid}
              client_nickname={client.client_nickname}
            />
          ))}
        </ListGroup>
      </ListGroup.Item>
    );
  }
}
