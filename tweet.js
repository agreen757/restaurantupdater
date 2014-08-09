var twit = require('twit');
var T = new twit({
    consumer_key: 'ifYRUgfpEctzwrhVkCnlsGHhZ',
    consumer_secret: '8mcyW8KAhDhbvu4DTQdvDytMViCCNLRFgjtek5rIuJ6cZeewlo',
    access_token: '2345694962-YkesAp9P3tVTyt9AdqXJ9nQmMHlFqkIfMGQ5cdS',
    access_token_secret: 'sw8gz44TBtjmXbct7qNqLqxk208YkSsn7ldOlFBoC4ISE'
})

var js = T.stream('statuses/filter', { track: '#javascript', language: 'en' })

var node = T.stream('statuses/filter', {track: '#nodejs, #javascript, #MongoDB', language: 'en'});

js.on('tweet', function (tweet) {
  //console.log(tweet)
  T.post('favorites/create', {id:tweet.id_str}, function(err,data,resp){
      if(err){console.log(err)}
      
      console.log(data)
  })
})

node.on('tweet', function (tweet) {
  //console.log(tweet)
  T.post('favorites/create', {id:tweet.id_str}, function(err,data,resp){
      if(err){console.log(err)}
      
      console.log(data)
  })
})