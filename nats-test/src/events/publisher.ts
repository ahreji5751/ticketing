import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

export abstract class Publisher<Event extends any, Subject extends Subjects> {
  abstract subject: Subject;

  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: Event): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), err => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}