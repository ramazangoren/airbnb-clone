import axios from "axios";
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cold-3 lg:grid-cols-4 gap-x-6 gap-y-8 ">
      {places.length > 0 && places.map((place) => {
        return (
          <Link to={'/place/' +place._id} key={place._id} className="bg-gray-100 ">
            <div className="bg-gray-500 rounded-2xl flex mb-4">
              {place.photos?.[0] && (
                <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:3001/uploads/'+place.photos?.[0]} alt={place.title}/>
              )}
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm leading-4 text-gray-500">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> per night
            </div>
          </Link>
        )
      })}

    </div>
  );
};

export default IndexPage;
