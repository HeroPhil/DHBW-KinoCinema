import * as basics from './basics';

const {nanoid} = require('nanoid');

const locksCollectionPath = "sync";
const userCollectionPath = "live/users";
const customersCollectionPath = userCollectionPath + "/customers";
const ticketsCollectionPath = 'live/events/tickets';

export async function createTicket(screening: String, row: number, seat: number, context: any) {
  const eventId: String = context.eventId;
  const timestamp: String = context.timestamp;
  const userId: String = context.auth.uid;
  const userPath: String = customersCollectionPath  + "/" + userId;

  const executionId = nanoid();
  const lockRef = basics.getDocumentRefByID(locksCollectionPath + "/" + eventId);

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
    throw new Error("Already locked. This ticket was already booked.");
  }
  
  console.log("Locked for you.");

  // Proceed with ticket creation
  var data = {
    buyTime: timestamp,
    row: row,
    seat: seat,
    screening: screening,
    user: userPath
  };
  
  let ticket = await basics.setDocumentByID(ticketsCollectionPath, data)
  return ticket; 
}