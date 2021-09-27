import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { modalController } from '@ionic/core';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-modalpage',
  templateUrl: './modalpage.page.html',
  styleUrls: ['./modalpage.page.scss'],
})
export class ModalpagePage implements OnInit {
  newTask: string ='';
  hoje: boolean = false;

  constructor(private modalCtrl: ModalController, private utilServiceCtrl : UtilService) { }

  ngOnInit() {
  }

  adicionar(){
    if (this.newTask.trim().length < 1) {
      this.utilServiceCtrl.showToast('Informe o que deseja fazer!');
      return;
    }
    this.modalCtrl.dismiss({
      name: this.newTask,
      hoje: this.hoje,
    });
  }

  fechar(){
    this.modalCtrl.dismiss();
  }

}
