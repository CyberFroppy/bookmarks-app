const APIKEY = "2abbf7c3-245b-404f-9473-ade729ed4653";

function keyHandling(req, res, next) {
    let token = req.headers.authorization;
    let { apiKey } = req.query;
    let apiHeader = req.headers['book-api-key'];

    if (!token && !apiKey && !apiHeader) {
        res.statusMessage = "Please send the API key using apiKey parameter, the 'authorization' header or the 'book-api-key' header";
        return res.status(401).end();
    }
    else {
        //Authorization Header Authentication
        if (token) {
            if (token === `Bearer ${APIKEY}`) {
                next();
            }
            else {
                res.statusMessage = "The 'authorization' token is invalid.";
                return res.status(401).end();
            }
        }
        //book-api-key Header Authentication
        if (apiHeader) {
            if (apiHeader === APIKEY) {
                next();
            }
            else {
                res.statusMessage = "The 'apiKey' token is invalid.";
                return res.status(401).end();
            }
        }
        //apiKey query string authentication
        if (apiKey) {
            if (apiKey === APIKEY) { next(); }
            else {
                res.statusMessage = "The 'apiKey' is invalid";
                return res.status(401).end();
            }
        }
    }

}

module.exports = keyHandling;

