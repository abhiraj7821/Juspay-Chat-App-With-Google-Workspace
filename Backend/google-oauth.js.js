const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
 

// Configure Passport
passport.use(new GoogleStrategy({
    clientID: '1017825000593-3o7gfs0b1974bej23nif0jb2b3mp4nc2.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback:true
  },
  function(request,accessToken, refreshToken,profile,done) {
    const user = {
    id: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value,
    accessToken: accessToken
  };
    return done(null,user)
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
