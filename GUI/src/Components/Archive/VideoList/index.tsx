import React, { Component } from 'react'
import { ListVideos } from '../../../services/Archive';
import './VideoList.css';

type VideoArchiveState = {
    videos: string[]
}
type VideoArchiveProps = {
    playVideo: (string) => void;
}

export default class VideoList extends Component<VideoArchiveProps, VideoArchiveState> {
    constructor(props: any) {
        super(props);
        this.state = {
            videos: []
        }
        ListVideos()
            .then(videos => this.setState({ videos }))

    }
    render() {
        return (
            <div className="VideoArchive">
                {
                    this.state.videos.map((video: string, index: number) => {
                        return (
                            <i className="videoName" key={"video " + index} onClick={() => this.props.playVideo(video)}> {video}</i>
                            
                        )
                    })
                }
            </div>
        )


    }
}
