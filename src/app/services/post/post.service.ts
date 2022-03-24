import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}


export interface Post {
  createdAt: firebase.default.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  type: string;
  ville: string;
  likes?: string[];
  userLikes?: boolean;
  comments?: Comment[];
  countComments?: number;
  countLikes?: number;
  userProfile?: User;
}

export interface Comment {
  createdAt: firebase.default.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {


  users: User[] | undefined;
  currentUser: any;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore) {
                this.afAuth.onAuthStateChanged(user => {
                  console.log('Changed: ', user);

                });
  }

  addPostMessage(msg: any, type: any, ville: any) {
    return this.afs.collection('posts').add({
      msg: {msg}.msg,
      from: this.currentUser.uid,
      type: {type}.type,
      ville: {ville}.ville,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
    });
  }

  addPostComment(msg: string, postId: string | undefined) {
    return this.afs.collection('posts').doc(postId).collection('comments').add({
      msg: {msg}.msg,
      from: this.currentUser.uid,
      createdAt: firebase.default.firestore.FieldValue.serverTimestamp()
    });
  }

  getPostMessage() {
    let users: User[] = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        console.log('all users: ', users);
        return this.afs.collection('posts', ref => ref.orderBy('createdAt', 'desc')).valueChanges({ idField: 'id'}) as Observable<Post[]>;
      }),
      map(posts => {
        for (const m of posts) {

          // vérifier si le tableau likes existe
          if ( m.likes !== undefined && m.likes !== null ) {
            m.countLikes = m.likes.length;
            // vérifier si l'utilisateur uid est dans le tableau des likes
            if (m.likes.includes(this.currentUser.uid)) {
              m.userLikes = true;
            } else {
              m.userLikes = false;
            }
          } else {
            m.countLikes = 0;
          }

          this.getPostComments(m.id).subscribe( comments => {
            m.comments = comments;
            m.countComments = comments.length;
          });
        }
        console.log('all post: ', posts);
        return posts;
      })
    );
  }

  getPostComments(messageId: string | undefined) {
    let users: User[] = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        return this.afs.collection('posts').doc(messageId)
        .collection('comments', ref => ref.orderBy('createdAt', 'desc'))
        .valueChanges({ idField: 'id' }) as Observable<Comment[]>;
      }),

    );
  }

  getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }

  updatePostLike(post: Post) {
    let tempLikesArray = [];

    // Vérifier si le tableau existe
    if ( post.likes !== undefined && post.likes !== null ) {
      tempLikesArray = post.likes;

      // Vérifier si uid existe déjà dans le tableau supprimer du tableau.
      if (tempLikesArray.includes(this.currentUser.uid)){
        const index = tempLikesArray.indexOf(this.currentUser.uid);
        tempLikesArray.splice(index, 1);
      } else {
        tempLikesArray.push(this.currentUser.uid);
      }
    } else {
      console.log('Add user: ', this.currentUser.uid);
      tempLikesArray.push(this.currentUser.uid);
    }

    return this.afs.collection('posts').doc(post.id).update({
      likes: tempLikesArray,
    });

  }
  getProductsData() {
    return this.afs.collection("posts").snapshotChanges();
   }

   getPostData(id: string) {
    return this.afs.collection("posts").ref.doc(id).get();
  }

  deletePost(id:string) {
    return this.afs.collection("posts").doc(id).delete()
  }

}
