var KrakenClient = require('kraken-api');
var express = require('express')
  , app = express();
var argv = require('minimist')(process.argv.slice(2));
var kraken = new KrakenClient(process.env.KRAKEN_PUBLIC_KEY || argv.KRAKEN_API_KEY,process.env.KRAKEN_PUBLIC_KEY || argv.KRAKEN_PUBLIC_KEY);

app.use(express.static(__dirname+'/public'));

app.get('/balance', function(req, res) {
	kraken.api('Balance', null, function(error, data) {
		if(error) {
			res.send('ERROR: ' + error);
		}
		else {
			res.header("Content-Type", "application/json");
			res.send(JSON.stringify(data.result));
		}
	});
})

app.get('/ether', function(req, res) {
	kraken.api('Ticker', {"pair": 'XETHZEUR'}, function(error, data) {
		if(error) {
			res.send('ERROR: ' + error);
		}
		else {
			res.header("Content-Type", "application/json");
			res.send(JSON.stringify(data.result));
		}
	});
})

app.get('/pebble', function(req, res) {
	kraken.api('Ticker', {"pair": 'XETHZEUR'}, function(error, data) {
		if(error) {
			res.send('ERROR: ' + error);
		}
		else {
			kraken.api('Balance', null, function(error2, data2) {
				if(error2) {
					res.send('ERROR 2: ' + error);
				}
				else {
					res.header("Content-Type", "application/json");
					var finalobj={};
					for(var _obj in data.result) finalobj[_obj ]=data.result[_obj];
					for(var _obj in data2.result) finalobj[_obj ]=data2.result[_obj];
					res.send(JSON.stringify(finalobj));
				}
			});
		}
	});
})

app.get('/assets', function(req, res) {
	kraken.api('AssetPairs', null, function(error, data) {
		if(error) {
			res.send('ERROR: ' + error);
		}
		else {
			res.send(data.result);
		}
	});
})

app.get('/balanceWeb', function(req, res) {
	kraken.api('Balance', null, function(error, data) {
		if(error) {
			res.send('ERROR: ' + error);
		}
		else {
			res.send(data.result);
		}
	});
})

app.get('/assetWeb/:id', function(req, res) {
	var pair = req.params.id; //XETHZEUR
	kraken.api('Ticker', {"pair": pair}, function(error, data) {
		if(error) {
			res.send('ERROR: ' + error);
		}
		else {
			res.send(data.result);
		}
	});
})
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Listening on port ' + port);
})
