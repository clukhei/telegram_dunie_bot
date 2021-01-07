const fetch = require("node-fetch");
const withQuery = require("with-query").default;
//fetch news function 
const NEWS_URL = `https://newsapi.org/v2/top-headlines`;
const fetchNews = async(country,ctx)=> {
    const headers = { "x-api-key": `${process.env.NEWS_KEY}` };
	const url = withQuery(NEWS_URL, { country, pageSize: 5 });

	try {
		const result = await fetch(url, { headers });
		const data = await result.json();
		data.articles.map((e) => {
			ctx.replyWithHTML(
                `<b>${e.title}</b>
                 <a href="${e.urlToImage}"></a>  
                 <code>${e.description}</code> 
                 <a href="${e.url}">View Article</a>`
			);
		});

	} catch (e) {
		console.log(e);
	}
}

module.exports = fetchNews