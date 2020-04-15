addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// // Math.random() < 0.5;


async function handleRequest(request) {
    const url = "https://cfw-takehome.developers.workers.dev/api/variants";

    return fetch(url, {
        method: 'get',
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.text()
                console.log(response)
                throw new Error('Something went wrong!');
            }
        })
        .then(response => {
            urls = response["variants"];
            console.debug(response["variants"]);
//             return new Response(response)
            return response["variants"];
            
        })
        .then(function(response) {
            if(Math.random() < 0.5) {
                return fetch(urls[0]);
            } else {
                return fetch(urls[1]);
            }
        })
        .then(response => {
            console.debug(response);
            return new Response(response)            
        })
        .catch(error => {
            console.error(error);
        });
}
