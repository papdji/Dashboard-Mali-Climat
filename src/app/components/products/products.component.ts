import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoryService } from 'src/app/services/category/category.service';
import { UserService } from 'src/app/services/user/user.service';
import { AngularFireUploadTask, AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { ProductService } from 'src/app/services/product/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  public allPosts:any;
  public postsId : any;
  public users :any;
  allUsers : any = []
  getUsers?: Subscription
  allCategories : any = [];
  today:any;


  task?: AngularFireUploadTask
  ref?: AngularFireStorageReference
  imgUrl: string = ''
  percentage?: Observable<number | undefined>

  @ViewChild('closeButton') closeButton: any
  @ViewChild('closeButtonUpdate') closeButtonUpdate: any

  successMsg: string = ''
  allProducts: any = []
  product: any = []
  getProducts?: Subscription

  constructor(private userServ: UserService,
     private catServ: CategoryService, private afStore: AngularFirestore,
     private afStorage: AngularFireStorage, private router: Router,
     private proServ: ProductService) {

    this.getUsers = this.userServ.getUsersData().subscribe(data=> this.allUsers = data);

    this.getProducts = this.proServ.getProductsData().subscribe(data => {
      this.allProducts = data.map(element => {
        return element.payload.doc.data()
      })
    });



    this.afStore.firestore.collection("conseils").get().then(snapshot=>{
      snapshot.forEach(doc=>{
        this.allPosts = doc.data();
        console.log(this.allPosts);

        this.postsId = doc.id;
        this.afStore.collection("users").doc(this.allPosts.from).valueChanges().subscribe(user=>{
          this.users = user;
          console.log(this.users);

        })
        // this.afStore.collection("posts").doc(this.postsId).collection("comments").valueChanges().subscribe(comment=>{
        //   console.log(comment);

        // })
      })
    })

  }

  ngOnInit(): void {
  }


  uploadImage(event: any) {
    const id = Math.random().toString(36).substr(2, 9);
    this.ref = this.afStorage.ref(id + '_' + event.target.files[0].name)
    this.task = this.ref.put(event.target.files[0])
    this.percentage = this.task.percentageChanges()
    this.task.then((data)=> {
      data.ref.getDownloadURL().then((url) => {
        this.imgUrl = url
        console.log(url)
      })
    })
  }

  addNewProduct(form: NgForm) {
    let data = form.value
    console.log(data);
    this.today = new Date();
    var dd = String(this.today.getDate()).padStart(2, '0');
    var mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = this.today.getFullYear();

    this.today = dd + '/' + mm + '/' + yyyy;
    console.log(this.today);

    this.afStore.collection("conseils").add({
      Name: data.Name,
      Description: data.Description,
      // uid: data.uid,
      // catID: data.categoryId,
      "Date":this.today,
      Image: this.imgUrl,
      ID: Math.random().toString(36).substr(2, 9)
    }).then(() => {
      this.router.navigate(['/products'])
      form.reset()
      this.closeButton.nativeElement.click()
      this.successMsg = "Conseil ajouter avec succès"
  })

  this.getProducts = this.proServ.getProductsData().subscribe((data) => {
    data.map(element => {
      this.afStore.collection("conseils").doc(element.payload.doc.id).update({
        ID: element.payload.doc.id
      })
    })
  })
  }
  selectProduct(id:string) {
    this.proServ.getProductData(id).then(data => {
      this.product = data.data()
    })
  }

  updateProduct(updateData: NgForm) {
    let data = updateData.value
    this.afStore.collection("conseils").doc(data.ID).update({
      Name: data.Name,
      Description: data.Description,
      Image: this.imgUrl,
      ID: Math.random().toString(36).substr(2, 9)

    }).then(() => {
      this.closeButtonUpdate.nativeElement.click()
      this.successMsg = "Mis en jour avec succès"
    })
  }

  delete(id:string) {Swal.fire({
    title: 'Etes vous sure?',
    text: "L'utilisateur sera supprimer'",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Continuer',
    cancelButtonText: 'Annuler',
    confirmButtonColor:'#1cd835',
  })
    this.proServ.deleteProduct(id).then(() => {
      this.successMsg = "Conseil supprimé avec succès"
    })
  }

  ngOnDestroy(): void {

    this.getProducts?.unsubscribe()
  }
}
