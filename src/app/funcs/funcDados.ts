import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from '@angular/fire/database';



@Injectable({
  providedIn: 'root'
})

export class funcDados {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  buscaDados(cEnd) {
    return this
      .db
      .list(cEnd)
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
        })
      );
  }


  buscaClientes() {
    return this
      .db
      .list('clientes')
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
        })
      );
  }
  
  
  buscaConsultas() {
    return this
      .db
      .list('consultas', ref => ref.orderByChild('consDia'))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
        })
      );
  }

  // getByEmail(email:string) {
  //   return this
  //     .db
  //     .list('16433049000178/usuarios', ref => ref.orderByChild('email').equalTo(email))
  //     .snapshotChanges()
  //     .pipe(
  //       map(changes=>{
  //         return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
  //       })
  //     )
  // }

  buscaChamados() {
    return this
      .db
      .list('orders')
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
        })
      );
  }

  buscaTaks() {
    return this
      .db
      .list('task')
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }));
        })
      );
  }

}
