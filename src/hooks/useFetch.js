import { useEffect, useState } from "react"

export function useFetch(fetchFn, typeReq) {
    const [fetchedData, setFetchedData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const places = await fetchFn(typeReq);
            setFetchedData(places)
        }

        fetchData();
    }, [fetchFn])
    
    return {
        fetchedData,
        setFetchedData
    }
}