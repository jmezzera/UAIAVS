const serverUrl = "http://localhost:8080/videos/"

export const ListVideos = () : Promise<any> => {
    return fetch(serverUrl)
        .then(resp => resp.json())
}