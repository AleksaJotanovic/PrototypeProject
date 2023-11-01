import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'accounting-form',
  templateUrl: './accounting-form.component.html',
  styleUrls: ['./accounting-form.component.css']
})
export class AccountingFormComponent implements OnInit {

  @ViewChild('content', { static: false }) accounting!: ElementRef;

  name: string = '';
  email: string = '';
  message: string = '';
  price: number = 0;
  quantity: number = 0;
  date: Date = new Date();

  constructor(private emailService: EmailService) { }

  ngOnInit(): void { }

  // Functionalities
  onSubmit() {
    this.emailService.sendEmail(this.name, this.email, this.message, this.price, this.quantity, this.date).subscribe({
      next: () => console.log('successfully!'),
      error: (err) => console.log('Error while sending email: ', err),
      complete: () => console.log('Email sending completed.')
    });
  }

}
