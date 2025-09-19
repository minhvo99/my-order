import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastController = inject(ToastController);

  async present(
    message: string,
    color: string = 'primary',
    duration: number = 3000,
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'bottom', // 'top' | 'middle' | 'bottom'
      swipeGesture: 'vertical', // 'top' | 'middle' | 'bottom'
    });

    await toast.present();
  }

  async success(message: string, duration: number = 3000) {
    return this.present(message, 'success', duration);
  }

  async error(message: string, duration: number = 3000) {
    return this.present(message, 'danger', duration);
  }

  async warning(message: string, duration: number = 3000) {
    return this.present(message, 'warning', duration);
  }

  async info(message: string, duration: number = 3000) {
    return this.present(message, 'medium', duration);
  }
}
