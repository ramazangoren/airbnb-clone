import { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import {UserContext} from './UserContext'

const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect,setRedirect] = useState('');
  const {user} = useContext(UserContext)
  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
  }
  const bookThisPlace = async () =>{
    const response = await axios.post('/bookings', {checkIn , checkOut,numberOfGuests, 
        name,phone, place:place._id, price:numberOfNights*place.price})
    const bookingId= response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }
  useEffect(() => {
    if (user) {
      setName(user.name)
    }
}, [user]);

  if (redirect) {
    return <Navigate to={redirect}/>
  }
  return (
    <div>
      <div className="mb-8 bg-white p-4 rounded-2xl">
        <div className="text-2xl text-center">${place.price} / per night</div>
        <div className="border my-2 py-4 px-4 rounded-2xl">
          <label>Check in:</label>
          <input
            type="date"
            value={checkIn}
            onChange={(ev) => setCheckIn(ev.target.value)}
          />
        </div>
        <div className="border my-2 py-4 px-4 rounded-2xl">
          <label>Check out:</label>
          <input
            type="date"
            value={checkOut}
            onChange={(ev) => setCheckOut(ev.target.value)}
          />
        </div>
        <div className="border my-2 py-4 px-4 rounded-2xl">
          <label>number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>

        {numberOfNights > 0 && (
                <div className="border my-2 py-4 px-4 rounded-2xl">
                <label>full name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />
                <label>phone number:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(ev) => setPhone(ev.target.value)}
                />
              </div>
        )}

        <button onClick={bookThisPlace} className="primary mt-4">
            {numberOfNights > 0 && (
                <span className="">${numberOfNights * place.price}</span>
            )}
            book this place
        </button>
      </div>
    </div>
  );
};

export default BookingWidget;
