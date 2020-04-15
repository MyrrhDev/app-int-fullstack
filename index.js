addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})




async function handleRequest(request) {
    const url = "https://cfw-takehome.developers.workers.dev/api/variants";

    let method =	{ 
        method: 'GET'
    }
    return fetch(url, method)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.text()
                console.log(response)
                throw new Error('Something went wrong on api server!');
            }
        })
        .then(response => {
            urls = response["variants"];
            console.debug(response["variants"]);
            return new Response(response)
        }).catch(error => {
            console.error(error);
        });
}
