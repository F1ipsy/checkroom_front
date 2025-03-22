import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {useDrop} from "react-dnd";
import ItemCard from "../ItemCard.jsx";
import Notification from "../Notification.jsx";
import Result from "../Result.jsx";
import CustomDragLayer from "../CustomDragLayer.jsx";
import MenuButton from "@/components/MenuButton.jsx";

export default function ClothesStage() {
    const [elements, setElements] = useState([]);
    const [body, setBody] = useState([]);
    const [pants, setPants] = useState([]);
    const [shoes, setShoes] = useState([]);

    const {categoryId} = useParams();

    const notificationRef = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isClothesCorrect, setIsClothesCorrect] = useState(false);

    const link = document.referrer;

    const [, bodyDropRef] = useDrop({
        accept: "body",
        drop(data) {
            if (body.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    body[0],
                ]);
                setBody([data]);
            } else {
                setBody([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const [, pantsDropRef] = useDrop({
        accept: "pants",
        drop(data) {
            if (pants.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    pants[0],
                ]);
                setPants([data]);
            } else {
                setPants([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const [, shoesDropRef] = useDrop({
        accept: "shoes",
        drop(data) {
            if (shoes.length === 1) {
                setElements([
                    ...elements.filter((item) => item.id !== data.id),
                    shoes[0],
                ]);
                setShoes([data]);
            } else {
                setShoes([data]);
                setElements(elements.filter((item) => item.id !== data.id));
            }
        },
    });

    const fetchClothes = async () => {
        setIsLoading(true);
        const response = await fetch(
            import.meta.env.VITE_BACKEND_API_URL +
            `/categories/${categoryId}/clothes`
        );
        let data = await response.json();
        for await (const item of data) {
            item.img = import.meta.env.VITE_BACKEND_URL + item.img;
        }
        setIsLoading(false);
        setElements(data);
    };

    const checkClothes = () => {
        if (body.length === 0 || pants.length === 0 || shoes.length === 0) {
            notificationRef.current.notify();
            return;
        }

        setIsChecked(true);
        if (body[0]?.correct === "true" && pants[0]?.correct === "true" && shoes[0]?.correct === "true") {
            setIsClothesCorrect(true);
        } else {
            setIsClothesCorrect(false);
        }
    }

    useEffect(() => {
        setIsChecked(false)
    }, [elements]);


    useEffect(() => {
        fetchClothes();
    }, [categoryId]);

    return (
        <div className='clothes-stage-bg h-screen flex p-8'>
            <CustomDragLayer/>
            {isClothesCorrect && <Result isGameOver={false} nextStage={`/category/${categoryId}/makeup`}/>}
            <Notification message="Соберите полный комплект одежды" ref={notificationRef}/>
            <div className='flex flex-col mx-auto w-1/3 gap-8'>
                <div className="flex items-center gap-4">
                    <MenuButton link={link}/>
                    <button onClick={() => checkClothes()}
                            className='flex-1 bg-green-400/75 backdrop-blur text-white text-2xl border-4 border-green-500 p-4 rounded-lg'>
                        Проверить
                    </button>
                </div>
                <div className='flex flex-col items-center justify-center h-full w-full clothes-stage-character'>
                    <div className='grid place-items-center w-full h-[18%]'></div>
                    <div
                        ref={(!isChecked) || (isChecked && body[0]?.correct !== "true") ? bodyDropRef : null}
                        className={`w-full h-[30%] z-30 relative`}
                    >
                        {body.map((item) => (
                            <img
                                key={item.id}
                                src={item.img}
                                className={`h-full w-full scale-[102%] -rotate-1 ${isChecked && body[0]?.correct === "true" ? 'drop-shadow-correct' : isChecked && body[0]?.correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''} translate-x-2.5 -translate-y-1 absolute`}
                            ></img>
                        ))}
                    </div>
                    <div
                        ref={(!isChecked) || (isChecked && pants[0]?.correct !== "true") ? pantsDropRef : null}
                        className='w-full h-[40%] z-20 relative'
                    >
                        {pants.map((item) => (
                            <img
                                key={item.id}
                                src={item.img}
                                className={`w-full h-full scale-[105%] ${isChecked && pants[0]?.correct === "true" ? 'drop-shadow-correct' : isChecked && pants[0]?.correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''} -translate-y-[2.5rem] absolute`}
                            ></img>
                        ))}
                    </div>
                    <div
                        ref={(!isChecked) || (isChecked && shoes[0]?.correct !== "true") ? shoesDropRef : null}
                        className='w-full h-[12%] z-10 relative'
                    >
                        {shoes.map((item) => (
                            <img
                                key={item.id}
                                src={item.img}
                                className={`h-full w-full scale-[100%] ${isChecked && shoes[0]?.correct === "true" ? 'drop-shadow-correct' : isChecked && shoes[0]?.correct === "false" ? 'drop-shadow-incorrect animate-incorrect_pulse' : ''} translate-x-10 translate-y-0.5 absolute`}
                            ></img>
                        ))}
                    </div>
                </div>
            </div>

            <div className='grid grid-rows-4 ml-8 rounded-lg w-[48%]'>
                <div className="flex w-full h-full pt-8 pb-4">
                    {elements.filter(i => i.type === "body").map((item) => (
                        <div key={item.id} className={"flex h-full w-full relative"}>
                            <div className={"hanger"}></div>
                            <ItemCard
                                data={item}
                                width={"w-full"}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex py-4">
                    {elements.filter(i => i.type === "pants").map((item) => (
                        <ItemCard
                            key={item.id}
                            data={item}
                            width={"w-full"}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
                <div className="flex pt-16 pb-6">
                    {elements.filter(i => i.type === "shoes").map((item) => (
                        <ItemCard
                            key={item.id}
                            data={item}
                            width={"w-full"}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
