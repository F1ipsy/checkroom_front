import {Link} from "react-router-dom";

export default function MenuButton(link) {

    return (
        <Link to={
            link !== import.meta.env.VITE_KINDERGARTEN_LINK &&
            link !== import.meta.env.VITE_SCHOOL_LINK
                ? "/"
                : link}
              onClick={() => document.exitFullscreen()}
              className="w-1/3 z-50 border-4 border-transparent text-center text-2xl bg-yellow-400 hover:bg-gradient-to-t from-yellow-400 to-yellow-300 p-4 rounded-lg">
            В меню
        </Link>
    )
}