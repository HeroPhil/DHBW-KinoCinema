import * as basics from './basics';

import {nanoid} from 'nanoid';
import { CallableContext } from 'firebase-functions/lib/providers/https';

const screeningsSyncCollectionPath = "live/sync/screenings";
const userCollectionPath = "live/users";
const customersCollectionPath = userCollectionPath + "/customers";
const ticketsCollectionPath = 'live/events/tickets';

export async function createTicket(screening: string, row: number, seat: number, context: CallableContext) {
  const timestamp: number = Date.now();  
  const userId: string = context.auth.uid;
  const userPath: string = customersCollectionPath  + "/" + userId;
  const eventSyncPath: string = screeningsSyncCollectionPath  + "/" + screening + "/" + row + "/" + seat;

  const executionId = nanoid();
  const lockRef = basics.getDocumentRefByID(eventSyncPath);

  // check if screening exists
  // check if there are any seats in this screening available

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
      lockedAt: new Date(),
    });
  
    // If the write succeeds, we own the lock
    return true;
  });
  
  if (locked !== true) {
    console.log("Ticket was already booked!")
    return false;
  }
  
  console.log("Locked for you.");

  // Proceed with ticket creation
  var data = {
    buyTime: timestamp,
    row: row,
    seat: seat,
    screening: screening,
    user: userPath};
  
  let ticketRef = await basics.addDocToCollectionByID(ticketsCollectionPath, data);
  let ticket = await basics.getDocumentByRef(ticketRef);
  return ticket; 
}