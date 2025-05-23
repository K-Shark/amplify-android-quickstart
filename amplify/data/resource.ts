import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  /*
   * User - Private user information, not publicly accessible.
   */
  User: a
      .model({
        userId: a.id().required(),
        address: a.customType({
          country: a.string().required(), // Could be an enum
          addressLine1: a.string().required(),
          addressLine2: a.string(),
          city: a.string().required(),
          state: a.string(),
          zipCode: a.string(),
        }),
      })
      .identifier(['userId'])
      .authorization((allow) => [
        // Allow only signed-in users to create, read, update, and delete their user information.
        allow.owner()
      ]),
  /*
   * Profile - Public user information.
   */
  Profile: a
      .model({
        profileId: a.id().required(),
        name: a.string().required(),
        media: a.string().array(), // Pictures/Videos
        location: a.customType({
          country: a.string(), // Could be an enum
          city: a.string(),
          state: a.string(),
        }),
        posts: a.hasMany('Post', 'profileId'),
      })
      .identifier(['profileId'])
      .authorization((allow) => [
        // Allow anyone logged into the app to read everyone's profile.
        allow.authenticated().to(['read']),
        // Allow signed-in user to create, read, update, and delete their own profile.
        allow.owner()
      ]),
  /*
   * Post - A public message, associated with a Proflie.
   */
  Post: a
      .model({
        name: a.string(),
        message: a.string(),
        image: a.string(),
        profileId: a.id().required(),
        profile: a.belongsTo('Profile', 'profileId')
      })
      .authorization((allow) => [
        // Allow anyone logged into the app to read everyone's notes.
        allow.authenticated().to(['read']),
        // Allow signed-in user to create, read, update, and delete their own notes.
        allow.owner()
      ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
