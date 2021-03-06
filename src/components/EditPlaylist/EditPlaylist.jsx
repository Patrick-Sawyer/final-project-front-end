import React, { Component } from "react";
import axios from "axios";
import "./EditPlaylist.css";

class EditPlaylist extends Component {
  state = {
    tikToks: [],
    uuid: this.props.match.params.uuid,
    value: "",
    newTikToks: [],
    title: "",
  };

  componentDidMount = () => {
    if (this.state.uuid !== "new") {
      this.api();
    }
  };

  delete = (index) => {
    let newArray = this.state.tikToks;
    newArray.splice(index, 1);
    this.setState({
      tikToks: newArray,
    });
  };

  api = async () => {
    let url = "http://chronomy.herokuapp.com/playlists/" + this.state.uuid;
    await axios
      .get(url, { withCredentials: true })
      .then((response) => {
        let title = "Untitled";
        if (response.data.playlist.title != "") {
          title = response.data.playlist.title;
        }
        this.setState({
          tikToks: response.data.tiktoks,
          title: title,
        });
      })
      .catch((error) => console.log(error));
  };

  save_new_playlist = async () => {
    let url = "http://chronomy.herokuapp.com/playlists/";
    await axios
      .post(
        url,
        {
          playlist: {
            title: this.state.title,
            tiktoks: this.state.newTikToks,
          },
        },
        { withCredentials: true }
      )
      .then((response) => {
        this.props.history.push("/account");
      })
      .catch((error) => console.log(error));
  };

  update_playlist = async () => {
    let array = this.state.tikToks
      .map((tiktok) => tiktok.original_url)
      .concat(this.state.newTikToks);
    let url = "http://chronomy.herokuapp.com/playlists/" + this.state.uuid;
    await axios
      .put(
        url,
        {
          playlist: {
            title: this.state.title,
            tiktoks: array,
          },
        },
        { withCredentials: true }
      )
      .then((response) => {
        this.props.history.push("/account");
      })
      .catch((error) => console.log(error));
  };

  save = () => {
    this.state.uuid == "new"
      ? this.save_new_playlist()
      : this.update_playlist();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let array = this.state.newTikToks;
    array.push(this.state.value);
    this.setState({
      newTikToks: array,
      value: "",
    });
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleChangeTitle = (event) => {
    this.setState({
      title: event.target.value,
    });
  };

  tiktok_title_check = (title) => {
    return title == "" ? "Untitled" : title;
  };

  render() {
    let elements = [];
    for (let i = 0; i < this.state.tikToks.length; i++) {
      elements.push(
        <div className="tik-tok element" key={i} id={"tikTok" + i}>
          <p className="title-text">
            <strong>
              {this.tiktok_title_check(this.state.tikToks[i].title)}
            </strong>
          </p>
          <button
            className="delete-button patsbutton"
            onClick={() => {
              this.delete(i);
            }}
          >
            Click here to delete Tik-Tok
          </button>
        </div>
      );
    }

    return (
      <div className="edit-playlist">
        <button className="save-button patsbutton" onClick={this.save}>
          Click here to save
        </button>
        <div className="tik-tok">
          <label className="title-text">
            Playlist Title: <strong>{this.state.title}</strong>
          </label>
          <br></br>
          <input
            type="text"
            onChange={this.handleChangeTitle}
            name="titleInput"
            placeholder="Change title"
            id="title"
          />
        </div>
        <div className="tik-tok">
          <form className="form" onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              name="tikTokLink"
              placeholder="Tik-Tok link"
              required
              id="input"
            />
            <br></br>
            <button type="submit" id="submit" className="patsbutton">
              Click here to add Tik-Tok
            </button>
          </form>
          <p className="unsaved">
            <small>Unsaved Tik-Toks: {this.state.newTikToks.length}</small>
          </p>
        </div>

        {elements}
      </div>
    );
  }
}

export default EditPlaylist;
