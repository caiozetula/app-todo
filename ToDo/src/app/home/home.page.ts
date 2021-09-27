import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks: any[] = [];
  constructor(private alertCtrl: AlertController, private utilServiceCtrl: UtilService, private actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController) {
    let taskJson = localStorage.getItem('taskDb');
    if (taskJson != null) {
      this.tasks = JSON.parse(taskJson);
    }
  }

  async add(newTask: string) {
    //valida se o usuário preencheu a tarefa
    if (newTask.trim().length < 1) {
      this.utilServiceCtrl.showToast('Informe o que deseja fazer!');
      return;
    }
    let loading = this.loadingCtrl.create({ message: 'Processando' });
    (await loading).present();
    let task = { name: newTask, done: false };
    this.tasks.push(task);
    this.updateLocalStorage();
    (await loading).dismiss();
    this.utilServiceCtrl.showToast('Adicionado com sucesso!');
  }

  updateLocalStorage() {
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'Adicionar tarefa',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          placeholder: 'Alguma tarefa para a lista'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('clicked cancel');
          }
        },
        {
          text: 'Adicionar',
          cssClass: 'secondary',
          handler: (form) => {
            this.add(form.newTask);
          }
        },
      ]
    });
    await alert.present();
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O que deseja fazer?',
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          task.done = !task.done;
          this.updateLocalStorage();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }],
    });
    await actionSheet.present();
  }

  async deleteTask(task: any) {
    let loading = await this.loadingCtrl.create({ message: 'Processando' });
    const alert = await this.alertCtrl.create({
      header: 'Atenção',
      message: 'Confirme a exclusão do ítem',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        },
        {
          text: 'Excluir',
          handler: () => {
            loading.present();
            this.tasks = this.tasks.filter(taskArray => task != taskArray);
            this.updateLocalStorage();
            loading.dismiss();
            this.utilServiceCtrl.showToast('Removido com sucesso!');
          }
        }
      ]
    });
    alert.present();
  }

}
