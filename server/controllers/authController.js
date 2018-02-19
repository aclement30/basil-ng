const { OAuth2Client } = require('google-auth-library');

const CONFIG = require('../../config/server');
const GoogleAuthService = require('../services/google-auth-service');
const authorize = require('../middlewares/authorization');

class AuthController {

  constructor(app) {
    this.authClient = new OAuth2Client(
      CONFIG.googleOAuth.clientID,
      CONFIG.googleOAuth.clientSecret,
    );

    // Configure routes
    app.post('/api/access_token', this.authenticate.bind(this));
    app.get('/api/user', authorize, this.getUserProfile.bind(this));
  }

  authenticate(req, res) {
    let authService;

    if (req.body.provider === 'google') {
      authService = new GoogleAuthService();
    } else {
      res.status(400).send({ error: 'Unsupported auth provider: ' + req.body.provider});
      return;
    }

    authService.authenticateUserFromToken(req.body, (error, tokens) => {
      if (error) {
        res.status(401).send({ error });
        return;
      }

      res.status(200).send(tokens);
    });
  }

  getUserProfile(req, res) {
    if (req.user) {
      res.send({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      });
    } else {
      res.status(403).send();
    }
  }
}

module.exports = function(expressApp) {
  return new AuthController(expressApp);
};
