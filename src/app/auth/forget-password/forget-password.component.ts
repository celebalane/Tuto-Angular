import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {   //Connexion utilisateur

  resetPasswordForm: FormGroup;
  errorMessage: string;
  successMessage : string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {  //Création du formulaire de récupération de l'email
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],   //Utilisation de validateurs pour plus de conformité
    });
  }

  onSubmit() {  //Soumission du formulaire
    const email = this.resetPasswordForm.get('email').value;     //Récupération des valeurs du form
    
    this.authService.resetPassword(email).then( //Appel au service AuthService pour l'envoi du mail
      () => {
        this.successMessage = 'Un email vient de vous être envoyé, merci de bien vouloir suivre les instructions'; //Si ok, message de succès d'envoi
      },
      (error) => {
        this.errorMessage = error;  
      }
    );
  }

}
