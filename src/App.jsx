import { useCallback, useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';
import { updateUserPlaces, fetchAvailablePlaces } from './http.js'
import AvailablePlaces from './components/AvailablePlaces.jsx';
const storageIds = JSON.parse(localStorage.getItem('selectedIds')) || [];
const pickedPlaces2 = AVAILABLE_PLACES.filter(item => {
  return storageIds.find(id => item.id === id)
})

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(pickedPlaces2);
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{
    const fetchingPickedPlaces = async ()=>{
      const places = await fetchAvailablePlaces('user-places');
      setPickedPlaces(places)
    }

    fetchingPickedPlaces();
  },[])

  


  function handleStartRemovePlace(id) {
    setShowModal(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setShowModal(false)
  }

  async function handleSelectPlace(selectedPlaces) {
    setPickedPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlaces.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlaces, ...prevPickedPlaces];
    });

    try{
      await updateUserPlaces([selectedPlaces, ...pickedPlaces])
    }catch(err){
      setPickedPlaces(pickedPlaces);
    }
  }
  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    await updateUserPlaces(pickedPlaces.filter(place =>place.id !== selectedPlace.current.id))

    setShowModal(false)
  },[])
  

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
        <AvailablePlaces
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
