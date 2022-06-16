import { assign, createMachine } from "xstate";

const todoURL = "https://jsonplaceholder.typicode.com/todos";

type Todos = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

async function getOneTodo(todoNumber: 1) {
  return fetch(`${todoURL}/${todoNumber}`)
    .then((r) => r.json())
    .then((res: Todos) => res);
}

export const wakeUpMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHcCGBrMBaArgBwDpYAbMMPASwDsoBiAcQFEA5AFQBlGB9AQXZ4BKAWUSg8Ae1gUALhXFVRIAB6IsAFgAMAJgIB2AMz6AbBoCcR09oCMagwBoQAT1UBWABxGCVq5f26jbhpqpm4AvqEOaJi4hCRklDS0AGIAkgLcfIIiSCASUrLyiioIWDaeblr6pi5qbqY+LhoBDs4lVh567gZq+lYuWiZuYREgUdj4BFHUUACqeLQAyswA8ssAWoyKeTJyCjnFWC4hBCYuLla6594uulYtqoGmBKYvRj6XQY3DkRjjhFM0Oa0JSwaSoaRgAioABmEIATgAKfQaFEASloYxikww0zmW0kO0K+0QWksBFqFTULlO-gMRnuJX6agILmM-V0aisRmpL3CP2iE2QFAgYB4Y1oEHkkOoADdxJhsQL-sLRWMELLxABjcG7ADaGgAuvj8rsiohLvoWWcqijqsFdFoGYdLnoAjYLmo3dU+aNflihSKxb9aGA4XDxHCCHhiODoRGALaKv6TFVBzDqqhy7UFKj6o05bY5s0Ifw6YzBZHtDzlp1aWrkxqWNRqLTeFHfX1KlOB8UAEVQjgABBRYIPxDLQ4OqOJkMbCXtQAcuVYCG5bJojJpAlpW079HU9G5LudkX4zAZwiNpyL4DlMRM4uRpnOi8TGccmpuqpYbP43LWameRsUSCB0qVMXQfXvf4cUBPAX1NN8jB0dpTDrSkNBqI5TCdXRzGeV4uQ0MC2Sgv1BVTMYEKJRdEHA8lHjcYwjDpHwnU5J5zCGCDeg0YxSX0MilWohdlFUZCdFOc5Lm8PpbidIYdBecwLnLW4fEvUIgA */
  createMachine(
    {
      context: {
        numberOfTimesSnoozed: 0,
        cash: 0,
        todo: undefined as undefined | Todos,
      },
      tsTypes: {} as import("./wakeup.machine.typegen").Typegen0,
      schema: {
        events: {} as
          | { type: "GENTLE_ALARM" }
          | { type: "FIRE_ALARM" }
          | { type: "SNOOZE" }
          | { type: "Day is over now"; moneyBroughtHome: number },
        services: {} as {
          getTodosFromDb: {
            data: Todos;
          };
        },
      },
      id: "wake-up",
      initial: "sleeping",
      states: {
        sleeping: {
          on: {
            GENTLE_ALARM: {
              target: "wakingUp",
            },
            FIRE_ALARM: {
              target: "wideAwake",
            },
          },
        },
        wakingUp: {
          after: {
            "3000": {
              target: "wideAwake",
            },
          },
          on: {
            SNOOZE: {
              actions: "oneMoreTime",
              target: "sleeping",
            },
          },
        },
        wideAwake: {
          invoke: {
            src: "getTodosFromDb",
            onDone: [
              {
                actions: "updateTodo",
              },
            ],
            onError: [
              {
                target: "sleeping",
              },
            ],
          },
          on: {
            "Day is over now": {
              actions: "bringInTheDollas",
              target: "sleeping",
            },
          },
        },
      },
    },
    {
      actions: {
        oneMoreTime: assign((ctx, event) => {
          return {
            numberOfTimesSnoozed: ctx.numberOfTimesSnoozed + 1,
          };
        }),
        bringInTheDollas: assign((ctx, event) => {
          return {
            cash: event.moneyBroughtHome + ctx.cash,
          };
        }),
        updateTodo: assign((ctx, evt) => {
          return {
            todo: evt.data,
          };
        }),
      },
    }
  );
