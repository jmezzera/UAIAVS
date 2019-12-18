import { Router } from "express";

export default interface IVideoArchive{
    listVideos(): Promise<string[]>;
    playVideo(video: string): void;
    deleteVideo(video: string): Promise<number>;
    router: Router;
}