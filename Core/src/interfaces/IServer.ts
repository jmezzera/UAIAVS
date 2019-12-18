import StreamingSocket from "../controllers/StreamingSocket";
import IPositioning from "./IPositioning";
import IAngles from "./IAngles";

export default interface IServer {
    streamingSocket: StreamingSocket;
    positioning: IPositioning;
    angles: IAngles;
    start(): void;
}