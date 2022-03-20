import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private afStore: AngularFirestore) { }

  getProductsData() {
    return this.afStore.collection("posts").snapshotChanges();
   }

   getProductData(id: string) {
    return this.afStore.collection("posts").ref.doc(id).get();
  }

  deleteProduct(id:string) {
    return this.afStore.collection("posts").doc(id).delete()
  }
}
