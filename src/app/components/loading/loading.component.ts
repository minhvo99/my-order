import { Component, Input, OnInit } from '@angular/core';
import {  IonLoading } from '@ionic/angular/standalone';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone:true,
  imports:[IonLoading]
})
export class LoadingComponent  {
@Input() isLoading: boolean = false
}
