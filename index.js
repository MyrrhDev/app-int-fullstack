

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
      console.debug(element.attributes);      
      if(element.tagName == 'a') {
          element.setInnerContent(this.variant[element.tagName])
          element.setAttribute('href', this.variant['url'])
      } else {
          element.setInnerContent(this.variant[element.tagName])
      }
  }
}


async function handleRequest(request) {
    const url = "https://cfw-takehome.developers.workers.dev/api/variants";
    var re_urls = [ ]
    var variant = [ ]
    
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
            if(Math.random() < 0.5) {
                console.debug(strings['var1']);
                var rewriter = new HTMLRewriter()
                .on('title', new ElementHandler(strings['var1']))
                .on('h1#title', new ElementHandler(strings['var1']))
                .on('p#description', new ElementHandler(strings['var1']))
                .on('a#url', new ElementHandler(strings['var1']))
                .on('a', new ElementHandler(strings['var1']))
                const res = await fetch(re_urls[0])
                return rewriter.transform(res)
            } else {
//                 console.debug(strings['var1']);
                var rewriter = new HTMLRewriter()
                .on('title', new ElementHandler(strings['var2']))
                .on('h1#title', new ElementHandler(strings['var2']))
                .on('p#description', new ElementHandler(strings['var2']))
                .on('a#url', new ElementHandler(strings['var2']))
                .on('a', new ElementHandler(strings['var2']))
                const res = await fetch(re_urls[1])
                return rewriter.transform(res)
            }
        })
//         .then(response => {
//             console.debug(response);
//             return new Response(response.body)            
//         })
        .catch(error => {
            console.error(error);
        });
}
