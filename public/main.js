import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { uploadBytes, getStorage, ref } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import { getFirestore, collection, onSnapshot, query, addDoc } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
import { Post, PostForm } from "./components.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  // TODO: copy-paste firebase configuration from the console after you add the web app
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage();

const e = React.createElement;

signInWithPopup(auth, provider)
  .then(() => {
    loadPosts();
    ReactDOM.createRoot(
      document.getElementById('postForm')).render(e(PostForm, { 'onPost': createPost }));
  }).catch((error) => {
    alert(error)
  });

async function loadPosts() {
  const root = ReactDOM.createRoot(document.getElementById('posts'));
  const q = query(collection(db, "posts"));
  const unsub = onSnapshot(q, (querySnapshot) => {
    const posts = []
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      const original = doc.data().photos && doc.data().photos.original;
      const thumbnail = doc.data().photos && doc.data().photos.thumbnail;
      posts.push(e(Post, {
        key: doc.id,
        title: doc.data().title,
        body: doc.data().body,
        original,
        thumbnail,
      }));
    });
    root.render(posts);
  });
}

async function createPost(post) {
  console.log(post)
  const docRef = await addDoc(collection(db, "posts"), {
    title: post.title,
    body: post.text,
  });
  const file = post.photo;
  const postId = docRef.id;
  const ref = ref(storage, '/users/' + auth.currentUser.uid + '/' + postId + '/' + file.name);
  uploadBytes(ref, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}
