var requireAuth = require('../services/auth').check;

function init(app, passport) {

    // Google OAuth redirection page
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // Callback after Google authenticates user
    app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(error, user, info) {
            if (error) {
                return res.redirect('/login?error=' + error);
            }

            if (!user) {
                return res.redirect('/login');
            }

            req.logIn(user, function(err) {
                if (err) {
                    return res.redirect('/login?error=' + err);
                }

                return res.redirect('/?uid=' + user._id);
            });

        })(req, res, next);
    });

    // Connected user info page
    app.get('/api/user', requireAuth, function (req, res) {
        if (req.user) {
            res.send({
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            });
        } else {
            res.status(403).send();
        }
    });

    // User logout
    app.get('/auth/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}

module.exports.init = init;