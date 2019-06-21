import React from "react";
import Client from "./client";
import { ReactComponent as ChannelGreenIcon } from "../img/channel_green_subscribed.svg";

export default class Channel extends React.Component {
  render() {
    return (
      <div>
        <li className="list-group-item list-group-item-dark">
          <ChannelGreenIcon width="16px" height="16px" />
          {this.props.channel_name}
          <ul className="list-group">
            {this.props.connected_clients.map(client => (
              <Client
                key={client.clid}
                client_nickname={client.client_nickname}
              />
            ))}
          </ul>
        </li>
      </div>
    );
  }
}
