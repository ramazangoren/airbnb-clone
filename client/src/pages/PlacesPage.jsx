// import Perks from "../Perks.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Link, Navigate, useParams } from "react-router-dom";
// import PhotosUploader from '../PhotoUploader.jsx'
import PlacesFormPage from "./PlacesFormPage.jsx";
import PlaceImg from "../PlaceImg.jsx";

export default function PlacesPage() {
    const {action} = useParams()
    const [places, setPlaces] = useState([])
    useEffect(()=>{
        axios.get('/user-places').then(({data})=>{
            setPlaces(data)
        })
    }, [])
  return (
    <div>
      <AccountNav />
      {action !== 'new' && (
        <div className="text-center">
            <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add new place
          </Link>
            <div className="mt-4">
            {places.length > 0 && places.map((place) => (
                <Link to={'/account/places/'+place._id} key={place._id} className="cursor-pointer flex gap-4 bg-gray-100 mt-3 p-4 rounded-2xl">
                    <div className="flex w-32 h-32 bg-gray-300">
                        {/* {place.photos.lenght && (
                            <img src={'http://localhost:3001/uploads'+place.photos[0]} alt="" className="object-cover"/>
                        )} */}
                        <PlaceImg place={place}></PlaceImg>
                    </div>
                    <div className="">
                        <div className="text-xl">{place.title}</div>
                        <div className="text-sm mt-2">{place.description}</div>
                    </div>
                </Link>
            ))}
            </div>
        </div>
      )}

      {action == 'new' && (
        <PlacesFormPage></PlacesFormPage>
      )}
    </div>
  );
}
