import showErrorMessage from '../helpers/showErrorMessage.js';
import { verifyJWTToken } from './auth.js';

export function verifyJWT_MW(req, res, next) {
    let token = (req.method === 'POST') ? req.headers.auth : null;

    if (token) {
        verifyJWTToken(token)
            .then((decodedToken) => {
                req.user = decodedToken;
                next()
            })
            .catch(async (err) => {
                res.send({
                    status: 400,
                    errorMessage: await showErrorMessage({ errorCode: 'tokenError' })
                });
            });
    } else {
        next();
    }
}