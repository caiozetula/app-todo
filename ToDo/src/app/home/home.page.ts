import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Task } from 'src/models/task';
import { ModalpagePage } from '../modalpage/modalpage.page';
import { TaskService } from '../services/task.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks: any[] = [];
  user: string;

  constructor(private alertCtrl: AlertController,
    private utilServiceCtrl: UtilService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private taskService: TaskService,
    public fb: FormBuilder) {
    // let taskJson = localStorage.getItem('taskDb');
    // let numJson = localStorage.getItem('numHoje');
    this.user = localStorage.getItem('user');
    // if (taskJson != null) {
    //   this.tasks = JSON.parse(taskJson);
    //   this.numHoje = Number.parseInt(numJson);
    // }
  }

  async ngOnInit() {
    this.user = this.user.substring(1, this.user.length - 1);
    while(this.user.includes('@'))
      this.user = this.user.replace('@', '');
    while(this.user.includes('.'))
      this.user = this.user.replace('.', '');
    while(this.user.includes('_'))
      this.user = this.user.replace('_', '');
    let loading = this.loadingCtrl.create({ message: 'Carregando' });
    (await loading).present();
    this.fetchTasks();
    let taskRes = this.taskService.getTaskList(this.user);
    taskRes.snapshotChanges().subscribe(async (res) => {
      this.tasks = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.tasks.push(a as Task);
      });
      (await loading).dismiss();
    });
  }

  fetchTasks() {
    this.taskService.getTaskList(this.user).valueChanges().subscribe(res => {
      console.log(res);
    })
  }

  delete(id) {
    this.taskService.deleteTask(this.user, id);
  }

  updateTask(id, tsk: string, dn: boolean) {
    let updateTaskForm = this.fb.group({
      task: [tsk],
      done: !dn
    });
    this.taskService.updateTask(id, this.user, updateTaskForm.value)
      .then(() => {
        this.fetchTasks();
        let taskRes = this.taskService.getTaskList(this.user);
        taskRes.snapshotChanges().subscribe(res => {
          this.tasks = [];
          res.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.tasks.push(a as Task);
          })
        });
      })
      .catch(error => console.log(error));
  }

  // async add(newTask: any) {
  //   let loading = this.loadingCtrl.create({ message: 'Processando' });
  //   (await loading).present();
  //   let task = { name: newTask.name, done: false, hoje: newTask.hoje };
  //   this.tasks.push(task);
  //   (await loading).dismiss();
  //   if (task.hoje == true) {
  //     this.numHoje++;
  //   }
  //   this.updateLocalStorage();
  // }

  // updateLocalStorage() {
  //   localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  //   localStorage.setItem('numHoje', this.numHoje.toString());
  // }

  // async showAdd() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Adicionar tarefa',
  //     inputs: [
  //       {
  //         name: 'newTask',
  //         type: 'text',
  //         placeholder: 'Alguma tarefa para a lista'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('clicked cancel');
  //         }
  //       },
  //       {
  //         text: 'Adicionar',
  //         cssClass: 'secondary',
  //         handler: (form) => {
  //           this.add(form.newTask);
  //         }
  //       },
  //     ]
  //   });
  //   await alert.present();
  // }

  // async openActions(task: any) {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'O que deseja fazer?',
  //     buttons: [{
  //       text: task.done ? 'Desmarcar' : 'Marcar',
  //       icon: task.done ? 'radio-button-off' : 'checkmark-circle',
  //       handler: () => {
  //         task.done = !task.done;
  //         this.updateLocalStorage();
  //       }
  //     },
  //     {
  //       text: task.hoje ? 'Não é para hoje' : 'Para hoje',
  //       icon: task.hoje ? 'bookmark-outline' : 'bookmark',
  //       handler: () => {
  //         task.hoje = !task.hoje;
  //         if(task.hoje == true){
  //           this.numHoje++;
  //         }else{
  //           this.numHoje--;
  //         }
  //         this.updateLocalStorage();
  //       }
  //     },
  //     {
  //       text: 'Cancelar',
  //       icon: 'close',
  //       role: 'cancel',
  //       handler: () => {
  //         console.log('Cancel clicked');
  //       }
  //     }],
  //   });
  //   await actionSheet.present();
  // }

  // async deleteTask(task: any) {
  //   let loading = await this.loadingCtrl.create({ message: 'Processando' });
  //   const alert = await this.alertCtrl.create({
  //     header: 'Atenção',
  //     message: 'Confirme a exclusão do ítem',
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (blah) => {

  //         }
  //       },
  //       {
  //         text: 'Excluir',
  //         handler: () => {
  //           loading.present();
  //           this.tasks = this.tasks.filter(taskArray => task != taskArray);
  //           if (task.hoje == true) {
  //             this.numHoje--;
  //           }
  //           this.updateLocalStorage();
  //           loading.dismiss();
  //           this.utilServiceCtrl.showToast('Removido com sucesso!');
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  async showAdd2() {
    const modal = await this.modalCtrl.create({
      component: ModalpagePage,
      componentProps: {
        'email': this.user,
      },
    });

    await modal.present();
    await modal.onDidDismiss()
    .then(async ()=>{
      let loading = this.loadingCtrl.create({ message: 'Carregando' });
      (await loading).present();
      this.fetchTasks();
      let taskRes = this.taskService.getTaskList(this.user);
      taskRes.snapshotChanges().subscribe(async (res) => {
        this.tasks = [];
        res.forEach(item => {
          let a = item.payload.toJSON();
          a['$key'] = item.key;
          this.tasks.push(a as Task);
        });
        (await loading).dismiss();
      });
    })
    // const { data } = await modal.onWillDismiss();
    // //console.log(data);
    // if (data != undefined && data != null) {
    //   this.add(data);
    // }
    return;
  }
}
