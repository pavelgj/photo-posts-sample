import { onCustomEventPublished } from "firebase-functions/v2/eventarc";
import * as admin from "firebase-admin"

admin.initializeApp();
const db = admin.firestore();

export const imageresizehandler = onCustomEventPublished(
  "firebase.extensions.storage-resize-images.v1.complete",
  async (e) => {
    const resizedImgPath = e.data.outputs[0].outputFilePath;
    const postId = resizedImgPath.split('/')[2];


    const post = (await db
      .collection('posts')
      .doc(postId)
      .get()).data();

    if (!post) {
      throw new Error("unable to retrieve post " + postId);
    }

    post['photos'] = {
      original: e.subject && makeDownloadUrl(e.subject),
      thumbnail: makeDownloadUrl(resizedImgPath),
    };

    await db
      .collection('posts')
      .doc(postId)
      .update(post);
  });

function makeDownloadUrl(storagePath: string) {
  return "https://firebasestorage.googleapis.com/v0/b/" +
    process.env.GCLOUD_PROJECT +
    ".appspot.com/o/" +
    encodeURIComponent(storagePath) +
    "?alt=media"
}
