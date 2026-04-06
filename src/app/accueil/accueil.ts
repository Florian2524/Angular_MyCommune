import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommuneService } from '../services/commune';

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

  public messageErreur: string;
  public nbCommunes: number;

  constructor(
  private communeService: CommuneService,
  private cdr: ChangeDetectorRef
) {
    this.monTitre = 'Ma Commune';
    this.monIntroduction = 'Informations sur les communes';
    this.maPhraseAccroche = 'Insérez le code du département';

    this.messageErreur = '';
    this.nbCommunes = 0;
  }

  public afficherChampSaisi(): void {
    const codeDepartement = this.champSaisi.value?.trim();

    this.messageErreur = '';
    this.listeCommunes = [];
    this.nbCommunes = 0;
    this.communeSelectionnee.setValue('');
    this.communeAffichee = null;

    if (!codeDepartement) {
      this.messageErreur = 'Veuillez saisir un code de département.';
      return;
    }

    this.communeService
  .getCommunesByDepartement(codeDepartement)
      .subscribe({
        next: (donnees) => {
          this.listeCommunes = donnees;
          this.nbCommunes = donnees.length;

          if (this.nbCommunes === 0) {
            this.messageErreur = 'Aucune commune trouvée pour ce département.';
          }

          this.cdr.detectChanges();
        },
        error: () => {
          this.listeCommunes = [];
          this.nbCommunes = 0;
          this.messageErreur = 'Erreur lors de la récupération des communes.';
          this.cdr.detectChanges();
        }
      });
  }

  public validerCommune(): void {
    const nomCommune = this.communeSelectionnee.value;

    this.messageErreur = '';

    if (!nomCommune) {
      this.messageErreur = 'Veuillez sélectionner une commune.';
      return;
    }

    const communeTrouvee = this.listeCommunes.find(
      (commune) => commune.nom === nomCommune
    );

    if (communeTrouvee) {
      this.communeAffichee = {
        nom: communeTrouvee.nom,
        codePostal: communeTrouvee.codesPostaux?.[0] || 'Non renseigné',
        population: communeTrouvee.population,
      };
    } else {
      this.communeAffichee = null;
      this.messageErreur = 'Impossible de retrouver la commune sélectionnée.';
    }

    this.cdr.detectChanges();
  }
}