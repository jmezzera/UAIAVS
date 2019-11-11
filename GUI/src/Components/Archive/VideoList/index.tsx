import React, { Component } from 'react'
import { ListVideos } from '../../../services/Archive';

type VideoArchiveState = {
    videos: string[]
}

export default class VideoList extends Component<{}, VideoArchiveState> {
    constructor(props: any) {
        super(props);
        this.state = {
            videos: []
        }
        ListVideos()
            .then(videos => this.setState({ videos }))

    }
    render() {
        console.log(this.state.videos)
        return (
            <div>
                {
                    this.state.videos.map((video: string, index: number) => {
                        return (
                            <i key={"video " + index}> {video}</i>
                            
                        )
                    })
                }
            </div>
        )


    }
}
