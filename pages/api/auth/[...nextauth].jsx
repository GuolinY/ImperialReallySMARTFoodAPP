import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";
import makeUrl from "../../../constants/utils/UrlUtils";
import isJwtExpired from "../../../constants/utils/JwtUtils";

export const refreshToken = async function (refreshToken) {
  try {
    const response = await axios.post(
      // "http://localhost:8000/api/auth/token/refresh/",
      makeUrl(process.env.BACKEND_API_BASE, "auth", "token", "refresh"),
      {
        refresh: refreshToken,
      }
    );

    const { access, refresh } = response.data;
    // still within this block, return true
    return [access, refresh];
  } catch {
    return [null, null];
  }
};

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log("SIGN IN");
      console.log(user);
      console.log(account);
      console.log(profile);
      return true;
    },

    async jwt(token, user, account, profile, isNewUser) {
      console.log("JWT");
      console.log(token);
      console.log(user);
      console.log(account);
      console.log(profile);
      console.log(isNewUser);
      return token;
    },

    async session(session, user) {
      console.log("SESSION");
      console.log(session);
      console.log(user);
      return session;
    },
  },
});

/*
{
  username:
  display_name: 
  identities: [
    provider:
    id:
  ]
  avatar_url: 
  date_created: 
}
*/

// export default NextAuth({
//   secret: process.env.SESSION_SECRET,
//   session: {
//     jwt: true,
//     maxAge: 24 * 60 * 60,
//   },
//   jwt: {
//     secret: process.env.JWT_SECRET,
//   },
//   debug: process.env.NODE_ENV === "development",
//   providers: [
//     Providers.Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn(user, account, profile) {
//       if (account.provider === "google") {
//         const { accessToken, idToken } = account;

//         // POST request to backend
//         try {
//           const res = await axios.post(
//             "http://smart-food-app-backend.herokuapp.com/api/login/google", //TODO update with actual endpoint
//             {
//               access_token: accessToken,
//               id_token: idToken,
//             }
//           );

//           const { access_token } = res.data;
//           user.accessToken = access_token;

//           return true;
//         } catch (err) {
//           console.log(err);
//           return false;
//         }
//       }
//       return false;
//     },

//     async jwt(token, user, account, profile, isNewUser) {
//       if (user) {
//         const { accessToken } = user;

//         token.accessToken = accessToken;
//       }

//       return token;
//     },

//     async session(session, user) {
//       session.accessToken = user.accessToken;
//       return session;
//     },
//   },
// });

// const settings = {
//   secret: process.env.SESSION_SECRET,
//   session: {
//     jwt: true,
//     maxAge: 24 * 60 * 60, // 24 hours
//   },
//   jwt: {
//     secret: process.env.JWT_SECRET,
//   },
//   debug: process.env.NODE_ENV === "development",
//   providers: [
//     Providers.Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async jwt(token, user, account, profile, isNewUser) {
//       // user just signed in
//       if (user) {
//         // may have to switch it up a bit for other providers
//         if (account.provider === "google") {
//           // extract these two tokens
//           const { accessToken, idToken } = account;

//           // make a POST request to the DRF backend
//           try {
//             const response = await axios.post(
//               // tip: use a seperate .ts file or json file to store such URL endpoints
//               // "http://127.0.0.1:8000/api/social/login/google/",
//               UrlUtils.makeUrl(
//                 process.env.BACKEND_API_BASE,
//                 "social",
//                 "login",
//                 account.provider
//               ),
//               {
//                 access_token: accessToken, // note the differences in key and value variable names
//                 id_token: idToken,
//               }
//             );

//             // extract the returned token from the DRF backend and add it to the `user` object
//             const { access_token, refresh_token } = response.data;
//             // reform the `token` object from the access token we appended to the `user` object
//             token = {
//               ...token,
//               accessToken: access_token,
//               refreshToken: refresh_token,
//             };

//             return token;
//           } catch (error) {
//             return null;
//           }
//         }
//       }

//       // user was signed in previously, we want to check if the token needs refreshing
//       // token has been invalidated, try refreshing it
//       if (JwtUtils.isJwtExpired(token.accessToken)) {
//         const [newAccessToken, newRefreshToken] =
//           await NextAuthUtils.refreshToken(token.refreshToken);

//         if (newAccessToken && newRefreshToken) {
//           token = {
//             ...token,
//             accessToken: newAccessToken,
//             refreshToken: newRefreshToken,
//             iat: Math.floor(Date.now() / 1000),
//             exp: Math.floor(Date.now() / 1000 + 2 * 60 * 60),
//           };

//           return token;
//         }

//         // unable to refresh tokens from DRF backend, invalidate the token
//         return {
//           ...token,
//           exp: 0,
//         };
//       }

//       // token valid
//       return token;
//     },

//     async session(session, userOrToken) {
//       session.accessToken = userOrToken.accessToken;
//       return session;
//     },
//   },
// };

// export default (req, res) => NextAuth(req, res, settings);
