import passport from '../passport';
import jwt from 'jsonwebtoken';
import { auth, url } from '../../config';

const googleAuth = app => {

  app.get('/login/google',
    function (req, res, next) {
      let referURL = req.query.refer;
      if (referURL && referURL != null) {
        referURL = referURL.indexOf('------') >= 0 ? referURL.replaceAll('------', '?') : referURL;
        referURL = referURL.indexOf('--') >= 0 ? referURL.replaceAll('--', '&') : referURL;
      }
      if (referURL) {
        let expiresIn = 60 * 60; // 1 hour
        res.cookie('referURL', referURL, { maxAge: 1000 * expiresIn, httpOnly: true });
      }
      passport.authenticate('google',
        {
          scope: [
            'profile',
            'email'
          ],
          session: false,
        }
      )(req, res, next);
    }
  );

  app.get('/login/google/return', function (req, res, next) {
    passport.authenticate('google', {
      failureRedirect: '/login',
      session: false,
    },
      function callback(err, user, info, status) {
        if (err) { return res.redirect('/login') }
        if (!user) { return res.redirect('/login') }
        const type = user.type;
        let referURL = req.cookies.referURL;
        const userData = {
          id: user.id,
          email: user.email,
        };
        if (referURL) {
          res.clearCookie("referURL");
          const expiresIn = 60 * 60 * 24 * 180; // 180 days
          const token = jwt.sign(userData, auth.jwt.secret, { expiresIn });
          res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
          res.redirect(referURL);
        } else {
          if (type === 'verification') {
            res.redirect(auth.redirectURL.verification);
          } else if (type === 'userbanned') {
            res.redirect(auth.redirectURL.userbanned);
          } else if (type === 'userDeleted') {
            res.redirect(auth.redirectURL.returnURLDeletedUser);
          }
          else {
            const expiresIn = 60 * 60 * 24 * 180; // 180 days
            const token = jwt.sign(userData, auth.jwt.secret, { expiresIn });
            res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
            res.redirect(auth.redirectURL.login);
          }
        }
      })(req, res, next);
  });

};

export default googleAuth;
