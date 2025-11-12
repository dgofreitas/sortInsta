import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// Serializar usuário
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar usuário
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Estratégia Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verificar se usuário já existe
        let user = await User.findOne({
          providerId: profile.id,
          provider: 'google',
        });

        if (user) {
          // Atualizar tokens e última data de login
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.lastLogin = new Date();
          await user.save();
          logger.info(`Usuário Google existente logado: ${user.email}`);
        } else {
          // Criar novo usuário
          user = await User.create({
            email: profile.emails[0].value,
            name: profile.displayName,
            provider: 'google',
            providerId: profile.id,
            profilePicture: profile.photos[0]?.value,
            accessToken,
            refreshToken,
            lastLogin: new Date(),
          });
          logger.info(`Novo usuário Google criado: ${user.email}`);
        }

        return done(null, user);
      } catch (error) {
        logger.error('Erro na autenticação Google:', error);
        return done(error, null);
      }
    }
  )
);

// Estratégia Facebook OAuth (também usado para Instagram)
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      scope: ['email', 'public_profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          providerId: profile.id,
          provider: 'facebook',
        });

        if (user) {
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.lastLogin = new Date();
          await user.save();
          logger.info(`Usuário Facebook existente logado: ${user.email}`);
        } else {
          user = await User.create({
            email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            provider: 'facebook',
            providerId: profile.id,
            profilePicture: profile.photos?.[0]?.value,
            accessToken,
            refreshToken,
            lastLogin: new Date(),
          });
          logger.info(`Novo usuário Facebook criado: ${user.email}`);
        }

        return done(null, user);
      } catch (error) {
        logger.error('Erro na autenticação Facebook:', error);
        return done(error, null);
      }
    }
  )
);

export default passport;
