import { CallableContext } from "firebase-functions/lib/providers/https";

export const checkIfAnyLogin = (context: CallableContext) => {
  if(!context.auth) {
    console.log("You are not logged in!");
    const error = { message: "You are not logged in!"};
      return {error};
    }
  return {};
}