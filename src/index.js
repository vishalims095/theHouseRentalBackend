var http = require ("http");
var express = require ("express");
var cors = require ("cors");
var path = require ("path");
var glob = require ("glob");
var bodyParser = require ("body-parser");

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../src/Upload')));
app.use(cors());
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];
const responseHandler = require('./Middlewares/responseHandler')
app.use('/', responseHandler);
let initRoutes = () => {
	// including all routes
	glob("./Routes/*.js", {cwd: path.resolve("./src")}, (err, routes) => {
		if (err) {
			console.log("Error occured including routes");
			return;
		}
		routes.forEach((routePath) => {
			require(routePath).getRouter(app); // eslint-disable-line
		});
	});
	app.use('/',express.static(path.join(__dirname, '' ,'dist' ,'addAddress')));
        app.get('/userWeb/*', (req, res) => {
        res.sendFile(path.join(__dirname,'','dist','addAddress' ,'index.html'));
    })
}
initRoutes(app);
const port = process.env.PORT || 3010;
app.listen(port);
console.log("Started on port " + port);