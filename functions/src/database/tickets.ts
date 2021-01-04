import * as basics from './basics';
import { Screening, screeningsCollectionPath } from './screenings';
import {nanoid} from 'nanoid';
import { CallableContext } from 'firebase-functions/lib/providers/https';

const screeningsSyncCollectionPath = "live/sync/screenings";
const userCollectionPath = "live/users";
const customersCollectionPath = userCollectionPath + "/customers";
const ticketsCollectionPath = 'live/events/tickets';

class Ticket {
  id: string;
  data: any;
  constructor (id: string, data: any) {
      this.id = id;
      this.data = data;
  }
  
  async resolveRefs(sl = 0) {
      const sublevel = sl || 0;
      if (sublevel < 1) {
          return this;
      }

      const promises: Promise<any>[] = [];
  
      promises.push(
          basics.getDocumentByRef(this.data.screening)
          .then(async (screeningDoc: { id: string; data: () => any; }) => {
              this.data.screening = await new Screening(screeningDoc.id, screeningDoc.data()).resolveRefs(sublevel - 1);
              return;
          })
      );

      promises.push(
        basics.getDocumentByRef(this.data.user)
        .then( (userDoc: { id: string}) => {
            this.data.user = userDoc.id;
            return;
        })
      );

      await Promise.all(promises);

      return this;
  }

}

export async function createTicket(screening: string, row: number, seat: number, context: CallableContext, sublevel = 3) {
  const error: {message: string} = { message: "" };
  const timestamp: number = Date.now();  
  // include anonymous users
  if(!context.auth) {
    return error.message = "You are not logged in!";
  }
  const userId: string = context.auth.uid;
  const userPath: string = customersCollectionPath  + "/" + userId;
  const screeningRef = await basics.getDocumentRefByID(screeningsCollectionPath + "/" + screening);

  const screeningCheck = await basics.getDocumentByRef(screeningRef);
  if(!screeningCheck.exists) {
    return error.message = "This screening does not exist!";
  }

  const screeningCheckObj = await new Screening(screeningCheck.id, screeningCheck.data()).resolveRefs(2);
  const width = screeningCheckObj.data.hall.data.width;
  let rowCount = 0;
  screeningCheckObj.data.hall.data.rows.forEach((element: { count: number; }) => {
    rowCount += element.count;
  });

  if(!(0 <= seat && seat < width) || !(0 <= row && row < rowCount)) {
    return error.message = "This seat does not exist!";
  }

  const query = basics.getCollectionRefByID(ticketsCollectionPath)
    .where("screening", "==", screeningRef)
    .where("row", "==", row)
    .where("seat", "==", seat);
  const collection = await basics.getCollectionByRef(query);  

  if(collection.length < 1 || collection === undefined) {
    return error.message = "Ticket is already taken!";
  }

  // check if there are any seats in this screening available

  const executionId = nanoid();
  const eventSyncPath: string = screeningsSyncCollectionPath  + "/" + screening + "/" + row + "/" + seat;
  const lockRef = basics.getDocumentRefByID(eventSyncPath);

  const locked = await basics.startTransaction(async (transaction: any) => {
    const lockSnapshot = await transaction.get(lockRef);

    if(lockSnapshot.exists) {
      // If the lock exists, check if we locked it
      return lockSnapshot.data().executionId === executionId;
    }
  
    // If it doesn't exist, attempt to create it
    await transaction.set(lockRef, {
      executionId,
      // The timestamp and lockedAt date are just for debugging, why not?
      timestamp,
      lockedAt: Date.now(),
    });
  
    // If the write succeeds, we own the lock
    return true;
  });
  
  if(locked !== true) {
    return error.message = "Ticket was already booked!";
  }
  
  console.log("Locked for you.");

  // Proceed with ticket creation
  const userRef = await basics.getDocumentRefByID(userPath);

  const data = {
    buyTime: timestamp,
    row: row,
    seat: seat,
    screening: screeningRef,
    user: userRef
  };
   

  const ticketRef = await basics.addDocToCollectionByID(ticketsCollectionPath, data);
  const ticket = await basics.getDocumentByRef(ticketRef);

  return new Ticket(ticket.id, ticket.data()).resolveRefs(sublevel); 
}

export async function getTicketByID(id: string, context: CallableContext, sublevel = 3) {
  const error: {message: string} = { message: "" };
  const document = await basics.getDocumentByID(ticketsCollectionPath + '/' + id);
  if(!context.auth) {
    return error.message = "You are not logged in!";
  }
  if(!document.exists) {
    return error.message = "This ticket does not exist!";
  }
  const ticket = await new Ticket(document.id, document.data()).resolveRefs(sublevel);
  if(ticket.data.user === context.auth.uid) {
    return ticket;
  } else {
    console.log("Error: Access denied! "+ (await ticket).data.user +", "+ context.auth.uid);
    return error.message = "Access denied, you don't own this ticket!";
  }
}