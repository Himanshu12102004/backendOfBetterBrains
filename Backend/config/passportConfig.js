const passport = require("passport");
const User = require("../Schemas/schema");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const generateToken = require("../controllers/jwtCreation");
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleID = profile.id;
        let user = await User.findOne({ googleID });
        let previousUser = await User.findOne({ email });
        console.log(user);
        if (!user && !previousUser) {
          user = await User.create({
            name: profile.displayName,
            googleID,
            email,
            phone: "1000000000",
            password: "!!!!!!",
          });
        }
        console.log(user);
        const token = generateToken.createToken(user._id);

        done(null, { token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
