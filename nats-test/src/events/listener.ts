import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

export abstract class Listener<Event extends any, Subject extends Subjects> {
  abstract subject: Subject;
  abstract queueGroupName: string;
  abstract onMessage(data: Event, msg: Message): void;

  protected ackWait: number = 5 * 1000;

  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());

    subscription.on('message', (msg: Message) => {
      console.log(`Message received ${this.subject} / ${this.queueGroupName}`);

      const parcedData = this.parseMessage(msg);
      this.onMessage(parcedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
  }
}