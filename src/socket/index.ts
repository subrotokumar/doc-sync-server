
import { Request } from "express";
import { Server, Socket } from "socket.io";
import { Document } from "../models/document.model";

const joinEvent = (socket: Socket) => {
    socket.on('join', (documentId: string) => {
        socket.join(documentId);
    })
}

const typingEvent = (socket: Socket) => {
    socket.on('typing', (data) => {
        socket.broadcast.to(data.room).emit("changes", data);
    })
}

const saveEvent = (socket: Socket) => {
    socket.on("save", (data) => {
        saveData(data);
    });
}

const saveData = async (data: any) => {
    try {
        console.log("saving");
        let document = await Document.findById(data.room);
        console.log(document)
        if (!document) return;
        document.content = data.delta;
        document = await document.save();
    } catch (e) {
        //@ts-ignore
        console.log(e.message)
    }
}

const initializeSocketIO = (io: Server) => {
    return io.on("connection", async (socket: Socket) => {
        try {
            joinEvent(socket)
            typingEvent(socket)
            saveEvent(socket)
        } catch (error) {
            if (error instanceof Error) {
                socket.emit(
                    "socketError",
                    error?.message || "Something went wrong while connecting to the socket."
                );
            } else if (typeof error === 'string') {
                socket.emit(
                    "socketError",
                    error || "Something went wrong while connecting to the socket."
                );
            }
        }
    });
};

const emitSocketEvent = (req: Request, roomId: string, event: any, payload: any) => {
    req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };