import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MessageState } from './message-model';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new Subject<MessageState>();
  messageState = this.messageSubject.asObservable();

  constructor() { }
  error(message) {
    this.messageSubject.next(<MessageState>{ message: message, type:'ERROR' });
  }
  success(message) {
    this.messageSubject.next(<MessageState>{ message: message, type:'SUCCESS' });
  }
}