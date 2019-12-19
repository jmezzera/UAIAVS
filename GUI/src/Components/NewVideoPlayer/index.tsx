import React,  { Component } from "react";

export default class VideoPlayer extends Component<{video: string}, {}>{
    render(){
        if (!this.props.video)
            return null;
        return (
            <video controls className="video" src={"http://localhost:8080/videos/" + this.props.video} style={{height:  "400px", width: "600px"}}typeof="video/mp4"> </video>
        )
    }
}