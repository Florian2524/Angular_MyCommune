import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  imports: [ReactiveFormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  public monTitre: string;
  public monIntroduction: string;
  public maPhraseAccroche: string;

  public champSaisi = new FormControl('');

  constructor() {
    this.monTitre = 'Ma Commune';
    this.monIntroduction = 'Informations sur les communes';
    this.maPhraseAccroche = 'Insérez le code du département';
  }

  public afficherChampSaisi(): void {
    alert(this.champSaisi.value);
  }
}