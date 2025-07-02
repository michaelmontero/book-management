import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ transports: ['websocket'], path: '/library/websocket' })
export class WebsocketService {
  @WebSocketServer()
  server;

  emitAuthorCreated(author: any) {
    try {
      this.server.emit('author_created', {
        type: 'AUTHOR_CREATED',
        data: author,
        timestamp: new Date().toISOString(),
      });
      console.log('Author created event emitted:', author.id);
    } catch (e) {
      console.log('Unable to send author created update', e);
    }
  }

  emitBookCreated(book: any, authorId: string) {
    try {
      this.server.emit('book_created', {
        type: 'BOOK_CREATED',
        data: book,
        authorId,
        timestamp: new Date().toISOString(),
      });
      console.log('Book created event emitted:', book.id);
    } catch (e) {
      console.log('Unable to send book created update', e);
    }
  }
}
