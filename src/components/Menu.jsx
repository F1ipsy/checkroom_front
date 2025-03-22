import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import Notification from "./Notification.jsx";

export default function Menu() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const notificationRef = useRef();

    const link = document.referrer;

    const fetchCategories = async () => {
        const response = await fetch(
            import.meta.env.VITE_BACKEND_API_URL + "/categories"
        );
        let data = await response.json();
            setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        switch (link) {
            case import.meta.env.VITE_SECRETROOM_LINK:
                setSelectedCategory(categories.find(category => category.id === 2))
                break;
            case import.meta.env.VITE_KINDERGARTEN_LINK:
                setSelectedCategory(categories.find(category => category.id === 5))
                break;
            case import.meta.env.VITE_SCHOOL_LINK:
                setSelectedCategory(categories.find(category => category.id === 1))
                break;
        }
    }, [categories])

    return (
        <div className='w-full h-screen bg-slate-200 flex flex-col px-12'>
            <Notification message="Выберите категорию" ref={notificationRef}/>
            <div className="w-1/2 bg-white my-auto shadow-lg flex flex-col self-center rounded-lg gap-4 p-6">
                <h2 className="text-2xl font-medium tracking-wide">Игра «Гардероб»</h2>
                <div className='flex flex-col gap-4 rounded-lg'>
                    <select
                        onChange={(e) => setSelectedCategory(JSON.parse(e.target.value))}
                        className='w-full text-2xl border-2 border-slate-300 rounded-lg p-4'
                    >
                        <option selected hidden
                        >
                            Выберите категорию
                        </option>
                        {selectedCategory
                            ? <option
                                selected
                                value={selectedCategory}
                                className='w-2/3 text-2xl'
                            >
                                {selectedCategory.title}
                            </option>
                            : (categories.map((category) => (
                                <option
                                    value={JSON.stringify(category)}
                                    className='w-2/3 text-2xl'
                                    key={category.id}
                                >
                                    {category.title}
                                </option>
                            )))
                        }
                    </select>
                    {selectedCategory &&
                        <div className='flex flex-col gap-4'>
                            <h2 className="text-2xl font-medium tracking-wide border-2 border-yellow-400 p-4 rounded-lg">Инструкция</h2>
                            <div className="bg-slate-200 text-2xl p-4 rounded-lg">
                                {selectedCategory.instruction}
                            </div>
                        </div>
                    }
                    <Link to={`${selectedCategory ? "/category/" + selectedCategory?.id : ""}`} onClick={() => {
                        if (!selectedCategory) {
                            notificationRef.current.notify();
                        } else {
                            document.documentElement.requestFullscreen();
                            }}}
                          className='w-full text-center text-2xl p-4 bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-lg'
                    >
                        Начать игру
                    </Link>
                </div>
            </div>
        </div>
    );
}
