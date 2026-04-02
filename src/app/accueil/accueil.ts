import { Component } from '@angular/core';

@Component({
  selector: 'app-accueil',
  imports: [],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {

public monTitre: string;
public monIntroduction: string;
public maPhraseAccroche: string;

  constructor() {
    this.monTitre = 'Ma commune';
    this.monIntroduction = 'Informations sur les communes';
    this.maPhraseAccroche = 'Insérez le code du département';
  }

}
