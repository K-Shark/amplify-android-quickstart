import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
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
        profile: a.hasOne('Profile', 'profileId'),
      }).authorization((allow) => [
        // Allow only signed-in users to create, read, update, and delete their user information.
        allow.owner()
      ]),
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
        posts: a.hasMany('Post', 'postId'),
        user: a.belongsTo('User', "userId").authorization((allow) => [
          // Only the owner can see this relationship.
          allow.owner()
        ])
      })
      .authorization((allow) => [
        // Allow anyone logged into the app to read everyone's profile.
        allow.authenticated().to(['read']),
        // Allow signed-in user to create, read, update, and delete their own profile.
        allow.owner()
      ]),
  Post: a
      .model({
        postId: a.id().required(),
        name: a.string(),
        message: a.string(),
        image: a.string(),
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
