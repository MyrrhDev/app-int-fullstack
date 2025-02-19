

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const strings = {
    var1: {
        title: 'This is variant one',
        h1: 'This is OG variant one',
        p: 'Let me tell you about this github repo:',
        a: 'this project github repo',
        url: 'https://github.com/MyrrhDev/app-int-fullstack',
    }, 
    var2: {
        title: 'This is variant two',
        h1: 'Variant two: the sequel',
        p: 'Let me tell you about this git powered website:',
        a: 'my website',
        url: 'http://myrrhdev.github.io/',
    },
}

class ElementHandler {
  constructor(variant) {
    this.variant = variant
  }

  element(element) {
      if(element.tagName == 'a') {
          element.setInnerContent(this.variant[element.tagName])
          element.setAttribute('href', this.variant['url'])
      } else {
          element.setInnerContent(this.variant[element.tagName])
      }
  }
}

function createRewriter(chosenVariant) {
    var rewriter = new HTMLRewriter()
        .on('title', new ElementHandler(chosenVariant))
        .on('h1#title', new ElementHandler(chosenVariant))
        .on('p#description', new ElementHandler(chosenVariant))
        .on('a#url', new ElementHandler(chosenVariant))
        .on('a', new ElementHandler(chosenVariant))
        
    return rewriter
}

async function handleRequest(request) {
    const url = "https://cfw-takehome.developers.workers.dev/api/variants";
    var re_urls = [ ]
    const cookie = request.headers.get('cookie')
    
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
        .then(async function(response) {
            var variantOne = createRewriter(strings['var1']).transform(await fetch(re_urls[0]))
            var variantTwo = createRewriter(strings['var2']).transform(await fetch(re_urls[1]))
            
            if(cookie && cookie.includes(`which=var1`)) {
                return variantOne
            } else if (cookie && cookie.includes(`which=var2`)) {
                return variantTwo
            } else {
                console.debug(" no cookies");
                if(Math.random() < 0.5) {
                    response = variantOne
                    const cookies_send = {
                        headers: { 'Set-Cookie': `which=var1; Expires=Wed, 20 Jun 2035 07:38:00 GMT;` },
                    }
                    return new Response(response.body,cookies_send)
                } else {
                    response = variantTwo
                    const cookies_send = {
                        headers: { 'Set-Cookie': `which=var2; Expires=Wed, 20 Jun 2035 07:38:00 GMT;` },
                    }
                    return new Response(response.body,cookies_send)                    
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}
