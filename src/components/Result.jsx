import {Link} from "react-router-dom";
import confetti from "canvas-confetti";
import {useEffect} from "react";

// eslint-disable-next-line react/prop-types
export default function Result({recommendations, isGameOver, nextStage}) {

    const link = document.referrer;
    const handleClick = () => {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 110, scalar: 2 };

        const randomInRange = (min, max) =>
            Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    useEffect(() => {
        handleClick()
        }, [])

    console.log(link);

    return (
        <div className="bg-black/25 backdrop-blur-sm absolute z-[90] top-0 bottom-0 left-0 right-0">
            <div className="absolute z-[100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white rounded-lg overflow-hidden">
                <div className="flex items-center border-b-2 gap-2 p-4">
                    <svg width="36px" height="36px" viewBox="0 0 24.00 24.00" fill="none"
                         xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="0.00024000000000000003">
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M12 21C10.22 21 8.47991 20.4722 6.99987 19.4832C5.51983 18.4943 4.36628 17.0887 3.68509 15.4442C3.0039 13.7996 2.82567 11.99 3.17294 10.2442C3.5202 8.49836 4.37737 6.89472 5.63604 5.63604C6.89472 4.37737 8.49836 3.5202 10.2442 3.17294C11.99 2.82567 13.7996 3.0039 15.4442 3.68509C17.0887 4.36628 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12C21 14.387 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21ZM12 4.5C10.5166 4.5 9.0666 4.93987 7.83323 5.76398C6.59986 6.58809 5.63856 7.75943 5.07091 9.12988C4.50325 10.5003 4.35473 12.0083 4.64411 13.4632C4.9335 14.918 5.64781 16.2544 6.6967 17.3033C7.7456 18.3522 9.08197 19.0665 10.5368 19.3559C11.9917 19.6453 13.4997 19.4968 14.8701 18.9291C16.2406 18.3614 17.4119 17.4001 18.236 16.1668C19.0601 14.9334 19.5 13.4834 19.5 12C19.5 10.0109 18.7098 8.10323 17.3033 6.6967C15.8968 5.29018 13.9891 4.5 12 4.5Z"
                                fill="#1fbd00"></path>
                            <path
                                d="M12 13C11.8019 12.9974 11.6126 12.9176 11.4725 12.7775C11.3324 12.6374 11.2526 12.4481 11.25 12.25V8.75C11.25 8.55109 11.329 8.36032 11.4697 8.21967C11.6103 8.07902 11.8011 8 12 8C12.1989 8 12.3897 8.07902 12.5303 8.21967C12.671 8.36032 12.75 8.55109 12.75 8.75V12.25C12.7474 12.4481 12.6676 12.6374 12.5275 12.7775C12.3874 12.9176 12.1981 12.9974 12 13Z"
                                fill="#1fbd00"></path>
                            <path
                                d="M12 16C11.8019 15.9974 11.6126 15.9176 11.4725 15.7775C11.3324 15.6374 11.2526 15.4481 11.25 15.25V14.75C11.25 14.5511 11.329 14.3603 11.4697 14.2197C11.6103 14.079 11.8011 14 12 14C12.1989 14 12.3897 14.079 12.5303 14.2197C12.671 14.3603 12.75 14.5511 12.75 14.75V15.25C12.7474 15.4481 12.6676 15.6374 12.5275 15.7775C12.3874 15.9176 12.1981 15.9974 12 16Z"
                                fill="#1fbd00"></path>
                        </g>
                    </svg>
                    <h2 className="font-medium text-2xl">Поздравляем! Вы успешно справились с заданием!</h2>
                </div>
                {isGameOver && <div className="text-2xl p-4">
                        <p className="underline">Рекомендации по стилю:</p>
                        <ul className="mt-4">
                            <li className="mt-2"><span className="font-medium">Одежда: </span>{recommendations[0]?.title}</li>
                            <li className="mt-2"><span className="font-medium">Обувь: </span>{recommendations[1]?.title}</li>
                            <li className="mt-2"><span className="font-medium">Детали: </span>{recommendations[2]?.title}</li>
                            <li className="mt-2"><span className="font-medium">Аксессуары: </span>{recommendations[3]?.title}</li>
                        </ul>
                </div>}
                {isGameOver && (link === '' || link === 'http://checkroom.sfera.local/') &&
                    <Link to={link === 'http://checkroom.sfera.local/' || link === '' ? "/" : link}
                      onClick={() => document.exitFullscreen()}
                      className="bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 text-2xl p-4">
                        Выйти в меню
                    </Link>
                }
                {!isGameOver && <Link to={nextStage} className="bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 text-2xl p-4">Следующий этап</Link>}
            </div>
        </div>

    )
}
