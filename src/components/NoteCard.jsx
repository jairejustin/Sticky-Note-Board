import { useRef, useEffect, useState } from "react";
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

        // 1 - Calculate move direction
        const mouseMoveDir = {
            x: mouseStartPos.current.x - e.clientX,
            y: mouseStartPos.current.y - e.clientY,
        };

        // 2 - Update start position for next move.
        mouseStartPos.current = { x: e.clientX, y: e.clientY };

        // 3 - Update card top and left position
        setPosition((prev) => ({
            x: cardRef.current.offsetLeft - mouseMoveDir.x,
            y: cardRef.current.offsetTop - mouseMoveDir.y,
        }));
    };

    function autoGrow(ref) {
        if (!ref.current) return;
        ref.current.style.height = "auto";
        ref.current.style.height = ref.current.scrollHeight + "px";
    }

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
                />
            </div>
        </div>
    );
};

export default NoteCard;
