import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  public chargement: boolean;
  public codeDepartementActuel: string;
  public mapUrl: SafeResourceUrl | null;

  constructor(
    private communeService: CommuneService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.monTitre = 'Ma Commune';
    this.monIntroduction = 'Informations sur les communes';
    this.maPhraseAccroche = 'Insérez le code du département';

    this.messageErreur = '';
    this.nbCommunes = 0;
    this.chargement = false;
    this.codeDepartementActuel = '';
    this.mapUrl = null;
  }

  public afficherChampSaisi(): void {
    const codeDepartement = this.champSaisi.value?.trim();

    this.messageErreur = '';
    this.listeCommunes = [];
    this.nbCommunes = 0;
    this.communeSelectionnee.setValue('');
    this.communeAffichee = null;
    this.mapUrl = null;

    if (!codeDepartement) {
      this.messageErreur = 'Veuillez saisir un code de département.';
      return;
    }

    this.chargement = true;
    this.codeDepartementActuel = codeDepartement;

    this.communeService
      .getCommunesByDepartement(codeDepartement)
      .subscribe({
        next: (donnees) => {
          this.listeCommunes = donnees;
          this.nbCommunes = donnees.length;
          this.chargement = false;

          if (this.nbCommunes === 0) {
            this.messageErreur = 'Aucune commune trouvée pour ce département.';
          }

          this.cdr.detectChanges();
        },
        error: () => {
          this.listeCommunes = [];
          this.nbCommunes = 0;
          this.messageErreur = 'Erreur lors de la récupération des communes.';
          this.chargement = false;
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
  latitude: communeTrouvee.centre?.coordinates?.[1] || null,
  longitude: communeTrouvee.centre?.coordinates?.[0] || null,
};

      const rechercheCarte = encodeURIComponent(
        `${communeTrouvee.nom} ${this.codeDepartementActuel} France`
      );

      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.google.com/maps?q=${rechercheCarte}&output=embed`
      );
    } else {
      this.communeAffichee = null;
      this.mapUrl = null;
      this.messageErreur = 'Impossible de retrouver la commune sélectionnée.';
    }

    this.cdr.detectChanges();
  }
}