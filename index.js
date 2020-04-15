addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = "https://cfw-takehome.developers.workers.dev/api/variants";
    var re_urls = [ ]
    
    return fetch(url, {
        method: 'GET',
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
            re_urls.push(response["variants"][0]);
            re_urls.push(response["variants"][1]);
            console.debug(re_urls);
            return response;
        })
        .then(function(response) {
            if(Math.random() < 0.5) {
                return fetch(re_urls[0]);
            } else {
                return fetch(re_urls[1]);
            }
        })
        .then(response => {
            console.debug(response);
            return new Response(response.body)            
        })
        .catch(error => {
            console.error(error);
        });
}
