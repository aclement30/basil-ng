const authService = require('../services/auth');
const requireAuth = authService.check;

function init(app, passport) {

    // Google OAuth redirection page
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'], accessType: 'offline' }));

    // Callback after Google authenticates user
    app.get('/auth/google/callback', (req, res, next) => {
        passport.authenticate('google', (error, user, info) =>{
            if (error) {
                return res.redirect('/login?error=' + error);
            }

            if (!user) {
                return res.redirect('/login');
            }

            req.logIn(user, (err) => {
                if (err) {
                    return res.redirect('/login?error=' + err);
                }

                return res.redirect('/?uid=' + user._id);
            });

        })(req, res, next);
    });

    // Connected user info page
    app.get('/api/user', requireAuth, (req, res) => {
        if (req.user) {
            res.send({
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                accessToken: req.user.google.accessToken,
                refreshToken: req.user.google.refreshToken,
            });
        } else {
            res.status(403).send();
        }
    });

    app.get('/api/ping', (req, res) => {
        res.status(200).send();
    });

    // User logout
    app.post('/auth/token', authService.validateRefreshToken, authService.generateAccessToken, (req, res) => {
        res.status(201).json({
            accessToken: res.accessToken
        });
    });

    // User logout
    app.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}

module.exports.init = init;