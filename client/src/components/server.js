import React from "react";
import io from "socket.io-client";
import Channel from "./channel";
import "bootstrap/dist/css/bootstrap.css";
import { ReactComponent as ServerGreenIcon } from "../img/server_green.svg";
import { Card, Container, ListGroup } from "react-bootstrap";

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

    const socket = io(
      `http://${this.props.config.serverAddress}:${
        this.props.config.serverPort
      }`
    );
    socket.on("update", currentServer => {
      this.setState(currentServer);
      console.log(currentServer);
    });
    socket.on("cliententerview", clientConnectionInfo => {
      console.log(clientConnectionInfo);
    });
    socket.on("clientleftview", clientDisconnectionInfo => {
      console.log(clientDisconnectionInfo);
    });
  }

  render() {
    return (
      <Container>
        <Card style={{ width: "95%", margin: "auto" }}>
          <Card.Header>
            <Card.Title>Teamspeak Server Viewer</Card.Title>
            <Card.Subtitle>
              <ServerGreenIcon width="16px" height="16px" />
              <span style={{ paddingLeft: "5px" }}>
                {this.state.serverName}
              </span>
            </Card.Subtitle>
          </Card.Header>
          <ListGroup style={{ color: "#000" }}>
            {this.state.channelList.map(channel => (
              <Channel
                key={channel.cid}
                channel_name={channel.channel_name}
                connected_clients={channel.connected_clients}
              />
            ))}
          </ListGroup>
        </Card>
      </Container>
    );
  }
}
