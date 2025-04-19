import { useEffect, useState } from "react";
import Places from "./Places";
import Errors from "./Errors"
import { sortPlacesByDistance } from "../loc";
import {fetchAvailablePlaces} from "../http"

export default function AvailablePlaces({ onSelectPlace }) {
    const [error, setError] = useState()
    const [availablePlaces, setAvailablePlaces] = useState([]);
    const [isLoading, setIsloading] = useState(false)

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setIsloading(true)
                const places = await fetchAvailablePlaces('places');
                navigator.geolocation.getCurrentPosition((position) => {
                    const sortPlaces = sortPlacesByDistance(
                        places,
                        position.coords.latitude,
                        position.coords.longitude
                    )
                    setAvailablePlaces(sortPlaces)
                    setIsloading(false)
                })
            } catch (err) {
                setError({ message: "Something went wrong!" })
            }
        }
        fetchPlaces();
    }, [])

    if (error) {
        return <Errors title={"An error occurred !!"} message={error.message || ''} />
    }


    return <Places
        title="Available Places"
        places={availablePlaces}
        isLoading={isLoading}
        loadingText={"Fetching places ..."}
        fallbackText={"Sorting places by distance,,,,"}
        onSelectPlace={onSelectPlace}
    />
}