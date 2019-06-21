import React from "react";
import io from "socket.io-client";
import Channel from "./channel";

export default class Server extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      serverName: "",
      channelList: [
        {
          channel_name: "",
          connected_clients: []
        }
      ]
    };

    const socket = io("http://localhost:3000");
    socket.on("update", msg => {
      this.setState(msg);
    });
  }

  render() {
    return (
      <div>
        <h1>{this.state.serverName}</h1>
        <ul>
          {this.state.channelList.map(channel => (
            <Channel
              key={channel.cid}
              channel_name={channel.channel_name}
              connected_clients={channel.connected_clients}
            />
          ))}
        </ul>
      </div>
    );
  }
}
