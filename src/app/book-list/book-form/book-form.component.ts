import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  bookForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;

  constructor(private formBuilder: FormBuilder, private booksService: BooksService,
              private router: Router) { }
              
  ngOnInit() {
    this.initForm();
  }
  
  initForm() {  //Création du formulaire d'enregistrement d'un livre
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      synopsis: ''
    });
  }

  detectFiles(event) { //Fait la liaison entre l'input de type file et la méthode onUploadFile
    this.onUploadFile(event.target.files[0]);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true; //Désactive le bouton submit durant l'enregistrement du fichier
    this.booksService.uploadFile(file).then( //Appel du service Books pour enregistrer l'image
      (url: string) => { //Si l'url du fichier enregistré est retourné, les états changent
        this.fileUrl = url;
        this.fileIsUploading = false; //Activation du bouton submit
        this.fileUploaded = true; //Affichage du message de réussite
      }
    );
  }
  
  onSaveBook() { //Enregistrement d'un nouveau livre
    const title = this.bookForm.get('title').value;  //Récupération des valeurs du form
    const author = this.bookForm.get('author').value;
    const synopsis = this.bookForm.get('synopsis').value;
    const newBook = new Book(title, author);
    newBook.synopsis = synopsis;

    if(this.fileUrl && this.fileUrl !== '') { //Si une image est envoyé, on en récupère l'url pour l'enregistrement
      newBook.photo = this.fileUrl;
    }

    this.booksService.createNewBook(newBook);  //Appel au service booksService et à la fonction createNewBook pour l'enregistrement
    this.router.navigate(['/books']);  //Renvoie à la liste des livres une fois enregistré
  }
}


