import {
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonImg,
  IonContent,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonBadge,
} from '@ionic/angular/standalone';
import { NgModule } from '@angular/core';
import { LoadingComponent } from './components/loading/loading.component';

const modules = [
  IonLabel,
  IonThumbnail,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  LoadingComponent,
  IonCard,
  IonCardHeader,
  IonList,
  IonItem,
  IonIcon,
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonImg,
  IonSelect,
  IonSelectOption,
  IonContent,
  IonFab,
  IonFabButton,
  IonBadge,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class ImportsModule {}
