import CustomDragLayer from "../CustomDragLayer.jsx";
import Notification from "../Notification.jsx";
import Result from "@/components/Result.jsx";
import {useParams} from "react-router-dom";
import ItemCard from "@/components/ItemCard.jsx";
import {useEffect, useRef, useState} from "react";
import {useDrop} from "react-dnd";
import MenuButton from "@/components/MenuButton.jsx";
import default_hairstyle from "../../../public/default_hairstyle.svg";

export default function JewelryStage() {

    const [elements, setElements] = useState([]);
    const [earrings, setEarrings] = useState([]);
    const [necklace, setNecklace] = useState([]);
    const [hairstyle, setHairstyle] = useState([{
        id: 1,
        img: default_hairstyle
    }]);

    const {categoryId} = useParams();

    const notificationRef = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isJewelriesCorrect, setIsJewelriesCorrect] = useState(false);

    const [recommendations, setRecommendations] = useState();

    const link = document.referrer;

    const [, earringsDrop] = useDrop({
        accept: "earrings",
        drop(data) {
            if (earrings.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    earrings[0],
                ]);
                setEarrings([data]);
            } else {
                setEarrings([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const [, necklaceDrop] = useDrop({
        accept: "necklace",
        drop(data) {
            if (necklace.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    necklace[0],
                ]);
                setNecklace([data]);
            } else {
                setNecklace([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const [, hairstyleDrop] = useDrop({
        accept: "hairstyle",
        drop(data) {
            if (hairstyle.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    hairstyle[0],
                ]);
                setHairstyle([data]);
            } else {
                setHairstyle([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const fetchJewelries = async () => {
        setIsLoading(true);
        const response = await fetch(
            import.meta.env.VITE_BACKEND_API_URL +
            `/categories/${categoryId}/jewelry`
        );
        let data = await response.json();
        for await (const item of data) {
            item.img = import.meta.env.VITE_BACKEND_URL + item.img;
            if (item.alternateImg !== null) {
                item.alternateImg = import.meta.env.VITE_BACKEND_URL + item.alternateImg;
            }
        }
        setIsLoading(false);
        setElements(data);
    };

    const fetchResult = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_API_URL + "/categories/" + categoryId);
        let data = await response.json();
        setRecommendations(data?.recommendations);
    }

    const checkJewelries = () => {
        if (earrings.length === 0 || necklace.length === 0 || hairstyle.length === 0) {
            notificationRef.current.notify();
            return;
        }

        setIsChecked(true);
        if (earrings[0]?.correct === "true" && necklace[0]?.correct === "true" && hairstyle[0]?.correct === "true") {
            setIsJewelriesCorrect(true);
        } else {
            setIsJewelriesCorrect(false);
        }
    }

    useEffect(() => {
        setIsChecked(false)
    }, [elements]);

    useEffect(() => {
        fetchJewelries();
        fetchResult();
    }, [categoryId]);

    return (
        <div className='jewelry-stage-bg h-screen flex overflow-hidden pt-8'>
            <CustomDragLayer/>
            {isJewelriesCorrect && <Result isGameOver={true} recommendations={recommendations} nextStage={""}/>}
            <Notification message="Наденьте серьги, ожерелье и выберите прическу" ref={notificationRef}/>
            <div className='flex flex-col mx-auto w-1/3 gap-8'>
                <div className="flex items-center gap-4">
                    <MenuButton link={link}/>
                    <button onClick={() => checkJewelries()}
                            className='flex-1 z-50 bg-green-400/75 backdrop-blur text-white text-2xl border-4 border-green-500 p-4 rounded-lg'>
                        Проверить
                    </button>
                </div>
                <div className='h-full w-full relative flex flex-col items-center justify-center jewelry-stage-character'>
                    <div
                        ref={(!isChecked) || (isChecked && hairstyle[0]?.correct !== "true") ? hairstyleDrop : null}
                        className={`w-full h-[40%] z-20 relative`}
                    >
                        {hairstyle.map((item) => (
                            <img
                                key={item.id}
                                src={item.img}
                                className={`w-full scale-[128%] pointer-events-none -top-[4.2rem] left-[0.7rem] absolute ${isChecked && hairstyle[0]?.correct === "true" ? 'drop-shadow-correct' : isChecked && hairstyle[0]?.correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''}`}
                            ></img>
                        ))}
                    </div>
                    <div
                        ref={(!isChecked) || (isChecked && earrings[0]?.correct !== "true") ? earringsDrop : null}
                        className={`flex w-full h-[20%] z-30 relative`}
                    >
                        {earrings[0] &&
                            <img
                                key={earrings[0].id}
                                src={earrings[0].img}
                                className={`w-1/2 h-full scale-50 object-fill -translate-x-10 translate-y-20 ${isChecked && earrings[0].correct === "true" ? 'drop-shadow-correct' : isChecked && earrings[0].correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''}`}
                            ></img>
                        }
                        {earrings[0] &&
                            <img
                                key={earrings[0].id + 1}
                                src={earrings[0].img}
                                className={`w-1/2 h-full scale-50 object-fill translate-x-4 translate-y-20 ${isChecked && earrings[0].correct === "true" ? 'drop-shadow-correct' : isChecked && earrings[0].correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''}`}
                            ></img>
                        }
                    </div>
                    <div
                        ref={(!isChecked) || (isChecked && necklace[0]?.correct !== "true") ? necklaceDrop : null}
                        className='w-full h-[40%] z-10 relative'
                    >
                        {necklace.map((item) => (
                            <img
                                key={item.id}
                                src={item.alternateImg || item.img}
                                className={`h-full w-full scale-[40%] -translate-x-1 translate-y-[5.5rem] absolute ${isChecked && necklace[0]?.correct === "true" ? 'drop-shadow-correct' : isChecked && necklace[0]?.correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''}`}
                            ></img>
                        ))}
                    </div>
                </div>
            </div>

            <div className='grid grid-rows-3 ml-8 rounded-lg w-[48%]'>
                <div className="flex justify-center gap-12 pb-20">
                    {elements.filter(i => i.type === "hairstyle").map((item) => (
                        <ItemCard
                            key={item.id}
                            data={item}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
                <div className="flex justify-center gap-12 py-20">
                    {elements.filter(i => i.type === "earrings").map((item) => (
                        <ItemCard
                            key={item.id}
                            data={item}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
                <div className="flex justify-center gap-6 pb-20 pt-20 px-8">
                    {elements.filter(i => i.type === "necklace").map((item) => (
                        <ItemCard
                            key={item.id}
                            data={item}
                            width={"w-1/4"}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}