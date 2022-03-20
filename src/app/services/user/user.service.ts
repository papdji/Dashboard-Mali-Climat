import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


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
