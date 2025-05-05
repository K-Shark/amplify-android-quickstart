import { defineStorage } from "@aws-amplify/backend";

/**
 * Access is set so that only the person who uploads the image can read, write, delete, but
 * anyone logged in can read.
 *
 * The code will use the entity_id as a reserved token that will be replaced with the users'
 * identifier when the file is being uploaded.
 */
export const storage = defineStorage({
    name: "amplifyNotesDrive", // S3 Bucket Name
    access: (allow) => ({
        "media/{entity_id}/*": [
            // Allow anyone logged into the app to read everyone's media.
            allow.authenticated.to(['read']),
            // Allow only the owner of an item to modify it.
            allow.entity("identity").to(["read", "write", "delete"]),
        ],
    }),
});
