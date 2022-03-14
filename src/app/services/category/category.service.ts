import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afStore: AngularFirestore) { }

  getCategoriesData() {
    return this.afStore.collection("Categorie").snapshotChanges();
   }

   getCategoryData(id: string) {
     return this.afStore.collection("Categorie").ref.doc(id).get();
   }

   deleteCategory(id:string) {
     return this.afStore.collection("Categorie").doc(id).delete()
   }
}
