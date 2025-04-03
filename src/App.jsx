import { useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const storageIds = JSON.parse(localStorage.getItem('selectedIds')) || [];
const pickedPlaces2 = AVAILABLE_PLACES.filter(item=>{
   return storageIds.find(id => item.id === id)
})

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(pickedPlaces2);
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      const sortPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES, 
        position.coords.latitude, 
        position.coords.longitude
      )
      setAvailablePlaces(sortPlaces)
    });
  },[])

  

  function handleStartRemovePlace(id) {
    setShowModal(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setShowModal(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    let newData = [id, ...storageIds]
    
    if(storageIds.indexOf(id) === -1){
      localStorage.setItem('selectedIds', JSON.stringify(newData))
    }
    
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
   
    localStorage.setItem('selectedIds', JSON.stringify(storageIds.filter(item=>{
      item.id !== selectedPlace.current
    })))
    setShowModal(false)
  }

  return (
    <>
      <Modal ref={modal} open={showModal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText={"Sorting places by distance,,,,"}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
