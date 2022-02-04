import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class SearchService {
  public subjects: Subject<any>[] = [];

  constructor() {
  }


  publish(eventName: string) {
    // ensure a subject for the event name exists
    this.subjects[eventName] = this.subjects[eventName] || new Subject<any>();

    // publish event
    this.subjects[eventName].next();
  }

  on(eventName: string): Observable<any> {
    // ensure a subject for the event name exists
    this.subjects[eventName] = this.subjects[eventName] || new Subject<any>();

    // return observable
    return this.subjects[eventName].asObservable();
  }

  destroy(eventName?: string) {
    if (this.subjects) {
      if (eventName) {
        this.subjects[eventName].unsubscribe();
      } else {
        Object.keys(this.subjects).forEach(key => {
          this.subjects[key].unsubscribe();
        });
      }
    }
  }
}

