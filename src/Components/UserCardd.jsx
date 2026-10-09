
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCardd = ({user}) => {
    const {_id,firstName,lastName,age,gender,about,photoUrl} = user;
    const dispatch = useDispatch();
    const swipeThreshold = 90;
    const [toast, setToast] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const cardRef = useRef(null);
    const pointerStart = useRef(null);
    const toastTimer = useRef(null);
    const swipeTimer = useRef(null);
    const isSendingRef = useRef(false);

const showToast = (message, isError = false) => {
  setToast({ message, isError });
  window.clearTimeout(toastTimer.current);
  toastTimer.current = window.setTimeout(() => setToast(null), 3000);
};

const sendRequest = async(status,userId)=>{
  setIsSending(true);
  try{
    await axios.post(BASE_URL+"/request/send/"+status+"/"+userId,{},{withCredentials:true})
    dispatch(removeUserFromFeed(userId));
    showToast(status === "interested" ? "Added into connections" : "Ignored the user card");
  }
  catch(err){
    console.error(err);
    setDragOffset(0);
    showToast("Could not update this card. Please try again.", true);
  } finally {
    isSendingRef.current = false;
    setIsSending(false);
  }
}

const handleSendRequest = (status,userId)=>{
  if (isSendingRef.current) return;
  isSendingRef.current = true;
  sendRequest(status,userId);
}

const handlePointerDown = (event) => {
  if (!event.isPrimary || event.button !== 0 || isSendingRef.current) return;
  if (event.target instanceof Element && event.target.closest("button")) return;
  pointerStart.current = { x: event.clientX, y: event.clientY, horizontal: false };
  event.currentTarget.setPointerCapture(event.pointerId);
};

const handlePointerMove = (event) => {
  if (!pointerStart.current || isSendingRef.current) return;
  const deltaX = event.clientX - pointerStart.current.x;
  const deltaY = event.clientY - pointerStart.current.y;

  if (!pointerStart.current.horizontal) {
    if (Math.hypot(deltaX, deltaY) < 8) return;
    if (Math.abs(deltaY) >= Math.abs(deltaX)) {
      pointerStart.current = null;
      return;
    }
    pointerStart.current.horizontal = true;
    setIsDragging(true);
  }

  event.preventDefault();
  const maxOffset = cardRef.current?.offsetWidth ?? 350;
  setDragOffset(Math.max(-maxOffset, Math.min(maxOffset, deltaX)));
};

const handlePointerUp = (event) => {
  if (!pointerStart.current) return;
  const { x, y, horizontal } = pointerStart.current;
  const deltaX = event.clientX - x;
  const deltaY = event.clientY - y;
  pointerStart.current = null;
  setIsDragging(false);

  if (!horizontal) {
    setDragOffset(0);
    return;
  }

  if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) {
    setDragOffset(0);
    return;
  }

  if (isSendingRef.current) return;
  isSendingRef.current = true;
  setIsSending(true);
  const direction = deltaX > 0 ? 1 : -1;
  setDragOffset(direction * ((cardRef.current?.offsetWidth ?? 350) + 80));
  swipeTimer.current = window.setTimeout(() => {
    sendRequest(direction > 0 ? "interested" : "ignored", _id);
  }, 180);
};

const resetPointer = () => {
  pointerStart.current = null;
  setDragOffset(0);
  setIsDragging(false);
};

useEffect(() => () => {
  window.clearTimeout(toastTimer.current);
  window.clearTimeout(swipeTimer.current);
}, []);

const swipeProgress = Math.min(1, Math.abs(dragOffset) / swipeThreshold);



  return (
    <>
    <div
      ref={cardRef}
      className={`feed-user-card card my-auto w-full max-w-sm touch-pan-y select-none rounded-3xl${isDragging ? " is-dragging" : ""}${isSending && dragOffset ? " is-swiping" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={resetPointer}
      style={dragOffset ? { transform: `translateX(${dragOffset}px) rotate(${dragOffset / 24}deg)` } : undefined}
    >
  {dragOffset !== 0 && (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-7 z-10 rounded-xl border-4 px-4 py-2 text-2xl font-black uppercase tracking-widest ${
        dragOffset > 0
          ? "right-5 rotate-12 border-emerald-500 text-emerald-600"
          : "left-5 -rotate-12 border-rose-500 text-rose-600"
      }`}
      style={{ opacity: swipeProgress }}
    >
      {dragOffset > 0 ? "Interested" : "Ignore"}
    </div>
  )}
  <figure>
    <img
      src={photoUrl}
      className="h-72 w-full object-cover"
      alt={`${firstName} ${lastName}`} />
  </figure>
  <div className="card-body">
    <h2 className="card-title text-2xl font-bold">{firstName+" "+lastName}</h2>
    {age && gender&& <p>{age + " , "+ gender}</p>}
    <p className='font-mono'>{about}</p>
    <p className="text-center text-sm text-base-content/60">Swipe left to ignore · Swipe right to show interest</p>
    <div className="card-actions justify-center my-10 ">
     <button className="btn btn-active btn-primary" disabled={isSending} onClick={()=>{handleSendRequest("ignored",_id)}}>Ignore</button>
<button className="btn btn-active btn-secondary" disabled={isSending} onClick={()=>{handleSendRequest("interested",_id)}}>Interested</button>
    </div>
  </div>
</div>
    {toast && (
      <div className="toast toast-top toast-center z-50" role="status" aria-live="polite">
        <div className={`alert ${toast.isError ? "alert-error" : "alert-success"}`}>
          <span>{toast.message}</span>
        </div>
      </div>
    )}
    </>
  )
}

export default UserCardd
