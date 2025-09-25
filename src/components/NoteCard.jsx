import { useRef, useEffect, useState } from "react";
import { setNewOffset, autoGrow, setZIndex } from "../utils.js";
import Trash from "../icons/Trash.jsx";

const NoteCard = ({ note }) => {
    const cardRef = useRef(null);
    const [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);
    const textAreaRef = useRef(null);

    // Track last mouse pos for dragging
    let mouseStartPos = useRef({ x: 0, y: 0 });

    const mouseDown = (e) => {
        setZIndex(cardRef.current)
        mouseStartPos.current = { x: e.clientX, y: e.clientY };
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    };

    const mouseMove = (e) => {
        if (!cardRef.current) return;

        const mouseMoveDir = {
            x: mouseStartPos.current.x - e.clientX,
            y: mouseStartPos.current.y - e.clientY,
        };

        mouseStartPos.current = { x: e.clientX, y: e.clientY };

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
        setPosition(newPosition);
    };

    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);

    return (
        <div
            className="card"
            ref={cardRef}
            style={{
                position: "absolute", // important for left/top to apply
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div
                className="card-header"
                style={{ backgroundColor: colors.colorHeader, cursor: "grab" }}
                onMouseDown={mouseDown}
            >
                <Trash />
            </div>
            <div className="card-body">
                <textarea
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                    ref={textAreaRef}
                    onInput={() => autoGrow(textAreaRef)}
                    onFocus={() => {setZIndex(cardRef.current);  
                    }}
                />
            </div>
        </div>
    );
};

export default NoteCard;
