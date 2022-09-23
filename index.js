require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true}));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrl = [];
const shortUrl = [];
app.post('/api/shorturl', function(req, res){
  const url = req.body.url;
  const foundIndex = originalUrl.indexOf(url);

  if(!url.includes("https://") && !url.includes("http://")){
    res.json({"error":"invalid url"});
  }

  if(foundIndex < 0){
    originalUrl.push(url)
    shortUrl.push(shortUrl.length );

    return res.json({
      original_url:url,
      short_url:shortUrl.length - 1
    })
  }

  return res.json({
    original_url : url,
    short_url:shortUrl[foundIndex]
  });

});

app.get("/api/shorturl/:shorturl", (req,res)=>{
  const shorturl = parseInt(req.params.shorturl);
  const foundIndex = shortUrl.indexOf(shorturl);
  if(foundIndex < 0 ){
    return res.json({
      "error": "No short URL found for the  given input"
    });
  }
  res.redirect(originalUrl[foundIndex]);

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
