import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {   //Connexion utilisateur

  signinForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {  //Création du formulaire de connexion
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],   //Utilisation de validateurs pour plus de conformité
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]  //Regex pour un mot de passe de minimum 6 caractères (min autorisé par firebase)
    });
  }

  onSubmit() {  //Soumission du formulaire
    const email = this.signinForm.get('email').value;     //Récupération des valeurs du form
    const password = this.signinForm.get('password').value;
    
    this.authService.signInUser(email, password).then( //Appel au service AuthService pour la la vérification de l'utilisateur dans la bdd de firebase
      () => {
        this.router.navigate(['/books']); //Si ok, l'utilisateur est rediriger vers le listing des livres
      },
      (error) => {
        this.errorMessage = error;  //Sinon message d'erreur (à voir pour personnalisation)
      }
    );
  }

}
