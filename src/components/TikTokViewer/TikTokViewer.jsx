import React, { Component } from "react";
import axios from "axios";
import Buttons from "../Buttons/Buttons";
import "./TikTokViewer.css";

class TikTokViewer extends Component {
  state = {
    tikToks: [],
    currentClip: 0,
    title: "",
    src: "",
    uuid: this.props.match.params.uuid,
  };

  handleNext = () => {
    if (this.state.currentClip >= this.state.tikToks.length - 1) {
      this.setState({ currentClip: 0 });
    } else {
      this.setState({ currentClip: this.state.currentClip + 1 });
    }
    this._update();
  };

  handlePrevious = () => {
    if (this.state.currentClip <= 0) {
      this.setState({ currentClip: this.state.tikToks.length - 1 });
    } else {
      this.setState({ currentClip: this.state.currentClip - 1 });
    }
    this._update();
  };

  _update = () => {
    this.setState({
      title: this.state.tikToks[this.state.currentClip].title,
      src: this.state.tikToks[this.state.currentClip].mp4_url,
    });
  };

  componentDidMount = async () => {
    let url = "http://chronomy.herokuapp.com/playlists/" + this.state.uuid;
    await axios
      .get(url, { withCredentials: true })
      .then((response) => {
        this.setState({
          tikToks: response.data.tiktoks,
          title: response.data.tiktoks[0].title,
          src: response.data.tiktoks[0].mp4_url,
        });
        console.log(this.state.tikToks);
      })
      .catch((error) => console.log(error));
  };

  render = () => {
    return (
      <div className="tik-tok-viewer" data-cy="tik-tok">
        {this.state.title}
        <br />
        <video src={this.state.src} controls loop height="480" width="250" />
        <Buttons
          handleNext={this.handleNext}
          handlePrevious={this.handlePrevious}
        />
      </div>
    );
  };
}

export default TikTokViewer;
