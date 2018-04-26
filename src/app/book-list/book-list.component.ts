import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksService } from '../services/books.service';
import { Book } from '../models/book.model';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[];
  booksSubscription: Subscription;

  constructor(private booksService: BooksService, private router: Router) {}

  ngOnInit() {
    this.booksSubscription = this.booksService.booksSubject.subscribe( //Soupscription au sujet books pour pouvoir récuperer ses données et les emettres
      (books: Book[]) => {
        this.books = books;
      }
    );
    this.booksService.getBooks();
  }

  onNewBook() {  //Création
    this.router.navigate(['/books', 'new']); //Router
  }

/*  onEditBook(id: number){
    this.router.navigate(['/books', 'edit', id]);
  }*/

  onDeleteBook(book: Book) {  //Supression
    this.booksService.removeBook(book);
  }

  onViewBook(id: number) { //Vue d'un seul livre
    this.router.navigate(['/books', 'view', id]);
  }
  
  ngOnDestroy() { //Fin de l'émission de données
    this.booksSubscription.unsubscribe();
  }
}