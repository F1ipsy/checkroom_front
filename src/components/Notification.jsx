import {forwardRef, useImperativeHandle} from "react";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
 function Notification({message}, ref) {

     const notify = () => {
         toast.error(message)
     }
     useImperativeHandle(ref, () => ({
         notify
     }));

     return (
         <ToastContainer
             position='bottom-right'
             autoClose={2000}
             closeOnClick
             rtl={false}
             limit={3}
             draggable
         />
     );
}

export default forwardRef(Notification);