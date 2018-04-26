import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';  
import { Book } from '../models/book.model';
import * as firebase from 'firebase';
import { DataSnapshot } from 'firebase/database';

@Injectable()
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>(); /*Observable et observé, ex: mise à jour d'un livre, 
  										un component modifie le livre et le livre se met à jour dans les components (abstrait)*/

  emitBooks() {
    this.booksSubject.next(this.books); //books devient concret et est retourné
  }
  
  //Sauvegarde
  saveBooks() {
    firebase.database().ref('/books').set(this.books); /*Enregistrement de la liste de livres dans la bdd firebase
                                                       ref() -> noeud de la bdd
                                                       set() -> enregistrement*/
  }

  //Récupération
  getBooks() {  //Récupération de la liste des livres
    firebase.database().ref('/books')
      .on('value', (data: DataSnapshot) => {            /*'value' demande à firebase d'exécuter le callback (Datasnapshot->objet comportant les données voulues) 
      													à chaque modification de valeur enregistrée au endpoint choisi
      													la liste sera toujours à jour*/
          this.books = data.val() ? data.val() : [];  //val() -> récupère la valeur
          this.emitBooks();
        }
      );
  }

  getSingleBook(id: number) {  //Récupération d'un seul livre selon son id
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then( /* once() -> une seule requête
        															then() ->retourne les données si elles existent bien sinon erreur*/
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  //Action sur les livres
  createNewBook(newBook: Book) {  //Création
    this.books.push(newBook); //Pousse à la suite dans le tableau
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) { //Supression
    if(book.photo) { //Suppression de la photo liée au livre
      const storageRef = firebase.storage().refFromURL(book.photo); //Pour la suppression avec delete, on a besoin d'une référence, ca sera l'url
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }

    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {    //Recherche une correspondance, si true, l'index est le bon et la constante à son index
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1); //Supprime du tableau selon l'index
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {  //Enregistrement d'une photo
    return new Promise(  //Utilisation d'une promise car cela met du temps
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString(); //Création d'un préfixe unique pour rendre le nom de fichier envoyé unique
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file); //On stocke les images dans le sous dossier images
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.downloadURL); //Retourne l'url du fichier enregistré
          }
        );
      }
    );
  }
}
