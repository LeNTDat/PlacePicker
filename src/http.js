export async function fetchAvailablePlaces(target) {
    const response = await fetch(`http://localhost:3000/${target}`);
    const resData = await response.json();

    if(!response.ok){
        throw new Error("Something went wrong ")
    }

    return resData.places;
}

export async function updateUserPlaces(data) {
    const response = await fetch('http://localhost:3000/user-places',{
        method: "PUT",
        body: JSON.stringify({places : data}),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const resData = await response.json();
    if(!response.ok){
        throw new Error("Failed to update")
    }
    return resData.message;
    
}