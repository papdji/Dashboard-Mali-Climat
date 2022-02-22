import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afStore: AngularFirestore) { }

  getCategoriesData() {
    return this.afStore.collection("Alertes").snapshotChanges();
   }

   getCategoryData(id: string) {
     return this.afStore.collection("Alertes").ref.doc(id).get();
   }

   deleteCategory(id:string) {
     return this.afStore.collection("Alertes").doc(id).delete()
   }
}
