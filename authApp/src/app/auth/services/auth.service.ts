import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;          //Evaluo yo si usuario tiene algo


  get usuario() {
    return (this._usuario);
  }

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {

    const url = `${this.baseUrl}/auth`;
    const body = { email, password }

    return this.http.post<AuthResponse>(url, body)
      .pipe(

        tap(resp => {                 //Para separar del map
          if (resp.ok) {
            localStorage.setItem('token', resp.token!)


            this._usuario = {name: resp.name!, uid: resp.uid!, email: resp.email!

            }
          }
        }),

        map(resp => resp.ok),
        catchError(err => of(err.error.msg))    //Se transforma el valor en un observable
      )
  }


 // prueba get
/*
  getUserInfo(): Observable<any> {
    const url = `${this.baseUrl}/user`;

    return this.http.get<any>(url)
      .pipe(
        tap(resp => {
          if (resp.ok) {
            const usuario = {
              name: resp.name!,
              uid: resp.uid!,
              email: resp.email!
            };
            localStorage.setItem('usuario', JSON.stringify(usuario));
          }
        }),
        catchError(err => of(err.error.msg))
      );
  }

*/

  registro(name: string, email: string, password: string) {

    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password }

    return this.http.post<AuthResponse>(url, body)
      .pipe(

        tap(resp => {                 //Para separar del map
          if (resp.ok) {
            localStorage.setItem('token', resp.token!)


            this._usuario = {
              name: resp.name!,
              uid: resp.uid!,
              email: resp.email!

            }
          }
        }),

        map(resp => resp.ok),
        catchError(err => of(err.error.msg))    //Se transforma el valor en un observable
      )
  }



  validarToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '')

    return this.http.get<AuthResponse>(url, { headers })
      .pipe(
        map(resp => {

          localStorage.setItem('token', resp.token!)

          this._usuario = {
            name: resp.name!,
            uid: resp.uid!,
            email: resp.email!
          }


          return resp.ok;
        }),

        catchError(err => of(false))   //Si el token no es correcto 
      )
  }

  logout() {

    localStorage.clear();
  }

}
