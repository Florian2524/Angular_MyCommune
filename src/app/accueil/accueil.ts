import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  public monTitre: string;
  public monIntroduction: string;
  public maPhraseAccroche: string;

  public champSaisi = new FormControl('');
  public communeSelectionnee = new FormControl('');
  public listeCommunes: any[] = [];
  public communeAffichee: any = null;

  constructor(private http: HttpClient) {
    this.monTitre = 'Ma Commune';
    this.monIntroduction = 'Informations sur les communes';
    this.maPhraseAccroche = 'Insérez le code du département';
  }

  public afficherChampSaisi(): void {
    const codeDepartement = this.champSaisi.value;

    this.http
      .get<any[]>(`https://geo.api.gouv.fr/departements/${codeDepartement}/communes`)
      .subscribe((donnees) => {
        this.listeCommunes = donnees;
        this.communeSelectionnee.setValue('');
        this.communeAffichee = null;
        console.log(this.listeCommunes);
      });
  }

  public validerCommune(): void {
    const nomCommune = this.communeSelectionnee.value;

    const communeTrouvee = this.listeCommunes.find(
      (commune) => commune.nom === nomCommune
    );

    if (communeTrouvee) {
      this.communeAffichee = {
        nom: communeTrouvee.nom,
        codePostal: communeTrouvee.codesPostaux?.[0] || 'Non renseigné',
        population: communeTrouvee.population,
      };
    }
  }
}