import React from "react";
import io from "socket.io-client";
import Channel from "./channel";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/server.css";
import { ReactComponent as ServerGreenIcon } from "../img/server_green.svg";

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
    socket.on("update", currentServer => {
      this.setState(currentServer);
      console.log(currentServer);
    });
  }

  render() {
    return (
      <div className="ServerViewer">
        <header className="ServerNameHeader">
          <ServerGreenIcon width="16px" height="16px" />
          {this.state.serverName}
        </header>
        <ul className="list-group">
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
