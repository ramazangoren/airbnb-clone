// import Image from "./Image.jsx";

export default function PlaceImg({place,index=0,className=null}) {
  if (!place.photos?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover';
  }
  return (
    // <Image className={className} src={place.photos[index]} alt=""/>
    <img src={'http://localhost:3002/uploads'+place.photos[0]} className={className}/>
  );
}