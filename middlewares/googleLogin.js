const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { User } = require('../models/userModel');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL } = process.env;

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/api/users/google/callback`,
  passReqToCallback: true, // Змінено з passRecToCallback на passReqToCallback
};

const googleCallback = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const { emails, photos } = profile;
    console.log('🚀 ~ profile:', profile);
    const email = emails[0].value;
    const avatarURL = photos[0].value;

    // Перевірка наявності користувача в базі даних
    let user = await User.findOne({ email });
    if (user) {
      return done(null, user);
    }

    // Генерація випадкового пароля
    const password = nanoid(10);

    // Хешування пароля перед збереженням
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача з хешованим паролем
    user = await User.create({ email, password: hashedPassword, avatarURL });

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy = new Strategy(googleParams, googleCallback);
passport.use('google', googleStrategy);

module.exports = passport;
