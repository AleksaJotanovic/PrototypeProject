import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { Student } from 'src/data-types';

@Component({
  selector: 'students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: Student[] = [];
  isStudentsLoaded: boolean = false;
  isUpdateFormActive: boolean = false;

  name: string = '';
  course: string = '';
  fee: string = '';
  currentId: string = '';

  constructor(private crud: CrudService) { }

  ngOnInit(): void {
    this.getAllStudents();
  }

  // Functionalities
  getAllStudents() {
    this.crud.getStudents().subscribe((result: any) => {
      this.isStudentsLoaded = true;
      this.students = result.data;
      console.log('Successfull initializing of students: ', result);
    });
  }

  register() {
    let bodyData = {
      "name": this.name,
      "course": this.course,
      "fee": this.fee
    };
    this.crud.addStudent(bodyData).subscribe((result) => {
      this.getAllStudents();
      this.name = '';
      this.course = '';
      this.fee = '';
      this.currentId = '';
      console.log("Student successfully added :), ", result);
    });
  }

  update(data: any) {
    this.name = data.name;
    this.course = data.course;
    this.fee = data.fee;
    this.currentId = data.id;
  }
  updateRecords() {
    let bodyData = {
      "name": this.name,
      "course": this.course,
      "fee": this.fee
    };
    this.crud.updateStudent(bodyData, this.currentId).subscribe((result) => {
      this.getAllStudents();
      this.name = '';
      this.course = '';
      this.fee = '';
      this.currentId = '';
      console.log("Student updated successfully :), ", result);
    });
  }

  save() {
    if (this.currentId === '') {
      this.register();
    } else {
      this.updateRecords();
    }
  }

  delete(data: any) {
    this.crud.deleteStudent(data).subscribe((result) => {
      this.getAllStudents();
      console.log("Successfully deleted student :), ", result);
    });
  }

}
