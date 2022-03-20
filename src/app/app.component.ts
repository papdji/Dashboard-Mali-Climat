import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dashboard';
  private postData : any;

  constructor(private db: AngularFirestore) {


  }

//   private getData(id:any){
//     this.db.collection("posts").doc(id).collection("comments").valueChanges().subscribe(comment=>{
//       console.log(comment);

//     });
//   }
}
