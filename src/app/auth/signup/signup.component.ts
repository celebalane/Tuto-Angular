import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {   //Enregistrement d'un nouvel utilisateur

  signupForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {  //Création du formulaire d'enregistrement
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],   //Utilisation de validateurs pour plus de conformité
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]  //Regex pour un mot de passe de minimum 6 caractères (min autorisé par firebase)
    });
  }         //voir pour un deuxième champs de mot de passe

  onSubmit() {  //Soumission du formulaire
    const email = this.signupForm.get('email').value;     //Récupération des valeurs du form
    const password = this.signupForm.get('password').value;
    
    this.authService.createNewUser(email, password).then( //Appel au service AuthService pour la création de l'utilisateur dans la bdd de firebase
      () => {
        this.router.navigate(['/books']); //Si ok, l'utilisateur est rediriger vers le listing des livres
      },
      (error) => {
        this.errorMessage = error;  //Sinon message d'erreur
      }
    );
  }
}
