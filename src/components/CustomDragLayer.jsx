import { useDragLayer } from "react-dnd";
import { useState } from "react"

export default function CustomDragLayer() {
    const { isDragging, item } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        isDragging: monitor.isDragging(),
    }));

    const [transform, setTransform] = useState({
        transform: `translate(0px, 0px)`
    });

    document.body.addEventListener("touchmove", (event) => {
        setTransform({
            transform: `translate(${event.targetTouches[0].clientX - event.targetTouches[0].target.offsetWidth / 2}px, ${event.targetTouches[0].clientY - event.targetTouches[0].target.offsetHeight / 2}px)`
        })
    })

    if (!isDragging) {
        return null;
    }

    return (
        <div style={{ pointerEvents: "none", position: "fixed", zIndex: 100 }}>
            <div style={transform}>
                <img src={item.img} alt={item.name} style={{ width: "150px", height: "150px" }} />
            </div>
        </div>
    );
}
