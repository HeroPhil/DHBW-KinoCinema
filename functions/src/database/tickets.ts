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
      var sublevel = sl || 0;
      if (sublevel < 1) {
          return this;
      }

      var promises: Promise<any>[] = [];
  
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
  const timestamp: number = Date.now();  
  if(!context.auth) {
    return "Error: You are not logged in!";
  }
  const userId: string = context.auth.uid;
  const userPath: string = customersCollectionPath  + "/" + userId;
  const eventSyncPath: string = screeningsSyncCollectionPath  + "/" + screening + "/" + row + "/" + seat;
  const screeningRef = await basics.getDocumentRefByID(screeningsCollectionPath + "/" + screening);

  let screeningCheck = await basics.getDocumentByRef(screeningRef);
  if(!screeningCheck.exists) {
    return "Error: This screening does not exist!"
  }

  let screeningCheckObj = new Screening(screeningCheck.id, screeningCheck.data()).resolveRefs(2);
  let width = (await screeningCheckObj).data.hall.data.width;
  let rowCount = 0;
  (await screeningCheckObj).data.hall.data.rows.forEach((element: { count: number; }) => {
    rowCount += element.count;
  });

  if(seat > width || row > rowCount) {
    return "Error: This seat does not exist!"
  }

  // check if there are any seats in this screening available

  const executionId = nanoid();
  const lockRef = basics.getDocumentRefByID(eventSyncPath);

  const locked = await basics.startTransaction(async (transaction: any) => {
    const lockSnapshot = await transaction.get(lockRef);

    if (lockSnapshot.exists) {
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
  
  if (locked !== true) {
    console.log("Error: Ticket was already booked!")
    return "Error: Ticket was already booked!";
  }
  
  console.log("Locked for you.");

  // Proceed with ticket creation
  var userRef = await basics.getDocumentRefByID(userPath);

  var data = {
    buyTime: timestamp,
    row: row,
    seat: seat,
    screening: screeningRef,
    user: userRef};
  
  let promises: Promise<any>[] = [];
  

  let ticketRef = await basics.addDocToCollectionByID(ticketsCollectionPath, data);
  let ticket = await basics.getDocumentByRef(ticketRef);
  promises.push(ticket);
 
  //need to add TicketRef to users ticket array under /live/users/customers/$uid.tickets
  //something like:
  /*
  let arrUnion = userRef.update({
    tickets: admin.firestore.FieldValue.arrayUnion(ticket)
  });
  promises.push(arrUnion);
  */
  await Promise.all(promises);

  return new Ticket(ticket.id, ticket.data()).resolveRefs(sublevel); 
}

export async function getTicketByID(id: string, context: CallableContext, sublevel = 0) {
  const document = await basics.getDocumentByID(ticketsCollectionPath + '/' + id);
  if(!context.auth) {
    return "Error: You are not logged in!";
  }
  let ticket = new Ticket(document.id, document.data()).resolveRefs(sublevel);
  if((await ticket).data.user == context.auth.uid) {
    return ticket;
  } else {
    console.log("Error: Access denied!");
    return "Error: Access denied!";
  }
}