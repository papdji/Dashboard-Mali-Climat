import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category/category.service';
import { Post, PostService } from '../services/post/post.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  viewVille = true;
  allUsers : any = []
  getUsers?: Subscription

  viewComments = false;

  newMsg = '';

  @Input()
  post!: Post;
  allPosts: any;
  postsId: string | undefined;
  postImage: string | undefined;
  users: any;

  constructor(private userServ: UserService,
    private catServ: CategoryService, private afStore: AngularFirestore,
    private afStorage: AngularFireStorage, private router: Router,
    private Postservice: PostService) {
      this.getUsers = this.userServ.getUsersData().subscribe(data=> this.allUsers = data);


    this.afStore.firestore.collection("posts").get().then(snapshot=>{
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

  ngOnInit() {
    this.checkPostImage();
    console.log('Post view: ', this.post);
  }

  checkPostImage() {
    switch ( this.post.type, this.post.ville ) {
      case 'conseil':
        this.postImage = './assets/undraw_Problem_solving_re_4gq3.svg';
        break;
      case 'question':
        this.postImage = './assets/undraw_Questions_re_1fy7.svg';
        break;
      case 'climat':
        this.postImage = 'https://firebasestorage.googleapis.com/v0/b/ionfire-d0376.appspot.com/o/images%2Fundraw_weather_d9t2%20(1).svg?alt=media&token=a62181a8-ba81-4aba-b825-1860a193592d';
        break;
      default:
        this.postImage = 'https://firebasestorage.googleapis.com/v0/b/ionfire-d0376.appspot.com/o/images%2Fundraw_weather_d9t2%20(1).svg?alt=media&token=a62181a8-ba81-4aba-b825-1860a193592d';
        break;
    }
  }

  toggleViewComments() {
    this.viewComments = !this.viewComments;
  }

  addPostComment() {
    this.Postservice.addPostComment(this.newMsg, this.post.id).then(() => {
      this.newMsg = '';
    });
  }

  togglePostLiked() {
    this.Postservice.updatePostLike(this.post);
  }
}
