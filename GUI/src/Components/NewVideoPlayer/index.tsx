import React,  { Component } from "react";

export default class VideoPlayer extends Component<{}, {}>{
    render(){
        return (
            <video  className="video" src={"http://localhost:8080/videos/1.mp4"} style={{height:  "400px", width: "600px"}}typeof="video/mp4"> </video>
        )
    }
}