import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild('closeButton') closeButton: any
  @ViewChild('closeButtonUpdate') closeButtonUpdate: any

  successMsg: string = ''

  allUsers : any = []
  user: any = []

  constructor(private afStore: AngularFirestore, private router:Router, private userServ: UserService) {
    this.userServ.getUsersData().subscribe(data => this.allUsers = data)
  }

  ngOnInit(): void {
  }


  addNewUser(form: NgForm) {
    let data = form.value
    this.userServ.addUser(data.email, data.Password).then(user => {
      this.afStore.collection("users").doc(user.user?.uid).set({
        name: data.name,
        email: data.email,
        uid: user.user?.uid,
        profile: data.profile,
      }).then(() => {
        this.router.navigate(['/users'])
        this.closeButton.nativeElement.click()
        this.successMsg = "Utilisateur ajouter avec succès"
      })
    })
  }

  selectUser(id:string) {
    this.userServ.getUserData(id).valueChanges().subscribe(user=>{
      this.user = user;
      console.log(this.user.name);


    })
  }

  updateUser(updateData: NgForm) {
    let data = updateData.value
    this.afStore.collection("users").doc(data.uid).update({
      name: data.name,
      email: data.email,
      profile: data.profile
    }).then(() => {
      this.closeButtonUpdate.nativeElement.click()
      this.successMsg = "utilisateur modifier avec succès"
    })
  }

  delete(id:string){Swal.fire({
    title: 'Etes vous sure?',
    text: "L'utilisateur sera supprimer'",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Continuer',
    cancelButtonText: 'Annuler',
    confirmButtonColor:'#1cd835',
  }).then((result) => {
    if (result.isConfirmed) {
      this.afStore.collection("users").doc(id).update({
        etat:"DESACTIVER",})
    } else if (result.isDismissed) {
    }
  });
}


    // this.userServ.deleteUser(id).then(() => {
    //   this.successMsg = "Utilisateur supprimé avec succès"
    // })
  }


