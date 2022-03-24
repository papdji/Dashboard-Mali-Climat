import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private afStore: AngularFirestore) { }

  getProductsData() {
    return this.afStore.collection("conseils").snapshotChanges();
   }

   getProductData(id: string) {
    return this.afStore.collection("conseils").ref.doc(id).get();
  }

  deleteProduct(id:string) {
    return this.afStore.collection("conseils").doc(id).delete()
  }
}
