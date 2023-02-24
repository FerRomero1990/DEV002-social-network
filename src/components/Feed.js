// PARA QUE NO ME LO BORRE EN FEED BRANCH
// eslint-disable-next-line import/no-cycle
// import { onNavigate } from '../main.js';
// import { async } from 'regenerator-runtime';
import { auth, doc } from '../firebase/firebase.js';
// eslint-disable-next-line import/no-cycle
import {
  addPost, getPost, observerUser, deletePost, darLike, quitarLike,
} from '../firebase/functions.js';

export const Feed = () => {
  const FeedDiv = document.createElement('div');
  const sectionFeed = `
    <header>
      <div class='headerFeed'>
        <h1 class="title_feed">SabiOld</h1>
        <div class='btnOut'>
          <p class='textOut'>Salir</p>
          <img src='./IMG/salida-de-la-puerta.png' alt='Salir de SabiOld' id='imgOut'>
        </div>
      </div>
    </header>
    <hr>
    <section class='section_feed'>
      <section class='section_profile'>
        <form action='' method='post' name='profile' id='profile'>
          <label for='name' class='name_profile'>Tú sabes quien soy:</label>
          <textarea id='textProfile' class='textarea_profile' name='textarea' placeholder='Aquí el texto a publicar'></textarea>
          <p class='error' id='errorNoPost'></p>
          <div class='buttons_profile'>
            <button class='button btnPost' id='btnPost'>Publicar</button>
            <button class='button btnPost' id='btnCancelPost'>Cancelar</button>
          </div>
        </form>
      </section>
      <hr>
      <section class='section_posts' id='posts'></section>
    </section>
  `;
  FeedDiv.innerHTML = sectionFeed;
  return FeedDiv;
};

export const savePost = () => {
  const postForm = document.getElementById('profile');
  // console.log('aqui mismito');
  // if (postForm) {
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const txtPost = postForm.textProfile.value;
    const errorPost = document.getElementById('errorNoPost');
    if (txtPost !== '') {
      // }
      const callback = (txt, uid, nameU, dateP) => {
      // console.log(`se ejecutó el callback ${uid}`);
        addPost(txt, uid, nameU, dateP);
      };
      observerUser(callback, txtPost);
      // .then((userPost) => {
      //   console.log(`este es el final${userPost}`);
      // });
      document.getElementsByClassName('textarea_profile')[0].value = '';
    } else {
      errorPost.textContent = 'No has agregado texto a tu publicación';
    }
  });
};

export const showPost = () => {
  getPost()
    .then((postSnapshot) => {
      // console.log(postSnapshot);
      const sectionPosts = document.getElementById('posts');
      sectionPosts.innerHTML = '';
      const userLoginFirebase = auth.currentUser.uid;
      // console.log(auth);
      postSnapshot.docs.forEach((doc) => {
        const userPost = doc.data().userUid;
        // console.log(doc.id);
        if (userLoginFirebase === userPost) {
          const articlePost = `
            <article class='postUsers'>
              <div name='feed' id='post'>
                <label id='nameUserPost' for='name' class='name_user'>${doc.data().nameUser}</label>
                <button type='button' id='edit_button'>
                  <img class='imgEdit' src='./IMG/boligrafo.png' alt='Lápiz de edición'>
                </button>
                <h4 id='textPost' class='textarea_post' name='textarea'>${doc.data().post}</h4>
                <div class='likear' id=${doc.id}>
                  <img class='imgLikeRosa' src="./IMG/corazonRosa.png" alt="Corazón pintado de rosa">
                  <img class ='imgLikeVacio' src="./IMG/corazon.png" alt="Corazón sin pintar"></img>
                </div>
                <div class='container_remove'>
                  <!--<p class='textRemove'>Eliminar Publicación</p>-->
                  <button class='btn_remove' id=${doc.id}>
                    <img class='imgRemove' src="./IMG/eliminar.png" alt="Eliminar publicación">
                  </button>
                </div>
              </div>
              
              <hr>
            </article>
          `;
          sectionPosts.innerHTML += articlePost;
        //   const btnRemove = sectionPosts.querySelector(`#${doc.id}`);
        //   btnRemove.addEventListener('click', () => {
        //     console.log('acaaaaa')
        // })
        //   console.log(btnRemove);
        } else {
          const articlePost = `
          <article class='postUsers'>
            <div name='feed' id='post'>
              <label id='nameUserPost' for='name' class='name_user'>${doc.data().nameUser}</label>
              <h4 id='textPost' class='textarea_post' name='textarea'>${doc.data().post}</h4>
              <div class='likear' id=${doc.id}>
                <img class='imgLikeRosa' src="./IMG/corazonRosa.png" alt="Corazón pintado de rosa">
                <img class ='imgLikeVacio' src="./IMG/corazon.png" alt="Corazón sin pintar"></img>
              </div>
            </div>
            <hr>
          </article>
        `;
          sectionPosts.innerHTML += articlePost;
        }
        // removePost(doc.id);
      });
      // DELETE
      const btnRemove = sectionPosts.querySelectorAll('.btn_remove');
      btnRemove.forEach((btn) => {
        btn.addEventListener('click', () => {
          console.log(btn.id);
          deletePost(btn.id)
            .then(() => { showPost(); });
        });
      });
      // console.log(btnRemove);
      // EDIT
      // LIKE
      // si le dan click al div, y el array likes estaba vacío
      // se cambia a corazón pintado
      // y se agrega elem uid al array

      const likePost = sectionPosts.querySelectorAll('.likear');
      likePost.forEach((btnLike) => {
        btnLike.addEventListener('click', () => {
          const userUidLike = auth.currentUser.uid;
          const x = doc.data().userUid;
          // const x = db.doc;
          console.log(userUidLike);
          console.log(`AQUI ${x}`);
          console.log(btnLike.id);
          // if () {
          //   // si en totalLikes existe userUidLike se ejecuta quitarLike

          //   quitarLike(userUidLike, btnLike.id);
          // } else {
          //   // si en totalLikes NO existe userUidLike se ejecuta darLike
          //   darLike(userUidLike, btnLike.id);
          // }
        });
      });

      // si le dan click al div, y el array likes contiene elem uid
      // se cambia a corazón vacío y se quita elem al array

      // sino le dan click, se queda el corazón vacío y no hace nada más....
      // (no se si va afuera en un if englobando al addEL o ya no se pone)
    });
};

// export const removePost = (idPost) => {
//   deletePost(idPost);
// };

// export const removePost = (idPost) => {
//   deletePost(idPost)
//     .then((deleteDocs) => {
//       const btnRemove = document.getElementById(idPost);
//       btnRemove.addEventListener('click', () => {
//         deleteDocs.docs.forEach((doc)=>{
//           const idPost = doc.id;

//         });
//       });
//     });
// };

// export const removePost = () => {
// const btnRemove = document.querySelectorAll('.btn_remove');
// btnRemove.addEventListener('click', console.log('hola estoy probando'));
