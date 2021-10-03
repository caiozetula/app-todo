import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-modalpage',
  templateUrl: './modalpage.page.html',
  styleUrls: ['./modalpage.page.scss'],
})

export class ModalpagePage implements OnInit {
  @Input() email: string;

  newTask: string ='';
  hoje: boolean = false;
  taskForm: FormGroup;
  constructor(
    private modalCtrl: ModalController,
    private utilServiceCtrl : UtilService,
    private taskService: TaskService,
    public fb: FormBuilder) {
      
    }

  ngOnInit() {
    this.taskForm = this.fb.group({
      task: [''],
      done: false,
    })

  }

  formSubmit() {
    if (!this.taskForm.valid) {
      this.utilServiceCtrl.showToast('Informe o que deseja fazer!');
      return false;
    }  else {
      console.log(this.taskForm.value);
      this.taskService.createTask(this.email, this.taskForm.value)
      .then(res => {
        this.taskForm.reset();
        this.modalCtrl.dismiss();
      })
      .catch(error => {
        console.log(error)
        this.utilServiceCtrl.showToast('Ocorreu um erro, tente novamente!');
      });
    }
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
