import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../post/post.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  addNewPosts(email: any, Password: any) {
    throw new Error('Method not implemented.');
  }
  auth: any;

  constructor(private afStore: AngularFirestore, private afAuth: AngularFireAuth) {}
  signin(email: any, pass: any) {
    return this.auth.signin(email, pass);
  }

  signup(email: any, pass: any) {
    return this.auth.signup(email, pass);
  }

  getUsersData() {
   return this.afStore.collection("users").valueChanges();
  }


  private updateUserData(user: { uid: any; email: any; displayName: any; photoURL: any; }) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

  }


  getUserData(id: string) {
    return this.afStore.collection("users").doc(id);
  }

  addUser(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  deleteUser(id:string) {
    return this.afStore.collection("users").doc(id).delete()
  }
  isAuth() {
    return this.auth.isAuthenticated();
  }
}
