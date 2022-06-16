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
  /** @xstate-layout N4IgpgJg5mDOIC5QHcCGBrMBaArgBwDpYAbMMPASwDsoBiAcQFEA5AFQBlGB9AQXZ4BKAWUSg8Ae1gUALhXFVRIAB6IsAZgBsGggHY1OgBw7jxgEwBOPQBYANCACeqtVZ26AjG6tWLbg+a8aOgC+QXZomLiEJGSUNLQAYgCSAtx8giJIIBJSsvKKKghYHm4EGgCsAAwaFToV5mV6OqYado6FbqaunhrmbuZ+Oh2BViFhGNj4BOHUUACqeLQAyswA8isAWoyK2TJyCpkFWGUaagRWaqZuGm4VahUVVy0OqmVWJZVuamUGGm9Vv6MQOEJoRpjR5rQlLBpKhpGACKgAGZwgBOAAo7vcAJS0YGRKYYGbzbaSXZ5A6INRqcylGrnGq-Y6mUytJwnAhfWrmTT3NyVcwaQF4ybICgQMA8YG0AAiqHsAAIKLB5eIAG5gFHyqjiZAknJ7fKqIalHRWCrfa6+Co-AyswpUioENw6BqaAwGMoNY4hUIgbXi+CZYVRUjkGZ6sn7UCHJkEPx3cyXc3NKl2or1DnU61M3oeAymIXjfFguZ4CO5KPKRCfVzW4xfCpWb6+Ixpz2mXRlG4eMoJ87BX3BqZiiXA8sGikIKz+UqvKndTm9tM8jkNa2mPzMjcGQsRfDj8nRl5GM4XK43TGPNMaUxlTvdlznC6Nn1BIA */
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
            onDone: {
              actions: "updateTodo",
            },

            onError: "sleeping",
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
