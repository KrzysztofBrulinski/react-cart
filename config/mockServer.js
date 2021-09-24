const cart = require('./cart.json');

const newResponse = (isError, success, message, errorType) => ({ isError, success, message, errorType });

const createLag = (callback) => (req, resp) => setTimeout(() => callback(req, resp), Math.ceil(1000*Math.random())+Math.ceil(1000*Math.random() / 2));

const handleApiCart = createLag((req, resp) => resp.json(cart));

const handleApiProductCheck = createLag((req, resp) => {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        try {
            body = JSON.parse(Buffer.concat(body).toString());
        } catch {
            return resp.status(406).json(newResponse(true, false, 'Incorrect input data', 'INCORRECT_BODY')); 
        }

        if(!typeof body === 'object' || !body.pid || !body.quantity) {
            return resp.status(406).json(newResponse(true, false, 'Incorrect type', 'INCORRECT_TYPE'));
            
        }
        if(!body.pid || !body.quantity) {
            return resp.status(406).json(newResponse(true, false, 'Missing property', 'MISSING_PROPERTY'));
            
        }
        const product = cart.find(product => product.pid === body.pid);

        if(!product) {
            return resp.status(404).json(newResponse(true, false, 'Product not found', 'NOT_FOUND'));
        }

        if(body.quantity < product.min || body.quantity > product.max) {
            return resp.status(406).json(newResponse(true, false, 'Incorrect product quantity', 'INCORRECT_QUANTITY'));
        }
        resp.status(200).json(newResponse(false, true, 'Correct product', ''));
    });
});

const createMockServer = (app) => {
    app.get('/api/cart', handleApiCart);
    app.post('/api/product/check', handleApiProductCheck);
};

module.exports = createMockServer;