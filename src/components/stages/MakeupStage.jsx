import CustomDragLayer from "../CustomDragLayer.jsx";
import Notification from "../Notification.jsx";
import Result from "@/components/Result.jsx";
import {useParams} from "react-router-dom";
import ItemCard from "@/components/ItemCard.jsx";
import {useEffect, useRef, useState} from "react";
import {useDrop} from "react-dnd";
import MenuButton from "@/components/MenuButton.jsx";

export default function MakeupStage() {

    const [elements, setElements] = useState([]);
    const [shadow, setShadow] = useState([]);
    const [mascara, setMascara] = useState([]);
    const [lipstick, setLipstick] = useState([]);

    const [currentDragItem, setCurrentDragItem] = useState(null);

    const {categoryId} = useParams();

    const notificationRef = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isMakeupCorrect, setIsMakeupCorrect] = useState(false);

    const link = document.referrer;

    const [, shadowDrop] = useDrop({
        accept: "shadow",
        drop(data) {
            if (shadow.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    shadow[0],
                ]);
                setShadow([data]);
            } else {
                setShadow([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const [, mascaraDrop] = useDrop({
        accept: "mascara",
        drop(data) {
            if (mascara.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    mascara[0],
                ]);
                setMascara([data]);
            } else {
                setMascara([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const [, lipstickDrop] = useDrop({
        accept: "lipstick",
        drop(data) {
            if (lipstick.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    lipstick[0],
                ]);
                setLipstick([data]);
            } else {
                setLipstick([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const fetchMakeup = async () => {
        setIsLoading(true);
        const response = await fetch(
            import.meta.env.VITE_BACKEND_API_URL +
            `/categories/${categoryId}/makeup`
        );
        let data = await response.json();
        for await (const item of data) {
            item.img = import.meta.env.VITE_BACKEND_URL + item.img;
            item.alternateImg = import.meta.env.VITE_BACKEND_URL + item.alternateImg;
        }
        setIsLoading(false);
        setElements(data);
    };

    const checkMakeup = () => {
        if (shadow.length === 0 || mascara.length === 0 || lipstick.length === 0) {
            notificationRef.current.notify();
            return;
        }

        setIsChecked(true);
        if (shadow[0]?.correct === "true" && mascara[0]?.correct === "true" && lipstick[0]?.correct === "true") {
            setIsMakeupCorrect(true);
        } else {
            setIsMakeupCorrect(false);
        }
    }

    useEffect(() => {
        setIsChecked(false)
    }, [elements]);

    useEffect(() => {
        fetchMakeup();
    }, [categoryId]);

    return (
        <div className='makeup-stage-bg h-screen flex pt-8'>
            <CustomDragLayer/>
            {isMakeupCorrect && <Result isGameOver={false} nextStage={`/category/${categoryId}/jewelry`}/>}
            <Notification message="Нанесите макияж с каждой полки" ref={notificationRef}/>
            <div className='flex flex-col mx-auto w-1/3 gap-8'>
                <div className="flex items-center gap-4">
                    <MenuButton link={link}/>
                    <button onClick={() => checkMakeup()}
                            className='flex-1 bg-green-400/75 backdrop-blur text-white text-2xl border-4 border-green-500 p-4 rounded-lg'>
                        Проверить
                    </button>
                </div>
                <div className='relative flex flex-col items-center justify-center h-full w-full makeup-stage-character'>
                    <div
                        ref={(!isChecked) || (isChecked && shadow[0]?.correct !== "true") ? shadowDrop : null}
                        className={`w-full h-[12%] top-[35%] absolute ${currentDragItem?.type === "shadow" ? "z-30" : "z-10"}`}
                    >
                        {shadow.map((item) => (
                            <img
                                key={item.id}
                                src={item.alternateImg}
                                className={`h-full w-full scale-[52%] -translate-x-3.5 translate-y-2.5 ${isChecked && shadow[0]?.correct === "true" ? 'drop-shadow-correct' : isChecked && shadow[0]?.correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''}`}
                            ></img>
                        ))}
                    </div>
                    <div
                        ref={(!isChecked) || (isChecked && mascara[0]?.correct !== "true") ? mascaraDrop : null}
                        className={`flex w-full h-[12%] top-[35%] absolute z-20 ${currentDragItem?.type === "shadow" ? "hidden" : "block"}`}
                    >
                        {mascara[0] &&
                            <img
                                key={mascara[0].id}
                                src={mascara[0].alternateImg}
                                className={`w-1/2 h-full scale-[60%] translate-x-10 translate-y-1.5 rotate-3 ${isChecked && mascara[0].correct === "true" ? 'drop-shadow-correct' : isChecked && mascara[0].correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''}`}
                            ></img>
                        }
                        {mascara[0] &&
                            <img
                                key={mascara[0].id + 1}
                                src={mascara[0].alternateImg}
                                className={`w-1/2 h-[60%] scale-x-[-1] -translate-x-16 translate-y-6 -rotate-2 ${isChecked && mascara[0].correct === "true" ? 'drop-shadow-correct' : isChecked && mascara[0].correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''}`}
                            ></img>
                        }
                    </div>
                    <div
                        ref={(!isChecked) || (isChecked && lipstick[0]?.correct !== "true") ? lipstickDrop : null}
                        className='w-full h-[12%] top-[57%] z-10 absolute'
                    >
                        {lipstick.map((item) => (
                            <img
                                key={item.id}
                                src={item.alternateImg}
                                className={`h-full w-full scale-[66%] -translate-x-2 translate-y-1 ${isChecked && lipstick[0]?.correct === "true" ? 'drop-shadow-correct' : isChecked && lipstick[0]?.correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''}`}
                            ></img>
                        ))}
                    </div>
                </div>
            </div>

            <div className='grid grid-rows-3 ml-8 rounded-lg w-[48%]'>
                <div className="flex justify-center py-20 pr-16">
                    {elements.filter(i => i.type === "shadow").map((item) => (
                        <ItemCard
                            onDragStart={() => setCurrentDragItem(item)}
                            onDragEnd={() => setCurrentDragItem(null)}
                            key={item.id}
                            data={item}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
                <div className="flex justify-center gap-8 pb-14">
                    {elements.filter(i => i.type === "mascara").map((item) => (
                        <ItemCard
                            key={item.id}
                            data={item}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
                <div className="flex justify-center gap-12 pb-14">
                    {elements.filter(i => i.type === "lipstick").map((item) => (
                        <ItemCard
                            key={item.id}
                            data={item}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
