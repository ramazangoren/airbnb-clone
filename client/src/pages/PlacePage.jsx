import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

const PlacePage =()=>{
    const [place, setPlace] = useState([]);
    const {id} = useParams(null);
    useEffect(()=>{
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then((response)=>{
            setPlace(response.data)
        })
         
    },[id])
    if (!place) return'';
    return(
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8" >
            <Link to={'/'} className="flex gap-1 rounded-2xl py-2 px-4 bg-white text-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transform -rotate-90">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                home page
            </Link>
            <h1 className="text-3xl mr-48">{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>
            <PlaceGallery place={place}></PlaceGallery>
            <div className="mt-8  gap-8  grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div>
                    <div className="my-4 ">
                        <h1 className="font-semibold text-2xl">Description</h1>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn}<br/>
                    Check-Out: {place.checkOut}<br/>
                    Number of max guest {place.maxGuests}
                </div>
                <div >
                    <BookingWidget place={place}></BookingWidget>
                </div>
                <div className="bg-white -mx-8 px-4 py-4 border-t">
                    <div className="">
                        <h1 className="font-semibold text-2xl mt-3">Extra information</h1>
                    </div>
                    <div className="my-4 mb-2 text-sm text-gray-700 leading-5">
                        {place.extraInfo}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlacePage