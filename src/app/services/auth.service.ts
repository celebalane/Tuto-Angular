import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable() //Permet d'injecter dans AuthService un autre service
export class AuthService {

  constructor() { }

  createNewUser(email: string, password: string) {   //Nouvel utilisateur
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(   //Utilisation du service de création d'utilisateur de firebase
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signInUser(email: string, password: string) {     //Connexion pour un utilisateur déjà existant
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(   //Utilisation du service d'identification de firebase
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signOutUser() {              //Déconnexion de l'utilisateur
    firebase.auth().signOut();
  }

  resetPassword(email: string){
  	return new Promise(
      (resolve, reject) => {
        firebase.auth().sendPasswordResetEmail(email).then(   //Envoi d'un mail contenant les instructions pour la réinitialisation du mot de passe
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
}
