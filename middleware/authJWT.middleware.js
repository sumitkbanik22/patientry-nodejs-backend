const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const { access_token_secret, refresh_token_secret } = require("../configs/config");

const RefreshToken = require("../models/refreshToken");
const User = require("../models/user");

function getAccessToken(payload) {
    const access_token = jwt.sign({user: payload}, access_token_secret, { expiresIn: '10min' });
    return access_token
}

function getRefreshToken(payload) {

    // get all user's refresh tokens from DB
    const user_refresh_tokens = RefreshToken.find({user_id: payload.id});
    // console.log(user_refresh_tokens);

    // check if there are 5 or more refresh tokens,
    // which have already been generated. In this case we should
    // remove all this refresh tokens and leave only new one for security reason
    if (user_refresh_tokens.length >= 5) {
        console.log('check');
        RefreshToken.deleteMany({user_id: payload.id});
    }

    const refresh_token = jwt.sign({user: payload}, refresh_token_secret, {expiresIn: '1d'});

    RefreshToken.insertMany({
        id: uuidv4(),
        user_id: payload.id,
        refresh_token
    });

    return refresh_token;
}

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        if (!token.startsWith('Bearer')) {
        // Reject if there is no Bearer in the token
        return reject('Token is invalid');
        }
        // Remove Bearer from string
        token = token.slice(7, token.length);

        jwt.verify(token, access_token_secret, (err, decoded_token) => {
            if (err) {
                return reject(err.message);
            }

            // Check the decoded user
            if (!decoded_token || !decoded_token.user) {
                return reject('Token is invalid');
            }

            resolve(decoded_token.user);
        })
    });
}

function refreshToken(token) {
    // get decoded data
    const decoded_token = jwt.verify(token, refresh_token_secret);

    // find the user in the user table
    const user = User.findOne({id: decoded_token.user.id});
  
    if (!user) {
      throw new Error(`Access is forbidden`);
    }
  
    // get all user's refresh tokens from DB
    const all_refresh_tokens = RefreshToken.find({user_id: user.id}).toArray(function(error, result) {
        if (error) throw error;
        return result.map(obj => obj);
    });
  
    if (!all_refresh_tokens || !all_refresh_tokens.length) {
      throw new Error(`There is no refresh token for the user with`);
    }
  
    const current_refresh_token = all_refresh_tokens.find(refresh_token => refresh_token.refresh_token === token);
  
    if (!current_refresh_token) {
      throw new Error(`Refresh token is wrong`);
    }
    // user's data for new tokens
    const payload = {
      id : user.id,
      email: user.email,
      username: user.username
    };
    // get new refresh and access token
    const new_refresh_token = getUpdatedRefreshToken(token, payload);
    const new_access_token = getAccessToken(payload);
  
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    };
}


function getUpdatedRefreshToken(old_refresh_token, payload) {
    // create new refresh token
    const new_refresh_token = jwt.sign({user: payload}, refresh_token_secret, { expiresIn: '1d' });

    // replace current refresh token with new one
    const current_refresh_token_obj = RefreshToken.find({refresh_token: old_refresh_token});

    if (current_refresh_token_obj) {
        RefreshToken.update({refresh_token: old_refresh_token},{$set:{refresh_token: new_refresh_token}});
    }
  
    return new_refresh_token;
}

function jwtMiddleware(req, res, next) {
    // get token from headers object
    const token = req.get('Authorization');
    // check token
    if (!token) {
      return res.status(401).send('Token is invalid');
    }
  
    verifyJWTToken(token)
      .then(user => {
        // put user's information to req object
        req.user = user;
        // call next to finish this middleware function
        next();
      }).catch(err => {
        res.status(401).send(err);
    });
}


module.exports = {
    getAccessToken,
    getRefreshToken,
    verifyJWTToken,
    refreshToken,
    jwtMiddleware
};