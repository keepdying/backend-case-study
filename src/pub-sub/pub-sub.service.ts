import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { callbackify } from 'util';

@Injectable()
export class PubSubService {
  private readonly pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  async publishMessage(topicName: string, data: any) {
    const topic = this.pubSub.topic(topicName);
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const callback = (err: any) => {
      if (err) {
        console.error(`Error occurred while publishing message: ${err}`);
      }
    };
    topic.publishMessage({ data: dataBuffer }, callback);
  }
}
