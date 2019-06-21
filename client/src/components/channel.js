import React from "react";
import Client from './client';

export default class Channel extends React.Component {
  render() {
    return (
      <li>
        {this.props.channel_name}
        <ul>
          {this.props.connected_clients.map(client => (
            <Client
              key={client.clid}
              client_nickname={client.client_nickname}
            />
          ))}
        </ul>
      </li>
    );
  }
}
