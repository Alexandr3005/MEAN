import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup = this.fb.group({
    name: ['usuario1', [Validators.required]],
    email: ['test1@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]

  })

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }
  //Validacion front 
  campoNoValido(campo : string){
    return this.registerForm.controls[campo].errors && this.registerForm.controls[campo].touched;
    
 }

  register() {
   
    const { name, email, password } = this.registerForm.value;


    this.authService.registro(name, email, password).subscribe( ok => {
      if(ok === true ){
        this.router.navigateByUrl('/dashboard');
      } else {
        Swal.fire("Error", ok, "error")
      }

    });

  
  }
}
